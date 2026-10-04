import type { GhostActivityPayload } from "./GhostActivityPayload";

export type GhostResurrectingEvent = {
  eventType: "GHOST_RESURRECTING";
  payload: GhostActivityPayload;
  occurredAt: number;
};
