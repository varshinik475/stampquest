import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { stampCatalog } from '../data/stamps';
import { loadTravelData, saveTravelData } from '../utils/storage';

const TravelContext = createContext();

const initialState = {
  visits: [
    { id: 1, destinationName: 'Tokyo', country: 'Japan', date: '2024-06-10', notes: 'Cherry blossoms and ramen' },
    { id: 2, destinationName: 'Rome', country: 'Italy', date: '2024-08-14', notes: 'Amazing history and food' }
  ],
  travelerName: 'Ava',
  stamps: []
};

function getUnlockedStamps(visits) {
  const countryCount = new Set(visits.map((visit) => visit.country).filter(Boolean)).size;
  const visitCount = visits.length;

  return stampCatalog
    .filter((stamp) => {
      if (stamp.requirement === 3) return visitCount >= stamp.requirement;
      if (stamp.requirement === 2) return countryCount >= stamp.requirement;
      return visitCount >= stamp.requirement;
    })
    .map((stamp) => stamp.id);
}

function hydrateTravelData(rawData) {
  const source = rawData ?? initialState;
  const visits = Array.isArray(source.visits) ? source.visits : [];

  return {
    ...initialState,
    ...source,
    visits,
    travelerName: source.travelerName || initialState.travelerName,
    stamps: Array.isArray(source.stamps) && source.stamps.length > 0 ? source.stamps : getUnlockedStamps(visits)
  };
}

export function TravelProvider({ children }) {
  const [travelData, setTravelData] = useState(() => hydrateTravelData(loadTravelData()));

  useEffect(() => {
    saveTravelData(travelData);
  }, [travelData]);

  const updateTravelData = (updater) => {
    setTravelData((prev) => {
      const next = updater(prev);
      return {
        ...next,
        stamps: getUnlockedStamps(next.visits)
      };
    });
  };

  const addVisit = (visit) => {
    updateTravelData((prev) => ({
      ...prev,
      visits: [...prev.visits, { ...visit, id: Date.now() }]
    }));
  };

  const removeVisit = (id) => {
    updateTravelData((prev) => ({
      ...prev,
      visits: prev.visits.filter((visit) => visit.id !== id)
    }));
  };

  const value = useMemo(() => ({
    travelData,
    addVisit,
    removeVisit,
    setTravelerName: (name) => updateTravelData((prev) => ({ ...prev, travelerName: name }))
  }), [travelData]);

  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>;
}

export function useTravel() {
  return useContext(TravelContext);
}
