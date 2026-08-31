import type { HeroDetails } from "../model/HeroDetails";

export async function getHeroesDetails(): Promise<HeroDetails[]> {
    const response = await fetch(
        "http://localhost:8080/heroes",
        {
            method: "GET",
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch heroes details: ${response.status}`);
    }

    return response.json();
}