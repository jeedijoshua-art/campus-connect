import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, User, ArrowRight, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch {
      // error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-float" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-600 to-violet-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40 mx-auto mb-6 -rotate-3 hover:rotate-0 transition-transform duration-500"
          >
            <Zap size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">ENLIST NOW</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Campus Connect • Registration Portal</p>
        </div>

        <div className="glass rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within/input:text-blue-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-zinc-700 font-medium"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within/input:text-blue-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-zinc-700 font-medium"
                  placeholder="name@university.edu"
                  required
                />
              </div>

              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within/input:text-blue-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-zinc-700 font-medium"
                  placeholder="Create Passphrase"
                  required
                />
              </div>
            </div>

            <div className="px-2">
              <p className="text-[9px] text-zinc-600 font-medium leading-relaxed">
                By enlisting, you agree to the <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Campus Protocols</span> and <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Data Privacy Clauses</span>.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all duration-300 shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-3 transform group active:scale-95 disabled:opacity-50"
            >
              <span>{isLoading ? 'Processing...' : 'Complete Enlistment'}</span>
              {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          Already have Clearance?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Return to Terminal
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
