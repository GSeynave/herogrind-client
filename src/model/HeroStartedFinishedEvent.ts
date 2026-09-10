import type { HeroActivityPayload } from "./HeroActivityPayload"

export type HeroStartedFinishedEvent = {
        eventType: "HERO_FINISHED_ENCOUNTER",
        payload: HeroActivityPayload,
        occurredAt: number,
}