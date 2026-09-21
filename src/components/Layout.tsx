import React from 'react';
import { useAppStore } from '../store';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, FileClock } from 'lucide-react';
import { clsx } from 'clsx';

export default function Layout() {
  const currentUser = useAppStore(state => state.currentUser);
  const logout = useAppStore(state => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'ثبت گزارش جدید', icon: FileText, roles: ['manager', 'admin'] },
    { path: '/dashboard/history', label: 'تاریخچه گزارشات', icon: FileClock, roles: ['manager', 'admin'] },
    { path: '/dashboard/admin', label: 'پنل مدیریت', icon: Settings, roles: ['admin'] },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-gray-200 shadow-sm flex flex-col z-10">
        <div className="h-16 flex items-center justify-center border-b border-gray-100 px-4">
          <LayoutDashboard className="w-6 h-6 text-blue-600 ml-2" />
          <h2 className="font-bold text-gray-700">سامانه مشکلات</h2>
        </div>
        
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{currentUser.role === 'admin' ? 'مدیر سیستم' : 'کاربر مدیر'}</p>
        </div>
        
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.filter(item => item.roles.includes(currentUser.role)).map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className={clsx("w-5 h-5 ml-2.5", isActive ? "text-blue-600" : "text-gray-400")} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 ml-2.5 opacity-80" />
            خروج از سیستم
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="p-6 md:p-8 max-w-7xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
