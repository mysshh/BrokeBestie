export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'expense' | 'commitment' | 'saving' | 'income';
  createdAt: any;
}

export interface Commitment {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string; // ISO string
  category: string;
  recurrence: 'one-time' | 'weekly' | 'monthly';
  status: 'pending' | 'paid';
  createdAt: any;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentSaved: number;
  createdAt: any;
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  cost: number;
  billingDate: string;
  frequency: 'monthly' | 'yearly';
  active: boolean;
  createdAt: any;
}

export interface Budget {
  startingBalance: number;
  cycleDays: number;
  startDate: string;
}
