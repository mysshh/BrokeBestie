import { useState, useEffect } from 'react';
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandling';
import { Commitment, SavingsGoal, Subscription } from '../types';
import Commitments from './Commitments';
import SavingsGoals from './SavingsGoals';
import Subscriptions from './Subscriptions';

interface SettingsProps {
  savingsGoals: SavingsGoal[];
  commitments: Commitment[];
  subscriptions: Subscription[];
}

export default function Settings({ savingsGoals, commitments, subscriptions }: SettingsProps) {
  const user = auth.currentUser;
  const [budget, setBudget] = useState(10000);
  const [savingsReserve, setSavingsReserve] = useState(1000);
  const [alertThreshold, setAlertThreshold] = useState(500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchSettings = async () => {
      const docRef = doc(db, 'userSettings', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBudget(data.budget || 10000);
        setSavingsReserve(data.savingsReserve || 1000);
        setAlertThreshold(data.alertThreshold || 500);
      }
    };
    fetchSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'userSettings', user.uid), {
        budget,
        savingsReserve,
        alertThreshold,
      });
      alert('Settings saved!');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `userSettings/${user.uid}`);
      alert('Error saving settings: Check console');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-main">Settings</h2>
      
      <div className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-text-main">Financial Preferences</h3>
        <label className="block text-sm font-medium text-text-secondary">Budget (INR)</label>
        <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full bg-main-bg border border-border p-3 rounded-xl text-text-main" />
        
        <label className="block text-sm font-medium text-text-secondary">Protected Savings Reserve (INR)</label>
        <input type="number" value={savingsReserve} onChange={e => setSavingsReserve(Number(e.target.value))} className="w-full bg-main-bg border border-border p-3 rounded-xl text-text-main" />
        
        <label className="block text-sm font-medium text-text-secondary">Low Balance Alert Threshold (INR)</label>
        <input type="number" value={alertThreshold} onChange={e => setAlertThreshold(Number(e.target.value))} className="w-full bg-main-bg border border-border p-3 rounded-xl text-text-main" />
        
        <button onClick={saveSettings} disabled={loading} className="bg-emerald text-main-bg px-6 py-3 rounded-xl font-bold hover:bg-emerald/90">
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      <div className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-text-main">Savings Goals</h3>
        <SavingsGoals savingsGoals={savingsGoals} />
      </div>

      <div className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-text-main">Commitments</h3>
        <Commitments commitments={commitments} />
      </div>

      <div className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-text-main">Subscriptions</h3>
        <Subscriptions subscriptions={subscriptions} />
      </div>

      <div className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-text-main">Data Management</h3>
        <button className="bg-main-bg text-emerald border border-emerald px-4 py-2 rounded-xl" onClick={() => alert('Exporting data...')}>Export Transactions (CSV)</button>
        <button className="bg-red-900/20 text-red-400 px-4 py-2 rounded-xl" onClick={() => confirm('Are you sure?') && alert('Resetting data...')}>Reset Demo Data</button>
      </div>

      <div className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-text-main">Account</h3>
        {user ? (
          <div className="space-y-2 text-text-secondary">
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p className="text-text-secondary">Not signed in.</p>
        )}
        <button onClick={handleSignOut} className="bg-red-900/20 text-red-400 px-4 py-2 rounded-xl">
          Sign Out
        </button>
      </div>
    </div>
  );
}
