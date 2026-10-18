import { worldCanvasConfig } from "../config/worldCanvasConfig";
import type { Area } from "../model/Area";
import type { WorldBounds } from "./cameraUtils";
import { getAreaCanvasPosition, getAreaCanvasSize } from "./areaUtils";

export function getWorldBounds(areas: Area[]): WorldBounds | undefined {
  if (areas.length === 0) return undefined;

  const bounds = areas.reduce<WorldBounds | undefined>((current, area) => {
    const position = getAreaCanvasPosition(area.position);
    const size = getAreaCanvasSize(area.size);
    const areaBounds = {
      left: position.x,
      top: position.y,
      right: position.x + size.width,
      bottom: position.y + size.height,
    };

    if (!current) return areaBounds;

    return {
      left: Math.min(current.left, areaBounds.left),
      top: Math.min(current.top, areaBounds.top),
      right: Math.max(current.right, areaBounds.right),
      bottom: Math.max(current.bottom, areaBounds.bottom),
    };
  }, undefined);

  if (!bounds) return undefined;

  return {
    left: bounds.left - worldCanvasConfig.margin,
    top: bounds.top - worldCanvasConfig.margin,
    right: bounds.right + worldCanvasConfig.margin,
    bottom: bounds.bottom + worldCanvasConfig.margin,
  };
}
