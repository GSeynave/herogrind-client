import type { CanvasMenuButton, CanvasPanel } from "../model/CanvasMenu";
import type { CanvasPosition } from "../model/CanvasPosition";

export function getCanvasMenuPanelAtPosition(
  buttons: CanvasMenuButton[],
  position: CanvasPosition,
): CanvasPanel | undefined {
  return buttons.find((button) => isInsideButton(position, button))?.panel;
}

function isInsideButton(
  position: CanvasPosition,
  button: CanvasMenuButton,
): boolean {
  return (
    position.x >= button.position.x &&
    position.x <= button.position.x + button.size.width &&
    position.y >= button.position.y &&
    position.y <= button.position.y + button.size.height
  );
}
