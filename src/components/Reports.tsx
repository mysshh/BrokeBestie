import { useState, useMemo } from 'react';
import { Expense, Commitment, SavingsGoal, Subscription } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { calculateFinancials } from '../lib/financialCalculations';
import { downloadCSV, filterExpensesByDate } from '../lib/utils';

interface ReportsProps {
  expenses: Expense[];
  commitments: Commitment[];
  savingsGoals: SavingsGoal[];
  subscriptions: Subscription[];
  budget: number;
  savingsReserve: number;
}

export default function Reports({ expenses, commitments, savingsGoals, subscriptions, budget, savingsReserve }: ReportsProps) {
  const [period, setPeriod] = useState('all');

  const filteredExpenses = useMemo(() => {
    return filterExpensesByDate(expenses, period);
  }, [expenses, period]);

  const {
    income,
    actualExpenses,
    spendableBalance,
    netCashFlow
  } = calculateFinancials(filteredExpenses, commitments, savingsGoals, subscriptions, budget, savingsReserve);

  const categoryData = useMemo(() => {
    const data: { [key: string]: number } = {};
    filteredExpenses.filter(e => e.type === 'expense').forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-main">Financial Reports</h2>
        <div className="flex gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="p-2 border rounded bg-card-bg border-border text-text-main">
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="current_month">Current Month</option>
          </select>
          <button onClick={() => downloadCSV(expenses, 'transactions.csv')} className="bg-emerald text-main-bg px-4 py-2 rounded-xl font-bold hover:bg-emerald/90">Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm">
          <p className="text-sm text-text-secondary">Income</p>
          <p className="text-2xl font-bold text-text-main">₹{income.toFixed(0)}</p>
        </div>
        <div className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm">
          <p className="text-sm text-text-secondary">Expenses</p>
          <p className="text-2xl font-bold text-text-main">₹{actualExpenses.toFixed(0)}</p>
        </div>
        <div className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm">
          <p className="text-sm text-text-secondary">Spendable Balance</p>
          <p className="text-2xl font-bold text-text-main">₹{spendableBalance.toFixed(0)}</p>
        </div>
        <div className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm">
          <p className="text-sm text-text-secondary">Net Cash Flow</p>
          <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-emerald' : 'text-red-400'}`}>₹{netCashFlow.toFixed(0)}</p>
        </div>
      </div>

      <div className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm">
        <h3 className="text-xl font-bold mb-4 text-text-main">Spending by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categoryData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0D1812', borderColor: '#1E3127', color: '#F2F8F3' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-charcoal/10 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2 border-b">Date</th>
                <th className="p-2 border-b">Category</th>
                <th className="p-2 border-b">Description</th>
                <th className="p-2 border-b">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.slice(0, 5).map(e => (
                <tr key={e.id}>
                  <td className="p-2 border-b">{e.date}</td>
                  <td className="p-2 border-b">{e.category}</td>
                  <td className="p-2 border-b">{e.description}</td>
                  <td className="p-2 border-b">₹{e.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
