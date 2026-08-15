import Button from '../components/Button';
import Card from '../components/Card';
import PageContainer from '../components/PageContainer';
import SectionHeader from '../components/SectionHeader';

const sampleStamps = [
  { title: 'Tokyo Sunrise', region: 'Japan', icon: '🌅', status: 'Unlocked' },
  { title: 'Paris Romance', region: 'France', icon: '💫', status: 'Unlocked' },
  { title: 'Cape Adventure', region: 'South Africa', icon: '🧭', status: 'In progress' },
  { title: 'Kyiv Echo', region: 'Ukraine', icon: '🏛️', status: 'Locked' }
];

export default function StampsPage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Collection"
        title="Digital travel stamps"
        description="A curated snapshot of the unique badges and moments your passport is collecting on the road."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {sampleStamps.map((stamp) => (
          <Card key={stamp.title} className="bg-white/80">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl">{stamp.icon}</div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">{stamp.title}</h3>
              <p className="text-sm text-slate-600">{stamp.region}</p>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{stamp.status}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Stamp</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button to="/explore" variant="secondary">Discover more destinations</Button>
      </div>
    </PageContainer>
  );
}
