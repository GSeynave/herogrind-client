import type { EncounterDto } from "../Encounter/EncounterDto";
import type { GhostDto } from "../Ghost/GhostDto";
import type { HeroActivityDto } from "../Hero/HeroActivityDto";
import type { WorldActorDto } from "./WorldActorDto";

export type WorldState = {
  heroActivities: HeroActivityDto[];
  encounters: EncounterDto[];
  ghosts: GhostDto[];
  actors: WorldActorDto[];
};
