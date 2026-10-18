import type { CanvasPosition } from "./CanvasPosition";
import type { CanvasSize } from "./CanvasSize";

export type CanvasPanel = "heroes" | "parties" | "areas" | "events";

export type CanvasMenuButton = {
  panel: CanvasPanel;
  label: string;
  position: CanvasPosition;
  size: CanvasSize;
};
