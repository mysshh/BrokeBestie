import { motion } from 'motion/react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ArrowRight, Zap, Target, BarChart3, BotMessageSquare } from 'lucide-react';

export default function LandingPage() {
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center">
            <span className="text-lime text-2xl font-black">B</span>
          </div>
          <span className="text-2xl font-black text-forest">BROKEBESTIE</span>
        </div>
        <button 
          onClick={signIn}
          className="px-6 py-2 bg-forest text-white rounded-full font-bold hover:bg-forest/90 transition-all"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <header className="px-8 py-20 text-center max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-9xl font-black text-forest leading-tight"
        >
          Your money. Your rules.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl mt-8 text-charcoal/80"
        >
          No more broke surprises. Plan, test, and master your financial future before making a move.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex gap-4 justify-center"
        >
          <button 
            onClick={signIn}
            className="px-8 py-4 bg-lime text-forest rounded-full font-black text-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 bg-forest text-white rounded-full font-black text-lg hover:scale-105 transition-all">
            See How It Works
          </button>
        </motion.div>
      </header>

      {/* Features */}
      <section className="px-8 py-20 bg-forest text-cream rounded-t-[3rem]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: 'Plan Your Money', desc: 'Map out your income and expenses effortlessly.' },
            { icon: Zap, title: 'Test Your Decisions', desc: 'See the impact of any purchase before you make it.' },
            { icon: BarChart3, title: 'Stay Ahead', desc: 'Predict your financial health 30 days in advance.' },
          ].map((feat, i) => (
            <div key={i} className="p-8 bg-charcoal rounded-3xl">
              <feat.icon className="w-12 h-12 text-lime mb-6" />
              <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
              <p className="text-cream/70">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
