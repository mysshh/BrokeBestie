import { useState, useMemo } from 'react';
import { Expense, Commitment, SavingsGoal, Subscription } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface ReportsProps {
  expenses: Expense[];
  commitments: Commitment[];
  savingsGoals: SavingsGoal[];
  subscriptions: Subscription[];
}

export default function Reports({ expenses, commitments, savingsGoals, subscriptions }: ReportsProps) {
  const [period, setPeriod] = useState('all');

  const filteredExpenses = useMemo(() => {
    if (period === 'all') return expenses;
    // Simple filter: assume date is YYYY-MM-DD
    return expenses.filter(e => e.date.startsWith(period));
  }, [expenses, period]);

  const income = filteredExpenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const spending = filteredExpenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const savingsContributions = savingsGoals.reduce((sum, s) => sum + s.currentSaved, 0); // Need to see if I can map expenses to savings
  
  const netCashFlow = income - spending - savingsContributions;

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
        <h2 className="text-2xl font-bold">Financial Reports</h2>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="p-2 border rounded">
          <option value="all">All Time</option>
          <option value="2026-10">October 2026</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-charcoal/10 shadow-sm">
          <p className="text-sm text-gray-500">Income</p>
          <p className="text-2xl font-bold">₹{income.toFixed(0)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-charcoal/10 shadow-sm">
          <p className="text-sm text-gray-500">Spending</p>
          <p className="text-2xl font-bold">₹{spending.toFixed(0)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-charcoal/10 shadow-sm">
          <p className="text-sm text-gray-500">Savings</p>
          <p className="text-2xl font-bold">₹{savingsContributions.toFixed(0)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-charcoal/10 shadow-sm">
          <p className="text-sm text-gray-500">Net Cash Flow</p>
          <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{netCashFlow.toFixed(0)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-charcoal/10 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Spending by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categoryData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
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
