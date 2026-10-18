import type { Area } from "../model/Area";
import type { HeroDetails } from "../model/HeroDetails";
import type { HeroActivityDto } from "../model/Hero/HeroActivityDto";

function HeroList({
  heroes,
  areas,
  activities,
  onAssign,
  onDungeonAssign,
  onTownAssign,
}: {
  heroes: HeroDetails[];
  areas: Area[];
  activities: HeroActivityDto[];
  onAssign: (heroId: string, areaId: string) => void;
  onDungeonAssign: (heroId: string) => void;
  onTownAssign: (heroId: string, areaId: string | undefined, state: string) => void;
}) {
  function getHeroActivity(heroId: string): HeroActivityDto | undefined {
    return activities.find((activity) => activity.heroId === heroId);
  }

  return (
    <div className="HeroList">
      {heroes.length > 0
        ? heroes.map((h) => {
            const activity = getHeroActivity(h.id);

            return (
              // Make it so we can clearly see the hero's name, role, level, and current activity state. Also, show the list of areas that the hero can be assigned to.
              <div key={h.id} className="hero-card">
                {h.name}
                {" - "}[{activity?.state ?? "LOADING"}]{" - "}[{h.role}]{" - "}[
                {h.level}]
                <div className="assign">
                  <div className="assign-label">Assign to:</div>
                  <div className="assign-list">
                    {areas.length > 0
                      ? areas.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => onAssign(h.id, a.id)}
                          >
                            {a.name}
                          </button>
                        ))
                      : "Loading..."}
                  </div>
                  <div className="assign-dungeon">
                    <button onClick={() => onDungeonAssign(h.id)}>
                      Dungeon
                    </button>
                  </div>
                  <div className="assign-town">
                    <button
                      onClick={() =>
                        onTownAssign(
                          h.id,
                          activity?.areaId,
                          activity?.state ?? "LOADING",
                        )
                      }
                    >
                      Town
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        : "Loading..."}
    </div>
  );
}

export default HeroList;
