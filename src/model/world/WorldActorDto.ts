export type WorldActorType = "HERO" | "MONSTER";

export type WorldActorDto = {
  id: string;
  type: WorldActorType;
  areaId: string;
  positionX: number;
  positionY: number;
  behavior: string;
  targetId: string | null;
  health: number;
  maxHealth: number;
};
