import type { WorldEvent } from "../model/Event";
import type { HeroDetails } from "../model/HeroDetails";

function WorldEvents({ events, heroes }: { events: WorldEvent[], heroes: HeroDetails[] }) {
    function getHeroName(heroId: string): string {
        const hero = heroes.find(h => h.id === heroId);
        return hero ? hero.name : "Unknown Hero";
    }
    return (
        <div className="WorldEvents">
            <div className="section-title">World Events :</div>
            {events.length > 0 ? (
                events.map((e) => (
                    <div key={e.occurredAt} className="event-item"> {getHeroName(e.heroId)} - {e.type}</div>
                ))
            ) : (
                'Loading...'
            )}
        </div>
    );
}

export default WorldEvents;