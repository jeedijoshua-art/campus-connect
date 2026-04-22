import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { Megaphone, Plus, Calendar, Clock, User, ArrowRight, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useNotificationStore } from '../store/useNotificationStore';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('General');
  const { user } = useAuthStore();
  const { addToast } = useNotificationStore();

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get('/announcements');
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', { title, content, tag });
      addToast('Announcement broadcasted globally.', 'zap');
      setIsModalOpen(false);
      setTitle('');
      setContent('');
      fetchAnnouncements();
    } catch (error) {
      addToast('Transmission failure. Check admin clearance.', 'error');
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full pt-8 pb-12 px-4 italic!">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400">Broadcast Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-3 text-glow">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Chronicle</span>
          </h1>
          <p className="text-zinc-500 font-medium text-sm max-w-lg">
            Stay synchronized with real-time updates, event logs, and critical campus alerts.
          </p>
        </div>

        {user?.role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-violet-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-white/5 flex items-center space-x-3"
          >
            <Plus size={18} />
            <span>Post Update</span>
          </button>
        )}
      </div>

      <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-0 before:w-px before:bg-zinc-800">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-40 glass-card rounded-[2.5rem] animate-pulse ml-12 border-white/5" />)
        ) : announcements.length > 0 ? (
          announcements.map((ann, index) => (
            <motion.div 
              key={ann._id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative ml-12"
            >
              {/* Timeline Indicator */}
              <div className={`absolute -left-[12px] top-6 w-6 h-6 rounded-lg ${ann.tag === 'Urgent' ? 'bg-red-500 animate-glow shadow-red-500/50' : 'bg-zinc-800'} border-4 border-[#09090b] z-10`} />
              
              <div className="glass-card rounded-[2.5rem] p-8 group hover:border-violet-500/30 transition-all border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                  <ShieldAlert size={120} className="text-violet-400" />
                </div>

                <div className="flex flex-wrap justify-between items-start mb-6 gap-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <span className={`text-[9px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full border ${
                      ann.tag === 'Urgent' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      ann.tag === 'Event' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      ann.tag === 'Study' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      'bg-violet-500/10 text-violet-400 border-violet-500/20'
                    }`}>
                      {ann.tag}
                    </span>
                    <div className="flex items-center space-x-1.5 text-zinc-600">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold tracking-tight uppercase">
                        {format(new Date(ann.createdAt), 'MMM d, yyyy • h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-violet-400 transition-colors uppercase leading-none">
                  {ann.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-medium italic">
                  {ann.content}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-violet-600/10 group-hover:text-violet-400 transition-all">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Posted By</p>
                      <p className="text-[10px] font-bold text-zinc-300 tracking-tight">{ann.author?.name || 'ADMIN_CMD'}</p>
                    </div>
                  </div>
                  
                  <button className="p-3 rounded-xl bg-zinc-950 text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all transform hover:scale-110 active:scale-90">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="ml-12 py-20 text-center glass-card rounded-[3rem] border-dashed border-zinc-800">
            <div className="w-20 h-20 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-zinc-700">
              <Megaphone size={40} />
            </div>
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Static Silence</h3>
            <p className="text-zinc-500 font-medium mb-8 max-w-xs mx-auto text-sm">Universal quiet detected across all channels. Standby for future transmissions.</p>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg glass rounded-[2.5rem] border border-zinc-800 shadow-2xl overflow-hidden relative z-10"
            >
              <div className="p-10">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2 italic">Broadcast Protocol</h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8">Elevated Admin Access Verified</p>
                
                <form onSubmit={handlePost} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Intel Heading</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e=>setTitle(e.target.value)} 
                      required 
                      placeholder="Title" 
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-violet-500/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Classification</label>
                    <select 
                      value={tag} 
                      onChange={e=>setTag(e.target.value)} 
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                    >
                      <option>General</option>
                      <option>Urgent</option>
                      <option>Event</option>
                      <option>Study</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Detailed Signal</label>
                    <textarea 
                      value={content} 
                      onChange={e=>setContent(e.target.value)} 
                      required 
                      rows="4" 
                      placeholder="Input signal data here..." 
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-violet-500/50" 
                    />
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 bg-zinc-900 text-zinc-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-colors"
                    >
                      Cancel Broadcast
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:from-violet-500 hover:to-blue-500 transition-all shadow-lg shadow-violet-600/20"
                    >
                      Execute signal
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;
