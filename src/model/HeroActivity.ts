import type { HeroState } from "./HeroState"

export type HeroActivity={
        heroId: string,
        areaId: string,
        state: HeroState,
        encouterId: string
}