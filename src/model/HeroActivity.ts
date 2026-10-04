import type { HeroActivityPayload } from "./HeroActivityPayload";
import type { HeroState } from "./HeroState";

export type HeroActivity = {
  heroId: string;
  areaId: string;
  state: HeroState;
  startedAt: number;
  payload: HeroActivityPayload;
};
