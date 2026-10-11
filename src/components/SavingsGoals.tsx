import { useState } from 'react';
import { SavingsGoal } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function SavingsGoals({ savingsGoals }: { savingsGoals: SavingsGoal[] }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const addGoal = async () => {
    if (!name || !target || !auth.currentUser) return;
    await addDoc(collection(db, 'savingsGoals'), {
      name,
      targetAmount: Number(target),
      currentSaved: 0,
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString()
    });
    setName('');
    setTarget('');
  };

  const deleteGoal = async (id: string) => {
    await deleteDoc(doc(db, 'savingsGoals', id));
  };

  const contribute = async (id: string, current: number) => {
    await updateDoc(doc(db, 'savingsGoals', id), {
      currentSaved: current + 100 // Simplified
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input placeholder="Goal Name" className="bg-black p-2 rounded-lg flex-1" value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="Target" className="bg-black p-2 rounded-lg w-24" value={target} onChange={e => setTarget(e.target.value)} />
        <button className="bg-purple-600 px-4 py-2 rounded-lg" onClick={addGoal}>Add</button>
      </div>
      {savingsGoals.map(s => (
        <div key={s.id} className="p-4 bg-white/5 rounded-xl space-y-2">
          <div className="flex justify-between">
            <p className="font-semibold">{s.name}</p>
            <button className="text-red-500 text-sm" onClick={() => deleteGoal(s.id)}>Delete</button>
          </div>
          <div className="h-2 bg-slate-700 rounded-full cursor-pointer" onClick={() => contribute(s.id, s.currentSaved)}>
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min((s.currentSaved / s.targetAmount) * 100, 100)}%` }}></div>
          </div>
          <div className="flex justify-between text-sm text-slate-400">
             <p>₹{s.currentSaved} / ₹{s.targetAmount}</p>
             <p>Click bar to +₹100</p>
          </div>
        </div>
      ))}
    </div>
  );
}
