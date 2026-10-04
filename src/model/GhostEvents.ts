import type { GhostResurrectingEvent } from "./GhostResurrectingEvent";
import type { GhostTravelingEvent } from "./GhostTravelingEvent";
import type { GhostWaitingEvent } from "./GhostWaitingEvent";

export type GhostEvents =
  | GhostWaitingEvent
  | GhostTravelingEvent
  | GhostResurrectingEvent;
