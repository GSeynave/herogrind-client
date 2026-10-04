import { useEffect, useRef } from "react";
import type { HeroActivity } from "../model/HeroActivity";
import type { HeroDetails } from "../model/HeroDetails";
import type { Area } from "../model/Area";
import type { WorldEvent } from "../model/WorldEvent";
import type { FloatingDamage } from "../model/FloatingDamage";
import type { Monster } from "../model/Monster";
import { drawAreas } from "../rendering/areaRenderer";
import { resolveHeroPositions } from "../world/actorUtils";
import { drawHeroes } from "../rendering/heroRenderer";
import { drawMonsters } from "../rendering/monsterRenderer";
import { drawFloatingDamages } from "../rendering/effectRenderer";
import type { Encounter } from "../model/Encounter";
import type { EncounterAcitivyPayload as EncounterActivyPayload } from "../model/EncounterActivityPayload";
import type { GhostEvents } from "../model/GhostEvents";

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
  const processedEventsCountRef = useRef(0);
  const floatingDamagesRef = useRef<FloatingDamage[]>([]);
  const heroesRef = useRef<HeroDetails[]>(heroes);
  const activitiesRef = useRef<HeroActivity[]>(activities);
  const areasRef = useRef<Area[]>(areas);
  const encounterVisualsRef = useRef<Encounter[]>([]);
  const monstersRef = useRef<Monster[]>(monsters);
  const ghostsRef = useRef<GhostEvents[]>([]);

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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const actorPositions = resolveHeroPositions(
        heroesRef.current,
        areasRef.current,
        activitiesRef.current,
      );
      // 1. Draw areas
      drawAreas(ctx, areasRef.current);

      // 2. Draw heroes
      drawHeroes(ctx, heroesRef.current, actorPositions);
      // 3. Draw monsters
      drawMonsters(
        ctx,
        monstersRef.current,
        actorPositions,
        encounterVisualsRef.current,
      );

      // 4. Draw floating damages
      floatingDamagesRef.current = drawFloatingDamages(
        ctx,
        floatingDamagesRef.current,
        actorPositions,
      );

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
          var payload = event.payload as EncounterActivyPayload;
          encounterVisualsRef.current.push({
            encounterId: payload.encounterId,
            heroId: payload.heroId,
            monsterId: payload.enemyId,
          });
          break;
        case "HERO_FINISHED_ENCOUNTER":
          var payload = event.payload as EncounterActivyPayload;
          encounterVisualsRef.current = encounterVisualsRef.current.filter(
            (e) => e.heroId !== payload.heroId,
          );
          break;
        case "GHOST_WAITING":
        case "GHOST_TRAVELING":
        case "GHOST_RESURRECTING":
          heroesRef.current = heroesRef.current.filter(
            (h) => h.id !== (event as GhostEvents).payload.heroId,
          );
          ghostsRef.current.push(event as GhostEvents);
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
