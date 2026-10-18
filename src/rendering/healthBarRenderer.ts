import { heroConfig } from "../config/worldCanvasConfig";
import { worldCanvasColors } from "../config/worldCanvasColors";
import type { ActorPosition } from "../model/ActorPosition";

export function renderHealthBar(
  ctx: CanvasRenderingContext2D,
  actorPosition: ActorPosition,
  maxHealth: number,
  currentHealth: number,
) {
  const x = actorPosition.x + 60;
  const y = actorPosition.y;

  ctx.beginPath();

  // monster health bar
  const healthBarWidth = 40;
  const healthBarHeight = 5;
  const healthPercentage = currentHealth / maxHealth;
  ctx.fillStyle = worldCanvasColors.monster.healthEmpty;
  ctx.fillRect(
    x - healthBarWidth / 2,
    y + heroConfig.radius + 5,
    healthBarWidth,
    healthBarHeight,
  );
  ctx.fillStyle = worldCanvasColors.monster.healthFull;
  ctx.fillRect(
    x - healthBarWidth / 2,
    y + heroConfig.radius + 5,
    healthBarWidth * healthPercentage,
    healthBarHeight,
  );
  ctx.fillStyle = "black"; // Reset fill style to default
}
