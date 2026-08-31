import type {Party} from "../model/Party.ts"
export async function getParties(): Promise<Party[]> {
    const response = await fetch(
        "http://localhost:8080/parties",
        {
            method: "GET",
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch heroes details: ${response.status}`);
    }

    return response.json();
}
export async function addHeroToAreaParty(heroId: string, areaId: string): Promise<Party> {
    const response = await fetch(
        `http://localhost:8080/parties/areas/${areaId}/members`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ memberId: heroId }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to assign hero to area ${areaId}: ${response.status}`);
    }

    return response.json();
}
export async function addHeroToActiveParty(heroId: string): Promise<Party> {
    const response = await fetch(
        "http://localhost:8080/parties/active/members",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ memberId: heroId }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to assign hero to active party: ${response.status}`);
    }

    return response.json();
}

export async function removeHeroFromParty(heroId: string): Promise<void> {
    const response = await fetch(
        `http://localhost:8080/parties/active/members/${heroId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to remove hero from active party: ${response.status}`);
    }
}

export async function removeHeroFromAreaParty(heroId: string, areaId: string): Promise<void> {
    const response = await fetch(
        `http://localhost:8080/parties/areas/${areaId}/members/${heroId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to remove hero from area ${areaId} party: ${response.status}`);
    }
}