import type { Area } from "../model/Area";
import type { CanvasPanel } from "../model/CanvasMenu";
import type { HeroDetails } from "../model/HeroDetails";
import type { Monster } from "../model/Monster";
import type { Party } from "../model/Party";
import type { WorldEvent } from "../model/WorldEvent";
import type { WorldState } from "../model/world/WorldState";
import AreaList from "./AreaList";
import HeroList from "./HeroList";
import PartyList from "./PartyList";
import WorldEvents from "./WorldEvents";

type WorldOverlayProps = {
  activePanel: CanvasPanel;
  onClose: () => void;
  heroes: HeroDetails[];
  areas: Area[];
  parties: Party[];
  worldState: WorldState | undefined;
  events: WorldEvent[];
  monsters: Monster[];
  onAssign: (heroId: string, areaId: string) => void;
  onDungeonAssign: (heroId: string) => void;
  onTownAssign: (
    heroId: string,
    areaId: string | undefined,
    state: string,
  ) => void;
};

function WorldOverlay({ activePanel, onClose, ...props }: WorldOverlayProps) {
  return (
    <aside className="world-overlay" aria-label={`${activePanel} panel`}>
      <button className="world-overlay-close" onClick={onClose}>
        Close
      </button>
      {activePanel === "heroes" && (
        <HeroList
          heroes={props.heroes}
          areas={props.areas}
          activities={props.worldState?.heroActivities || []}
          onAssign={props.onAssign}
          onDungeonAssign={props.onDungeonAssign}
          onTownAssign={props.onTownAssign}
        />
      )}
      {activePanel === "parties" && (
        <PartyList parties={props.parties} areas={props.areas} />
      )}
      {activePanel === "areas" && <AreaList areas={props.areas} />}
      {activePanel === "events" && (
        <WorldEvents
          events={props.events}
          worldState={props.worldState}
          heroes={props.heroes}
          monsters={props.monsters}
        />
      )}
    </aside>
  );
}

export default WorldOverlay;
