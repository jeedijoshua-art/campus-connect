import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Header from './Header';
import Toast from '../ui/Toast';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  // Dynamic page titles
  useEffect(() => {
    const pageTitles = {
      '/':             'Dashboard',
      '/chats':        'Chats',
      '/groups':       'Study Groups',
      '/files':        'Resources',
      '/announcements':'Announcements',
      '/admin':        'Admin Dashboard',
    };
    const matched = Object.keys(pageTitles).find((path) =>
      path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
    );
    const pageLabel = matched ? pageTitles[matched] : 'Campus Connect';
    document.title = matched && matched !== '/'
      ? `${pageLabel} | Campus Connect`
      : 'Campus Connect';
  }, [location.pathname]);

  if (!user) return <Outlet />;

  const hideNavOnMobile = location.pathname.includes('/chat/');

  return (
    <div className="flex h-screen bg-dark-bg text-[#f8f8fc] overflow-hidden relative">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex relative z-20">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Unified Application Header */}
        <Header />

        <main className="flex-1 overflow-y-auto px-4 pb-16 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation */}
        {!hideNavOnMobile && (
          <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 px-4 pb-4 bg-transparent">
            <div className="glass rounded-2xl shadow-2xl">
              <BottomNav />
            </div>
          </nav>
        )}
      </div>

      {/* Global Toast Notifications */}
      <Toast />
    </div>
  );
};

export default Layout;
