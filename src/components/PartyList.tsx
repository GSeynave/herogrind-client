import type { Area } from "../model/AreaPosition";
import type { Party } from "../model/Party";

function PartyList({ parties, areas }: { parties: Party[]; areas: Area[] }) {
  return (
    <div className="PartyList">
      {parties.length > 0
        ? parties.map((p) => {
            const areaName =
              areas.find((a) => a.id === p.areaId)?.name ?? "Unknown Area";
            return (
              <div key={p.id} className="party-item">
                {areaName} - {p.members.map((m) => m.name).join(", ")}
              </div>
            );
          })
        : "None"}
    </div>
  );
}

export default PartyList;
