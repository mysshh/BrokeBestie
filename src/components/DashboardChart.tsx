import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Expense, Commitment, SavingsGoal, Subscription } from '../types';

export default function DashboardChart({
  expenses,
  commitments,
  savingsGoals,
  subscriptions,
}: {
  expenses: Expense[];
  commitments: Commitment[];
  savingsGoals: SavingsGoal[];
  subscriptions: Subscription[];
}) {
  const data = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    // Simplified projection logic
    const spentSoFar = expenses.filter(e => new Date(e.date).getDate() <= day).reduce((sum, e) => sum + e.amount, 0);
    const projectedBalance = 10000 - spentSoFar;
    return { day, balance: projectedBalance };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="day" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
        <Area type="monotone" dataKey="balance" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
