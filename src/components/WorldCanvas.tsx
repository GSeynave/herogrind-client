import { useEffect, useRef } from "react";
import type { HeroActivity } from "../model/HeroActivity";
import type { HeroDetails } from "../model/HeroDetails";
import {
  areaConfig,
  heroConfig,
  townConfig,
  worldCanvasConfig,
} from "../config/worldCanvasConfig";
import type { Area } from "../model/Area";
import type { WorldEvent } from "../model/WorldEvent";
import type { FloatingDamage } from "../model/FloatingDamage";
import type { ActorPosition } from "../model/ActorPosition";
import type { Monster } from "../model/Monster";

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

      drawTown(ctx);
      drawHeroesInTown(ctx);
      drawAreas(ctx);
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

  function drawTown(ctx: CanvasRenderingContext2D) {
    ctx.strokeRect(
      worldCanvasConfig.margin,
      worldCanvasConfig.margin,
      townConfig.width,
      townConfig.height,
    );

    const townCenter = {
      x: worldCanvasConfig.margin + townConfig.width / 2,
      y: worldCanvasConfig.margin + townConfig.height / 2,
    };
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Town", townCenter.x, townCenter.y);
    ctx.stroke();
  }

  function drawHeroesInTown(ctx: CanvasRenderingContext2D) {
    const idleHeroes = heroesRef.current.filter(
      (h) => getHeroActivity(h.id)?.state === "IDLE",
    );
    if (idleHeroes.length === 0) return;

    idleHeroes.forEach((h, index) => {
      drawHero(
        h,
        { x: worldCanvasConfig.margin, y: worldCanvasConfig.margin },
        index,
        ctx,
      );
    });
  }
  function drawAreas(ctx: CanvasRenderingContext2D) {
    areasRef.current.forEach((area, index) => {
      const areaPosition = getAreaPositions(index);
      const areaCenter = {
        x: areaPosition.x + areaConfig.width / 2,
        y: areaPosition.y + areaConfig.height / 2,
      };
      ctx.strokeRect(
        areaPosition.x,
        areaPosition.y,
        areaConfig.width,
        areaConfig.height,
      );
      ctx.fillText(index + " - " + area.name, areaCenter.x, areaCenter.y);

      drawHeroesInArea(ctx, area, areaPosition);
    });
  }

  function getAreaPositions(index: number): { x: number; y: number } {
    if (index % 2 == 0) {
      const x =
        worldCanvasConfig.margin + townConfig.width + worldCanvasConfig.gap;
      const y =
        worldCanvasConfig.margin +
        (index > 0
          ? (index - 1) * (areaConfig.height + worldCanvasConfig.gap)
          : 0);
      return { x, y };
    } else {
      const x = worldCanvasConfig.margin;
      const y =
        worldCanvasConfig.margin + townConfig.height + worldCanvasConfig.gap;
      return { x, y };
    }
  }

  function drawHeroesInArea(
    ctx: CanvasRenderingContext2D,
    area: Area,
    areaPosition: { x: number; y: number },
  ) {
    const heroesInArea = heroesRef.current.filter(
      (h) => getHeroActivity(h.id)?.areaId === area.id,
    );

    if (heroesInArea.length === 0) return;

    heroesInArea.forEach((h, index) => {
      const heroPosition = drawHero(h, areaPosition, index, ctx);

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
    areaPosition: { x: number; y: number },
    index: number,
    ctx: CanvasRenderingContext2D,
  ): ActorPosition {
    const heroText = `${h.name}`;
    const heroX = areaPosition.x + heroConfig.margin + index * heroConfig.gap;
    const heroY = areaPosition.y + (areaConfig.height - heroConfig.margin);
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
