import type { GhostActivityPayload } from "./GhostActivityPayload";

export type GhostTravelingEvent = {
  eventType: "GHOST_TRAVELING";
  payload: GhostActivityPayload;
  occurredAt: number;
};
