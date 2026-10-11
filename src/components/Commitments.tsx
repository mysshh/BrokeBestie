import { useState } from 'react';
import { Commitment } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function Commitments({ commitments }: { commitments: Commitment[] }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const addCommitment = async () => {
    if (!name || !amount || !auth.currentUser) return;
    await addDoc(collection(db, 'commitments'), {
      name,
      amount: Number(amount),
      category: 'General',
      dueDate: new Date().toISOString(),
      status: 'pending',
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString()
    });
    setName('');
    setAmount('');
  };

  const deleteCommitment = async (id: string) => {
    await deleteDoc(doc(db, 'commitments', id));
  };

  const toggleCommitment = async (id: string, status: string) => {
    await updateDoc(doc(db, 'commitments', id), {
      status: status === 'pending' ? 'paid' : 'pending'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input placeholder="Name" className="bg-black p-2 rounded-lg flex-1" value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="Amount" className="bg-black p-2 rounded-lg w-24" value={amount} onChange={e => setAmount(e.target.value)} />
        <button className="bg-purple-600 px-4 py-2 rounded-lg" onClick={addCommitment}>Add</button>
      </div>
      {commitments.map(c => (
        <div key={c.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
          <div onClick={() => toggleCommitment(c.id, c.status)} className="cursor-pointer">
            <p className={`font-semibold ${c.status === 'paid' ? 'line-through text-slate-500' : ''}`}>{c.name}</p>
            <p className="text-sm text-slate-400">{c.category} - {new Date(c.dueDate).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`font-bold ${c.status === 'paid' ? 'text-slate-500' : 'text-amber-400'}`}>₹{c.amount}</div>
            <button className="text-red-500" onClick={() => deleteCommitment(c.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
