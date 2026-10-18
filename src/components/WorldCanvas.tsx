import { useEffect, useRef } from "react";
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
import type { WorldState } from "../model/world/WorldState";

function WorldCanvas({
  heroes,
  areas,
  worldState,
  events,
  monsters,
}: {
  heroes: HeroDetails[];
  areas: Area[];
  worldState: WorldState;
  events: WorldEvent[];
  monsters: Monster[];
}) {
  const processedEventsCountRef = useRef(0);
  const floatingDamagesRef = useRef<FloatingDamage[]>([]);
  const heroesRef = useRef<HeroDetails[]>(heroes);
  const worldStateRef = useRef<WorldState>(worldState);
  const areasRef = useRef<Area[]>(areas);
  const monstersRef = useRef<Monster[]>(monsters);

  useEffect(() => {
    heroesRef.current = heroes;
  }, [heroes]);

  useEffect(() => {
    worldStateRef.current = worldState;
  }, [worldState]);

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
        worldStateRef.current,
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
        worldStateRef?.current?.encounters,
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
      if (event.eventType === "COMBAT_ACTION") {
        floatingDamagesRef.current.push({
          targetId: event.payload.targetId,
          value: event.payload.value,
          startedAt: performance.now(),
        });
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
