import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { Users, Plus, MapPin, Shield, Zap, Check, Trash2, AlertTriangle, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Simple Toast System ─────────────────────────────────────────────────────
const Toast = ({ toasts, removeToast }) => (
  <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.9 }}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-bold tracking-wide ${
            t.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/90 border-red-500/30 text-red-300'
          }`}
        >
          {t.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          <span>{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// ── Confirm Dialog ──────────────────────────────────────────────────────────
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, danger }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-10 w-full max-w-sm bg-[#13131f] border border-zinc-800 rounded-3xl p-8 shadow-2xl"
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${danger ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
            <AlertTriangle size={24} className={danger ? 'text-red-400' : 'text-blue-400'} />
          </div>
          <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">{title}</h3>
          <p className="text-zinc-500 text-sm leading-relaxed mb-8">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-black text-xs uppercase tracking-widest rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all ${
                danger
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ── Main Component ──────────────────────────────────────────────────────────
const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joiningId, setJoiningId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, groupId: null });

  // Toast state
  const [toasts, setToasts] = useState([]);

  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';

  // ── Toast helpers ─────────────────────────────────────────────────────────
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchGroups = async () => {
    try {
      const { data } = await api.get('/groups');
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      addToast('Failed to load groups', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { data: newGroup } = await api.post('/groups', { name, subject, description });
      setGroups((prev) => [newGroup, ...prev]);
      setIsModalOpen(false);
      setName('');
      setSubject('');
      setDescription('');
      addToast('Group created successfully! 🚀');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to create group', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Join ──────────────────────────────────────────────────────────────────
  const handleJoinGroup = async (groupId) => {
    if (joiningId) return;
    setJoiningId(groupId);
    try {
      const { data: updatedGroup } = await api.post(`/groups/${groupId}/join`);
      setGroups((prev) => prev.map((g) => (g._id === groupId ? updatedGroup : g)));
      addToast('Enlisted successfully! Welcome aboard 🎯');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to join group', 'error');
    } finally {
      setJoiningId(null);
    }
  };

  // ── Delete single ─────────────────────────────────────────────────────────
  const confirmDeleteGroup = (groupId) => {
    setConfirmDialog({ isOpen: true, type: 'single', groupId });
  };

  const handleDeleteGroup = async () => {
    const { groupId } = confirmDialog;
    setConfirmDialog({ isOpen: false, type: null, groupId: null });
    setDeletingId(groupId);
    try {
      await api.delete(`/groups/${groupId}`);
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      addToast('Group deleted successfully');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete group', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Clear all (admin) ─────────────────────────────────────────────────────
  const confirmClearAll = () => {
    setConfirmDialog({ isOpen: true, type: 'all', groupId: null });
  };

  const handleClearAll = async () => {
    setConfirmDialog({ isOpen: false, type: null, groupId: null });
    try {
      const { data } = await api.delete('/groups/all');
      setGroups([]);
      addToast(data.message || 'All groups cleared');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to clear groups', 'error');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto w-full pt-8 pb-12 px-4">
      {/* Toast */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        danger
        title={confirmDialog.type === 'all' ? 'Clear All Groups?' : 'Delete Group?'}
        message={
          confirmDialog.type === 'all'
            ? 'This will permanently delete ALL study groups and cannot be undone.'
            : 'This group will be permanently deleted and removed for all members.'
        }
        onConfirm={confirmDialog.type === 'all' ? handleClearAll : handleDeleteGroup}
        onCancel={() => setConfirmDialog({ isOpen: false, type: null, groupId: null })}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Collaborative Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-3">
            Discovery <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Nexus</span>
          </h1>
          <p className="text-zinc-500 font-medium text-sm max-w-lg">
            Connect with peers, create specialized nodes, and scale your collective intelligence across campus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin: Clear All */}
          {isAdmin && groups.length > 0 && (
            <button
              onClick={confirmClearAll}
              className="flex items-center gap-2 bg-red-950/60 hover:bg-red-900/60 text-red-400 hover:text-red-300 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-red-800/30 hover:border-red-500/40 cursor-pointer"
            >
              <Trash2 size={16} />
              <span>Reset All</span>
            </button>
          )}

          {/* Establish Node */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-400 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-white/5 flex items-center space-x-3 cursor-pointer"
          >
            <Plus size={18} />
            <span>Establish Node</span>
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card rounded-[2.5rem] h-64 animate-pulse" />
          ))
        ) : groups.length > 0 ? (
          groups.map((group, index) => {
            const isJoined = group.members?.some((m) => m._id === user?._id || m === user?._id);
            const isGroupAdmin =
              group.admin?._id === user?._id || group.admin === user?._id;
            const canDelete = isGroupAdmin || isAdmin;
            const isThisDeleting = deletingId === group._id;
            const isThisJoining = joiningId === group._id;

            return (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card rounded-[2.5rem] p-8 group relative overflow-hidden transition-opacity ${
                  isThisDeleting ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                {/* Background Shield Icon */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                  <Shield size={100} className="text-blue-400" />
                </div>

                {/* Delete Button (visible on hover, admin/group-admin only) */}
                {canDelete && (
                  <button
                    onClick={() => confirmDeleteGroup(group._id)}
                    disabled={isThisDeleting}
                    className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-zinc-900/80 border border-zinc-700/50 flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-950/40 hover:border-red-700/30 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 cursor-pointer"
                    title="Delete group"
                  >
                    <Trash2 size={15} />
                  </button>
                )}

                {/* Header Row */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all duration-500">
                    <Users size={24} />
                  </div>
                  <div className="flex -space-x-3">
                    {group.members?.slice(0, 3).map((m, i) => (
                      <img
                        key={m._id || i}
                        src={m.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${m.name || 'U'}`}
                        alt={m.name}
                        className="w-8 h-8 rounded-xl border-2 border-[#12121a] object-cover ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all"
                        style={{ zIndex: 10 - i }}
                        onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${m.name || 'U'}`; }}
                      />
                    ))}
                    {group.members?.length > 3 && (
                      <div className="w-8 h-8 rounded-xl border-2 border-[#12121a] bg-zinc-800 flex items-center justify-center text-[8px] font-black text-zinc-500">
                        +{group.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="relative z-10">
                  {/* Subject badge */}
                  {group.subject && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <BookOpen size={11} className="text-violet-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">
                        {group.subject}
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-8 font-medium italic">
                    {group.description || 'The mission parameters for this node are currently classified. Connect to sync terminal data.'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-zinc-600">
                      <div className="flex items-center space-x-1">
                        <MapPin size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Zone 01</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-zinc-800" />
                      <div className="flex items-center space-x-1">
                        <Zap size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{group.members?.length || 0} OPS</span>
                      </div>
                    </div>

                    {isJoined ? (
                      <div className="flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                        <Check size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoinGroup(group._id)}
                        disabled={isThisJoining}
                        className="bg-zinc-900 hover:bg-blue-600 text-zinc-400 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-800 hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isThisJoining ? 'Enlisting…' : 'Enlist'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
              <Users size={28} className="text-zinc-700" />
            </div>
            <h3 className="text-zinc-700 font-black uppercase tracking-[0.5em] mb-3">No active nodes found</h3>
            <p className="text-zinc-800 text-sm font-medium">
              Be the first to establish a study group node.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              + Establish First Node
            </button>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg glass rounded-[2.5rem] border border-zinc-800 shadow-2xl overflow-hidden relative z-10"
            >
              <div className="p-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 italic">Forge New Node</h2>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">System Deployment Protocol</p>
                  </div>
                  <button
                    onClick={() => !isSubmitting && setIsModalOpen(false)}
                    className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleCreateGroup} className="space-y-5">
                  {/* Group Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Node Designation <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. QUANTUM_PHYSICS"
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Subject / Topic
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. DBMS, Web Technologies, OS…"
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                      Node Directive
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      placeholder="Specify mission objectives…"
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 resize-none transition-all"
                    />
                  </div>

                  <div className="flex space-x-4 pt-2">
                    <button
                      type="button"
                      onClick={() => !isSubmitting && setIsModalOpen(false)}
                      disabled={isSubmitting}
                      className="flex-1 py-4 bg-zinc-900 text-zinc-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Abort
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Initializing…</span>
                        </>
                      ) : (
                        'Initialize'
                      )}
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

export default Groups;
