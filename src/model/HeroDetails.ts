import type { HeroRole } from "./HeroRole"

export type HeroDetails = {
        id: string,
        name: string,
        role: HeroRole,
        level: number,
        health: number,
        attack: number,
        defense: number
    }
