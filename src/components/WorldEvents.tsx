import type { WorldEvent } from "../model/WorldEvent";
import type { WorldEventType } from "../model/WorldEventType";
import type { HeroDetails } from "../model/HeroDetails";
import type { Monster } from "../model/Monster";
import { useEffect, useRef, useState } from "react";

function WorldEvents({
  events,
  heroes,
  monsters,
}: {
  events: WorldEvent[];
  heroes: HeroDetails[];
  monsters: Monster[];
}) {
  const combatEventTypes: WorldEventType[] = [
    "COMBAT_ACTION",
    "HERO_STARTED_ENCOUNTER",
    "HERO_FINISHED_ENCOUNTER",
  ];
  const combatEvents = events.filter((e) =>
    combatEventTypes.includes(e.eventType),
  );
  const worldEvents = events.filter(
    (e) => !combatEventTypes.includes(e.eventType),
  );
  function getActor(id: string): HeroDetails | Monster | "Unknown" {
    const hero = heroes.find((h) => h.id === id);
    if (hero) return hero;
    const monster = monsters.find((m) => m.id === id);
    if (monster) return monster;
    return "Unknown";
  }
  function getName(id: string): string {
    const actor = getActor(id);
    return actor ? (actor as HeroDetails).name : "Unknown";
  }

  type Encounter = {
    heroId: string;
    heroHealth: number;
    monsterId?: string;
    monsterHealth?: number;
  };
  const processedEventCountRef = useRef(0);
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  useEffect(() => {
    const newEvents = events.slice(processedEventCountRef.current);
    newEvents.forEach((event) => {
      switch (event.eventType) {
        case "COMBAT_ACTION":
          var encounter = encounters.find(
            (e) =>
              e.heroId === event.payload.sourceId ||
              e.heroId === event.payload.targetId,
          );
          // FIXME to be fix by sending proper encounters events from server.
          if (encounter) {
            if (!encounter.monsterId)
              encounter.monsterId =
                encounter.heroId === event.payload.targetId
                  ? (encounter.monsterId = event.payload.sourceId)
                  : (encounter.monsterId = event.payload.targetId);

            if (event.payload.targetId === encounter.heroId) {
              encounter.heroHealth = event.payload.targetHealth;
            }
            if (event.payload.targetId === encounter.monsterId) {
              encounter.monsterHealth = event.payload.targetHealth;
            }
          }
          break;
        case "HERO_STARTED_ENCOUNTER":
          setEncounters((prev) => [
            ...prev,
            {
              heroId: event.payload.heroId,
              heroHealth:
                getActor(event.payload.heroId) === "Unknown"
                  ? 0
                  : (getActor(event.payload.heroId) as HeroDetails).health,
            },
          ]);
          break;
        case "HERO_FINISHED_ENCOUNTER":
          setEncounters((prevEncounters) =>
            prevEncounters.filter((e) => e.heroId !== encounter!.heroId),
          );
          break;
        case "HERO_IDLE":
        case "HERO_ENTERED_DUNGEON":
        case "HERO_STARTED_ROAMING":

        default:
          return `Unknown event type`;
      }
    });
    processedEventCountRef.current = events.length;
  }, [events]);

  function getEventLabel(event: WorldEvent): string {
    switch (event.eventType) {
      case "COMBAT_ACTION":
        return `Combat action by ${getName(event.payload.sourceId)} on ${getName(event.payload.targetId)}. Target health: ${event.payload.targetHealth}`;
      case "HERO_STARTED_ENCOUNTER":
        return `${getName(event.payload.heroId)} started an encounter in area ${event.payload.areaId}`;
      case "HERO_FINISHED_ENCOUNTER":
        return `${getName(event.payload.heroId)} finished an encounter in area ${event.payload.areaId}`;
      case "HERO_IDLE":
        return `${getName(event.payload.heroId)} is idle in area ${event.payload.areaId}`;
      case "HERO_ENTERED_DUNGEON":
        return `${getName(event.payload.heroId)} entered a dungeon in area ${event.payload.areaId}`;
      case "HERO_STARTED_ROAMING":
        return `${getName(event.payload.heroId)} started roaming
    in area ${event.payload.areaId}`;

      default:
        return `Unknown event type`;
    }
  }

  return (
    <div className="WorldEvents">
      <div className="section-title">Combat Events :</div>

      {encounters.map((encounter, index) => (
        <div key={`${encounter.heroId}-${index}`} className="encounter-item">
          <div>
            {getName(encounter.heroId)} (Health: {encounter.heroHealth})
          </div>
          {encounter.monsterId && (
            <div>
              {getName(encounter.monsterId)} (Health: {encounter.monsterHealth})
            </div>
          )}
        </div>
      ))}

      {combatEvents.map((e, index) => (
        <div key={`${e.occurredAt}-${index}`} className="event-item">
          {getEventLabel(e)}
        </div>
      ))}
    </div>
  );
}

export default WorldEvents;
