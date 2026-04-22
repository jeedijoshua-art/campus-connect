import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { 
  Folder, 
  Upload, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  HardDrive, 
  Search,
  MoreVertical,
  Filter,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../store/useNotificationStore';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useNotificationStore();

  const fetchFiles = async () => {
    try {
      const { data } = await api.get('/files');
      setFiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    setIsUploading(true);
    addToast(`Initializing upload for ${file.name}...`, 'info');

    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addToast('Data packet secured successfully!', 'success');
      fetchFiles();
    } catch (error) {
      addToast('Critical upload failure. Interference detected.', 'error');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full pt-8 pb-12 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Secure Storage</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-3">
            Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Vault</span>
          </h1>
          <p className="text-zinc-500 font-medium text-sm max-w-lg italic">
            "Knowledge stored is wisdom preserved. Secure your intelligence across the campus cloud."
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
            <Filter size={20} />
          </button>
          <input type="file" id="file-upload" className="hidden" onChange={handleUpload} disabled={isUploading} />
          <label 
            htmlFor="file-upload" 
            className={`bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] cursor-pointer flex items-center space-x-3 transition-all transform hover:-translate-y-1 shadow-xl shadow-white/5 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-400 hover:text-white'}`}
          >
            <Plus size={18} />
            <span>{isUploading ? 'SYNCING...' : 'DEPOSIT DATA'}</span>
          </label>
        </div>
      </div>

      {/* Storage Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass-card rounded-[2rem] p-6 border-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <HardDrive size={16} />
            </div>
            <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Usage</span>
          </div>
          <h3 className="text-2xl font-black text-white leading-tight">1.2 <span className="text-xs text-zinc-500 uppercase">GB</span></h3>
          <div className="mt-4 w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
            <div className="w-[45%] h-full bg-emerald-500" />
          </div>
        </div>
        {[
          { icon: ImageIcon, label: 'Visuals', count: '14 Files', color: 'text-blue-400' },
          { icon: FileText, label: 'Documents', count: '32 Files', color: 'text-orange-400' },
          { icon: HardDrive, label: 'Others', count: '5 Files', color: 'text-violet-400' }
        ].map((item, i) => (
          <div key={i} className="glass-card rounded-[2rem] p-6 border-white/5 hidden md:block">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-lg bg-white/5 ${item.color} flex items-center justify-center`}>
                <item.icon size={16} />
              </div>
              <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">{item.label}</span>
            </div>
            <h3 className="text-2xl font-black text-white leading-tight">{item.count}</h3>
          </div>
        ))}
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
           [1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-48 glass-card rounded-[2.5rem] animate-pulse border-white/5" />)
        ) : files.length > 0 ? (
          files.map((file, index) => (
            <motion.div 
              key={file._id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-[2.5rem] p-6 flex flex-col group relative overflow-hidden border-white/5"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-zinc-500 hover:text-white">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${file.type.includes('image') ? 'bg-blue-600/10 text-blue-400' : 'bg-orange-600/10 text-orange-400'}`}>
                {file.type.includes('image') ? <ImageIcon size={28} /> : <FileText size={28} />}
              </div>
              
              <h3 className="text-white font-bold truncate text-sm mb-1 group-hover:text-emerald-400 transition-colors" title={file.name}>
                {file.name.toUpperCase()}
              </h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.uploader?.name?.split(' ')[0]}
              </p>
              
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Type: {file.type.split('/')[1] || 'DB'}</span>
                <a 
                  href={file.url} 
                  download 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-emerald-600 transition-all border border-zinc-800"
                >
                  <Download size={18} />
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass-card rounded-[3rem] border-dashed border-zinc-800">
            <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-zinc-700">
              <Folder size={40} />
            </div>
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Void Storage</h3>
            <p className="text-zinc-500 font-medium mb-8 max-w-xs mx-auto text-sm">No data objects have been localized in your sector. Deposit your first intelligence packet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;
