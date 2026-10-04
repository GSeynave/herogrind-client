import { heroConfig } from "../config/worldCanvasConfig";
import type { ActorPosition } from "../model/ActorPosition";
import type { FloatingDamage } from "../model/FloatingDamage";

export function drawFloatingDamages(
  ctx: CanvasRenderingContext2D,
  floatingDamages: FloatingDamage[],
  actorPositions: Map<string, ActorPosition>,
): FloatingDamage[] {
  const now = performance.now();
  return floatingDamages.filter((damage) => {
    const elapsed = now - damage.startedAt;
    if (elapsed > 700) {
      return false;
    }

    const progress = elapsed / 700;

    const targetPosition = getActorPosition(damage.targetId, actorPositions);

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

function getActorPosition(
  actorId: string,
  actorPositions: Map<string, ActorPosition>,
): ActorPosition | undefined {
  return actorPositions.get(actorId);
}
