import type { CombatActionPayload } from "./CombatActionPayload"

export type CombatActionEvent={
        eventType: "COMBAT_ACTION",
        payload: CombatActionPayload,
        occurredAt: number,
}