import { useState } from 'react';
import { Subscription } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function Subscriptions({ subscriptions }: { subscriptions: Subscription[] }) {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');

  const addSubscription = async () => {
    if (!name || !cost || !auth.currentUser) return;
    await addDoc(collection(db, 'subscriptions'), {
      name,
      cost: Number(cost),
      frequency: 'Monthly',
      billingDate: new Date().toISOString(),
      active: true,
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString()
    });
    setName('');
    setCost('');
  };

  const deleteSubscription = async (id: string) => {
    await deleteDoc(doc(db, 'subscriptions', id));
  };

  const toggleSubscription = async (id: string, active: boolean) => {
    await updateDoc(doc(db, 'subscriptions', id), {
      active: !active
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input placeholder="Name" className="bg-black p-2 rounded-lg flex-1" value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="Cost" className="bg-black p-2 rounded-lg w-24" value={cost} onChange={e => setCost(e.target.value)} />
        <button className="bg-purple-600 px-4 py-2 rounded-lg" onClick={addSubscription}>Add</button>
      </div>
      {subscriptions.map(s => (
        <div key={s.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
          <div onClick={() => toggleSubscription(s.id, s.active)} className="cursor-pointer">
            <p className={`font-semibold ${!s.active ? 'line-through text-slate-500' : ''}`}>{s.name}</p>
            <p className="text-sm text-slate-400">{s.frequency} - {new Date(s.billingDate).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`font-bold ${!s.active ? 'text-slate-500' : 'text-fuchsia-400'}`}>₹{s.cost}</div>
            <button className="text-red-500" onClick={() => deleteSubscription(s.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
