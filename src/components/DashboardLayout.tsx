import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  const menuItems = [
    { label: 'API Docs', path: '/docs' },
    { label: 'SandBox', path: '/sandbox' },
    { label: 'Production', path: '/production' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Wallet', path: '/wallet' },
    { label: 'Webhook', path: '/webhook' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 font-bold font-mono text-xl tracking-wide text-gray-900">
          MyAPI
        </div>
        <nav className="flex-1 p-3 space-y-1 font-mono text-sm">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-gray-200 text-black font-bold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 font-mono">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            API CONSOLE
          </span>
          <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-bold">
            U
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};