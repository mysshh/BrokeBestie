import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { motion } from 'motion/react';
import { LayoutDashboard, Wallet, FileText, Settings, Target, Zap, HelpCircle } from 'lucide-react';
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
import { Expense, Commitment, SavingsGoal, Subscription } from './types';
import { calculateHealth } from './lib/healthEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(auth.currentUser);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const iconMap = {
    dashboard: LayoutDashboard,
    expenses: Wallet,
    moneyPlan: Target,
    simulator: Zap,
    reports: FileText,
    settings: Settings,
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
  const startingBalance = 10000;
  const income = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const expensesOnly = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const pendingCommitments = commitments.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);
  const activeSubscriptions = subscriptions.filter(s => s.active).reduce((sum, s) => sum + s.cost, 0);
  const savingsContributions = savingsGoals.reduce((sum, s) => sum + s.currentSaved, 0);
  
  const totalAvailable = startingBalance + income;
  const totalDeductions = expensesOnly + pendingCommitments + activeSubscriptions + savingsContributions;
  const remainingSpendable = totalAvailable - totalDeductions;
  
  const dailyAllowance = remainingSpendable / 30; // Simplified

  const healthMetrics = calculateHealth(expenses, commitments, savingsGoals, subscriptions, remainingSpendable, totalAvailable);

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans flex">
      {/* Sidebar Rail */}
      <aside className="w-20 flex flex-col items-center py-8 bg-forest text-cream z-10 hidden md:flex">
        <div className="w-12 h-12 bg-lime rounded-2xl flex items-center justify-center mb-12 overflow-hidden">
          <img src="/src/assets/images/neon_finance_logo_1783356701553.jpg" alt="Neon Finance" className="w-full h-full object-cover" />
        </div>
        <nav className="flex flex-col gap-8 flex-1">
          {['dashboard', 'expenses', 'moneyPlan', 'simulator', 'reports', 'settings'].map((tab) => {
            const Icon = iconMap[tab as keyof typeof iconMap];
            return (
              <div
                role="button"
                tabIndex={0}
                key={tab}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(e) => e.key === 'Enter' && setActiveTab(tab)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-lime text-forest'
                    : 'text-cream/60 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6" />
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
            <h1 className="text-3xl font-black text-forest tracking-tight">
              Hey, <span className="text-forest/70">Bestie!</span> 👋
            </h1>
            <p className="text-charcoal/60 text-sm mt-1">Ready to crush those goals?</p>
          </div>
          <div className="flex items-center gap-4">
            <div 
              role="button"
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full font-bold border border-charcoal/10 hover:bg-cream transition-all cursor-pointer"
            >
              <HelpCircle className="w-5 h-5" /> What If?
            </div>
            <Auth />
            <div className="h-10 px-4 bg-lime rounded-full flex items-center gap-2 cursor-pointer hover:bg-lime/90 transition-all text-forest font-bold shadow-sm">
              <span>+ Add Spend</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 bg-white border border-charcoal/10 rounded-3xl p-8 shadow-sm overflow-auto">
          {activeTab === 'dashboard' ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <FinancialHealth metrics={healthMetrics} />
                  <motion.div className="bg-black/50 border border-white/10 rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">Spending Trends</h2>
                    <DashboardChart 
                      expenses={expenses} 
                      commitments={commitments} 
                      savingsGoals={savingsGoals} 
                      subscriptions={subscriptions} 
                    />
                  </motion.div>
                </div>
                <div className="space-y-6">
                  <div className="bg-lime/10 border border-lime/20 p-8 rounded-3xl">
                    <p className="text-forest/70 text-sm font-medium">Daily Allowance</p>
                    <p className="text-5xl font-black text-forest mt-2">₹{dailyAllowance.toFixed(0)}</p>
                    <p className="text-forest/60 text-xs mt-2">To stay on track for the 30-day challenge.</p>
                  </div>
                  <div className="bg-forest p-8 rounded-3xl">
                    <p className="text-lime text-sm font-medium">Remaining Spendable</p>
                    <p className="text-5xl font-black text-white mt-2">₹{remainingSpendable.toFixed(0)}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: 'Total Expenses', value: `₹${expensesOnly.toFixed(0)}`, color: 'fuchsia' },
                  { title: 'Commitments', value: `₹${(pendingCommitments + activeSubscriptions).toFixed(0)}`, color: 'amber' },
                  { title: 'Goals', value: `₹${savingsContributions.toFixed(0)}`, color: 'lime' },
                  { title: 'AI Bestie Tips', value: 'Ready', color: 'purple' },
                ].map((stat, i) => {
                  const colorMap = {
                    purple: 'border-forest/20 text-forest',
                    fuchsia: 'border-lime/50 text-lime-700',
                    amber: 'border-charcoal/10 text-charcoal',
                    lime: 'border-lime/50 text-lime-700',
                  };
                  return (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white border ${colorMap[stat.color as keyof typeof colorMap]} p-6 rounded-3xl shadow-sm`}
                    >
                      <p className="text-slate-400 text-sm">{stat.title}</p>
                      <p className={`text-xl font-bold mt-1`}>
                        {stat.value}
                      </p>
                    </motion.div>
                  );
                })}
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
            <Reports expenses={expenses} commitments={commitments} savingsGoals={savingsGoals} subscriptions={subscriptions} />
          ) : activeTab === 'settings' ? (
            <Settings />
          ) : (
            <h2 className="text-xl">Content for {activeTab} goes here...</h2>
          )}
        </div>
      </main>
    </div>
  );
}
