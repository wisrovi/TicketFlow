import React from 'react';
import { LayoutDashboard, PlusCircle, History, Users, Database, UserCircle, Tag, Sun, Moon, Lock, Unlock, UserCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'create' | 'history' | 'users' | 'subjects' | 'data' | 'mytickets';
  onTabChange: (tab: 'dashboard' | 'create' | 'history' | 'users' | 'subjects' | 'data' | 'mytickets') => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange,
  isAdmin,
  onToggleAdmin,
  isDarkMode,
  onToggleTheme
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mytickets', label: 'Mis Tickets', icon: UserCheck },
    { id: 'create', label: 'Nuevo Ticket', icon: PlusCircle },
    { id: 'history', label: 'Historial Global', icon: History },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'subjects', label: 'Temas/Asuntos', icon: Tag },
    { id: 'data', label: 'Datos / Backup', icon: Database },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col md:flex-row text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="bg-white dark:bg-gray-800 w-full md:w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-sm fixed md:relative z-20 h-16 md:h-auto bottom-0 md:bottom-auto transition-colors duration-300">
        <div className="p-6 hidden md:flex items-center gap-2 border-b border-gray-100 dark:border-gray-700">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200 dark:shadow-none">
            wT
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">wTicketFlow</span>
        </div>

        <nav className="flex-1 p-2 md:p-4 flex md:flex-col justify-between md:justify-start gap-1 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                activeTab === item.id 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Section: Theme & Profile */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 hidden md:block space-y-3">
          {/* Theme Toggle */}
          <button 
            onClick={onToggleTheme}
            title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>

          {/* User Profile / Admin Switch */}
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${isAdmin ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'}`}>
            <div className={`p-1.5 rounded-full ${isAdmin ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
               {isAdmin ? <Lock size={20} /> : <UserCircle size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {isAdmin ? "Admin" : "Usuario"}
              </p>
              <button 
                onClick={onToggleAdmin}
                title={isAdmin ? 'Salir del modo Administrador' : 'Activar permisos de Administrador'}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                {isAdmin ? 'Salir Admin' : 'Entrar Admin'}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white dark:bg-gray-800 h-16 border-b border-gray-200 dark:border-gray-700 flex md:hidden items-center justify-between px-4 sticky top-0 z-10 transition-colors duration-300">
           <div className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
             <div className="w-6 h-6 bg-indigo-600 rounded text-white flex items-center justify-center text-xs">wT</div>
             wTicketFlow
           </div>
           <div className="flex items-center gap-2">
             <button 
               onClick={onToggleTheme} 
               title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
               className="p-2 text-gray-600 dark:text-gray-300"
             >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>
             <button 
              onClick={onToggleAdmin} 
              title={isAdmin ? 'Salir del modo Administrador' : 'Activar permisos de Administrador'}
              className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 transition-colors ${isAdmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
             >
               {isAdmin ? <Unlock size={12} /> : <Lock size={12} />}
               {isAdmin ? 'Admin' : 'Acceso'}
             </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};