import type { HeroActivityPayload } from "./HeroActivityPayload"

export type HeroStartedRoamingEvent = {
        eventType: "HERO_STARTED_ROAMING",
        payload: HeroActivityPayload,
        occurredAt: number,
}