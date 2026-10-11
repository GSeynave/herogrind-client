import type { HeroActivityDto } from "../model/Hero/HeroActivityDto";

export function getHeroActivity(
  heroId: string,
  activities: HeroActivityDto[],
): HeroActivityDto | undefined {
  return activities.find((a: HeroActivityDto) => a.heroId === heroId);
}
