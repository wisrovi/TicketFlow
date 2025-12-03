import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, History, Users, Database, UserCircle, Tag, Sun, Moon, Lock, UserCheck, Menu, HelpCircle, Heart, ChevronLeft, ChevronRight, Settings as SettingsIcon, Sparkles, MonitorPlay } from 'lucide-react';
import { AboutModal } from './AboutModal';
import { HelpModal } from './HelpModal';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'create' | 'history' | 'users' | 'subjects' | 'data' | 'mytickets' | 'presentation' | 'settings' | 'about';
  onTabChange: (tab: 'dashboard' | 'create' | 'history' | 'users' | 'subjects' | 'data' | 'mytickets' | 'presentation' | 'settings' | 'about') => void;
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
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Mobile state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapsed state
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);

  // Define nav items (Presentation removed from main list to move to bottom)
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['all'] },
    { id: 'create', label: 'Nuevo Ticket', icon: PlusCircle, roles: ['all'] },
    { id: 'history', label: 'Historial', icon: History, roles: ['admin'] },
    { id: 'users', label: 'Usuarios', icon: Users, roles: ['admin'] },
    { id: 'subjects', label: 'Asuntos', icon: Tag, roles: ['admin'] },
    { id: 'data', label: 'Datos / Backup', icon: Database, roles: ['admin'] },
    { id: 'settings', label: 'Configuración', icon: SettingsIcon, roles: ['all'] },
    { id: 'about', label: 'Acerca de', icon: Heart, roles: ['all'] },
  ] as const;

  // Filter items based on current role
  const navItems = allNavItems.filter(item => {
    const roles = item.roles as readonly string[];
    if (roles.includes('all')) return true;
    if (isAdmin && roles.includes('admin')) return true;
    if (!isAdmin && roles.includes('user')) return true;
    return false;
  });

  const toggleSidebar = () => {
    // On mobile toggle open/close, on desktop toggle collapse/expand
    if (window.innerWidth < 768) {
      setSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl md:shadow-none transition-all duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative 
        ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo Area (Clickable to Toggle) */}
        <div 
          onClick={toggleSidebar}
          className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6 gap-3'} border-b border-gray-100 dark:border-gray-700 transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 group`}
          title="Click para ocultar/mostrar menú lateral"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200 dark:shadow-none shrink-0 group-hover:scale-110 transition-transform">
            wT
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight animate-in fade-in duration-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">wTicketFlow</span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider transition-opacity duration-200">
              Menu Principal
            </div>
          )}
          
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id as any);
                setSidebarOpen(false);
              }}
              title={isCollapsed ? item.label : ''}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                activeTab === item.id 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon size={20} className={`shrink-0 ${activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
              
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
              
              {/* Active Indicator Strip */}
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-2">
            
            {/* Presentation Mode Button (Prominent) */}
            <button
              onClick={() => {
                onTabChange('presentation');
                setSidebarOpen(false);
              }}
              title={isCollapsed ? "Modo Presentación" : ""}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:shadow-lg hover:shadow-indigo-500/20 group ${isCollapsed ? 'justify-center' : ''}`}
            >
               <MonitorPlay size={20} className="shrink-0 text-indigo-400 group-hover:text-white transition-colors" />
               {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm">Presentación</span>
                    <span className="text-[10px] text-gray-400">Ver Demo Pantalla Completa</span>
                  </div>
               )}
            </button>

             {/* Collapse Button (Desktop Only) */}
             <button
               onClick={() => setIsCollapsed(!isCollapsed)}
               className="hidden md:flex items-center justify-center p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-2"
               title={isCollapsed ? "Expandir menú" : "Contraer menú"}
             >
               {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
             </button>

             {!isCollapsed && (
               <button 
                 onClick={() => setAboutOpen(true)}
                 className="text-xs text-gray-400 hover:text-indigo-500 transition-colors flex items-center gap-1.5 px-2 justify-center md:justify-start mt-1"
               >
                 <Heart size={12} className="shrink-0" />
                 <span className="truncate">Versión 1.2.0</span>
               </button>
             )}
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* --- TOP HEADER (Sticky) --- */}
        <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8 z-20 sticky top-0">
          
          {/* Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-gray-600 dark:text-gray-300 md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white hidden md:block capitalize">
              {allNavItems.find(n => n.id === activeTab)?.label || (activeTab === 'presentation' ? 'Presentación' : 'Dashboard')}
            </h1>
          </div>

          {/* Right Actions: Admin, Theme, User */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Admin Switch */}
            <div className="flex items-center mr-2">
               <label className="relative inline-flex items-center cursor-pointer group" title="Alternar entre vista de Administrador y Usuario">
                <input type="checkbox" className="sr-only peer" checked={isAdmin} onChange={onToggleAdmin} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                <span className={`ml-2 text-sm font-medium transition-colors hidden lg:block ${isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>
                  {isAdmin ? 'Modo Admin' : 'Modo Usuario'}
                </span>
              </label>
            </div>

            {/* Help Button */}
            <button 
              onClick={() => setHelpOpen(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-all"
              title="Ayuda / Instrucciones"
            >
              <HelpCircle size={20} />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={onToggleTheme}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
              title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Profile Trigger */}
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>
            
            <button
              onClick={() => setAboutOpen(true)}
              className="flex items-center gap-2 pl-2 md:pl-4 focus:outline-none group"
              title="Ver perfil del autor"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {isAdmin ? 'Administrador' : 'Invitado'}
                </p>
                <p className="text-[10px] text-gray-400">Ver Perfil</p>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${isAdmin ? 'bg-purple-100 border-purple-200 dark:bg-purple-900 dark:border-purple-800 text-purple-600 dark:text-purple-300' : 'bg-gray-100 border-gray-200 dark:bg-gray-700 dark:border-gray-600 text-gray-500'}`}>
                {isAdmin ? <Lock size={16} /> : <UserCircle size={20} />}
              </div>
            </button>
          </div>
        </header>

        {/* --- SCROLLABLE CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative">
          <div className="max-w-6xl mx-auto w-full min-h-[calc(100vh-12rem)]">
            {children}
          </div>

          {/* --- FOOTER (Integrated) --- */}
          <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700/50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
               <div className="flex items-center gap-2">
                 <span className="font-semibold text-gray-700 dark:text-gray-300">wTicketFlow</span>
                 <span>&copy; {new Date().getFullYear()}</span>
               </div>
               
               <div className="flex items-center gap-6">
                 <button onClick={() => setAboutOpen(true)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                   Acerca del autor
                 </button>
                 <button onClick={() => setHelpOpen(true)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                   Ayuda
                 </button>
               </div>

               <div className="flex items-center gap-1 text-xs opacity-70">
                 <span>Desarrollado con</span>
                 <Heart size={10} className="text-red-500 fill-current" />
                 <span>por <a href="https://es.linkedin.com/in/wisrovi-rodriguez" target="_blank" rel="noreferrer" className="hover:underline">Wisrovi</a></span>
               </div>
            </div>
          </footer>
        </main>
      </div>

      {/* --- OVERLAY FOR MOBILE SIDEBAR --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- MODALS --- */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setAboutOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
};