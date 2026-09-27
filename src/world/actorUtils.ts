import type { Area } from "../model/Area";
import type { HeroActivity } from "../model/HeroActivity";
import type { HeroDetails } from "../model/HeroDetails";
import {
  getAreaById,
  getAreaByName,
  getAreaCanvasCenter,
  getAreaCanvasPosition,
  getAreaCanvasSize,
} from "../world/areaUtils";
import { getHeroActivity } from "../world/activityUtils";
import type { ActorPosition } from "../model/ActorPosition";
import { heroConfig } from "../config/worldCanvasConfig";
import type { GhostActivityPayload } from "../model/GhostActivityPayload";
import { calculateMovementProgress, interpolation } from "./movementUtils";

export function resolveHeroPositions(
  heroes: HeroDetails[],
  areas: Area[],
  activities: HeroActivity[],
): Map<string, ActorPosition> {
  const heroByArea = new Map<string, number>();
  const actorPositions = new Map<string, ActorPosition>();

  // NEW
  heroes.forEach((h) => {
    const activity = getHeroActivity(h.id, activities);
    console.log(`Hero ${h.id} activity:`, activity);
    if (!activity) {
      console.warn(`No activity found for hero ${h.id}`);
      return;
    }
    switch (activity.state) {
      case "GHOST_TRAVELING":
        setPositionForGhostTraveling(activity, areas, actorPositions, h);
        break;
      case "GHOST_RESURRECTING":
        setPositionForStaticGhost(areas, activity, actorPositions, h, "Town");
        break;
      case "GHOST_WAITING":
        setPositionForStaticGhost(
          areas,
          activity,
          actorPositions,
          h,
          "Graveyard",
        );
        break;

      default:
        setPositionForLivingHero(
          areas,
          activity,
          actorPositions,
          h,
          heroByArea,
        );
        break;
    }
  });
  return actorPositions;
}

function setPositionForLivingHero(
  areas: Area[],
  activity: HeroActivity,
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

function setPositionForStaticGhost(
  areas: Area[],
  activity: HeroActivity,
  actorPositions: Map<string, ActorPosition>,
  h: HeroDetails,
  areaName: string,
) {
  const currentArea = getAreaByName(areas, areaName);
  if (currentArea) {
    const resurrectionPosition = getAreaCanvasCenter(currentArea);
    actorPositions.set(h.id, resurrectionPosition);
  }
}

function setPositionForGhostTraveling(
  activity: HeroActivity,
  areas: Area[],
  actorPositions: Map<string, ActorPosition>,
  h: HeroDetails,
) {
  const ghostTravelingPosition = getGhostTravelingPosition(activity, areas);
  if (ghostTravelingPosition) {
    actorPositions.set(h.id, ghostTravelingPosition);
  }
}

function getGhostTravelingPosition(
  activity: HeroActivity,
  areas: Area[],
): ActorPosition | undefined {
  const ghostActivity = activity.payload as GhostActivityPayload;
  const sourceArea = getAreaById(areas, ghostActivity.currentAreaId);
  const targetArea = getAreaById(areas, ghostActivity.travelDestinationId);
  if (!sourceArea || !targetArea) return;

  const sourceCanvasCenterPosition = getAreaCanvasCenter(sourceArea);
  const targetCanvasCenterPosition = getAreaCanvasCenter(targetArea);

  const progress = calculateMovementProgress(
    activity.startedAt,
    ghostActivity.arrivalAt,
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
