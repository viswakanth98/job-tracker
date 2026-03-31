import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, X, BarChart2, ChevronDown, UserCircle } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useUserStore, getAvatarColor } from '../../store/useUserStore';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/applications', icon: Briefcase, label: 'Applications' },
  { to: '/stats', icon: BarChart2, label: 'Insights' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/profile', icon: UserCircle, label: 'My Profile' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, setStatusFilter, setSearchQuery } = useUIStore();
  const { users, activeUserId, setActiveUser } = useUserStore();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];

  const handleSwitch = (id: string) => {
    if (id !== activeUserId) {
      setActiveUser(id);
      // Reset filters so the new user starts clean
      setStatusFilter('All');
      setSearchQuery('');
    }
    setSwitcherOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-30 flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">JobTracker</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Switcher */}
        <div className="px-3 py-3 border-b border-gray-700 relative">
          <button
            onClick={() => setSwitcherOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <div
              className={`w-8 h-8 ${getAvatarColor(activeUser.id)} rounded-lg flex items-center justify-center flex-shrink-0`}
            >
              <span className="text-white font-bold text-sm">
                {activeUser.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-white text-sm font-medium truncate">{activeUser.name}</p>
              <p className="text-gray-400 text-xs">Active user</p>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform flex-shrink-0 ${switcherOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {switcherOpen && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide px-3 pt-2.5 pb-1">
                Switch User
              </p>
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSwitch(user.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-700 transition-colors ${
                    user.id === activeUserId ? 'bg-gray-700/50' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 ${getAvatarColor(user.id)} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-xs">
                      {user.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-white font-medium">{user.name}</span>
                  {user.id === activeUserId && (
                    <span className="ml-auto text-xs text-blue-400 font-medium">Active</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-0.5">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">Data stored locally in browser</p>
        </div>
      </aside>
    </>
  );
}
