import { heroConfig } from "../config/worldCanvasConfig";
import type { ActorPosition } from "../model/ActorPosition";

export function renderHealthBar(
  ctx: CanvasRenderingContext2D,
  actorPosition: ActorPosition,
  maxHealth: number,
  currentHealth: number,
  colors: { empty: string; full: string },
) {
  const x = actorPosition.x;
  const y = actorPosition.y;

  ctx.beginPath();

  // monster health bar
  const healthBarWidth = 40;
  const healthBarHeight = 5;
  const healthPercentage = currentHealth / maxHealth;
  ctx.fillStyle = colors.empty;
  ctx.fillRect(
    x - healthBarWidth / 2,
    y + heroConfig.radius + 5,
    healthBarWidth,
    healthBarHeight,
  );
  ctx.fillStyle = colors.full;
  ctx.fillRect(
    x - healthBarWidth / 2,
    y + heroConfig.radius + 5,
    healthBarWidth * healthPercentage,
    healthBarHeight,
  );
  ctx.fillStyle = "black"; // Reset fill style to default
}
