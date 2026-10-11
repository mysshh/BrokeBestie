import { calculateHealth } from './src/lib/healthEngine';
import { Expense, Commitment, SavingsGoal, Subscription } from './src/types';

const expenses: Expense[] = [];
const commitments: Commitment[] = [];
const savingsGoals: SavingsGoal[] = [];
const subscriptions: Subscription[] = [];

console.log("--- Test 1: Empty Data ---");
const metrics1 = calculateHealth(expenses, commitments, savingsGoals, subscriptions, 0, 0);
console.log(JSON.stringify(metrics1, null, 2));

console.log("\n--- Test 2: Negative Flexible Balance ---");
const metrics2 = calculateHealth(expenses, commitments, savingsGoals, subscriptions, -100, 1000);
console.log(JSON.stringify(metrics2, null, 2));

console.log("\n--- Test 3: Unpaid Commitments Exceed Flexible ---");
const commitments3: Commitment[] = [{ id: '1', userId: 'u1', name: 'Rent', amount: 500, dueDate: '2026-10-30', category: 'Rent', recurrence: 'monthly', status: 'pending', createdAt: new Date() }];
const metrics3 = calculateHealth(expenses, commitments3, savingsGoals, subscriptions, 100, 1000);
console.log(JSON.stringify(metrics3, null, 2));

console.log("\n--- Test 4: Savings Contribution ---");
const savings4: SavingsGoal[] = [{ id: '1', userId: 'u1', name: 'Car', targetAmount: 10000, targetDate: '2026-12-30', currentSaved: 1000, createdAt: new Date() }];
const metrics4 = calculateHealth(expenses, commitments, savings4, subscriptions, 500, 1000);
console.log(JSON.stringify(metrics4, null, 2));
