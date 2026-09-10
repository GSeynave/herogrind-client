import type { Monster } from "../model/Monster";

export async function getMonsters(): Promise<Monster[]> {
  const response = await fetch("http://localhost:8080/v1/monsters", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch monsters: ${response.status}`);
  }

  return response.json();
}
