import { use, useEffect, useRef } from "react";
import type { HeroActivity } from "../model/HeroActivity";
import type { HeroDetails } from "../model/HeroDetails";
import { areaConfig, heroConfig, townConfig, worldCanvasConfig } from "../config/worldCanvasConfig";
import type { Area } from "../model/Area";

function WorldCanvas({
  heroes,
  areas,
  activities
}: {
  heroes: HeroDetails[];
  areas: Area[];
  activities: HeroActivity[];
}) {

  function getHeroActivity(heroId: string): HeroActivity | undefined {
    return activities.find(
      (a: HeroActivity) => a.heroId === heroId
    );
  }

  const idleHeroes = heroes.filter(
    h => getHeroActivity(h.id)?.state === "IDLE"
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(worldCanvasConfig.margin, worldCanvasConfig.margin, townConfig.width, townConfig.height);

    const townCenter = {
      x: worldCanvasConfig.margin + townConfig.width / 2,
      y: worldCanvasConfig.margin + townConfig.height / 2
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Town", townCenter.x, townCenter.y);
    ctx.stroke();
    drawHeroesInTown(ctx, idleHeroes, townCenter);
    drawAreas(ctx);


  }, [areas, heroes, activities]);

  function drawHeroesInTown(ctx: CanvasRenderingContext2D, idleHeroes: HeroDetails[], townCenter: { x: number, y: number }) {
    if (idleHeroes.length === 0) return;

    idleHeroes.forEach((h, index) => {
      drawHero(h, { x: worldCanvasConfig.margin, y: worldCanvasConfig.margin}, index, ctx);
    });
  }
  function drawAreas(ctx: CanvasRenderingContext2D) {
    console.log("Drawing areas", areas);
    areas.forEach((area, index) => {
      const areaPosition = getAreaPositions(index);
      const areaCenter = {
        x: areaPosition.x + areaConfig.width / 2,
        y: areaPosition.y + areaConfig.height / 2
      }
      ctx.strokeRect(areaPosition.x, areaPosition.y, areaConfig.width, areaConfig.height);
      ctx.fillText(index + ' - ' + area.name, areaCenter.x, areaCenter.y);

      drawHeroesInArea(ctx, area, areaPosition);
    });
  }

  function getAreaPositions(index: number): { x: number, y: number } {
    if (index % 2 == 0) {
      const x = worldCanvasConfig.margin + townConfig.width + worldCanvasConfig.gap;
      const y = worldCanvasConfig.margin + (index > 0 ? (index - 1) * (areaConfig.height + worldCanvasConfig.gap) : 0);
      return { x, y };
    } else {
      const x = worldCanvasConfig.margin;
      const y = worldCanvasConfig.margin + townConfig.height + worldCanvasConfig.gap;
      return { x, y };
    }
  }

  function drawHeroesInArea(ctx: CanvasRenderingContext2D, area: Area, areaPosition: { x: number, y: number }) {
    const heroesInArea = heroes.filter(
      h => getHeroActivity(h.id)?.areaId === area.id
    );

    if (heroesInArea.length === 0) return;

    heroesInArea.forEach((h, index) => {
      drawHero(h, areaPosition, index, ctx);
    });
  }

  return (
    <div className="world-canvas-container">
      <canvas ref={canvasRef}
        className="world-canvas"
        width={800}
        height={500}
      />
    </div>
  );

  function drawHero(h: HeroDetails, areaPosition: { x: number; y: number; }, index: number, ctx: CanvasRenderingContext2D) {
    const heroText = `${h.name}`;
    const heroX = areaPosition.x + heroConfig.margin + index * heroConfig.gap;
    const heroY = areaPosition.y + (areaConfig.height - heroConfig.margin);
    ctx.beginPath();
    ctx.arc(heroX, heroY, heroConfig.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText(heroText, heroX, heroY - heroConfig.radius - 5);
  }
}

export default WorldCanvas;