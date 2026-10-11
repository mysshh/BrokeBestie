/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'motion/react';
import { LayoutDashboard, Wallet, FileText, Settings } from 'lucide-react';
import { auth } from './lib/firebase';
import Auth from './components/Auth';
import DashboardChart from './components/DashboardChart';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import LandingPage from './components/LandingPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(auth.currentUser);

  const iconMap = {
    dashboard: LayoutDashboard,
    expenses: Wallet,
    reports: FileText,
    settings: Settings,
  };
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Sidebar Rail */}
      <aside className="w-20 flex flex-col items-center py-8 bg-black/40 border-r border-white/10 z-10 hidden md:flex">
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-12 shadow-[0_0_20px_rgba(168,85,247,0.4)] overflow-hidden">
          <img src="/src/assets/images/neon_finance_logo_1783356701553.jpg" alt="Neon Finance" className="w-full h-full object-cover" />
        </div>
        <nav className="flex flex-col gap-8 flex-1">
          {['dashboard', 'expenses', 'reports', 'settings'].map((tab) => {
            const Icon = iconMap[tab as keyof typeof iconMap];
            return (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-xl transition-all ${
                  activeTab === tab
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6" />
              </motion.button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 md:p-8 gap-6 z-10">
        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500 tracking-tight">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Overview
            </h1>
            <p className="text-slate-500 text-sm">Welcome to Neon Finance</p>
          </div>
          <div className="flex items-center gap-4">
            <Auth />
            <div className="h-10 px-4 bg-purple-600 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.5)] cursor-pointer hover:bg-purple-700 transition-all">
              <span className="text-sm font-semibold text-white">Add Expense</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 bg-black/30 border border-white/5 rounded-2xl p-6 backdrop-blur-sm overflow-auto">
          {activeTab === 'dashboard' ? (
            <div className="space-y-6">
              <div className="flex items-center text-xs text-slate-500 font-mono">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                LIVE UPDATES ACTIVE
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Total Spent', value: '$12,450', color: 'purple' },
                  { title: 'Budget Remaining', value: '$2,500', color: 'cyan' },
                  { title: 'Top Category', value: 'Dining', color: 'fuchsia' },
                ].map((stat, i) => {
                  const colorMap = {
                    purple: 'border-purple-500/30 text-purple-400',
                    cyan: 'border-cyan-500/30 text-cyan-400',
                    fuchsia: 'border-fuchsia-500/30 text-fuchsia-400',
                  };
                  return (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-black/50 border ${colorMap[stat.color as keyof typeof colorMap]} p-6 rounded-2xl cursor-pointer`}
                    >
                      <p className="text-slate-400 text-sm">{stat.title}</p>
                      <p className={`text-3xl font-bold ${colorMap[stat.color as keyof typeof colorMap].split(' ')[1]} mt-2`}>
                        {stat.value}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-black/50 border border-white/5 rounded-2xl p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Spending Trends</h2>
                <DashboardChart />
              </motion.div>
            </div>
          ) : activeTab === 'expenses' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">My Expenses</h2>
              <ExpenseForm onAdd={() => {}} />
              <ExpenseList />
            </div>
          ) : (
            <h2 className="text-xl">Content for {activeTab} goes here...</h2>
          )}
        </div>
      </main>
    </div>
  );
}
