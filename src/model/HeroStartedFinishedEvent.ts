import type { HeroActivityPayload } from "./HeroActivityPayload";

export type HeroFinishedEncounterEvent = {
  eventType: "HERO_FINISHED_ENCOUNTER";
  payload: HeroActivityPayload;
  occurredAt: number;
};

