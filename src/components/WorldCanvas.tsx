import { useEffect, useRef, useState } from "react";
import type { HeroDetails } from "../model/HeroDetails";
import type { Area } from "../model/Area";
import type { WorldEvent } from "../model/WorldEvent";
import type { FloatingDamage } from "../model/FloatingDamage";
import type { Monster } from "../model/Monster";
import { drawAreas } from "../rendering/areaRenderer";
import { resolveHeroPositions } from "../world/actorUtils";
import { drawHeroes } from "../rendering/heroRenderer";
import { drawMonsters } from "../rendering/monsterRenderer";
import { drawFloatingDamages } from "../rendering/effectRenderer";
import type { WorldState } from "../model/world/WorldState";
import type { Party } from "../model/Party";
import type { CanvasPosition } from "../model/CanvasPosition";
import type { CanvasSize } from "../model/CanvasSize";
import type { CanvasMenuButton, CanvasPanel } from "../model/CanvasMenu";
import {
  clampCamera,
  getCameraForWorldPosition,
  interpolateCamera,
} from "../world/cameraUtils";
import { getWorldBounds } from "../world/worldBoundsUtils";
import { drawCanvasMenu } from "../rendering/canvasMenuRenderer";
import { getCanvasMenuPanelAtPosition } from "../world/canvasMenuUtils";
import WorldOverlay from "./WorldOverlay";
import { worldCanvasColors } from "../config/worldCanvasColors";

type CameraDrag = {
  pointerId: number;
  startScreenPosition: CanvasPosition;
  startCameraPosition: CanvasPosition;
};

