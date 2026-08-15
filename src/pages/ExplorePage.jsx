import Button from '../components/Button';
import Card from '../components/Card';
import PageContainer from '../components/PageContainer';
import SectionHeader from '../components/SectionHeader';

const destinations = [
  { name: 'Kyoto', type: 'Cultural getaway', tag: 'Japan' },
  { name: 'Lisbon', type: 'Sunset walk', tag: 'Portugal' },
  { name: 'Marrakech', type: 'Market discovery', tag: 'Morocco' },
  { name: 'Reykjavik', type: 'Northern lights', tag: 'Iceland' }
];

export default function ExplorePage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Discover"
        title="Explore destinations"
        description="Browse exciting places to plan your next passport add-on and collect the matching digital stamp."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {destinations.map((destination) => (
          <Card key={destination.name} className="bg-white/80">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-700">{destination.tag}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{destination.name}</h3>
              </div>
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">New</span>
            </div>
            <p className="mt-4 text-sm text-slate-600">{destination.type}</p>
            <div className="mt-6 flex gap-3">
              <Button to="/passport" variant="primary">View passport</Button>
              <Button to="/stamps" variant="secondary">See stamps</Button>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
