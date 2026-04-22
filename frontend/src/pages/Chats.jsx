import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, Users, ChevronRight, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

const Chats = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJoinedGroups = async () => {
      try {
        const { data } = await api.get('/groups');
        const joined = data.filter(g => g.members.some(m => m._id === user._id));
        setGroups(joined);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJoinedGroups();
  }, [user._id]);

  return (
    <div className="max-w-4xl mx-auto w-full pt-8 pb-12 px-4">
      <div className="mb-10">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-violet-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400">Communication Terminal</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">ACTIVE SESSIONS</h1>
        <p className="text-zinc-500 text-sm font-medium">Select a secure channel to initiate encrypted communication.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card rounded-3xl p-6 h-24 animate-pulse border-white/5" />
          ))
        ) : groups.length > 0 ? (
          groups.map((group, index) => (
            <motion.div 
              key={group._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/chat/${group._id}`)}
              className="glass-card rounded-[2rem] p-6 flex items-center space-x-6 cursor-pointer group hover:bg-zinc-800/40 border-white/5"
            >
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center relative flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                <Hash className="text-violet-400" size={24} />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0a0a0f] rounded-full" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-black text-white tracking-tight uppercase group-hover:text-violet-400 transition-colors">
                    {group.name}
                  </h3>
                  <div className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{group.members.length} MEMBERS</span>
                </div>
                <p className="text-xs text-zinc-500 font-medium italic group-hover:text-zinc-400 transition-colors">
                  Last transmission: 5 minutes ago
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex -space-x-3">
                  {group.members.slice(0, 3).map((m, i) => (
                    <img 
                      key={m._id} 
                      src={m.avatar} 
                      className="w-8 h-8 rounded-xl border-2 border-[#12121a] object-cover ring-2 ring-transparent group-hover:ring-violet-500/20 transition-all" 
                      style={{ zIndex: 10 - i }}
                    />
                  ))}
                  {group.members.length > 3 && (
                    <div className="w-8 h-8 rounded-xl border-2 border-[#12121a] bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-400 relative z-0">
                      +{group.members.length - 3}
                    </div>
                  )}
                </div>
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-violet-400 group-hover:bg-violet-600/10 transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="glass-card rounded-[2.5rem] p-16 text-center border-dashed border-zinc-800">
            <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-zinc-700">
              <MessageSquare size={40} />
            </div>
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Null Sector</h3>
            <p className="text-zinc-500 font-medium mb-8">No active communication channels found in your current sector.</p>
            <button 
              onClick={() => navigate('/groups')}
              className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-violet-400 hover:text-white transition-all transform hover:scale-105"
            >
              Scan for Groups
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
