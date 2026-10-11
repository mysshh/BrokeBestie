import { Expense, Commitment, SavingsGoal, Subscription } from '../types';

export function calculateFinancials(
  expenses: Expense[],
  commitments: Commitment[],
  savingsGoals: SavingsGoal[],
  subscriptions: Subscription[],
  budget: number,
  savingsReserve: number
) {
  const income = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const actualExpenses = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const pendingCommitments = commitments.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);
  const activeSubscriptions = subscriptions.filter(s => s.active).reduce((sum, s) => sum + s.cost, 0);
  const savingsContributions = savingsGoals.reduce((sum, s) => sum + s.currentSaved, 0);
  
  const totalAvailable = budget + income;
  
  // Formulas
  const remainingBalance = totalAvailable - actualExpenses - activeSubscriptions;
  const spendableBalance = remainingBalance - savingsContributions - savingsReserve - pendingCommitments;
  
  const daysRemaining = 30; // Should be dynamic
  const dailyAllowance = spendableBalance > 0 ? spendableBalance / daysRemaining : 0;
  
  const netCashFlow = income - actualExpenses - activeSubscriptions - savingsContributions;

  return {
    income,
    actualExpenses,
    pendingCommitments,
    activeSubscriptions,
    savingsContributions,
    totalAvailable,
    remainingBalance,
    spendableBalance,
    dailyAllowance,
    netCashFlow
  };
}
