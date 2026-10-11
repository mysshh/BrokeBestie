import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Expense } from '../types';

export default function RoastMySpending({ expenses }: { expenses: Expense[] }) {
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);

  const getRoast = async () => {
    setLoading(true);
    const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses: expenses.slice(0, 5) }) // Roast latest 5
    });
    const data = await response.json();
    setRoast(data.roast || data.error);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-purple-500/20 p-6 rounded-2xl">
      <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
        <Sparkles className="w-5 h-5" /> Bestie Check-in
      </h3>
      <p className="text-slate-400 text-sm mt-2">Ready for a brutal reality check on your spending, bestie?</p>
      <button onClick={getRoast} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 font-medium">
        {loading ? 'Consulting the vibes...' : 'Spill the tea ☕'}
      </button>
      {roast && <p className="mt-4 text-slate-300 font-mono text-sm leading-relaxed p-3 bg-white/5 rounded-lg border border-white/10">{roast}</p>}
    </div>
  );
}
