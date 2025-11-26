import React, { useState, useEffect } from 'react';
import { TicketTopic, TicketPriority, User, Subject } from '../types';
import { categorizeTicket } from '../services/geminiService';
import { Send, Sparkles, Loader2, UserPlus, Tag, AlertTriangle } from 'lucide-react';

interface TicketFormProps {
  users: User[];
  subjects: Subject[];
  onSubmit: (data: { title: string; description: string; creatorName: string; creatorId: string; topic: TicketTopic; priority: TicketPriority }) => void;
  onCancel: () => void;
  onNavigateToUsers: () => void;
  onNavigateToSubjects: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ 
  users, 
  subjects,
  onSubmit, 
  onCancel, 
  onNavigateToUsers,
  onNavigateToSubjects
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [topic, setTopic] = useState<TicketTopic>(TicketTopic.OTRO);
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.NORMAL);
  const [isAutoCategorizing, setIsAutoCategorizing] = useState(false);

  // Debounce logic to auto-categorize when description changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (description.length > 10) {
        setIsAutoCategorizing(true);
        const suggestedTopic = await categorizeTicket(description);
        setTopic(suggestedTopic);
        setIsAutoCategorizing(false);
      }
    }, 1500); // 1.5s delay after typing stops

    return () => clearTimeout(timer);
  }, [description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !description || !selectedUserId) return;

    const user = users.find(u => u.id === selectedUserId);
    const subject = subjects.find(s => s.id === selectedSubjectId);
    
    if (!user || !subject) return;

    onSubmit({ 
      title: subject.title, 
      description, 
      creatorName: user.name, 
      creatorId: user.id, 
      topic,
      priority
    });
  };

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto text-center transition-colors">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
          <UserPlus size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No hay usuarios registrados</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Para crear un ticket, primero debes registrar al menos un usuario en el sistema.</p>
        <button
          onClick={onNavigateToUsers}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Ir a Registro de Usuarios
        </button>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto text-center transition-colors">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
          <Tag size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No hay asuntos registrados</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Para crear un ticket, debes definir primero los asuntos disponibles.</p>
        <button
          onClick={onNavigateToSubjects}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
        >
          Ir a Registro de Asuntos
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 max-w-2xl mx-auto transition-colors">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Crear Solicitud</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Describe tu problema y se notificará al administrador.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: User & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Usuario Solicitante</label>
            <select
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 outline-none transition-all cursor-pointer"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="" disabled>Seleccionar un usuario...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prioridad</label>
            <select
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 outline-none transition-all cursor-pointer"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
            >
              <option value={TicketPriority.LOW}>Baja (Informativo)</option>
              <option value={TicketPriority.NORMAL}>Normal</option>
              <option value={TicketPriority.HIGH}>Alta (Impide trabajar)</option>
              <option value={TicketPriority.URGENT}>URGENTE (Crítico)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Asunto</label>
          <select
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 outline-none transition-all cursor-pointer"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            <option value="" disabled>Seleccionar un asunto...</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between">
            Descripción Detallada
            {isAutoCategorizing && (
              <span className="text-indigo-500 dark:text-indigo-400 flex items-center gap-1 text-xs animate-pulse">
                <Sparkles size={12} /> Analizando con AI...
              </span>
            )}
          </label>
          <textarea
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all resize-none"
            placeholder="Describe qué pasó, cuándo ocurrió, etc..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría (Auto-detectada)</label>
          <div className="relative">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value as TicketTopic)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
            >
              {Object.values(TicketTopic).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {isAutoCategorizing ? (
               <div className="absolute right-3 top-3.5 text-indigo-500 dark:text-indigo-400">
                  <Loader2 size={18} className="animate-spin" />
               </div>
            ) : (
              <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400 dark:text-gray-500">
                <Sparkles size={18} className={description.length > 10 ? "text-indigo-400 dark:text-indigo-500" : "text-gray-300 dark:text-gray-600"} />
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none transition-all flex justify-center items-center gap-2"
          >
            <Send size={18} />
            Enviar Ticket
          </button>
        </div>
      </form>
    </div>
  );
};