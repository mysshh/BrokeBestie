export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface Budget {
  category: string;
  limit: number;
}
