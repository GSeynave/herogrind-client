import type { WorldEvent } from "../model/WorldEvent";
import type { HeroDetails } from "../model/HeroDetails";
import type { Monster } from "../model/Monster";
import type { WorldState } from "../model/world/WorldState";

function WorldEvents({
  events,
  worldState,
  heroes,
  monsters,
}: {
  events: WorldEvent[];
  worldState: WorldState | undefined;
  heroes: HeroDetails[];
  monsters: Monster[];
}) {
  const combatEvents = events.filter(
    (event): event is Extract<WorldEvent, {
      eventType:
        | "COMBAT_ACTION"
        | "HERO_STARTED_ENCOUNTER"
        | "HERO_ENDED_ENCOUNTER";
    }> =>
      event.eventType === "COMBAT_ACTION" ||
      event.eventType === "HERO_STARTED_ENCOUNTER" ||
      event.eventType === "HERO_ENDED_ENCOUNTER",
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

  function getEventLabel(event: WorldEvent): string {
    switch (event.eventType) {
      case "COMBAT_ACTION":
        return `Combat action by ${getName(event.payload.sourceId)} on ${getName(event.payload.targetId)}. Target health: ${event.payload.targetHealth}`;
      case "HERO_STARTED_ENCOUNTER":
        return `${getName(event.payload.heroId)} started an encounter against ${getName(event.payload.monsterId)}`;
      case "HERO_ENDED_ENCOUNTER":
        return `${getName(event.payload.heroId)} finished an encounter`;
      case "HERO_IDLE":
        return `${getName(event.payload.heroId)} is idle in area ${event.payload.areaId}`;
      case "HERO_ENTERED_DUNGEON":
        return `${getName(event.payload.heroId)} entered a dungeon in area ${event.payload.areaId}`;
      case "HERO_STARTED_ROAMING":
        return `${getName(event.payload.heroId)} started roaming
    in area ${event.payload.areaId}`;
      case "HERO_DIED":
        return `${getName(event.payload.heroId)} died in area ${event.payload.areaId}`;
      case "HERO_GHOST_TRAVELING":
        return `${getName(event.payload.heroId)} is traveling as a ghost`;
      case "HERO_GHOST_RESURRECTING":
        return `${getName(event.payload.heroId)} is resurrecting`;
      case "HERO_RESURRECTED":
        return `${getName(event.payload.heroId)} was resurrected`;
    }
  }

  return (
    <div className="WorldEvents">
      <div className="section-title">Combat Events :</div>

      {worldState?.encounters.map((encounter) => (
        <div key={encounter.encounterId} className="encounter-item">
          <div>
            {getName(encounter.heroId)} (Health: {encounter.heroHealth})
          </div>
          <div>
              {getName(encounter.enemyId)} (Health: {encounter.enemyHealth})
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
