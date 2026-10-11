import type { WorldState } from "../model/world/WorldState";
import type { WorldEvent } from "../model/WorldEvent";

export async function getWorldState(): Promise<WorldState> {
  const response = await fetch("http://localhost:8080/v1/world/state", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch heroes activities: ${response.status}`);
  }

  return response.json();
}

export async function getEvents(): Promise<WorldEvent[]> {
  const response = await fetch("http://localhost:8080/v1/world/events", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`);
  }

  return response.json();
}
