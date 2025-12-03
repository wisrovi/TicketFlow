import React, { useState, useMemo, useEffect } from 'react';
import { Ticket, User, TicketStatus } from '../types';
import { TicketCard } from './TicketCard';
import { User as UserIcon, Inbox, CheckCircle2, Search } from 'lucide-react';

interface MyTicketsProps {
  tickets: Ticket[];
  users: User[];
  isAdmin: boolean;
  isAiEnabled: boolean;
  onResolve: (id: string) => void;
  onReopen: (id: string) => void;
  onAddComment: (ticketId: string, text: string) => void;
}

export const MyTickets: React.FC<MyTicketsProps> = ({ tickets, users, isAdmin, isAiEnabled, onResolve, onReopen, onAddComment }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Persist selected user in session for convenience
  useEffect(() => {
    const savedUser = sessionStorage.getItem('ticketflow_my_user');
    if (savedUser && users.some(u => u.id === savedUser)) {
      setSelectedUserId(savedUser);
    }
  }, [users]);

  const handleUserChange = (id: string) => {
    setSelectedUserId(id);
    sessionStorage.setItem('ticketflow_my_user', id);
  };

  const userTickets = useMemo(() => {
    if (!selectedUserId) return [];
    return tickets
      .filter(t => t.creatorId === selectedUserId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [tickets, selectedUserId]);

  const stats = useMemo(() => {
    return {
      total: userTickets.length,
      open: userTickets.filter(t => t.status === TicketStatus.OPEN).length,
      resolved: userTickets.filter(t => t.status === TicketStatus.RESOLVED).length,
    };
  }, [userTickets]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl text-indigo-600 dark:text-indigo-400">
              <UserIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Mis Tickets</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Selecciona tu usuario para ver tu historial</p>
            </div>
          </div>

          <div className="w-full md:w-72">
            <select
              value={selectedUserId}
              onChange={(e) => handleUserChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
            >
              <option value="" disabled>Selecciona quién eres...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedUserId && (
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
             <div className="text-center">
               <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Total</p>
               <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
             </div>
             <div className="text-center border-l border-gray-100 dark:border-gray-700">
               <p className="text-xs font-medium text-amber-600 dark:text-amber-500 uppercase tracking-wide mb-1">Pendientes</p>
               <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">{stats.open}</p>
             </div>
             <div className="text-center border-l border-gray-100 dark:border-gray-700">
               <p className="text-xs font-medium text-green-600 dark:text-green-500 uppercase tracking-wide mb-1">Resueltos</p>
               <p className="text-2xl font-bold text-green-600 dark:text-green-500">{stats.resolved}</p>
             </div>
          </div>
        )}
      </div>

      {!selectedUserId ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed transition-colors">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-500">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Identifícate por favor</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2">
            Selecciona tu nombre en el menú desplegable de arriba para ver el estado de tus solicitudes enviadas.
          </p>
        </div>
      ) : userTickets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {userTickets.map(ticket => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              isAdmin={isAdmin} 
              isAiEnabled={isAiEnabled}
              onResolve={onResolve}
              onReopen={onReopen}
              onAddComment={onAddComment}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed transition-colors">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <Inbox size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">No tienes tickets</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Aún no has enviado ninguna solicitud. ¡Estás al día!
          </p>
        </div>
      )}
    </div>
  );
};