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
      {/* Sidebar Rail */}
      <aside className="w-20 md:w-64 flex flex-col items-center py-8 bg-sidebar-bg text-text-main z-20 flex-shrink-0 border-r border-border">
        <div className="w-12 h-12 bg-emerald rounded-2xl flex items-center justify-center mb-12 overflow-hidden shadow-[0_0_15px_rgba(0,230,118,0.3)]">
          <img src="/src/assets/images/neon_finance_logo_1783356701553.jpg" alt="Neon Finance" className="w-full h-full object-cover" />
        </div>
        <nav className="flex flex-col gap-4 w-full px-4 flex-1">
          {['dashboard', 'expenses', 'moneyPlan', 'simulator', 'reports', 'settings'].map((tab) => {
            const Icon = iconMap[tab as keyof typeof iconMap];
            return (
              <div
                role="button"
                tabIndex={0}
                key={tab}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(e) => e.key === 'Enter' && setActiveTab(tab)}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-emerald text-main-bg font-bold shadow-[0_0_10px_rgba(0,230,118,0.2)]'
                    : 'text-text-secondary hover:text-text-main hover:bg-card-bg'
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
            <h1 className="text-3xl font-black text-text-main tracking-tight">
              Hey, <span className="text-emerald">Bestie!</span> 👋
            </h1>
            <p className="text-text-secondary text-sm mt-1">Ready to crush those goals?</p>
          </div>
          <div className="flex items-center gap-4">
            <div 
              role="button"
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 bg-card-bg rounded-full font-bold border border-border hover:bg-elevated-card-bg transition-all cursor-pointer"
            >
              <HelpCircle className="w-5 h-5 text-emerald" /> What If?
            </div>
            <Auth />
            <div className="h-10 px-4 bg-emerald rounded-full flex items-center gap-2 cursor-pointer hover:bg-emerald/90 transition-all text-main-bg font-bold shadow-[0_0_10px_rgba(0,230,118,0.2)]">
              <span>+ Add Spend</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 bg-card-bg border border-border rounded-3xl p-8 shadow-sm overflow-auto">
          {activeTab === 'dashboard' ? (
            <div className="space-y-8">
              <Alerts spendableBalance={spendableBalance} alertThreshold={alertThreshold} />
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
                  <div className="bg-emerald/10 border border-emerald/20 p-8 rounded-3xl">
                    <p className="text-secondary-green text-sm font-medium">Daily Allowance</p>
                    <p className="text-5xl font-black text-text-main mt-2">₹{dailyAllowance.toFixed(0)}</p>
                    <p className="text-text-secondary text-xs mt-2">To stay on track for the 30-day challenge.</p>
                  </div>
                  <div className="bg-card-bg border border-border p-8 rounded-3xl">
                    <p className="text-emerald text-sm font-medium">Spendable Balance</p>
                    <p className="text-5xl font-black text-text-main mt-2">₹{spendableBalance.toFixed(0)}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: 'Actual Expenses', value: `₹${actualExpenses.toFixed(0)}`, color: 'emerald' },
                  { title: 'Commitments', value: `₹${(pendingCommitments + activeSubscriptions).toFixed(0)}`, color: 'lime' },
                  { title: 'Goals', value: `₹${savingsContributions.toFixed(0)}`, color: 'emerald' },
                  { title: 'AI Bestie Tips', value: 'Ready', color: 'secondary-green' },
                ].map((stat, i) => {
                  const colorMap = {
                    emerald: 'border-emerald/30 text-text-main',
                    lime: 'border-lime/30 text-text-main',
                    'secondary-green': 'border-secondary-green/30 text-text-main',
                  };
                  return (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-card-bg border ${colorMap[stat.color as keyof typeof colorMap]} p-6 rounded-3xl shadow-sm`}
                    >
                      <p className="text-text-secondary text-sm">{stat.title}</p>
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
