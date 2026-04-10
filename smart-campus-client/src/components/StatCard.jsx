/**
 * StatCard.jsx
 * Reusable dashboard metric card.
 *
 * Props:
 *   icon    {string}  – emoji or character
 *   label   {string}  – descriptive label
 *   value   {any}     – metric value to display
 *   color   {string}  – hex accent colour (default indigo)
 *   loading {bool}    – show skeleton animation
 *
 * Member 4 – StatCard Component
 */

export default function StatCard({ icon, label, value, color = '#6366f1', loading = false }) {
  if (loading) {
    return (
      <div className="h-[88px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
    );
  }

  const softBg = color + '1a'; // ~10% opacity tint

  return (
    <div
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
        style={{ background: softBg, color }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900">
          {value ?? '—'}
        </p>
      </div>
    </div>
  );
}
