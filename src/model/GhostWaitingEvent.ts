import type { GhostActivityPayload } from "./GhostActivityPayload";

export type GhostWaitingEvent = {
  eventType: "GHOST_WAITING";
  payload: GhostActivityPayload;
  occurredAt: number;
};
