import type { HeroActivityPayload } from "./HeroActivityPayload"

export type HeroIdleEvent = {
        eventType: "HERO_IDLE",
        payload: HeroActivityPayload,
        occurredAt: number,
}