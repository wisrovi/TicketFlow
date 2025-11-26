import React, { useState } from 'react';
import { User } from '../types';
import { Plus, Trash2, UserCircle } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (name: string) => void;
  onDeleteUser: (id: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onDeleteUser }) => {
  const [newName, setNewName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddUser(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Registro de Usuarios</h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            placeholder="Nombre del usuario (ej. Carlos Garcia)"
            className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newName.trim()}
            title="Añadir usuario a la lista"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Añadir
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Usuarios Registrados ({users.length})</h3>
        </div>
        
        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No hay usuarios registrados aún.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {users.map((user) => (
              <li key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <UserCircle size={20} />
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                </div>
                <button
                  onClick={() => onDeleteUser(user.id)}
                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Eliminar usuario"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};