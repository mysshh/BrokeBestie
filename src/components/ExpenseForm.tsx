import React, { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandling';

export default function ExpenseForm({ onAdd }: { onAdd: () => void }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

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
        createdAt: serverTimestamp(),
      });
      onAdd();
      setAmount('');
      setCategory('');
      setDescription('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'expenses');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="w-full bg-black p-2 rounded" />
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full bg-black p-2 rounded" />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full bg-black p-2 rounded" />
      <button type="submit" className="bg-purple-600 px-4 py-2 rounded text-white font-semibold">Add Expense</button>
    </form>
  );
}
