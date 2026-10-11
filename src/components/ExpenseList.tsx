import { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandling';
import { Expense } from '../types';
import RoastMySpending from './RoastMySpending';
import StreakTracker from './StreakTracker';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'expenses');
    });
    return unsubscribe;
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'expenses');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <StreakTracker />
      </div>
      <RoastMySpending expenses={expenses} />
      <div className="space-y-4">
      {expenses.map(expense => (
        <div key={expense.id} className="flex justify-between bg-white/5 p-4 rounded-xl border border-white/5">
          <div>
            <p className="font-semibold">{expense.description}</p>
            <p className="text-sm text-slate-400">{expense.category}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-bold">${expense.amount.toFixed(2)}</p>
            <button onClick={() => handleDelete(expense.id)} className="text-red-500 hover:text-red-300">Delete</button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
