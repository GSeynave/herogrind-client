import type {Area} from "../model/Area.ts"

export async function getAreas(): Promise<Area[]> {
  const response = await fetch(
    "http://localhost:8080/areas",
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch areas: ${response.status}`);
  }

  return response.json();
}
