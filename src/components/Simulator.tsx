import { useState } from 'react';
import { motion } from 'motion/react';
import { Expense, Commitment, SavingsGoal, Subscription } from '../types';
import { calculateHealth } from '../lib/healthEngine';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function Simulator({
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
  const [simulation, setSimulation] = useState<{
    type: 'none' | 'purchase' | 'unexpected' | 'savings' | 'subscription' | 'cancelSubscription';
    amount: number;
    description: string;
    targetId?: string;
  }>({
    type: 'none',
    amount: 0,
    description: '',
  });

  const [loading, setLoading] = useState(false);

  // Baseline calculations
  const startingBalance = 10000;
  const income = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const expensesOnly = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const pendingCommitments = commitments.filter(c => c.status === 'pending');
  const activeSubscriptions = subscriptions.filter(s => s.active);
  const totalCommitmentAmount = pendingCommitments.reduce((sum, c) => sum + c.amount, 0);
  const totalSubscriptionCost = activeSubscriptions.reduce((sum, s) => sum + s.cost, 0);
  const totalSavings = savingsGoals.reduce((sum, s) => sum + s.currentSaved, 0);
  
  const totalAvailable = startingBalance + income;
  const totalDeductions = expensesOnly + totalCommitmentAmount + totalSubscriptionCost + totalSavings;
  const remainingSpendable = totalAvailable - totalDeductions;
  
  // Simulated calculations
  let simulatedExpensesOnly = expensesOnly;
  let simulatedPendingCommitments = totalCommitmentAmount;
  let simulatedActiveSubscriptions = totalSubscriptionCost;
  let simulatedSavingsContributions = totalSavings;

  if (simulation.type === 'purchase' || simulation.type === 'unexpected') simulatedExpensesOnly += simulation.amount;
  if (simulation.type === 'savings') simulatedSavingsContributions += simulation.amount;
  if (simulation.type === 'subscription') simulatedActiveSubscriptions += simulation.amount;
  if (simulation.type === 'cancelSubscription' && simulation.targetId) {
    const sub = activeSubscriptions.find(s => s.id === simulation.targetId);
    if (sub) simulatedActiveSubscriptions -= sub.cost;
  }

  const simulatedDeductions = simulatedExpensesOnly + simulatedPendingCommitments + simulatedActiveSubscriptions + simulatedSavingsContributions;
  const simulatedRemaining = totalAvailable - simulatedDeductions;
  
  const underfundedCommitments = pendingCommitments.filter(c => c.amount > simulatedRemaining);

  const baselineHealth = calculateHealth(expenses, commitments, savingsGoals, subscriptions, remainingSpendable, totalAvailable);
  const simulatedHealth = calculateHealth(
    [...expenses, simulation.type === 'purchase' || simulation.type === 'unexpected' ? { amount: simulation.amount, type: 'expense', description: simulation.description } as any : {}], 
    commitments, 
    savingsGoals, 
    subscriptions, 
    simulatedRemaining, 
    totalAvailable
  );

  const applyDecision = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      if (simulation.type === 'purchase' || simulation.type === 'unexpected') {
        await addDoc(collection(db, 'expenses'), {
          userId: auth.currentUser.uid,
          amount: simulation.amount,
          description: simulation.description || 'Simulated expense',
          type: 'expense',
          category: 'other',
          date: new Date().toISOString(),
          createdAt: serverTimestamp(),
        });
      } else if (simulation.type === 'savings') {
        if (savingsGoals.length > 0) {
          const goalRef = doc(db, 'savingsGoals', savingsGoals[0].id);
          await updateDoc(goalRef, { currentSaved: savingsGoals[0].currentSaved + simulation.amount });
        }
      } else if (simulation.type === 'cancelSubscription' && simulation.targetId) {
        await updateDoc(doc(db, 'subscriptions', simulation.targetId), { active: false });
      } else if (simulation.type === 'subscription') {
         await addDoc(collection(db, 'subscriptions'), {
          userId: auth.currentUser.uid,
          name: simulation.description || 'New Subscription',
          cost: simulation.amount,
          billingDate: new Date().toISOString(),
          frequency: 'monthly',
          active: true,
          createdAt: serverTimestamp(),
        });
      }
      setSimulation({ type: 'none', amount: 0, description: '' });
    } catch (error) {
      console.error('Error applying decision:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">What If? Simulator</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-lg font-semibold">New Scenario</h3>
          <select 
            className="w-full bg-black p-3 rounded-lg border border-white/10"
            onChange={(e) => setSimulation({ ...simulation, type: e.target.value as any })}
            value={simulation.type}
          >
            <option value="none">Select Scenario</option>
            <option value="purchase">Make a Purchase</option>
            <option value="unexpected">Unexpected Expense</option>
            <option value="savings">Add Savings Contribution</option>
            <option value="subscription">Add Subscription</option>
            <option value="cancelSubscription">Cancel Subscription</option>
          </select>
          
          {(simulation.type === 'purchase' || simulation.type === 'unexpected' || simulation.type === 'savings' || simulation.type === 'subscription') && (
            <>
              <input 
                type="number" 
                placeholder="Amount (₹)" 
                className="w-full bg-black p-3 rounded-lg border border-white/10"
                value={simulation.amount || ''}
                onChange={(e) => setSimulation({...simulation, amount: Number(e.target.value)})}
              />
              <input 
                type="text" 
                placeholder="Description" 
                className="w-full bg-black p-3 rounded-lg border border-white/10"
                value={simulation.description}
                onChange={(e) => setSimulation({...simulation, description: e.target.value})}
              />
            </>
          )}

          {simulation.type === 'cancelSubscription' && (
             <select 
              className="w-full bg-black p-3 rounded-lg border border-white/10"
              onChange={(e) => setSimulation({ ...simulation, targetId: e.target.value })}
              value={simulation.targetId}
            >
              <option value="">Select Subscription to Cancel</option>
              {activeSubscriptions.map(s => (
                <option key={s.id} value={s.id}>{s.name} (-₹{s.cost})</option>
              ))}
            </select>
          )}

          <div className="flex gap-2">
            <button 
              className="flex-1 bg-purple-600 p-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              onClick={applyDecision}
              disabled={loading || simulation.type === 'none'}
            >
              {loading ? 'Applying...' : 'Apply Decision'}
            </button>
            <button 
              className="bg-slate-700 p-3 rounded-lg hover:bg-slate-600 transition"
              onClick={() => setSimulation({type: 'none', amount: 0, description: ''})}
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="bg-black/50 p-6 rounded-2xl border border-purple-500/30 space-y-4">
          <h3 className="text-lg font-semibold">Impact Comparison</h3>
          <div className="space-y-3">
            <ImpactRow label="Remaining Spendable" baseline={remainingSpendable} simulated={simulatedRemaining} />
            <ImpactRow label="Daily Allowance" baseline={remainingSpendable/30} simulated={simulatedRemaining/30} />
            <ImpactRow label="Savings Progress" baseline={totalSavings} simulated={simulatedSavingsContributions} />
            <ImpactRow label="Health Score" baseline={baselineHealth.score} simulated={simulatedHealth.score} />
          </div>
          {simulatedRemaining < 0 && (
            <div className="p-3 bg-red-900/20 text-red-400 rounded-lg text-sm border border-red-500/20">
              Warning: This decision will make your flexible balance negative! Proceed with caution.
            </div>
          )}
          {underfundedCommitments.length > 0 && (
            <div className="p-3 bg-amber-900/20 text-amber-400 rounded-lg text-sm border border-amber-500/20">
              <strong>Risk Alert:</strong> The following commitments may become underfunded:
              <ul className="list-disc pl-4 mt-2">
                {underfundedCommitments.map(c => <li key={c.id}>{c.name} (₹{c.amount})</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ImpactRow({ label, baseline, simulated }: { label: string, baseline: number, simulated: number }) {
  const diff = simulated - baseline;
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-2">
      <span className="text-slate-400 text-sm">{label}</span>
      <div className="text-right">
        <div className="font-bold">₹{simulated.toFixed(0)}</div>
        <div className={`text-xs ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {diff >= 0 ? '+' : ''}{diff.toFixed(0)}
        </div>
      </div>
    </div>
  );
}
