import React from 'react';
import { Moon, Sun, Bell, Volume2, Shield, Database, Trash2, RefreshCcw } from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Configuración</h2>
        <p className="text-gray-500 dark:text-gray-400">Personaliza tu experiencia en wTicketFlow</p>
      </div>

      {/* Apariencia */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Sun size={20} className="text-orange-500" /> Apariencia
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">Modo Oscuro</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cambia entre temas claro y oscuro</p>
          </div>
          <button 
            onClick={onToggleTheme}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${isDarkMode ? 'bg-indigo-600 justify-end' : 'bg-gray-300 justify-start'}`}
          >
            <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
              {isDarkMode ? <Moon size={14} className="text-indigo-600" /> : <Sun size={14} className="text-yellow-500" />}
            </div>
          </button>
        </div>
      </div>

      {/* Notificaciones (Simulated) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm opacity-80">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Bell size={20} className="text-indigo-500" /> Notificaciones (Demo)
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Sonidos del sistema</p>
            </div>
            <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full relative cursor-not-allowed">
               <div className="w-5 h-5 bg-white rounded-full shadow absolute left-0"></div>
            </div>
          </div>
           <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Alertas por Email</p>
            </div>
             <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-not-allowed opacity-50">
               <div className="w-5 h-5 bg-white rounded-full shadow absolute right-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Zona de Peligro */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-900/50 shadow-sm">
        <h3 className="font-bold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
          <Shield size={20} /> Zona de Peligro
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-red-800 dark:text-red-300">Restablecer Aplicación</p>
            <p className="text-xs text-red-600 dark:text-red-400">Borra todos los datos locales (Tickets, Usuarios, Configuración).</p>
          </div>
          <button 
            onClick={() => {
              if(confirm('¿Estás SEGURO? Esto borrará todos tus tickets y usuarios. No se puede deshacer.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} /> Resetear Todo
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-8">
        wTicketFlow Build 2024.10.25 - <span className="font-mono">v1.2.0</span>
      </div>

    </div>
  );
};