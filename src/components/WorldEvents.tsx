import type { WorldEvent } from "../model/WorldEvent";
import type { WorldEventType } from "../model/WorldEventType";
import type { HeroDetails } from "../model/HeroDetails";
import type { Monster } from "../model/Monster";
import { useEffect, useRef, useState } from "react";
import type { CombatActionEvent } from "../model/CombatActionEvent";
import type { HeroStartedEncounterEvent } from "../model/HeroStartedEncounterEvent";

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
  function getActor(id: string): HeroDetails | Monster | "Unknown" {
    const hero = heroes.find((h) => h.id === id);
    if (hero) return hero;
    const monster = monsters.find((m) => m.id === id);
    if (monster) return monster;
    return "Unknown";
  }
  function getName(id: string): string {
    const actor = getActor(id);
    if (actor === "Unknown") return "Unknown";
    return actor.name;
  }

  type Encounter = {
    encounterId: string;
    heroId: string;
    heroHealth: number;
    monsterId: string;
    monsterHealth: number;
  };
  const processedEventCountRef = useRef(0);
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  useEffect(() => {
    const newEvents = events.slice(processedEventCountRef.current);

    if (newEvents.length === 0) {
      return;
    }

    setEncounters((previous) => {
      let next = [...previous];

      newEvents.forEach((event) => {
        switch (event.eventType) {
          case "HERO_STARTED_ENCOUNTER":
            next = heroStartedEncounterHandling(next, event);
            break;

          case "COMBAT_ACTION":
            next = combatActionHandling(next, event);
            break;
          case "HERO_FINISHED_ENCOUNTER":
            next = next.filter((e) => e.heroId !== event.payload.heroId);
            break;
        }
      });
      return next;
    });
    processedEventCountRef.current = events.length;
  }, [events]);

  function heroStartedEncounterHandling(
    next: Encounter[],
    event: HeroStartedEncounterEvent,
  ) {
    return [
      ...next,
      {
        encounterId: event.payload.encounterId,
        heroId: event.payload.heroId,
        heroHealth: event.payload.heroHealth,
        monsterId: event.payload.monsterId,
        monsterHealth: event.payload.monsterHealth,
      },
    ];
  }

  function combatActionHandling(next: Encounter[], event: CombatActionEvent) {
    next = next.map((encounter) => {
      if (
        encounter.heroId !== event.payload.sourceId &&
        encounter.heroId !== event.payload.targetId &&
        encounter.monsterId !== event.payload.sourceId &&
        encounter.monsterId !== event.payload.targetId
      ) {
        return encounter;
      }
      if (event.payload.targetId === encounter.heroId) {
        return {
          ...encounter,
          heroHealth: event.payload.targetHealth,
        };
      }

      if (event.payload.targetId === encounter.monsterId) {
        return {
          ...encounter,
          monsterHealth: event.payload.targetHealth,
        };
      }
      return encounter;
    });
    return next;
  }

  function getEventLabel(event: WorldEvent): string {
    switch (event.eventType) {
      case "COMBAT_ACTION":
        return `Combat action by ${getName(event.payload.sourceId)} on ${getName(event.payload.targetId)}. Target health: ${event.payload.targetHealth}`;
      case "HERO_STARTED_ENCOUNTER":
        return `${getName(event.payload.heroId)} started an encounter against ${getName(event.payload.monsterId)}`;
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

      {encounters.map((encounter) => (
        <div key={encounter.encounterId} className="encounter-item">
          <div>
            {getName(encounter.heroId)} (Health: {encounter.heroHealth})
          </div>
          <div>
            {getName(encounter.monsterId)} (Health: {encounter.monsterHealth})
          </div>
          )
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
