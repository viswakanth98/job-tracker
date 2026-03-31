import { Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import { useUIStore } from './store/useUIStore';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import InterviewLogPage from './pages/InterviewLogPage';
import ContactsPage from './pages/ContactsPage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const { setSidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-gray-900">JobTracker</span>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/applications/:applicationId/interviews" element={<InterviewLogPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
