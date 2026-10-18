import { useState, useEffect } from "react";
import "./App.css";
import * as HeroApi from "./api/heroApi";
import * as AreasApi from "./api/areaApi";
import * as PartyApi from "./api/partyApi";
import * as WorldApi from "./api/worldApi";
import * as MonsterApi from "./api/monsterApi";
import HeroList from "./components/HeroList";
import PartyList from "./components/PartyList";
import AreaList from "./components/AreaList";
import WorldEvents from "./components/WorldEvents";
import WorldCanvas from "./components/WorldCanvas";
import type { WorldEvent } from "./model/WorldEvent";
import type { Monster } from "./model/Monster";
import type { WorldState } from "./model/world/WorldState";
import type { HeroDetails } from "./model/HeroDetails";
import type { Area } from "./model/Area";
import type { Party } from "./model/Party";

function App() {
  const [heroes, setHeroes] = useState<HeroDetails[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [worldState, setWorldState] = useState<WorldState>();
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [events, setEvents] = useState<WorldEvent[]>([]);

  useEffect(() => {
    let mounted = true;
    HeroApi.getHeroesDetails()
      .then((data) => {
        if (mounted) setHeroes(data);
      })
      .catch((err) => {
        console.error("Failed to load heroes", err);
      });
    WorldApi.getWorldState()
      .then((data) => {
        if (mounted) setWorldState(data);
      })
      .catch((err) => {
        console.error("Failed to load activities", err);
      });

    MonsterApi.getMonsters()
      .then((data) => {
        if (mounted) setMonsters(data);
      })
      .catch((err) => {
        console.error("Failed to load monsters", err);
      });

    PartyApi.getParties()
      .then((data) => {
        if (mounted) setParties(data);
      })
      .catch((err) => {
        console.error("Failed to load parties", err);
      });

    AreasApi.getAreas()
      .then((data) => {
        if (mounted) setAreas(data);
      })
      .catch((err) => {
        console.error("Failed to load areas", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function assignHeroToDungeon(heroId: string) {
    try {
      await PartyApi.addHeroToActiveParty(heroId);

      const updatedParties = await PartyApi.getParties();
      setParties(updatedParties);
    } catch (err) {
      console.error(`Failed to assign hero ${heroId} to dungeon`, err);
    }
  }
  async function assignHeroToArea(heroId: string, areaId: string) {
    try {
      await PartyApi.addHeroToAreaParty(heroId, areaId);

      const updatedParties = await PartyApi.getParties();
      setParties(updatedParties);
    } catch (err) {
      console.error(`Failed to assign hero ${heroId} to area ${areaId}`, err);
    }
  }

  async function assignHeroToTown(
    heroId: string,
    areaId: string | undefined,
    state: string,
  ) {
    try {
      if (state === "DUNGEON") {
        await PartyApi.removeHeroFromParty(heroId);
      } else {
        if (!areaId) {
          throw new Error(`No area assignment found for hero ${heroId}`);
        }
        await PartyApi.removeHeroFromAreaParty(heroId, areaId);
      }

      const updatedParties = await PartyApi.getParties();
      setParties(updatedParties);
    } catch (err) {
      console.error(`Failed to assign hero ${heroId} to town`, err);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      WorldApi.getWorldState()
        .then((data) => {
          setWorldState(data);
        })
        .catch((err) => {
          console.error("Failed to load activities", err);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      WorldApi.getEvents()
        .then((data) => {
          if (data.length === 0) return;
          data.sort((a, b) => a.occurredAt - b.occurredAt);
          setEvents((prev) => [...prev, ...data]);
        })
        .catch((err) => {
          console.error("Failed to load events", err);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="app">
        <HeroList
          heroes={heroes}
          areas={areas}
          activities={worldState?.heroActivities || []}
          onAssign={assignHeroToArea}
          onDungeonAssign={assignHeroToDungeon}
          onTownAssign={assignHeroToTown}
        />

        <PartyList parties={parties} areas={areas} />

        <AreaList areas={areas} />

        <WorldCanvas
          heroes={heroes}
          areas={areas}
          worldState={worldState!}
          events={events}
          monsters={monsters}
        />

        <WorldEvents
          events={events}
          worldState={worldState}
          heroes={heroes}
          monsters={monsters}
        />
      </div>
    </>
  );
}

export default App;
