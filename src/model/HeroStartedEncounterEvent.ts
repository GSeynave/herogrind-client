import type { HeroActivityPayload } from "./HeroActivityPayload";

export type HeroStartedEncounterEvent = {
  eventType: "HERO_STARTED_ENCOUNTER";
  payload: HeroActivityPayload;
  occurredAt: number;
};
