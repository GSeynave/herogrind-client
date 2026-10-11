import type { HeroState } from "../HeroState";

export type HeroActivityDto = {
  heroId: string;
  areaId: string;
  state: HeroState;
  startedAt: number;
};
