import { motion } from 'motion/react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function LandingPage() {
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ repeat: Infinity, duration: 15 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[150px] rounded-full"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center space-y-6 max-w-2xl px-4"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-6 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-white/10"
        >
          <img src="/src/assets/images/neon_finance_logo_1783356701553.jpg" alt="Logo" className="w-full h-full object-cover" />
        </motion.div>
        <motion.h1 
          whileHover={{ scale: 1.05 }}
          className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
        >
          BrokeBestie
        </motion.h1>
        <p className="text-xl text-slate-400">
          Take control of your spending with our immersive, AI-powered insights platform.
        </p>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={signIn}
          className="px-8 py-4 bg-purple-600 rounded-full font-bold text-lg hover:bg-purple-700 transition-all shadow-[0_0_20px_rgba(147,51,234,0.5)]"
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
}
