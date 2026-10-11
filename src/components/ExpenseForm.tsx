import React, { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandling';

export default function ExpenseForm({ onAdd }: { onAdd: () => void }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'commitment' | 'saving' | 'income'>('expense');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'expenses'), {
        userId: auth.currentUser.uid,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString(),
        description,
        type,
        createdAt: serverTimestamp(),
      });
      onAdd();
      setAmount('');
      setCategory('');
      setDescription('');
      setType('expense');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'expenses');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (INR)" className="w-full bg-cream border border-charcoal/20 p-3 rounded-xl" />
      <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full bg-cream border border-charcoal/20 p-3 rounded-xl">
        <option value="expense">Expense</option>
        <option value="commitment">Commitment</option>
        <option value="saving">Saving</option>
        <option value="income">Income</option>
      </select>
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full bg-cream border border-charcoal/20 p-3 rounded-xl" />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full bg-cream border border-charcoal/20 p-3 rounded-xl" />
      <button type="submit" className="bg-forest text-white px-6 py-3 rounded-xl font-bold hover:bg-forest/90 transition-all">Add Transaction</button>
    </form>
  );
}
