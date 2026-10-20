import { heroConfig } from "../config/worldCanvasConfig";
import { worldCanvasColors } from "../config/worldCanvasColors";
import type { ActorPosition } from "../model/ActorPosition";
import type { Monster } from "../model/Monster";
import type { WorldActorDto } from "../model/world/WorldActorDto";
import { renderHealthBar } from "./healthBarRenderer";

export function drawMonsters(
  ctx: CanvasRenderingContext2D,
  monsters: Monster[],
  actors: WorldActorDto[],
  actorPositions: Map<string, ActorPosition>,
) {
  if (actorPositions.size === 0) return;

  actors.filter((actor) => actor.type === "MONSTER").forEach((actor) => {
    const monster = monsters.find((candidate) => candidate.id === actor.id);
    const actorPosition = actorPositions.get(actor.id);
    if (!monster || !actorPosition) return;

    drawMonsterInCanvas(ctx, monster, actorPosition, actor.health, actor.maxHealth);
  });
}

function drawMonsterInCanvas(
  ctx: CanvasRenderingContext2D,
  monster: Monster,
  position: ActorPosition,
  monsterHealth: number,
  monsterMaxHealth: number,
) {

  ctx.save();
  ctx.strokeStyle = worldCanvasColors.monster.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(position.x, position.y, heroConfig.radius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = worldCanvasColors.monster.label;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(monster.name, position.x, position.y - heroConfig.radius - 5);

  renderHealthBar(
    ctx,
    position,
    monsterMaxHealth,
    monsterHealth,
    {
      empty: worldCanvasColors.monster.healthEmpty,
      full: worldCanvasColors.monster.healthFull,
    },
  );
  ctx.restore();
}
