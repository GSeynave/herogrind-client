import type { HeroActivity } from "../model/HeroActivity";

export function getHeroActivity(
  heroId: string,
  activities: HeroActivity[],
): HeroActivity | undefined {
  return activities.find((a: HeroActivity) => a.heroId === heroId);
}
