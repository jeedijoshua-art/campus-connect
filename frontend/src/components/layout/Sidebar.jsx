import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Users, Folder, Megaphone, Shield, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user } = useAuthStore();

  const navItems = [
    { name: 'Campus Home', path: '/', icon: Home },
    { name: 'Student Chats', path: '/chats', icon: MessageSquare },
    { name: 'Study Groups', path: '/groups', icon: Users },
    { name: 'Study Resources', path: '/files', icon: Folder },
    { name: 'Campus News', path: '/announcements', icon: Megaphone },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: Shield });
  }

  return (
    <div className="w-64 h-full flex flex-col pt-8 pb-6 px-4 bg-dark-bg/60 backdrop-blur-xl border-r border-zinc-800/50">
      <div className="px-3 mb-10 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/30">
          <span className="text-xl font-black text-white italic">C</span>
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tighter text-white leading-none">CAMPUS</h1>
          <p className="text-[10px] font-bold tracking-[0.2em] text-violet-400 uppercase">Connect</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'bg-violet-600/10 text-violet-400 font-bold'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-violet-500 rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center space-x-3.5 relative z-10">
                    <Icon 
                      size={20} 
                      className={`transition-all duration-300 ${
                        isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-violet-400'
                      }`} 
                    />
                    <span className="text-sm tracking-tight">{item.name}</span>
                  </div>
                  {isActive ? (
                    <ChevronRight size={14} className="opacity-100" />
                  ) : (
                    <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Stats Widget */}
      <div className="mt-auto px-2">
        <div className="glass-card rounded-2xl p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield size={40} className="text-violet-400" />
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Academic Status</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-300">Campus Network Online</span>
          </div>
          <div className="mt-3 w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-gradient-to-r from-violet-600 to-blue-500" />
          </div>
          <p className="mt-1 text-[9px] text-zinc-600 italic">Semester Progress: 75%</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
