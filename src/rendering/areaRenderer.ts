import type { Area } from "../model/Area";
import {
  getAreaCanvasPosition,
  getAreaCanvasSize,
  getAreaCenterPosition,
} from "../world/areaUtils";

export function drawAreas(ctx: CanvasRenderingContext2D, areas: Area[]) {
  areas.forEach((area) => {
    const areaCanvasPosition = getAreaCanvasPosition(area.position);
    const areaCanvasSize = getAreaCanvasSize(area.size);
    const areaCenter = getAreaCenterPosition(
      areaCanvasPosition,
      areaCanvasSize,
    );
    ctx.strokeRect(
      areaCanvasPosition.x,
      areaCanvasPosition.y,
      areaCanvasSize.width,
      areaCanvasSize.height,
    );
    ctx.fillText(area.name, areaCenter.x, areaCenter.y);
  });
}
