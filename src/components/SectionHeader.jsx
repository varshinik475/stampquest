export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-6 space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-slate-600 sm:text-base">{description}</p> : null}
    </div>
  );
}
