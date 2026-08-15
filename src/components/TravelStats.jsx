import { useTravel } from '../context/TravelContext';

export default function TravelStats() {
  const { travelData } = useTravel();
  const visits = travelData.visits || [];
  const visitedCountries = new Set(visits.map((visit) => visit.country).filter(Boolean)).size;
  const visitedCities = visits.length;
  const totalTrips = visits.length;

  const favoriteDestination = visits.reduce((best, visit) => {
    if (!visit.destinationName && !visit.city) return best;
    const current = best?.count || 0;
    const candidateCount = visits.filter((item) => (item.destinationName || item.city) === (visit.destinationName || visit.city)).length;
    if (candidateCount > current) {
      return { name: visit.destinationName || visit.city, count: candidateCount };
    }
    return best;
  }, null);

  return (
    <section className="travel-stats">
      <h3>Travel Dashboard</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <strong>{totalTrips}</strong>
          <span>Total Trips</span>
        </div>
        <div className="stat-card">
          <strong>{visitedCities}</strong>
          <span>Cities Visited</span>
        </div>
        <div className="stat-card">
          <strong>{visitedCountries}</strong>
          <span>Countries Visited</span>
        </div>
        <div className="stat-card">
          <strong>{favoriteDestination?.name || '—'}</strong>
          <span>Favourite Destination</span>
        </div>
      </div>
    </section>
  );
}
