import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Users, MessageSquare, Folder, Download, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    totalGroups: 0,
    totalMessages: 0,
    totalFiles: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/analytics');
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    // Navigate to the export endpoint which downloads the excel file
    const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';
    window.location.href = `${baseURL}/admin/export?token=` + localStorage.getItem('token');
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/20' },
    { title: 'Study Groups', value: stats.totalGroups, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/20' },
    { title: 'Total Messages', value: stats.totalMessages, icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-500/20' },
    { title: 'Shared Files', value: stats.totalFiles, icon: Folder, color: 'text-orange-500', bg: 'bg-orange-500/20' }
  ];

  return (
    <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Platform overview and management.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 font-medium"
        >
          <Download size={20} />
          <span>Export to Excel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(stat => (
          <div key={stat.title} className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
            <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-zinc-400 font-medium mb-1">{stat.title}</p>
            <h2 className="text-3xl font-bold text-white">{stat.value}</h2>
          </div>
        ))}
      </div>
      
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">System Actions</h3>
        <p className="text-zinc-400 mb-6">Manage users, delete inappropriate content, and oversee the platform. Features coming soon.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
