import type { HeroActivity } from "../model/HeroActivity";
import type { HeroDetails } from "../model/HeroDetails";

function WorldCanvas({
  heroes,
  areas,
  activities
}: {
  heroes: HeroDetails[];
  areas: any[];
  activities: HeroActivity[];
}) {

  function getHeroActivity(heroId: string): HeroActivity | undefined {
    return activities.find(
      (a: HeroActivity) => a.heroId === heroId
    );
  }

  const idleHeroes = heroes.filter(
    h => getHeroActivity(h.id)?.state === "IDLE"
  );

  return (
    <div className="WorldCanvas">
      <div
        className="area-square"
        style={{ backgroundColor: "lightgray" }}
      >

        <div>
          {areas.length > 0 ? (
            areas.map((a) => {
              const heroesInArea = heroes.filter(
                h => getHeroActivity(h.id)?.areaId === a.id
              );

              return (
                <div key={a.id}>
                  <div className="area-item">
                    {a.name}
                  </div>

                  {heroesInArea.length > 0 ? (
                    heroesInArea.map((h) => {
                      const activity = getHeroActivity(h.id);

                      return (
                        <div key={h.id} className="hero-card">
                          {h.name}
                          {" - "}
                          [{activity?.state ?? "LOADING"}]
                          {" - "}
                          [{h.role}]
                          {" - "}
                          [{h.level}]
                        </div>
                      );
                    })
                  ) : (
                    "No heroes assigned"
                  )}
                </div>
              );
            })
          ) : (
            "Loading..."
          )}
        </div>

        <div className="area-label">Town</div>

        {idleHeroes.length > 0 ? (
          idleHeroes.map((h) => {
            const activity = getHeroActivity(h.id);

            return (
              <div key={h.id} className="hero-card">
                {h.name}
                {" - "}
                [{activity?.state ?? "LOADING"}]
                {" - "}
                [{h.role}]
                {" - "}
                [{h.level}]
              </div>
            );
          })
        ) : (
          "No heroes assigned"
        )}

      </div>
    </div>
  );
}

export default WorldCanvas;