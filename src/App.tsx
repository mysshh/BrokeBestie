import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { LayoutDashboard, Wallet, FileText, Settings as SettingsIcon, Target, Zap, HelpCircle } from 'lucide-react';
import { auth, db } from './lib/firebase';
import Auth from './components/Auth';
import DashboardChart from './components/DashboardChart';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import LandingPage from './components/LandingPage';
import MoneyPlan from './components/MoneyPlan';
import Simulator from './components/Simulator';
import FinancialHealth from './components/FinancialHealth';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Alerts from './components/Alerts';
import { Expense, Commitment, SavingsGoal, Subscription } from './types';
import { calculateHealth } from './lib/healthEngine';
import { calculateFinancials } from './lib/financialCalculations';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(auth.currentUser);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [budget, setBudget] = useState(10000);
  const [savingsReserve, setSavingsReserve] = useState(1000);
  const [alertThreshold, setAlertThreshold] = useState(500);

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

  const iconMap = {
    dashboard: LayoutDashboard,
    expenses: Wallet,
    moneyPlan: Target,
    simulator: Zap,
    reports: FileText,
    settings: SettingsIcon,
  };
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchData = (coll: string, setter: (data: any[]) => void) => {
      const q = query(collection(db, coll), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    };

    const unsubExpenses = fetchData('expenses', setExpenses);
    const unsubCommitments = fetchData('commitments', setCommitments);
    const unsubSavings = fetchData('savingsGoals', setSavingsGoals);
    const unsubSubscriptions = fetchData('subscriptions', setSubscriptions);
    
    return () => {
      unsubExpenses();
      unsubCommitments();
      unsubSavings();
      unsubSubscriptions();
    };
  }, [user]);

  // Financial Calculations
  const { 
    actualExpenses, 
    pendingCommitments, 
    activeSubscriptions, 
    savingsContributions, 
    spendableBalance, 
    dailyAllowance 
  } = calculateFinancials(expenses, commitments, savingsGoals, subscriptions, budget, savingsReserve);

  const healthMetrics = calculateHealth(expenses, commitments, savingsGoals, subscriptions, spendableBalance, budget + expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0));

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-main-bg text-text-main font-sans flex">
      <aside className="w-20 md:w-64 flex flex-col py-8 bg-surface-bg border-r border-forest z-20 flex-shrink-0">
        <div className="flex items-center gap-3 px-6 mb-12">
          <img src="/src/assets/images/brokebestie_logo_1791720990523.jpg" alt="BrokeBestie" className="w-12 h-12 rounded-xl" />
        </div>
        <nav className="flex flex-col gap-2 w-full px-4 flex-1">
          {['dashboard', 'expenses', 'moneyPlan', 'simulator', 'reports', 'settings'].map((tab) => {
            const Icon = iconMap[tab as keyof typeof iconMap];
            return (
              <div
                role="button"
                tabIndex={0}
                key={tab}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(e) => e.key === 'Enter' && setActiveTab(tab)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-lime text-main-bg font-bold'
                    : 'text-text-secondary hover:text-text-main hover:bg-forest'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="hidden md:inline font-medium capitalize">{tab}</span>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 md:p-8 gap-6">
        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">
              Hey, <span className="text-lime">Bestie!</span> 👋
            </h1>
            <p className="text-text-secondary text-lg mt-1">Ready to crush those goals?</p>
          </div>
          <div className="flex items-center gap-4">
            <Auth />
            <div className="h-12 px-6 bg-lime rounded-full flex items-center gap-2 cursor-pointer hover:bg-lime/90 transition-all text-main-bg font-bold">
              <span>+ Add Spend</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'dashboard' ? (
            <div className="space-y-8">
              <Alerts spendableBalance={spendableBalance} alertThreshold={alertThreshold} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <FinancialHealth metrics={healthMetrics} />
                  <div className="bg-surface-bg border border-forest rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-6">Spending Trends</h2>
                    <DashboardChart 
                      expenses={expenses} 
                      commitments={commitments} 
                      savingsGoals={savingsGoals} 
                      subscriptions={subscriptions} 
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-forest/50 border border-forest p-8 rounded-3xl">
                    <p className="text-text-secondary text-sm font-medium">Daily Allowance</p>
                    <p className="text-5xl font-black text-lime mt-2">₹{dailyAllowance.toFixed(0)}</p>
                  </div>
                  <div className="bg-surface-bg border border-forest p-8 rounded-3xl">
                    <p className="text-lavender text-sm font-medium">Spendable Balance</p>
                    <p className="text-5xl font-black mt-2">₹{spendableBalance.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'expenses' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">My Transactions</h2>
              <ExpenseForm onAdd={() => {}} />
              <ExpenseList expenses={expenses} metrics={healthMetrics} />
            </div>
          ) : activeTab === 'moneyPlan' ? (
            <MoneyPlan commitments={commitments} savingsGoals={savingsGoals} subscriptions={subscriptions} />
          ) : activeTab === 'simulator' ? (
            <Simulator expenses={expenses} commitments={commitments} savingsGoals={savingsGoals} subscriptions={subscriptions} />
          ) : activeTab === 'reports' ? (
            <Reports 
              expenses={expenses} 
              commitments={commitments} 
              savingsGoals={savingsGoals} 
              subscriptions={subscriptions} 
              budget={budget}
              savingsReserve={savingsReserve}
            />
          ) : activeTab === 'settings' ? (
            <Settings 
              savingsGoals={savingsGoals}
              commitments={commitments}
              subscriptions={subscriptions}
            />
          ) : (
            <h2 className="text-xl">Content for {activeTab} goes here...</h2>
          )}
        </div>
      </main>
    </div>
  );
}
