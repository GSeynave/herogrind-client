export type GhostActivityPayload = {
  heroId: string;
  areaId: string;
  state: GhostState;
  currentAreaId: string;
  travelDestinationId: string;
  startedAt: number;
  arrivalAt: number;
  resurrectionEndAt: number;
};

export type GhostState = "TRAVELING" | "RESURRECTING" | "IDLE";
