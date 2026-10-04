import type { AreaPosition } from "./AreaPosition";
import type { AreaSize } from "./AreaSize";

export type Area = {
  id: string;
  name: string;
  position: AreaPosition;
  size: AreaSize;
};
