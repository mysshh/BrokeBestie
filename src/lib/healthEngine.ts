import { Expense, Commitment, SavingsGoal, Subscription } from '../types';

export interface HealthMetrics {
  score: number;
  status: 'Critical' | 'Tight' | 'Healthy' | 'Thriving';
  factors: {
    positive: string[];
    negative: string[];
  };
  suggestions: string[];
}

export function calculateHealth(
  expenses: Expense[],
  commitments: Commitment[],
  savingsGoals: SavingsGoal[],
  subscriptions: Subscription[],
  remainingSpendable: number,
  totalAvailable: number
): HealthMetrics {
  let score = 60; // Start at 60 for a more balanced baseline
  const positive: string[] = [];
  const negative: string[] = [];
  const suggestions: string[] = [];

  // 1. Balance Check
  if (remainingSpendable < 0) {
    score -= 30;
    negative.push("Your flexible balance is currently negative.");
    suggestions.push("Focus on covering essential expenses first.");
  } else if (remainingSpendable > totalAvailable * 0.3) {
    score += 20;
    positive.push("You have a healthy flexible budget.");
  }

  // 2. Commitment Coverage
  const pendingCommitments = commitments.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);
  // Only penalize if we *actually* have a shortfall beyond what's already covered
  if (pendingCommitments > remainingSpendable) {
    score -= 20; // Reduced penalty
    negative.push("Your flexible money is tight compared to upcoming commitments.");
    suggestions.push("Prioritize your most urgent upcoming commitments.");
  } else {
    score += 10;
    positive.push("Your upcoming commitments are covered.");
  }

  // 3. Savings Progress
  const savingsContributions = savingsGoals.reduce((sum, s) => sum + s.currentSaved, 0);
  if (savingsContributions > 0) {
    score += 15;
    positive.push("Great job setting aside money for savings goals!");
  } else {
    suggestions.push("Consider setting up a small recurring savings transfer.");
  }

  // Final score clamping
  score = Math.max(0, Math.min(100, score));
  
  let status: HealthMetrics['status'] = 'Healthy';
  if (score < 35) status = 'Critical';
  else if (score < 65) status = 'Tight';
  else if (score > 80) status = 'Thriving';

  return { score, status, factors: { positive, negative }, suggestions };
}
