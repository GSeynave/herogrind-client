import type { Area } from "../model/Area";
import {
  getAreaCanvasPosition,
  getAreaCanvasSize,
  getAreaCenterPosition,
} from "../world/areaUtils";
import { worldCanvasColors } from "../config/worldCanvasColors";

export function drawAreas(ctx: CanvasRenderingContext2D, areas: Area[]) {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = worldCanvasColors.area.border;
  ctx.fillStyle = worldCanvasColors.area.label;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  areas.forEach((area) => {
    const areaCanvasPosition = getAreaCanvasPosition(area.position);
    const areaCanvasSize = getAreaCanvasSize(area.size);
    const areaCenter = getAreaCenterPosition(
      areaCanvasPosition,
      areaCanvasSize,
    );
    ctx.fillStyle = worldCanvasColors.area.fill;
    ctx.fillRect(
      areaCanvasPosition.x,
      areaCanvasPosition.y,
      areaCanvasSize.width,
      areaCanvasSize.height,
    );
    ctx.strokeRect(
      areaCanvasPosition.x,
      areaCanvasPosition.y,
      areaCanvasSize.width,
      areaCanvasSize.height,
    );
    ctx.fillStyle = worldCanvasColors.area.label;
    ctx.fillText(area.name, areaCenter.x, areaCenter.y);
  });

  ctx.restore();
}
