import { heroConfig } from "../config/worldCanvasConfig";
import { worldCanvasColors } from "../config/worldCanvasColors";
import type { ActorPosition } from "../model/ActorPosition";
import type { EncounterDto } from "../model/Encounter/EncounterDto";
import type { Monster } from "../model/Monster";
import { renderHealthBar } from "./healthBarRenderer";

export function drawMonsters(
  ctx: CanvasRenderingContext2D,
  monsters: Monster[],
  actorPositions: Map<string, ActorPosition>,
  encounters: EncounterDto[],
) {
  if (actorPositions.size === 0) return;

  monsters.forEach((m) => {
    console.log(`Encounters: ${JSON.stringify(encounters)}`);
    const encounter = encounters.find((e) => e.enemyId === m.id);
    if (encounter) {
      console.log(
        `Monster ${m.name} is in encounter with hero ${encounter.heroId}`,
      );
      const actorPosition = actorPositions.get(encounter.heroId);
      if (!actorPosition) return;
      actorPositions.set(
        m.id,
        drawMonsterInCanvas(ctx, m, actorPosition, encounter.enemyHealth),
      );
    }
  });
}

function drawMonsterInCanvas(
  ctx: CanvasRenderingContext2D,
  monster: Monster,
  actorPosition: ActorPosition,
  monsterHealth: number,
): ActorPosition {
  const monsterX = actorPosition.x + 60;
  const monsterY = actorPosition.y;

  ctx.save();
  ctx.strokeStyle = worldCanvasColors.monster.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(monsterX, monsterY, heroConfig.radius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = worldCanvasColors.monster.label;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(monster.name, monsterX, monsterY - heroConfig.radius - 5);

  renderHealthBar(
    ctx,
    { x: monsterX, y: monsterY },
    monster.health,
    monsterHealth,
  );
  ctx.restore();

  return { x: monsterX, y: monsterY };
}
