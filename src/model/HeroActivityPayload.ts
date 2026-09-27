import type { EncounterAcitivyPayload } from "./EncounterActivityPayload";
import type { GhostActivityPayload } from "./GhostActivityPayload";

export type HeroActivityPayload =
  | EncounterAcitivyPayload
  | GhostActivityPayload;
