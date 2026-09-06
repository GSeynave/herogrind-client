import type { HeroActivityPayload } from "./HeroActivityPayload"

export type HeroEnteredDungeonEvent = {
        type: "HERO_ENTERED_DUNGEON",
        payload: HeroActivityPayload,
        occurredAt: number,
}