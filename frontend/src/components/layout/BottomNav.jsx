import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Users, Folder, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Chats', path: '/chats', icon: MessageSquare },
    { name: 'Groups', path: '/groups', icon: Users },
    { name: 'Resources', path: '/files', icon: Folder },
    { name: 'News', path: '/announcements', icon: Megaphone },
  ];

  return (
    <div className="flex items-center justify-around h-16 px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center w-14 h-full transition-all duration-300 ${
                isActive ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute -top-1 w-8 h-1 bg-violet-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <Icon size={22} className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -inset-2 bg-violet-600/20 blur-lg rounded-full z-[-1]"
                    />
                  )}
                </div>
                <span className={`text-[10px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-90'}`}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
};

export default BottomNav;
