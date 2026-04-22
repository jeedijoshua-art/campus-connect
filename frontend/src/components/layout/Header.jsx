import { useState, useEffect } from 'react';
import { Search, Bell, User, ChevronDown, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-header py-3' : 'bg-transparent py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Mobile Brand Logo — hidden on desktop (sidebar has it) */}
        <div className="flex md:hidden items-center space-x-2 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/30">
            <span className="text-sm font-black text-white italic">C</span>
          </div>
          <div className="leading-none">
            <p className="text-sm font-black tracking-tighter text-white">CAMPUS</p>
            <p className="text-[8px] font-bold tracking-[0.15em] text-violet-400 uppercase">Connect</p>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-violet-400 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full bg-zinc-900/40 border border-zinc-800/50 text-sm text-zinc-100 rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all backdrop-blur-sm"
            placeholder="Search students, subjects, resources..."
          />
        </div>

        {/* Spacer on mobile so actions stay right-aligned */}
        <div className="flex md:hidden flex-1" />

        {/* Actions */}
        <div className="flex items-center space-x-1 md:space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
              className={`p-2.5 rounded-full transition-all duration-200 relative group ${
                isNotifOpen ? 'bg-violet-600/20 text-violet-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
              }`}
            >
              <Bell size={20} className="group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#09090b] shadow-lg shadow-violet-600/30">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsNotifOpen(false)}
                    className="fixed inset-0 z-[-1]"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-[min(320px,calc(100vw-2rem))] glass border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden py-2"
                  >
                    <div className="px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-white">Campus Alerts</h3>
                      <button onClick={markAllAsRead} className="text-[10px] uppercase font-bold text-violet-400 hover:text-violet-300 transition-colors">
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-[280px] overflow-y-auto">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-zinc-800/40 transition-colors cursor-pointer border-b border-zinc-800/50 last:border-none ${!notif.read ? 'bg-violet-600/5' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <h4 className={`text-xs font-bold leading-tight ${!notif.read ? 'text-violet-400' : 'text-zinc-100'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-zinc-500 shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-tight line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 bg-zinc-800/30 text-center">
                      <button className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                        View all campus alerts
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-[1px] bg-zinc-800" />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
              className={`flex items-center space-x-1.5 md:space-x-2 pl-1.5 pr-2 md:pr-3 py-1.5 rounded-full transition-all duration-200 group ${
                isProfileOpen ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/40'
              }`}
            >
              <div className="relative">
                <img 
                  src={user?.avatar} 
                  alt={user?.name} 
                  className="w-8 h-8 rounded-full border border-zinc-700 object-cover" 
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-900" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-zinc-100 group-hover:text-violet-400 transition-colors">
                  {user?.name?.split(' ')[0]}
                </p>
                <p className="text-[10px] text-zinc-500 font-medium leading-none">
                  {user?.role}
                </p>
              </div>
              <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsProfileOpen(false)}
                    className="fixed inset-0 z-[-1]"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 glass border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden py-2"
                  >
                    <div className="px-4 py-3 border-b border-zinc-800 mb-1">
                      <p className="text-xs font-medium text-zinc-500">Logged in as student</p>
                      <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                    </div>
                    
                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-zinc-400 hover:bg-zinc-800/60 hover:text-white transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-violet-600/20 group-hover:text-violet-400 transition-colors">
                        <User size={18} />
                      </div>
                      <span className="text-sm font-medium">Student Profile</span>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-zinc-400 hover:bg-zinc-800/60 hover:text-white transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-violet-600/20 group-hover:text-violet-400 transition-colors">
                        <Settings size={18} />
                      </div>
                      <span className="text-sm font-medium">Settings</span>
                    </button>

                    <div className="h-[1px] bg-zinc-800 my-1 mx-2" />

                    <button 
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors">
                        <LogOut size={18} />
                      </div>
                      <span className="text-sm font-medium">Log out</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
