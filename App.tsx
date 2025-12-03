import React, { useState, useEffect, useMemo } from 'react';
import { generateId } from './utils/helpers';
import { Layout } from './components/Layout';
import { TicketCard } from './components/TicketCard';
import { TicketForm } from './components/TicketForm';
import { UserManagement } from './components/UserManagement';
import { SubjectManagement } from './components/SubjectManagement';
import { DataManagement } from './components/DataManagement';
import { MyTickets } from './components/MyTickets';
import { Presentation } from './components/Presentation';
import { Settings } from './components/Settings';
import { AboutView } from './components/AboutView';
import { Ticket, TicketStatus, TicketTopic, TicketPriority, FilterState, User, Subject, AppData, Comment } from './types';
import { Filter, Search, Inbox, CheckCircle2, Clock, CalendarDays, Flame, Archive, RotateCcw, X, User as UserIcon, Download, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'history' | 'users' | 'subjects' | 'data' | 'mytickets' | 'presentation' | 'settings' | 'about'>('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('wticketflow_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // AI Feature Flag State (Default: False)
  const [isAiEnabled, setIsAiEnabled] = useState(() => {
    const savedAi = localStorage.getItem('wticketflow_ai_enabled');
    return savedAi ? savedAi === 'true' : false;
  });
  
  // Highlight New Ticket State
  const [highlightedTicketId, setHighlightedTicketId] = useState<string | null>(null);

  // Selected Ticket for Modal View
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // User Session State (Global)
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Persist selected user in session
  useEffect(() => {
    const savedUser = sessionStorage.getItem('ticketflow_my_user');
    if (savedUser) {
        setCurrentUserId(savedUser);
    }
  }, []);

  const handleUserChange = (id: string) => {
    setCurrentUserId(id);
    sessionStorage.setItem('ticketflow_my_user', id);
  };

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    status: 'ALL',
    topic: 'ALL',
    priority: 'ALL',
    search: '',
    dateStart: '',
    dateEnd: ''
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    if (localStorage.getItem('ticketflow_tickets') && !localStorage.getItem('wticketflow_tickets')) {
        localStorage.setItem('wticketflow_tickets', localStorage.getItem('ticketflow_tickets') || '[]');
        localStorage.setItem('wticketflow_users', localStorage.getItem('ticketflow_users') || '[]');
        localStorage.setItem('wticketflow_subjects', localStorage.getItem('ticketflow_subjects') || '[]');
    }

    const savedTickets = localStorage.getItem('wticketflow_tickets');
    const savedUsers = localStorage.getItem('wticketflow_users');
    const savedSubjects = localStorage.getItem('wticketflow_subjects');
    
    if (savedTickets) {
      try { 
        const parsedTickets = JSON.parse(savedTickets);
        let needsUpdate = false;
        const missingNumbers = parsedTickets.some((t: any) => t.number === undefined);
        const missingPriority = parsedTickets.some((t: any) => t.priority === undefined);
        const missingComments = parsedTickets.some((t: any) => t.comments === undefined);
        let processedTickets = parsedTickets;

        if (missingNumbers || missingPriority || missingComments) {
            const sorted = [...parsedTickets].sort((a: any, b: any) => a.createdAt - b.createdAt);
            processedTickets = sorted.map((t: Ticket, index: number) => ({
                ...t,
                number: t.number !== undefined ? t.number : index + 1,
                priority: t.priority || TicketPriority.NORMAL,
                comments: t.comments || []
            }));
            processedTickets.sort((a: Ticket, b: Ticket) => b.createdAt - a.createdAt);
            needsUpdate = true;
        }
        setTickets(processedTickets);
        if (needsUpdate) {
            localStorage.setItem('wticketflow_tickets', JSON.stringify(processedTickets));
        }
      } catch (e) { console.error(e); }
    }
    if (savedUsers) {
      try { setUsers(JSON.parse(savedUsers)); } catch (e) { console.error(e); }
    }
    if (savedSubjects) {
      try { setSubjects(JSON.parse(savedSubjects)); } catch (e) { console.error(e); }
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('wticketflow_tickets', JSON.stringify(tickets));
    localStorage.setItem('wticketflow_users', JSON.stringify(users));
    localStorage.setItem('wticketflow_subjects', JSON.stringify(subjects));
    localStorage.setItem('wticketflow_theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('wticketflow_ai_enabled', String(isAiEnabled));
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [tickets, users, subjects, isDarkMode, isAiEnabled]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (highlightedTicketId) {
      const timer = setTimeout(() => setHighlightedTicketId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedTicketId]);

  // --- Actions ---

  const handleCreateTicket = (data: { title: string; description: string; creatorName: string; creatorId: string; topic: TicketTopic; priority: TicketPriority }) => {
    const maxNumber = tickets.length > 0 
        ? Math.max(...tickets.map(t => t.number || 0)) 
        : 0;
    const nextNumber = maxNumber + 1;

    const newId = generateId();
    const newTicket: Ticket = {
      id: newId,
      number: nextNumber,
      ...data,
      status: TicketStatus.OPEN,
      createdAt: Date.now(),
      comments: []
    };
    setTickets([newTicket, ...tickets]);
    
    setActiveTab('dashboard');
    setHighlightedTicketId(newId);
    setNotification(`Ticket #${nextNumber} creado exitosamente`);
  };

  const handleResolveTicket = (id: string, note?: string) => {
    if (!isAdmin) return;
    setTickets(tickets.map(t => 
      t.id === id ? { ...t, status: TicketStatus.RESOLVED, resolvedAt: Date.now(), resolutionNote: note } : t
    ));
    setNotification("Ticket marcado como resuelto");
    if (selectedTicket?.id === id) setSelectedTicket(null);
  };

  const handleReopenTicket = (id: string) => {
    if (!isAdmin) return;
    setTickets(tickets.map(t =>
      t.id === id ? { ...t, status: TicketStatus.OPEN, resolvedAt: undefined, resolutionNote: undefined } : t
    ));
    setNotification("Ticket reabierto");
    if (selectedTicket?.id === id) setSelectedTicket(null);
  };

  const handleAddComment = (ticketId: string, text: string) => {
    let authorName = "Admin";
    if (!isAdmin) {
        const myUserId = sessionStorage.getItem('ticketflow_my_user');
        if (myUserId) {
            const u = users.find(user => user.id === myUserId);
            if (u) authorName = u.name;
        } else {
            authorName = "Usuario";
        }
    }

    const newComment: Comment = {
        id: generateId(),
        text,
        authorName,
        isAdmin,
        createdAt: Date.now()
    };

    const updatedTickets = tickets.map(t => {
        if (t.id === ticketId) {
            return { ...t, comments: [...(t.comments || []), newComment] };
        }
        return t;
    });

    setTickets(updatedTickets);

    if (selectedTicket?.id === ticketId) {
        setSelectedTicket({
            ...selectedTicket,
            comments: [...(selectedTicket.comments || []), newComment]
        });
    }
  };

  const handleAddUser = (name: string) => {
    const newUser: User = { id: generateId(), name };
    setUsers([...users, newUser]);
    setNotification(`Usuario ${name} añadido`);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    setNotification("Usuario eliminado");
  };

  const handleAddSubject = (title: string) => {
    const newSubject: Subject = { id: generateId(), title };
    setSubjects([...subjects, newSubject]);
    setNotification(`Asunto "${title}" añadido`);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setNotification("Asunto eliminado");
  };

  const handleImportData = (data: AppData) => {
    let processedTickets = data.tickets;
    const needsFix = processedTickets.some(t => t.number === undefined || t.priority === undefined || t.comments === undefined);
    
    if (needsFix) {
       const sorted = [...processedTickets].sort((a, b) => a.createdAt - b.createdAt);
       processedTickets = sorted.map((t: Ticket, index: number) => ({
           ...t,
           number: t.number !== undefined ? t.number : index + 1,
           priority: t.priority || TicketPriority.NORMAL,
           comments: t.comments || []
       }));
       processedTickets.sort((a, b) => b.createdAt - a.createdAt);
    }

    setTickets(processedTickets);
    setUsers(data.users);
    setSubjects(data.subjects);
    setNotification("Datos restaurados correctamente");
    setActiveTab('dashboard');
  };

  const handleExportCSV = () => {
    if (tickets.length === 0) {
        setNotification("No hay datos para exportar");
        return;
    }

    const headers = ["ID", "Numero", "Titulo", "Prioridad", "Estado", "Creador", "Tema", "Fecha Creacion", "Fecha Resolucion", "Nota Resolucion", "Descripcion", "Comentarios (Conteo)"];
    const rows = tickets.map(t => [
        t.id,
        t.number,
        `"${t.title.replace(/"/g, '""')}"`,
        t.priority,
        t.status,
        t.creatorName,
        t.topic,
        new Date(t.createdAt).toLocaleString(),
        t.resolvedAt ? new Date(t.resolvedAt).toLocaleString() : "",
        `"${(t.resolutionNote || "").replace(/"/g, '""')}"`,
        `"${t.description.replace(/"/g, '""')}"`,
        t.comments?.length || 0
    ]);

    const csvContent = [
        headers.join(","), 
        ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tickets_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleAi = () => {
    const newState = !isAiEnabled;
    setIsAiEnabled(newState);
    if (newState) {
      setNotification("✨ IA Activada: Categorización automática y respuestas inteligentes habilitadas.");
    } else {
      setNotification("Funcionalidades de IA desactivadas.");
    }
  };

  // --- Filtering & Stats ---
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesStatus = filters.status === 'ALL' || ticket.status === filters.status;
      const matchesTopic = filters.topic === 'ALL' || ticket.topic === filters.topic;
      const matchesPriority = filters.priority === 'ALL' || ticket.priority === filters.priority;
      const matchesSearch = ticket.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                            ticket.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                            ticket.creatorName.toLowerCase().includes(filters.search.toLowerCase());
      
      let matchesDate = true;
      if (filters.dateStart) {
        matchesDate = matchesDate && ticket.createdAt >= new Date(filters.dateStart).getTime();
      }
      if (filters.dateEnd) {
        const endDate = new Date(filters.dateEnd);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && ticket.createdAt <= endDate.getTime();
      }
      return matchesStatus && matchesTopic && matchesPriority && matchesSearch && matchesDate;
    });
  }, [tickets, filters]);

  const stats = useMemo(() => {
    return {
      open: tickets.filter(t => t.status === TicketStatus.OPEN).length,
      resolved: tickets.filter(t => t.status === TicketStatus.RESOLVED).length,
      urgent: tickets.filter(t => t.priority === TicketPriority.URGENT && t.status === TicketStatus.OPEN).length,
    };
  }, [tickets]);

  // --- Rendering ---
  if (activeTab === 'presentation') {
      return <Presentation onExit={() => setActiveTab('dashboard')} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return (
          <TicketForm 
            users={users} 
            subjects={subjects}
            isAiEnabled={isAiEnabled}
            onSubmit={handleCreateTicket} 
            onCancel={() => setActiveTab('dashboard')}
            onNavigateToUsers={() => setActiveTab('users')}
            onNavigateToSubjects={() => setActiveTab('subjects')}
          />
        );
      case 'users':
        return <UserManagement users={users} onAddUser={handleAddUser} onDeleteUser={handleDeleteUser} />;
      case 'subjects':
        return <SubjectManagement subjects={subjects} onAddSubject={handleAddSubject} onDeleteSubject={handleDeleteSubject} />;
      case 'data':
        return <DataManagement data={{ tickets, users, subjects }} onImport={handleImportData} />;
      case 'settings':
        return <Settings isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} isAiEnabled={isAiEnabled} onToggleAi={handleToggleAi} />;
      case 'about':
        return <AboutView />;
      case 'history':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
               <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Clock className="text-indigo-600 dark:text-indigo-400" /> Historial Completo
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total: {filteredTickets.length} tickets</p>
               </div>
               <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-sm font-medium">
                 <Download size={16} /> Exportar CSV
               </button>
             </div>
             <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white" value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} />
                </div>
                <select className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white" value={filters.topic} onChange={(e) => setFilters({...filters, topic: e.target.value as any})}>
                  <option value="ALL">Todos los temas</option>
                  {Object.values(TicketTopic).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white" value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value as any})}>
                  <option value="ALL">Todas las prioridades</option>
                  {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value as any})}>
                  <option value="ALL">Todos los estados</option>
                  <option value={TicketStatus.OPEN}>Abiertos</option>
                  <option value={TicketStatus.RESOLVED}>Resueltos</option>
                </select>
             </div>
             <div className="space-y-4">
               {filteredTickets.map(ticket => (
                 <TicketCard 
                   key={ticket.id} 
                   ticket={ticket} 
                   isAdmin={isAdmin} 
                   isAiEnabled={isAiEnabled}
                   onResolve={handleResolveTicket}
                   onReopen={handleReopenTicket}
                   onAddComment={handleAddComment}
                   defaultExpanded={false}
                 />
               ))}
               {filteredTickets.length === 0 && (
                 <div className="text-center py-12 text-gray-400">No se encontraron tickets con los filtros actuales.</div>
               )}
             </div>
          </div>
        );

      case 'dashboard':
      default:
        if (!isAdmin) {
            return (
                <MyTickets 
                    tickets={tickets} 
                    users={users} 
                    isAdmin={isAdmin} 
                    isAiEnabled={isAiEnabled}
                    onResolve={handleResolveTicket}
                    onReopen={handleReopenTicket}
                    onAddComment={handleAddComment}
                />
            );
        }
        const openTickets = tickets.filter(t => t.status === TicketStatus.OPEN).sort((a, b) => b.createdAt - a.createdAt);
        const resolvedTickets = tickets.filter(t => t.status === TicketStatus.RESOLVED).sort((a, b) => (b.resolvedAt || 0) - (a.resolvedAt || 0));

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between group hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                <div><p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pendientes</p><p className="text-3xl font-bold text-amber-600 dark:text-amber-500">{stats.open}</p></div>
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full text-amber-600 dark:text-amber-500 group-hover:rotate-12 transition-transform"><Flame size={24} /></div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between group hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                <div><p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Urgentes</p><p className="text-3xl font-bold text-red-600 dark:text-red-500">{stats.urgent}</p></div>
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600 dark:text-red-500 group-hover:scale-110 transition-transform"><Clock size={24} /></div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between group hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                <div><p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Resueltos</p><p className="text-3xl font-bold text-green-600 dark:text-green-500">{stats.resolved}</p></div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-500 group-hover:rotate-12 transition-transform"><CheckCircle2 size={24} /></div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
               <div className="flex-1 w-full space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2"><Inbox className="text-amber-600" size={20} /> Pendientes de Atención</h3>
                  {openTickets.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700 border-dashed">
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} /></div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">¡Todo listo!</h3><p className="text-gray-500 dark:text-gray-400">No hay tickets pendientes por resolver.</p>
                    </div>
                  ) : (
                    openTickets.map(ticket => (
                      <TicketCard 
                        key={ticket.id} 
                        ticket={ticket} 
                        isAdmin={isAdmin} 
                        isAiEnabled={isAiEnabled}
                        isHighlighted={highlightedTicketId === ticket.id}
                        onResolve={handleResolveTicket}
                        onReopen={handleReopenTicket}
                        onAddComment={handleAddComment}
                      />
                    ))
                  )}
               </div>
               <div className="w-full lg:w-80 shrink-0">
                  <div className="bg-gray-100 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 sticky top-20">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Archive size={16} /> Resueltos Recientes</h3>
                    <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-1">
                      {resolvedTickets.length === 0 && <p className="text-xs text-gray-400 italic">No hay tickets resueltos.</p>}
                      {resolvedTickets.map(ticket => (
                        <div key={ticket.id} className="group bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer relative" onClick={() => setSelectedTicket(ticket)} title="Click para ver detalles">
                          <div className="flex justify-between items-start mb-1"><span className="text-[10px] font-bold text-gray-400">#{ticket.number}</span><span className="text-[10px] text-gray-400 flex items-center gap-1">{ticket.resolvedAt && new Date(ticket.resolvedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></div>
                          <div className="flex items-center gap-2 mb-1">
                             <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 text-[10px] font-bold">{ticket.creatorName.charAt(0)}</div>
                             <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 line-through decoration-gray-400 opacity-80 truncate">{ticket.title}</p>
                          </div>
                          <p className="text--[10px] text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">{ticket.description}</p>
                          {isAdmin && (
                            <button onClick={(e) => { e.stopPropagation(); handleReopenTicket(ticket.id); }} className="absolute right-2 bottom-2 p-1.5 bg-amber-100 text-amber-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-200" title="Reabrir ticket rápidamente"><RotateCcw size={14} /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      isAdmin={isAdmin}
      onToggleAdmin={() => setIsAdmin(!isAdmin)}
      isDarkMode={isDarkMode}
      onToggleTheme={() => setIsDarkMode(!isDarkMode)}
    >
      {renderContent()}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-gray-800 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/30">
                 <h3 className="font-bold text-gray-700 dark:text-white flex items-center gap-2">Vista Detallada <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300">#{selectedTicket.number}</span></h3>
                 <button onClick={() => setSelectedTicket(null)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors" title="Cerrar ventana"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                 <TicketCard 
                    ticket={selectedTicket} 
                    isAdmin={isAdmin} 
                    isAiEnabled={isAiEnabled}
                    onResolve={handleResolveTicket}
                    onReopen={handleReopenTicket}
                    onAddComment={handleAddComment}
                    defaultExpanded={true}
                 />
              </div>
           </div>
        </div>
      )}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-50 max-w-md border border-gray-800 dark:border-gray-200">
          <div className="p-1 bg-green-500/20 rounded-full shrink-0">
             {notification.includes('IA') ? <Sparkles size={20} className="text-purple-400 dark:text-purple-600" /> : <CheckCircle2 size={20} className="text-green-400 dark:text-green-600" />}
          </div>
          <span className="font-medium text-sm leading-snug">{notification}</span>
        </div>
      )}
    </Layout>
  );
};

export default App;