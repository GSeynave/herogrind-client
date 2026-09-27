import { useEffect, useRef } from "react";
import type { HeroActivity } from "../model/HeroActivity";
import type { HeroDetails } from "../model/HeroDetails";
import { worldCanvasConfig, heroConfig } from "../config/worldCanvasConfig";
import type { Area } from "../model/Area";
import type { WorldEvent } from "../model/WorldEvent";
import type { FloatingDamage } from "../model/FloatingDamage";
import type { ActorPosition } from "../model/ActorPosition";
import type { Monster } from "../model/Monster";
import type { AreaPosition } from "../model/AreaPosition";
import type { AreaSize } from "../model/AreaSize";

function WorldCanvas({
  heroes,
  areas,
  activities,
  events,
  monsters,
}: {
  heroes: HeroDetails[];
  areas: Area[];
  activities: HeroActivity[];
  events: WorldEvent[];
  monsters: Monster[];
}) {
  type EncounterVisual = {
    encounterId: string;
    heroId: string;
    monsterId: string;
  };
  const processedEventsCountRef = useRef(0);
  const floatingDamagesRef = useRef<FloatingDamage[]>([]);
  const heroesRef = useRef<HeroDetails[]>(heroes);
  const activitiesRef = useRef<HeroActivity[]>(activities);
  const areasRef = useRef<Area[]>(areas);
  const encounterVisualsRef = useRef<EncounterVisual[]>([]);
  const monstersRef = useRef<Monster[]>(monsters);
  const actorPositionsRef = useRef<Map<string, ActorPosition>>(new Map());

  useEffect(() => {
    heroesRef.current = heroes;
  }, [heroes]);

  useEffect(() => {
    activitiesRef.current = activities;
  }, [activities]);

  useEffect(() => {
    areasRef.current = areas;
  }, [areas]);

  useEffect(() => {
    monstersRef.current = monsters;
  }, [monsters]);

  function getHeroActivity(heroId: string): HeroActivity | undefined {
    return activitiesRef.current.find((a: HeroActivity) => a.heroId === heroId);
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      actorPositionsRef.current.clear();

      drawAreas(ctx);
      drawHeroesInTown(ctx);
      drawFloatingDamages(ctx);

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const newEvents = events.slice(processedEventsCountRef.current);

    newEvents.forEach((event) => {
      switch (event.eventType) {
        case "COMBAT_ACTION":
          floatingDamagesRef.current.push({
            targetId: event.payload.targetId,
            value: event.payload.value,
            startedAt: performance.now(),
          });
          break;
        case "HERO_STARTED_ENCOUNTER":
          encounterVisualsRef.current.push({
            encounterId: event.payload.encounterId,
            heroId: event.payload.heroId,
            monsterId: event.payload.monsterId,
          });
          break;
        case "HERO_FINISHED_ENCOUNTER":
          encounterVisualsRef.current = encounterVisualsRef.current.filter(
            (e) => e.heroId !== event.payload.heroId,
          );
          break;
        case "HERO_IDLE":
        case "HERO_STARTED_ROAMING":
        case "HERO_ENTERED_DUNGEON":
          break;
        default:
          console.warn("Unknown event type", event.eventType);
      }
    });
    processedEventsCountRef.current += newEvents.length;
  }, [events]);

  function drawHeroesInTown(ctx: CanvasRenderingContext2D) {
    const town = getTown(areasRef.current);
    if (!town) return;
    const townCanvasPosition = getAreaCanvasPosition(town.position);
    const idleHeroes = heroesRef.current.filter(
      (h) => getHeroActivity(h.id)?.state === "IDLE",
    );

    idleHeroes.forEach((h, index) => {
      drawHero(h, townCanvasPosition, town.size, index, ctx);
    });
  }

  function getTown(areas: Area[]): Area | undefined {
    return areas.find((a) => a.name === "Town");
  }

  function drawAreas(ctx: CanvasRenderingContext2D) {
    areasRef.current.forEach((area, index) => {
      const areaPosition = getAreaCanvasPosition(area.position);
      const width = worldCanvasConfig.cellSize * area.size.width;
      const height = worldCanvasConfig.cellSize * area.size.height;
      const areaCenter = {
        x: areaPosition.x + width / 2,
        y: areaPosition.y + height / 2,
      };
      ctx.strokeRect(areaPosition.x, areaPosition.y, width, height);
      ctx.fillText(area.name, areaCenter.x, areaCenter.y);

      drawHeroesInArea(ctx, area, areaPosition);
    });
  }

  function getAreaCanvasPosition(areaPosition: AreaPosition): ActorPosition {
    const x =
      worldCanvasConfig.margin + areaPosition.x * worldCanvasConfig.cellSize;
    const y =
      worldCanvasConfig.margin + areaPosition.y * worldCanvasConfig.cellSize;
    return { x, y };
  }

  function drawHeroesInArea(
    ctx: CanvasRenderingContext2D,
    area: Area,
    canvasPosition: ActorPosition,
  ) {
    const heroesInArea = heroesRef.current.filter(
      (h) => getHeroActivity(h.id)?.areaId === area.id,
    );

    heroesInArea.forEach((h, index) => {
      const heroPosition = drawHero(h, canvasPosition, area.size, index, ctx);

      const encounter = getEncounterVisual(h.id);
      if (!encounter) return;

      const monster = getMonster(encounter.monsterId);

      if (!monster) return;

      drawMonster(monster, heroPosition, ctx);
    });
  }

  function drawFloatingDamages(ctx: CanvasRenderingContext2D) {
    const now = performance.now();
    floatingDamagesRef.current = floatingDamagesRef.current.filter((damage) => {
      const elapsed = now - damage.startedAt;
      if (elapsed > 700) {
        return false;
      }

      const progress = elapsed / 700;

      const targetPosition = getActorPosition(damage.targetId);

      if (targetPosition) {
        ctx.fillText(
          `-${damage.value}`,
          targetPosition.x,
          targetPosition.y - heroConfig.radius - 10 - progress * 30,
        );
      }
      return true;
    });
  }
  function getActorPosition(actorId: string): ActorPosition | undefined {
    return actorPositionsRef.current.get(actorId);
  }

  function drawHero(
    h: HeroDetails,
    areaPosition: ActorPosition,
    areaSize: AreaSize,
    index: number,
    ctx: CanvasRenderingContext2D,
  ): ActorPosition {
    const heroText = `${h.name}`;
    const heroX = areaPosition.x + heroConfig.margin + index * heroConfig.gap;
    const heroY =
      areaPosition.y +
      areaSize.height * worldCanvasConfig.cellSize -
      heroConfig.margin;
    const position: ActorPosition = { x: heroX, y: heroY };
    actorPositionsRef.current.set(h.id, position);
    ctx.beginPath();
    ctx.arc(heroX, heroY, heroConfig.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText(heroText, heroX, heroY - heroConfig.radius - 5);
    return position;
  }

  function getEncounterVisual(heroId: string): EncounterVisual | undefined {
    return encounterVisualsRef.current.find((e) => e.heroId === heroId);
  }

  function getMonster(monsterId: string): Monster | undefined {
    return monstersRef.current.find((m) => m.id === monsterId);
  }

  function drawMonster(
    monster: Monster,
    heroPosition: ActorPosition,
    ctx: CanvasRenderingContext2D,
  ) {
    const monsterX = heroPosition.x + 60;
    const monsterY = heroPosition.y;

    actorPositionsRef.current.set(monster.id, {
      x: monsterX,
      y: monsterY,
    });

    ctx.beginPath();
    ctx.arc(monsterX, monsterY, heroConfig.radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillText(monster.name, monsterX, monsterY - heroConfig.radius - 5);
  }

  return (
    <div className="world-canvas-container">
      <canvas
        ref={canvasRef}
        className="world-canvas"
        width={800}
        height={500}
      />
    </div>
  );
}

export default WorldCanvas;
