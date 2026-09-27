import { worldCanvasConfig } from "../config/worldCanvasConfig";
import type { Area } from "../model/Area";
import type { AreaPosition } from "../model/AreaPosition";
import type { CanvasPosition } from "../model/CanvasPosition";
import type { CanvasSize } from "../model/CanvasSize";

export function getAreaCanvasPosition(
  areaPosition: AreaPosition,
): CanvasPosition {
  const x =
    worldCanvasConfig.margin + areaPosition.x * worldCanvasConfig.cellSize;
  const y =
    worldCanvasConfig.margin + areaPosition.y * worldCanvasConfig.cellSize;
  return { x, y };
}

export function getAreaCanvasSize(areaSize: {
  width: number;
  height: number;
}): CanvasSize {
  const width = worldCanvasConfig.cellSize * areaSize.width;
  const height = worldCanvasConfig.cellSize * areaSize.height;
  return { width, height };
}

export function getAreaCanvasCenter(area: Area): CanvasPosition {
  const areaCanvasPosition = getAreaCanvasPosition(area.position);
  const areaCanvasSize = getAreaCanvasSize(area.size);
  return {
    x: areaCanvasPosition.x + areaCanvasSize.width / 2,
    y: areaCanvasPosition.y + areaCanvasSize.height / 2,
  };
}
export function getAreaCenterPosition(
  areaCanvasPosition: CanvasPosition,
  areaCanvasSize: CanvasSize,
): CanvasPosition {
  return {
    x: areaCanvasPosition.x + areaCanvasSize.width / 2,
    y: areaCanvasPosition.y + areaCanvasSize.height / 2,
  };
}

export function getAreaById(areas: Area[], id: string): Area | undefined {
  return areas.find((a) => a.id === id);
}

export function getAreaByName(areas: Area[], name: string): Area | undefined {
  return areas.find((a) => a.name === name);
}
