import type { HeroDetails } from "../model/HeroDetails";
import type { ActorPosition } from "../model/ActorPosition";
import type { WorldActorDto } from "../model/world/WorldActorDto";
import { heroConfig } from "../config/worldCanvasConfig";
import { worldCanvasColors } from "../config/worldCanvasColors";
import { renderHealthBar } from "./healthBarRenderer";

export function drawHeroes(
  ctx: CanvasRenderingContext2D,
  heroes: HeroDetails[],
  actors: WorldActorDto[],
  actorPositions: Map<string, ActorPosition>,
) {
  if (actorPositions.size === 0) return;

  actorPositions.forEach((value: ActorPosition, key: string) => {
    const hero = heroes.find((h) => h.id === key);
    if (hero) {
      const actor = actors.find(
        (candidate) => candidate.id === hero.id && candidate.type === "HERO",
      );
      drawHeroInCanvas(ctx, hero, value, actor);
    }
  });
}

function drawHeroInCanvas(
  ctx: CanvasRenderingContext2D,
  h: HeroDetails,
  position: ActorPosition,
  actor: WorldActorDto | undefined,
) {
  const heroText = `${h.name}`;
  ctx.save();
  ctx.fillStyle = worldCanvasColors.hero.fill;
  ctx.strokeStyle = worldCanvasColors.hero.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(position.x, position.y, heroConfig.radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = worldCanvasColors.hero.label;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(heroText, position.x, position.y - heroConfig.radius - 5);
  if (actor) {
    renderHealthBar(ctx, position, actor.maxHealth, actor.health, {
      empty: worldCanvasColors.hero.healthEmpty,
      full: worldCanvasColors.hero.healthFull,
    });
  }
  ctx.restore();
}
