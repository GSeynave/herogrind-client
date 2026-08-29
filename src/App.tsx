import { useState, useEffect } from 'react'
import './App.css'
import * as HeroApi from './api/heroApi'
import * as AreasApi from './api/areaApi'
import * as PartyApi from './api/partyApi'
import * as WorldApi from './api/worldApi'
import HeroList from './components/HeroList'
import PartyList from './components/PartyList'
import AreaList from './components/AreaList'
import WorldEvents from './components/WorldEvents'
import WorldCanvas from './components/WorldCanvas'

function App() {
  const [heroes, setHeroes] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])
  const [parties, setParties] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    HeroApi.getHeroesDetails()
      .then(data => {
        if (mounted) setHeroes(data)
      })
      .catch(err => {
        console.error('Failed to load heroes', err)
      })
    WorldApi.getHeroActivities()
      .then(data => {
        if (mounted) setActivities(data)
      })
      .catch(err => {
        console.error('Failed to load activities', err)
      })

    PartyApi.getParties()
      .then(data => {
        if (mounted) setParties(data)
      })
      .catch(err => {
        console.error('Failed to load parties', err)
      })

    WorldApi.getEvents()
      .then(data => {
        if (mounted) setEvents(prev => [...prev, ...data])
      })
      .catch(err => {
        console.error('Failed to load events', err)
      })


    AreasApi.getAreas()
      .then(data => {
        if (mounted) setAreas(data)
      })
      .catch(err => {
        console.error('Failed to load areas', err)
      })
    return () => {
      mounted = false
    }
  }, [])

async function assignHeroToArea(heroId: string, areaId: string) {
  try {
    await PartyApi.addHeroToAreaParty(heroId, areaId);

    const updatedParties = await PartyApi.getParties();
    setParties(updatedParties);
  } catch (err) {
    console.error(
      `Failed to assign hero ${heroId} to area ${areaId}`,
      err
    );
  }
}

  useEffect(() => {
    const interval = setInterval(() => {
      WorldApi.getHeroActivities()
        .then(data => {
          setActivities(data)
        })
        .catch(err => {
          console.error('Failed to load activities', err)
        })
    }, 1000)

    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    const interval = setInterval(() => {
      WorldApi.getEvents()
        .then(data => {
          setEvents(prev => [...prev, ...data])
        })
        .catch(err => {
          console.error('Failed to load events', err)
        })
    }, 1000)

    return () => clearInterval(interval)
  }, [])
  return (
    <>
      <div className="app">
      <HeroList heroes={heroes} areas={areas} activities={activities} onAssign={assignHeroToArea} />

      <PartyList parties={parties} areas={areas} />

      <AreaList areas={areas} />

      <WorldCanvas heroes={heroes} areas={areas} activities={activities} />

      <WorldEvents events={events} heroes={heroes} />
      </div>
    
    </>
  )
}

export default App
