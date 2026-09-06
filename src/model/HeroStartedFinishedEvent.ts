import type { HeroActivityPayload } from "./HeroActivityPayload"

export type HeroStartedFinishedEvent = {
        type: "HERO_FINISHED_ENCOUNTER",
        payload: HeroActivityPayload,
        occurredAt: number,
}