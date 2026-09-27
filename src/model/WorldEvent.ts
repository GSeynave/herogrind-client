import type { CombatActionEvent } from "./CombatActionEvent";
import type { GhostResurrectingEvent } from "./GhostResurrectingEvent";
import type { GhostTravelingEvent } from "./GhostTravelingEvent";
import type { GhostWaitingEvent } from "./GhostWaitingEvent";
import type { HeroEnteredDungeonEvent } from "./HeroEnteredDungeonEvent";
import type { HeroIdleEvent } from "./HeroIdleEvent";
import type { HeroStartedEncounterEvent } from "./HeroStartedEncounterEvent";
import type { HeroFinishedEncounterEvent } from "./HeroStartedFinishedEvent";
import type { HeroStartedRoamingEvent } from "./HeroStartedRoamingEvent";

export type WorldEvent =
  | CombatActionEvent
  | HeroStartedRoamingEvent
  | HeroStartedEncounterEvent
  | HeroFinishedEncounterEvent
  | HeroEnteredDungeonEvent
  | HeroIdleEvent
  | GhostResurrectingEvent
  | GhostTravelingEvent
  | GhostWaitingEvent;
