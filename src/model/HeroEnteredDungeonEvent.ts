import type { HeroActivityPayload } from "./HeroActivityPayload"

export type HeroEnteredDungeonEvent = {
        eventType: "HERO_ENTERED_DUNGEON",
        payload: HeroActivityPayload,
        occurredAt: number,
}