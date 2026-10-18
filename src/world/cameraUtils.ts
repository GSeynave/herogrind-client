import type { CanvasPosition } from "../model/CanvasPosition";
import type { CanvasSize } from "../model/CanvasSize";

export type WorldBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export function getCameraForWorldPosition(
  worldPosition: CanvasPosition,
  viewport: CanvasSize,
): CanvasPosition {
  return {
    x: viewport.width / 2 - worldPosition.x,
    y: viewport.height / 2 - worldPosition.y,
  };
}

export function clampCamera(
  camera: CanvasPosition,
  viewport: CanvasSize,
  bounds: WorldBounds,
): CanvasPosition {
  const worldWidth = bounds.right - bounds.left;
  const worldHeight = bounds.bottom - bounds.top;

  return {
    x: clampAxis(camera.x, viewport.width, bounds.left, worldWidth),
    y: clampAxis(camera.y, viewport.height, bounds.top, worldHeight),
  };
}

export function interpolateCamera(
  current: CanvasPosition,
  target: CanvasPosition,
  factor: number,
): CanvasPosition {
  return {
    x: current.x + (target.x - current.x) * factor,
    y: current.y + (target.y - current.y) * factor,
  };
}

export function screenToWorldPosition(
  screenPosition: CanvasPosition,
  camera: CanvasPosition,
): CanvasPosition {
  return {
    x: screenPosition.x - camera.x,
    y: screenPosition.y - camera.y,
  };
}

function clampAxis(
  cameraOffset: number,
  viewportLength: number,
  worldStart: number,
  worldLength: number,
): number {
  if (worldLength <= viewportLength) {
    return viewportLength / 2 - (worldStart + worldLength / 2);
  }

  return Math.min(
    -worldStart,
    Math.max(viewportLength - worldStart - worldLength, cameraOffset),
  );
}
