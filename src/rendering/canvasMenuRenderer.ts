import type { CanvasMenuButton, CanvasPanel } from "../model/CanvasMenu";
import type { CanvasSize } from "../model/CanvasSize";
import { worldCanvasColors } from "../config/worldCanvasColors";

const menuItems: Array<{ panel: CanvasPanel; label: string }> = [
  { panel: "heroes", label: "Heroes" },
  { panel: "parties", label: "Parties" },
  { panel: "areas", label: "Areas" },
  { panel: "events", label: "Events" },
];
const buttonSize = { width: 92, height: 36 };
const menuPadding = 16;
const menuGap = 8;

export function drawCanvasMenu(
  ctx: CanvasRenderingContext2D,
  viewport: CanvasSize,
  activePanel: CanvasPanel | undefined,
): CanvasMenuButton[] {
  const buttons = menuItems.map((item, index) => ({
    ...item,
    position: {
      x: menuPadding + index * (buttonSize.width + menuGap),
      y: viewport.height - buttonSize.height - menuPadding,
    },
    size: buttonSize,
  }));

  ctx.font = "14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  buttons.forEach((button) => {
    const selected = button.panel === activePanel;
    ctx.fillStyle = selected
      ? worldCanvasColors.menu.selectedFill
      : worldCanvasColors.menu.fill;
    ctx.fillRect(
      button.position.x,
      button.position.y,
      button.size.width,
      button.size.height,
    );
    ctx.strokeStyle = selected
      ? worldCanvasColors.menu.selectedBorder
      : worldCanvasColors.menu.border;
    ctx.strokeRect(
      button.position.x,
      button.position.y,
      button.size.width,
      button.size.height,
    );
    ctx.fillStyle = worldCanvasColors.menu.label;
    ctx.fillText(
      button.label,
      button.position.x + button.size.width / 2,
      button.position.y + button.size.height / 2,
    );
  });

  return buttons;
}