function WorldCanvas({
  heroes,
  areas,
  worldState,
  events,
  monsters,
  parties,
  onAssign,
  onDungeonAssign,
  onTownAssign,
}: {
  heroes: HeroDetails[];
  areas: Area[];
  worldState: WorldState;
  events: WorldEvent[];
  monsters: Monster[];
  parties: Party[];
  onAssign: (heroId: string, areaId: string) => void;
  onDungeonAssign: (heroId: string) => void;
  onTownAssign: (
    heroId: string,
    areaId: string | undefined,
    state: string,
  ) => void;
}) {
  const processedEventsCountRef = useRef(0);
  const floatingDamagesRef = useRef<FloatingDamage[]>([]);
  const heroesRef = useRef<HeroDetails[]>(heroes);
  const worldStateRef = useRef<WorldState>(worldState);
  const areasRef = useRef<Area[]>(areas);
  const monstersRef = useRef<Monster[]>(monsters);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<CanvasPosition>({ x: 0, y: 0 });
  const cameraTargetRef = useRef<CanvasPosition>({ x: 0, y: 0 });
  const menuButtonsRef = useRef<CanvasMenuButton[]>([]);
  const viewportRef = useRef<CanvasSize>({ width: 0, height: 0 });
  const cameraDragRef = useRef<CameraDrag | undefined>(undefined);
  const hasInitialCameraPositionRef = useRef(false);
  const [viewport, setViewport] = useState<CanvasSize>({ width: 0, height: 0 });
  const [activePanel, setActivePanel] = useState<CanvasPanel>();

  useEffect(() => {
    heroesRef.current = heroes;
  }, [heroes]);

  useEffect(() => {
    worldStateRef.current = worldState;
  }, [worldState]);

  useEffect(() => {
    areasRef.current = areas;
  }, [areas]);

  useEffect(() => {
    monstersRef.current = monsters;
  }, [monsters]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const nextViewport = { width: Math.floor(width), height: Math.floor(height) };
      viewportRef.current = nextViewport;
      setViewport(nextViewport);
    });
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bounds = getWorldBounds(areas);
    if (!bounds || viewport.width === 0 || viewport.height === 0) return;

    const center = {
      x: (bounds.left + bounds.right) / 2,
      y: (bounds.top + bounds.bottom) / 2,
    };
    const centeredCamera = clampCamera(
      getCameraForWorldPosition(center, viewport),
      viewport,
      bounds,
    );

    if (!hasInitialCameraPositionRef.current) {
      cameraRef.current = centeredCamera;
      cameraTargetRef.current = centeredCamera;
      hasInitialCameraPositionRef.current = true;
      return;
    }

    cameraTargetRef.current = clampCamera(
      cameraTargetRef.current,
      viewport,
      bounds,
    );
  }, [areas, viewport]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    function render() {
      if (!ctx || !canvas) return;
      const currentViewport = viewportRef.current;
      if (currentViewport.width === 0 || currentViewport.height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const devicePixelRatio = window.devicePixelRatio || 1;
      const pixelWidth = Math.floor(currentViewport.width * devicePixelRatio);
      const pixelHeight = Math.floor(currentViewport.height * devicePixelRatio);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.fillStyle = worldCanvasColors.background;
      ctx.fillRect(0, 0, currentViewport.width, currentViewport.height);

      const bounds = getWorldBounds(areasRef.current);
      if (bounds) {
        cameraTargetRef.current = clampCamera(
          cameraTargetRef.current,
          currentViewport,
          bounds,
        );
        cameraRef.current = interpolateCamera(
          cameraRef.current,
          cameraTargetRef.current,
          0.12,
        );
      }

      ctx.save();
      ctx.translate(cameraRef.current.x, cameraRef.current.y);

      const actorPositions = resolveHeroPositions(
        heroesRef.current,
        areasRef.current,
        worldStateRef.current,
      );
      // 1. Draw areas
      drawAreas(ctx, areasRef.current);

      // 2. Draw heroes
      drawHeroes(ctx, heroesRef.current, actorPositions);
      // 3. Draw monsters
      drawMonsters(
        ctx,
        monstersRef.current,
        actorPositions,
        worldStateRef?.current?.encounters,
      );

      // 4. Draw floating damages
      floatingDamagesRef.current = drawFloatingDamages(
        ctx,
        floatingDamagesRef.current,
        actorPositions,
      );

      ctx.restore();
      menuButtonsRef.current = drawCanvasMenu(
        ctx,
        currentViewport,
        activePanel,
      );

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activePanel]);

  useEffect(() => {
    const newEvents = events.slice(processedEventsCountRef.current);

    newEvents.forEach((event) => {
      if (event.eventType === "COMBAT_ACTION") {
        floatingDamagesRef.current.push({
          targetId: event.payload.targetId,
          value: event.payload.value,
          startedAt: performance.now(),
        });
      }
    });
    processedEventsCountRef.current += newEvents.length;
  }, [events]);

  function getScreenPosition(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function handleCanvasClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const selectedPanel = getCanvasMenuPanelAtPosition(
      menuButtonsRef.current,
      screenPosition,
    );

    if (selectedPanel) {
      setActivePanel((current) =>
        current === selectedPanel ? undefined : selectedPanel,
      );
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (event.button !== 0) return;

    const screenPosition = getScreenPosition(event);
    if (!screenPosition) return;
    if (getCanvasMenuPanelAtPosition(menuButtonsRef.current, screenPosition)) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    cameraDragRef.current = {
      pointerId: event.pointerId,
      startScreenPosition: screenPosition,
      startCameraPosition: cameraRef.current,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const drag = cameraDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const screenPosition = getScreenPosition(event);
    const bounds = getWorldBounds(areasRef.current);
    const currentViewport = viewportRef.current;
    if (!screenPosition || !bounds) return;

    const draggedCamera = {
      x:
        drag.startCameraPosition.x +
        screenPosition.x -
        drag.startScreenPosition.x,
      y:
        drag.startCameraPosition.y +
        screenPosition.y -
        drag.startScreenPosition.y,
    };
    cameraTargetRef.current = clampCamera(
      draggedCamera,
      currentViewport,
      bounds,
    );
  }

  function stopCameraDrag(event: React.PointerEvent<HTMLCanvasElement>) {
    if (cameraDragRef.current?.pointerId !== event.pointerId) return;
    cameraDragRef.current = undefined;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="world-canvas-container">
      <canvas
        ref={canvasRef}
        className="world-canvas"
        style={{ backgroundColor: worldCanvasColors.background }}
        onClick={handleCanvasClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopCameraDrag}
        onPointerCancel={stopCameraDrag}
      />
      {activePanel && (
        <WorldOverlay
          activePanel={activePanel}
          onClose={() => setActivePanel(undefined)}
          heroes={heroes}
          areas={areas}
          parties={parties}
          worldState={worldState}
          events={events}
          monsters={monsters}
          onAssign={onAssign}
          onDungeonAssign={onDungeonAssign}
          onTownAssign={onTownAssign}
        />
      )}
    </div>
  );
}

export default WorldCanvas;
