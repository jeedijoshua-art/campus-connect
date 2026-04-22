import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../../store/useNotificationStore';
import { X, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useNotificationStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-400" size={18} />,
    error: <AlertCircle className="text-red-400" size={18} />,
    info: <Info className="text-blue-400" size={18} />,
    zap: <Zap className="text-violet-400" size={18} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-4 min-w-[300px] border border-zinc-800 shadow-2xl flex items-center space-x-4 group"
    >
      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        {icons[toast.type] || icons.info}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white tracking-tight leading-none mb-1">System Message</p>
        <p className="text-xs text-zinc-400 font-medium">{toast.message}</p>
      </div>
      <button 
        onClick={onClose}
        className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
      >
        <X size={16} />
      </button>
      
      {/* Progress Bar */}
      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-violet-600 to-blue-500 rounded-full"
      />
    </motion.div>
  );
};

export default Toast;
