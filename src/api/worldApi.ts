import type { HeroActivity } from "../model/HeroActivity";
import type { WorldEvent } from "../model/WorldEvent";

export async function getHeroActivities(): Promise<HeroActivity[]> {
    const response = await fetch(
        "http://localhost:8080/world/heroes/activities",
        {
            method: "GET",
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch heroes activities: ${response.status}`);
    }

    return response.json();
}

export async function getEvents(): Promise<WorldEvent[]> {
    const response = await fetch(
        "http://localhost:8080/world/events",
        {
            method: "GET",
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
    }

    return response.json();
}