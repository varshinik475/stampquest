import { useTravel } from '../context/TravelContext';

export default function MapPage() {
  const { travelData } = useTravel();

  return (
    <div className="page">
      <section className="hero-card">
        <h1>World Map</h1>
        <p>Your visited destinations are shown below.</p>
      </section>
      <div className="map-view">
        {travelData.visits.map((visit) => (
          <div key={visit.id} className="map-pin">
            <strong>{visit.destinationName || visit.city}</strong>
            <span>{visit.country}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
