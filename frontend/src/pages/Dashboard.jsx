import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import api from '../lib/axios';
import { 
  MessageSquare, 
  Users, 
  Folder, 
  Megaphone, 
  Trophy, 
  ChevronRight, 
  Zap, 
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Layout as LayoutIcon,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import Skeleton from '../components/ui/Skeleton';
import Ripple from '../components/ui/Ripple';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-[100px]`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 bg-zinc-900/50 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-zinc-800/50`}>
        <Icon size={24} className={color.replace('from-', 'text-').replace('-600', '-400')} />
      </div>
      <div className="flex items-center space-x-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
        <TrendingUp size={12} />
        <span>+12%</span>
      </div>
    </div>
    <div>
      <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-black text-white tracking-tighter">{value}</span>
        <span className="text-zinc-600 text-[10px] font-medium mb-1">vs last month</span>
      </div>
    </div>
  </motion.div>
);

const IconButton = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center group space-y-2 cursor-pointer"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} p-0.5 relative`}>
      <div className="absolute inset-0 bg-white/10 rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center border border-white/5 transition-transform duration-300 group-hover:scale-95 group-active:scale-90">
        <Icon size={24} className="text-white group-hover:scale-110 transition-transform" />
      </div>
    </div>
    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 group-hover:text-zinc-200 transition-colors">
      {label}
    </span>
  </button>
);

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [announcementsRes, usersRes] = await Promise.all([
          api.get('/announcements'),
          api.get('/auth')
        ]);
        setAnnouncements(announcementsRes.data.slice(0, 3));
        setTopUsers(usersRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { title: 'Messages Sent', value: '1.2k', icon: MessageSquare, color: 'from-blue-600 to-cyan-500', delay: 0.1 },
    { title: 'Study Groups', value: '24', icon: Users, color: 'from-violet-600 to-purple-500', delay: 0.2 },
    { title: 'Study Resources', value: '86', icon: Folder, color: 'from-emerald-600 to-teal-500', delay: 0.3 },
  ];

  const events = [
    { title: 'DBMS Mid-Term Exam', time: 'Tomorrow, 10:00 AM • Hall B', type: 'exam', color: 'text-red-400', bg: 'bg-red-500' },
    { title: 'Web Tech Workshop', time: 'Friday, 2:00 PM • Lab 301', type: 'workshop', color: 'text-blue-400', bg: 'bg-blue-500' },
    { title: 'OS Assignment Due', time: 'Monday, 11:59 PM', type: 'deadline', color: 'text-amber-400', bg: 'bg-amber-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full pt-4 pb-12">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 md:mb-10 px-2"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400">Campus Network Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-3">
              WELCOME BACK, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                {user?.name?.split(' ')[0].toUpperCase()}
              </span>
            </h1>
            <p className="text-zinc-400 font-medium text-sm max-w-md italic">
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </p>
          </div>
          
          {/* Quick Actions — 2×2 grid on mobile, row on md+ */}
          <div className="grid grid-cols-4 sm:flex sm:flex-row items-center gap-4 sm:gap-6 bg-zinc-900/40 backdrop-blur-md p-5 md:p-6 rounded-[2rem] border border-zinc-800/50 relative w-full sm:w-auto">
            <IconButton icon={MessageSquare} label="Chats" color="bg-blue-600/20" onClick={() => navigate('/chats')} />
            <IconButton icon={Users} label="Groups" color="bg-violet-600/20" onClick={() => navigate('/groups')} />
            <IconButton icon={Folder} label="Resources" color="bg-emerald-600/20" onClick={() => navigate('/files')} />
            <IconButton icon={Megaphone} label="News" color="bg-orange-600/20" onClick={() => navigate('/announcements')} />
            <Ripple />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-2">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Featured News/Study Tip */}
          <div className="neon-border rounded-[2rem] md:rounded-[2.5rem]">
            <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden group border-none!">
              <div className="absolute top-0 right-0 p-6 md:p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                <Zap size={100} className="text-violet-400" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 bg-violet-600/10 text-violet-400 px-4 py-1.5 rounded-full border border-violet-500/20 mb-4 md:mb-6 group-hover:animate-glow">
                  <Trophy size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Daily Study Tip</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4 tracking-tight leading-tight">
                  Master Deep Work with <br />
                  the Pomodoro Technique
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mb-6 md:mb-8">
                  Study in focused 25-minute sprints followed by 5-minute breaks. This proven method boosts retention and prevents cognitive burnout — perfect for exam season!
                </p>
                <button className="flex items-center space-x-2 bg-white text-black px-5 md:px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-400 hover:text-white transition-all transform hover:scale-105 active:scale-95">
                  <span>Learn more</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Announcements Feed */}
          <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight uppercase">Campus Announcements</h2>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Official Broadcast Feed</p>
              </div>
              <button className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <LayoutIcon size={18} />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 rounded-3xl" />
                <Skeleton className="h-24 rounded-3xl" />
                <Skeleton className="h-24 rounded-3xl" />
              </div>
            ) : announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann._id} className="group flex items-start space-x-3 md:space-x-6 p-4 md:p-6 rounded-3xl border border-zinc-800/30 hover:border-violet-500/20 hover:bg-zinc-800/20 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex flex-col items-center justify-center border border-zinc-800">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">
                        {format(new Date(ann.createdAt), 'MMM')}
                      </span>
                      <span className="text-xl font-black text-white leading-none">
                        {format(new Date(ann.createdAt), 'dd')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-[10px] font-black uppercase text-violet-400 tracking-widest">{ann.tag}</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span className="text-[10px] font-bold text-zinc-500">Verified Broadcast</span>
                      </div>
                      <h4 className="text-white font-bold group-hover:text-violet-400 transition-colors uppercase tracking-tight">{ann.title}</h4>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-1 leading-relaxed">{ann.content}</p>
                    </div>
                    <button className="self-center p-3 rounded-2xl bg-zinc-900/50 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <ChevronRight size={18} className="text-zinc-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-800">
                <p className="text-zinc-600 font-bold uppercase tracking-widest">No active transmissions</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets Area */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Schedule */}
          <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black text-white tracking-widest uppercase italic">This Week</h2>
              <Calendar size={18} className="text-zinc-600" />
            </div>
            <div className="space-y-6">
              {events.map((event, i) => (
                <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:rounded-full transition-all group">
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full ${event.bg.replace('/10', '')}`} />
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${event.color}`}>{event.type}</p>
                  <h4 className="text-xs font-black text-zinc-100 group-hover:text-white transition-colors">{event.title}</h4>
                  <div className="flex items-center space-x-2 mt-1 text-zinc-500">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold tracking-tight">{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl transition duration-200 border border-zinc-800/50">
              View Full Academic Calendar
            </button>
          </div>

          {/* Leaders board / Top Contributors */}
          <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/10 blur-[50px] rounded-full" />
            <h2 className="text-sm font-black text-white tracking-widest uppercase italic mb-8 relative z-10">Top Students</h2>
            
            <div className="space-y-5 relative z-10">
              {isLoading ? (
                [1, 2, 3].map(i => <div key={i} className="h-10 bg-zinc-900/50 animate-pulse rounded-full" />)
              ) : (
                topUsers.map((u, i) => (
                  <div key={u._id} className="flex items-center space-x-3 group">
                    <div className="relative">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-2xl bg-zinc-800 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      {i < 3 && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-violet-500 to-blue-500 text-white text-[9px] font-black rounded-lg flex items-center justify-center border-2 border-[#0f0f1a] shadow-lg">
                          {i + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-300 truncate group-hover:text-white transition-colors">{u.name}</p>
                      <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-tighter">{u.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-violet-400 italic">#{980 - (i * 40)}</p>
                      <p className="text-[8px] font-bold text-zinc-700 uppercase">XP</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button 
              onClick={() => setIsLeaderboardOpen(true)}
              className="w-full mt-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all duration-300 shadow-lg shadow-violet-600/20 transform hover:-translate-y-1 relative overflow-hidden"
            >
              <span>Student Leaderboard</span>
              <Ripple />
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {isLeaderboardOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLeaderboardOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl glass rounded-[2rem] md:rounded-[3rem] border border-zinc-800 shadow-2xl overflow-hidden relative z-10"
            >
              <div className="p-6 md:p-10">
                  <div className="flex justify-between items-center mb-6 md:mb-10">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Hall of Merit</h2>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Top Students • Academic Year 2025-26</p>
                    </div>
                    <button onClick={() => setIsLeaderboardOpen(false)} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                      <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-4">
                  {topUsers.map((u, i) => (
                    <div key={u._id} className="flex items-center space-x-6 p-4 rounded-[1.5rem] bg-zinc-900/50 border border-zinc-800/50 hover:border-violet-500/30 transition-all">
                      <span className="w-8 text-2xl font-black italic text-zinc-800">{i + 1}</span>
                      <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <p className="text-white font-black uppercase tracking-tight">{u.name}</p>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase">{u.role} • Batch 2024</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-violet-400 font-black">
                          <Zap size={14} />
                          <span>{1200 - (i * 150)} pts</span>
                        </div>
                        <p className="text-[9px] font-bold text-zinc-700 uppercase">Season Rank</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-10 py-5 bg-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-[0.4em] rounded-[1.5rem] hover:bg-zinc-700 hover:text-white transition-all">
                  Load Full Ranking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
