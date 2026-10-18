type EventMetadata = {
  occurredAt: number;
};

type HeroActivityPayload = {
  heroId: string;
  areaId: string;
};

type EncounterPayload = {
  encounterId: string;
  heroId: string;
  heroHealth: number;
  monsterId: string;
  monsterHealth: number;
};

type GhostPayload = {
  heroId: string;
  areaId: string | null;
  state: "TRAVELING" | "RESURRECTING" | "IDLE";
  currentAreaId: string | null;
  travelDestinationId: string | null;
  arrivalAt: number | null;
  resurrectionEndAt: number | null;
};

export type WorldEvent =
  | (EventMetadata & {
      eventType:
        | "HERO_IDLE"
        | "HERO_ENTERED_DUNGEON"
        | "HERO_STARTED_ROAMING"
        | "HERO_DIED";
      payload: HeroActivityPayload;
    })
  | (EventMetadata & {
      eventType: "HERO_STARTED_ENCOUNTER" | "HERO_ENDED_ENCOUNTER";
      payload: EncounterPayload;
    })
  | (EventMetadata & {
      eventType: "COMBAT_ACTION";
      payload: {
        sourceId: string;
        targetId: string;
        targetHealth: number;
        actionType: string;
        value: number;
      };
    })
  | (EventMetadata & {
      eventType:
        | "HERO_GHOST_RESURRECTING"
        | "HERO_GHOST_TRAVELING"
        | "HERO_RESURRECTED";
      payload: GhostPayload;
    });

export type WorldEventType = WorldEvent["eventType"];
