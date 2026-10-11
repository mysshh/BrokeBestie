import { motion } from 'motion/react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ArrowRight, Sparkles, TrendingUp, BarChart3, Target, Zap, Wallet, Star, ArrowDown } from 'lucide-react';

export default function LandingPage() {
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="min-h-screen bg-[#0A0B09] text-[#F5F4ED] font-sans overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_100%_0%,#173D2A_0%,transparent_60%)]"></div>

      {/* Navigation */}
      <nav className="fixed w-full flex items-center justify-between px-8 py-6 z-50 bg-[#0A0B09]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <img src="/src/assets/images/brokebestie_logo_1791720990523.jpg" alt="BrokeBestie" className="w-10 h-10 rounded-xl" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a href="#vibe" className="hover:text-lime transition-colors">The vibe</a>
          <a href="#features" className="hover:text-lime transition-colors">How it works</a>
        </div>
        <button onClick={signIn} className="px-6 py-2 bg-[#0A0B09] border border-[#173D2A] rounded-full font-bold hover:border-lime transition-all">
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <header id="vibe" className="relative z-10 min-h-screen flex items-center pt-20 px-8 max-w-7xl mx-auto gap-12">
        <div className="w-full md:w-1/2">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-lime font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> YOUR MONEY. YOUR RULES.
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-7xl font-black leading-tight tracking-tighter mb-6">
            Broke is a phase.<br />
            Bad money habits <span className="text-lime">don't have to be.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-text-secondary mb-10 max-w-lg">
            Make your money make sense—without killing your vibe.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4 mb-12">
            <button onClick={signIn} className="px-8 py-4 bg-lime text-[#0A0B09] rounded-full font-black text-lg hover:scale-105 transition-all flex items-center gap-2">
              Get started <ArrowRight size={20} />
            </button>
            <a href="#features" className="px-8 py-4 bg-[#191C18] text-[#F5F4ED] rounded-full font-bold text-lg hover:bg-[#173D2A] transition-all flex items-center gap-2">
              See how it works <ArrowDown size={20} />
            </a>
          </motion.div>
        </div>

        <div className="hidden md:flex w-1/2 relative items-center justify-center">
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="relative z-20">
              <div className="w-56 h-56 rounded-full bg-[#173D2A]/40 border-2 border-lime/30 backdrop-blur-md flex items-center justify-center text-4xl">😊</div>
              <div className="absolute -right-20 -bottom-10 w-24 h-24 rounded-full bg-[#BBA7FF]/40 backdrop-blur-sm"></div>
              <div className="absolute -left-20 -top-10 w-20 h-20 bg-[#FFAB70] rounded-full flex items-center justify-center text-4xl">😊</div>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="w-72 p-6 bg-[#191C18] rounded-3xl border border-[#173D2A] shadow-2xl absolute -top-10 -right-10 z-30">
              <p className="text-[#A0A0A0] text-xs mb-3">Monthly Budget</p>
              <div className="w-24 h-24 rounded-full border-4 border-lime flex items-center justify-center my-3 font-black text-xl">₹7,450</div>
              <p className="text-lime text-[10px] font-bold bg-lime/10 px-2 py-0.5 rounded-full inline-block">budget mode ON</p>
            </motion.div>
        </div>
      </header>

      <FeaturesSection />
    </div>
  );
}

function FeaturesSection() {
  const stories = [
    { title: 'The Chaos', text: 'Stressed about where your money goes? We turn financial chaos into clarity, organizing your spending into meaningful insights.', icon: Wallet },
    { title: 'Get Together', text: 'Meet your money\'s new bestie. Our intelligent dashboard brings all your financial data into one playful, easy-to-read view.', icon: Target },
    { title: 'Better Habits', text: 'Small moves lead to big changes. Track, test, and master your spending with features designed to build better habits.', icon: Zap },
    { title: 'The Payoff', text: 'Less money stress, more main-character energy. Achieve your goals and enjoy a better financial future.', icon: TrendingUp },
  ];

  return (
    <section id="features" className="bg-[#173D2A] px-8 py-32 rounded-t-[5rem] relative z-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-black tracking-tighter text-center mb-20 text-lime">Financial freedom, simplified.</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {stories.map((story, i) => (
            <StoryPanel key={i} {...story} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryPanel({ title, text, icon: Icon }: { title: string, text: string, icon: any, key?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-10 bg-[#191C18] rounded-3xl border border-[#173D2A] hover:border-lime transition-colors flex items-start gap-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#0A0B09] border border-[#173D2A] flex items-center justify-center text-lime flex-shrink-0">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-[#A0A0A0] leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}
