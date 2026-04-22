import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Chats from './pages/Chats';
import ChatDetail from './pages/ChatDetail';
import Groups from './pages/Groups';
import Files from './pages/Files';
import Announcements from './pages/Announcements';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { user, isAuthenticated, isLoading, getProfile } = useAuthStore();

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} 
        />

        {/* Protected Routes */}
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chat/:groupId" element={<ChatDetail />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/files" element={<Files />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route 
            path="/admin" 
            element={user?.role === 'Admin' ? <AdminDashboard /> : <Navigate to="/" />} 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
