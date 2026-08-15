import React from 'react';
import { useTravel } from '../context/TravelContext';

export default function StampCard({ visit }) {
  const { travelData } = useTravel();
  const visits = travelData?.visits || [];

  if (!visit) {
    const totalTrips = visits.length;
    const visitedCountries = new Set(visits.map((entry) => entry.country).filter(Boolean)).size;

    return (
      <article className="stamp-card stamp-card--summary">
        <div className="stamp-card__top">
          <div className="stamp-card__badge">✈️</div>
          <div className="stamp-card__header">
            <h3>Travel Summary</h3>
            <p>Your passport progress</p>
          </div>
        </div>

        <div className="stamp-card__summary">
          <div>
            <strong>{totalTrips}</strong>
            <span>Trips</span>
          </div>
          <div>
            <strong>{visitedCountries}</strong>
            <span>Countries</span>
          </div>
        </div>
      </article>
    );
  }

  const destination = visit.destinationName || visit.city || 'Unknown destination';
  const dateLabel = visit.date
    ? new Date(visit.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Date pending';

  return (
    <article className="stamp-card">
      <div className="stamp-card__top">
        <div className="stamp-card__badge">✈️</div>
        <div className="stamp-card__header">
          <h3>{destination}</h3>
          <p>{visit.country}</p>
        </div>
      </div>

      <div className="stamp-card__body">
        {visit.photo ? (
          <img className="stamp-card__photo" src={visit.photo} alt={destination} />
        ) : (
          <div className="stamp-card__placeholder">Stamp</div>
        )}
      </div>

      <div className="stamp-card__footer">
        <span>{dateLabel}</span>
        <div className="stamp-card__seal">✓</div>
      </div>
    </article>
  );
}
