import { Zap } from 'lucide-react';

export default function StreakTracker() {
  return (
    <div className="bg-black/50 border border-white/5 p-4 rounded-xl flex items-center gap-3">
        <Zap className="w-6 h-6 text-yellow-400" />
        <div>
            <p className="text-xs text-slate-500">Current Streak</p>
            <p className="font-bold">5 Days</p>
        </div>
    </div>
  );
}
