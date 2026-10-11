import { Expense, Commitment, SavingsGoal, Subscription } from '../types';
import RoastMySpending from './RoastMySpending';
import StreakTracker from './StreakTracker';
import { HealthMetrics } from '../lib/healthEngine';

export default function ExpenseList({ 
  expenses, 
  metrics 
}: { 
  expenses: Expense[],
  metrics: HealthMetrics 
}) {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <StreakTracker />
      </div>
      <RoastMySpending expenses={expenses} metrics={metrics} />
      <div className="space-y-4">
      {expenses.map(expense => (
        <div key={expense.id} className="flex justify-between bg-white/5 p-4 rounded-xl border border-white/5">
          <div>
            <p className="font-semibold">{expense.description}</p>
            <p className="text-sm text-slate-400">{expense.category}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-bold">₹{expense.amount.toFixed(2)}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
