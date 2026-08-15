import Button from '../components/Button';
import Card from '../components/Card';
import PageContainer from '../components/PageContainer';
import SectionHeader from '../components/SectionHeader';

const profileSections = [
  { label: 'Traveler name', value: 'Ava McKenzie' },
  { label: 'Travel style', value: 'Culture + food + coastal escapes' },
  { label: 'Streak', value: '12 active months' },
  { label: 'Favorites', value: 'Sunrise walks, local markets, museums' }
];

export default function ProfilePage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Profile"
        title="Traveler settings"
        description="A simple overview of your travel identity and the details that shape your passport experience."
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-white/80">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 to-emerald-200 text-2xl">✈️</div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Ava McKenzie</h3>
              <p className="text-sm text-slate-600">Global explorer</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {profileSections.map((entry) => (
              <div key={entry.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{entry.label}</p>
                <p className="mt-2 text-sm font-medium text-slate-700">{entry.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-900 p-7 text-white">
          <h3 className="text-xl font-bold">Quick actions</h3>
          <div className="mt-6 space-y-3">
            <Button to="/passport" className="w-full justify-center">View passport</Button>
            <Button to="/stamps" variant="secondary" className="w-full justify-center border-white/20 bg-white/5 text-white hover:bg-white/10">Review stamps</Button>
            <Button to="/explore" variant="muted" className="w-full justify-center bg-white/10 text-white hover:bg-white/20">Plan next trip</Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
