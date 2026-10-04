import type { Area } from "../model/AreaPosition";

function AreaList({ areas }: { areas: Area[] }) {
  return (
    <div className="areas-card">
      {areas.length > 0 ? (
        <div className="areas-row">
          {areas.map((a) => (
            <div key={a.id} className="area-item">
              {a.name}
            </div>
          ))}
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default AreaList;
