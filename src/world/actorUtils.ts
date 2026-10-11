import type { Area } from "../model/Area";
import type { HeroActivityDto } from "../model/Hero/HeroActivityDto";
import type { HeroDetails } from "../model/HeroDetails";
import {
  getAreaById,
  getAreaByName,
  getAreaCanvasCenter,
  getAreaCanvasPosition,
  getAreaCanvasSize,
} from "../world/areaUtils";
import type { ActorPosition } from "../model/ActorPosition";
import { heroConfig } from "../config/worldCanvasConfig";
import { calculateMovementProgress, interpolation } from "./movementUtils";
import type { WorldState } from "../model/world/WorldState";
import type { GhostDto } from "../model/Ghost/GhostDto";

export function resolveHeroPositions(
  heroes: HeroDetails[],
  areas: Area[],
  worldState: WorldState,
): Map<string, ActorPosition> {
  const heroByArea = new Map<string, number>();
  const actorPositions = new Map<string, ActorPosition>();

  if (!worldState) {
    console.warn("World state is undefined");
    return actorPositions;
  }

  if (worldState.heroActivities) {
    worldState.heroActivities.forEach((activity) => {
      const h = heroes.find((hero) => hero.id === activity.heroId);
      if (!h) {
        console.warn(`No hero found for activity ${activity.heroId}`);
        return;
      }
      setPositionForLivingHero(areas, activity, actorPositions, h, heroByArea);
    });
  }
  if (worldState.ghosts) {
    worldState.ghosts.forEach((ghost) => {
      setGhostPosition(ghost, areas, actorPositions);
    });
  }
  return actorPositions;
}

function setPositionForLivingHero(
  areas: Area[],
  activity: HeroActivityDto,
  actorPositions: Map<string, ActorPosition>,
  h: HeroDetails,
  heroByArea: Map<string, number>,
) {
  let area = areas.find((a) => a.id === activity.areaId);
  if (!area && activity.state !== "IDLE") {
    console.warn(
      `No area found for hero ${h.id} with activity ${activity.state}`,
    );
    return;
  }
  if (!area) {
    area = getAreaByName(areas, "Town");
  }
  if (!area) {
    console.warn(
      `No area found for hero ${h.id} with activity ${activity.state}`,
    );
    return;
  }
  const areaCanvasPosition = getAreaCanvasPosition(area.position);
  const areaCanvasSize = getAreaCanvasSize(area.size);
  const heroX =
    areaCanvasPosition.x +
    heroConfig.margin +
    (heroByArea.get(area.id) || 0) * heroConfig.gap;
  const heroY =
    areaCanvasPosition.y + areaCanvasSize.height - heroConfig.margin;
  const position: ActorPosition = { x: heroX, y: heroY };
  actorPositions.set(h.id, position);
  heroByArea.set(area.id, (heroByArea.get(area.id) || 0) + 1);
}

function setGhostPosition(
  ghost: GhostDto,
  areas: Area[],
  actorPositions: Map<string, ActorPosition>,
) {
  if (ghost.travelDestinationId == null && ghost.currentAreaId != null) {
    // Ghost is not traveling, place it in the current area
    const currentArea = getAreaById(areas, ghost.currentAreaId);
    if (currentArea) {
      const resurrectionPosition = getAreaCanvasCenter(currentArea);
      actorPositions.set(ghost.heroId, resurrectionPosition);
    }
  } else if (ghost.travelDestinationId != null && ghost.currentAreaId != null) {
    const ghostTravelingPosition = getGhostTravelingPosition(ghost, areas);
    if (ghostTravelingPosition) {
      actorPositions.set(ghost.heroId, ghostTravelingPosition);
    }
  }
}

function getGhostTravelingPosition(
  activity: GhostDto,
  areas: Area[],
): ActorPosition | undefined {
  const sourceArea = getAreaById(areas, activity.currentAreaId);
  const targetArea = getAreaById(areas, activity.travelDestinationId);
  if (!sourceArea || !targetArea) return;

  const sourceCanvasCenterPosition = getAreaCanvasCenter(sourceArea);
  const targetCanvasCenterPosition = getAreaCanvasCenter(targetArea);

  const progress = calculateMovementProgress(
    activity.startedAt,
    activity.arrivalAt,
    Date.now(),
  );

  const interpolatedX = interpolation(
    sourceCanvasCenterPosition.x,
    targetCanvasCenterPosition.x,
    progress,
  );
  const interpolatedY = interpolation(
    sourceCanvasCenterPosition.y,
    targetCanvasCenterPosition.y,
    progress,
  );

  console.log(
    `Interpolated position for hero ${activity.heroId}: (${interpolatedX}, ${interpolatedY}) with progress ${progress}`,
  );

  return { x: interpolatedX, y: interpolatedY };
}
