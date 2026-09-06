import type { WorldEvent } from "../model/WorldEvent";
import type { WorldEventType } from "../model/WorldEventType";
import type { HeroDetails } from "../model/HeroDetails";

function WorldEvents({ events, heroes }: { events: WorldEvent[], heroes: HeroDetails[] }) {
    const combatEventTypes: WorldEventType[] = ["COMBAT_ACTION", "HERO_STARTED_ENCOUNTER", "HERO_FINISHED_ENCOUNTER"];
    const combatEvents = events.filter(e => combatEventTypes.includes(e.type));
    const worldEvents = events.filter(e => !combatEventTypes.includes(e.type));
    function getHeroName(heroId: string): string {
        const hero = heroes.find(h => h.id === heroId);
        return hero ? hero.name : "Unknown Hero";
    }

    function getEventLabel(event: WorldEvent): string {
        switch (event.type) {
            case "COMBAT_ACTION":
                return `Combat action by ${getHeroName(event.payload.sourceId)} on ${getHeroName(event.payload.targetId)}. Target health: ${event.payload.targetHealth}`;
            case "HERO_STARTED_ENCOUNTER":
                return `${getHeroName(event.payload.heroId)} started an encounter in area ${event.payload.areaId}`;
            case "HERO_FINISHED_ENCOUNTER":
                return `${getHeroName(event.payload.heroId)} finished an encounter in area ${event.payload.areaId}`;
            case "HERO_IDLE":
                return `${getHeroName(event.payload.heroId)} is idle in area ${event.payload.areaId}`;
            case "HERO_ENTERED_DUNGEON":
                return `${getHeroName(event.payload.heroId)} entered a dungeon in area ${event.payload.areaId}`;
            case "HERO_STARTED_ROAMING":
                return `${getHeroName(event.payload.heroId)} started roaming
    in area ${event.payload.areaId}`;
            
            default:
                return `Unknown event type: ${event.type}`;
        }
    }
    return (
        <div className="WorldEvents">
            <div className="section-title">World Events :</div>
            {events.length > 0 ? (
                combatEvents.map((e) => (
                    <div key={e.occurredAt} className="event-item"> {getEventLabel(e)}</div>
                ))
            ) : (
                'Loading...'
            )}
        </div>
    );
}

export default WorldEvents;