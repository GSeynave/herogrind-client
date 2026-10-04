import type { HeroDetails } from "../model/HeroDetails";
import type { ActorPosition } from "../model/ActorPosition";
import { heroConfig } from "../config/worldCanvasConfig";

export function drawHeroes(
  ctx: CanvasRenderingContext2D,
  heroes: HeroDetails[],
  actorPositions: Map<string, ActorPosition>,
) {
  if (actorPositions.size === 0) return;

  actorPositions.forEach((value: ActorPosition, key: string) => {
    const hero = heroes.find((h) => h.id === key);
    if (hero) {
      drawHeroInCanvas(ctx, hero, value);
    }
  });
}

function drawHeroInCanvas(
  ctx: CanvasRenderingContext2D,
  h: HeroDetails,
  position: ActorPosition,
): ActorPosition {
  const heroText = `${h.name}`;
  //actorPositionsRef.current.set(h.id, position);
  ctx.beginPath();
  ctx.arc(position.x, position.y, heroConfig.radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillText(heroText, position.x, position.y - heroConfig.radius - 5);
  return position;
}
