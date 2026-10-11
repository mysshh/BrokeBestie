import { HealthMetrics } from '../lib/healthEngine';

export default function FinancialHealth({ metrics }: { metrics: HealthMetrics }) {
  const color = 
    metrics.score < 30 ? 'text-red-600' :
    metrics.score < 60 ? 'text-amber-600' : 'text-forest';

  return (
    <div className="bg-white p-8 rounded-3xl border border-charcoal/10 space-y-6 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-forest">Financial Health</h2>
        <div className={`text-4xl font-black ${color}`}>{metrics.score}</div>
      </div>
      <p className="text-xl font-bold text-forest">{metrics.status}</p>
      
      <div className="space-y-3">
        {metrics.factors.positive.map((f, i) => <p key={i} className="text-forest text-sm font-bold flex items-center gap-2"><span>✔</span> {f}</p>)}
        {metrics.factors.negative.map((f, i) => <p key={i} className="text-red-600 text-sm font-bold flex items-center gap-2"><span>!</span> {f}</p>)}
      </div>

      <div className="pt-6 border-t border-charcoal/10">
        <h3 className="font-bold text-forest mb-4">Bestie's Suggestions</h3>
        <ul className="text-sm text-charcoal/70 space-y-2">
          {metrics.suggestions.map((s, i) => <li key={i} className="flex gap-2 font-medium"><span>✨</span> {s}</li>)}
        </ul>
      </div>
    </div>
  );
}
