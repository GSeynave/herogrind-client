import { heroConfig } from "../config/worldCanvasConfig";
import type { ActorPosition } from "../model/ActorPosition";
import type { Encounter } from "../model/Encounter";
import type { Monster } from "../model/Monster";

export function drawMonsters(
  ctx: CanvasRenderingContext2D,
  monsters: Monster[],
  actorPositions: Map<string, ActorPosition>,
  encounters: Encounter[],
) {
  if (actorPositions.size === 0) return;

  monsters.forEach((m) => {
    console.log(`Encounters: ${JSON.stringify(encounters)}`);
    const encounter = encounters.find((e) => e.monsterId === m.id);
    if (encounter) {
      console.log(
        `Monster ${m.name} is in encounter with hero ${encounter.heroId}`,
      );
      const actorPosition = actorPositions.get(encounter.heroId);
      if (!actorPosition) return;
      actorPositions.set(m.id, drawMonsterInCanvas(ctx, m, actorPosition));
    }
  });
}

function drawMonsterInCanvas(
  ctx: CanvasRenderingContext2D,
  monster: Monster,
  actorPosition: ActorPosition,
): ActorPosition {
  const monsterX = actorPosition.x + 60;
  const monsterY = actorPosition.y;

  ctx.beginPath();
  ctx.arc(monsterX, monsterY, heroConfig.radius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.fillText(monster.name, monsterX, monsterY - heroConfig.radius - 5);
  return { x: monsterX, y: monsterY };
}
