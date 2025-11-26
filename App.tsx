
import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Layout } from './components/Layout';
import { TicketCard } from './components/TicketCard';
import { TicketForm } from './components/TicketForm';
import { UserManagement } from './components/UserManagement';
import { SubjectManagement } from './components/SubjectManagement';
import { DataManagement } from './components/DataManagement';
import { MyTickets } from './components/MyTickets';
import { Ticket, TicketStatus, TicketTopic, TicketPriority, FilterState, User, Subject, AppData, Comment } from './types';
import { Filter, Search, Inbox, CheckCircle2, Clock, CalendarDays, Flame, Archive, RotateCcw, X, User as UserIcon, Download } from 'lucide-react';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'history' | 'users' | 'subjects' | 'data' | 'mytickets'>('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Highlight New Ticket State
  const [highlightedTicketId, setHighlightedTicketId] = useState<string | null>(null);

  // Selected Ticket for Modal View
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

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
    // Migration Logic: Check if old 'ticketflow_' keys exist, if so, migrate to 'wticketflow_'
    if (localStorage.getItem('ticketflow_tickets') && !localStorage.getItem('wticketflow_tickets')) {
        localStorage.setItem('wticketflow_tickets', localStorage.getItem('ticketflow_tickets') || '[]');
        localStorage.setItem('wticketflow_users', localStorage.getItem('ticketflow_users') || '[]');
        localStorage.setItem('wticketflow_subjects', localStorage.getItem('ticketflow_subjects') || '[]');
        localStorage.setItem('wticketflow_theme', localStorage.getItem('ticketflow_theme') || 'light');
    }

    const savedTickets = localStorage.getItem('wticketflow_tickets');
    const savedUsers = localStorage.getItem('wticketflow_users');
    const savedSubjects = localStorage.getItem('wticketflow_subjects');
    const savedTheme = localStorage.getItem('wticketflow_theme');
    
    if (savedTickets) {
      try { 
        const parsedTickets = JSON.parse(savedTickets);
        // Migration & Validation
        let needsUpdate = false;
        
        // 1. Assign sequential numbers if missing
        const missingNumbers = parsedTickets.some((t: any) => t.number === undefined);
        // 2. Assign default priority if missing
        const missingPriority = parsedTickets.some((t: any) => t.priority === undefined);
        // 3. Assign empty comments array if missing
        const missingComments = parsedTickets.some((t: any) => t.comments === undefined);

        let processedTickets = parsedTickets;

        if (missingNumbers || missingPriority || missingComments) {
            const sorted = [...parsedTickets].sort((a: any, b: any) => a.createdAt - b.createdAt);
            processedTickets = sorted.map((t, index) => ({
                ...t,
                number: t.number !== undefined ? t.number : index + 1,
                priority: t.priority || TicketPriority.NORMAL,
                comments: t.comments || []
            }));
            // Sort back to match original display preference (Newest first)
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
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('wticketflow_tickets', JSON.stringify(tickets));
    localStorage.setItem('wticketflow_users', JSON.stringify(users));
    localStorage.setItem('wticketflow_subjects', JSON.stringify(subjects));
    localStorage.setItem('wticketflow_theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [tickets, users, subjects, isDarkMode]);

  // Toast Notification Logic
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Clear highlight after 3 seconds
  useEffect(() => {
    if (highlightedTicketId) {
      const timer = setTimeout(() => setHighlightedTicketId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedTicketId]);

  // --- Actions ---

  const handleCreateTicket = (data: { title: string; description: string; creatorName: string; creatorId: string; topic: TicketTopic; priority: TicketPriority }) => {
    // Calculate next ticket number
    const maxNumber = tickets.length > 0 
        ? Math.max(...tickets.map(t => t.number || 0)) 
        : 0;
    const nextNumber = maxNumber + 1;

    const newId = uuidv4();
    const newTicket: Ticket = {
      id: newId,
      number: nextNumber,
      ...data,
      status: TicketStatus.OPEN,
      createdAt: Date.now(),
      comments: []
    };
    setTickets([newTicket, ...tickets]);
    
    // Switch to dashboard and highlight the new ticket
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
    // If resolved from modal, close modal
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
    // Determine author
    let authorName = "Admin";
    if (!isAdmin) {
        // If not admin, try to get user from session (MyTickets logic)
        const myUserId = sessionStorage.getItem('ticketflow_my_user');
        if (myUserId) {
            const u = users.find(user => user.id === myUserId);
            if (u) authorName = u.name;
        } else {
            authorName = "Usuario";
        }
    }

    const newComment: Comment = {
        id: uuidv4(),
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

    // Update selected ticket reference to show new comment immediately in modal
    if (selectedTicket?.id === ticketId) {
        setSelectedTicket({
            ...selectedTicket,
            comments: [...(selectedTicket.comments || []), newComment]
        });
    }
  };

  const handleAddUser = (name: string) => {
    const newUser: User = { id: uuidv4(), name };
    setUsers([...users, newUser]);
    setNotification(`Usuario ${name} añadido`);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    setNotification("Usuario eliminado");
  };

  const handleAddSubject = (title: string) => {
    const newSubject: Subject = { id: uuidv4(), title };
    setSubjects([...subjects, newSubject]);
    setNotification(`Asunto "${title}" añadido`);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setNotification("Asunto eliminado");
  };

  const handleImportData = (data: AppData) => {
    // Ensure imported tickets have numbers & priority & comments
    let processedTickets = data.tickets;
    const needsFix = processedTickets.some(t => t.number === undefined || t.priority === undefined || t.comments === undefined);
    
    if (needsFix) {
       const sorted = [...processedTickets].sort((a, b) => a.createdAt - b.createdAt);
       processedTickets = sorted.map((t, index) => ({
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
        `"${t.title.replace(/"/g, '""')}"`, // Escape quotes
        t.priority,
        t.status,
        t.creatorName,
        t.topic,
        new Date(t.createdAt).toLocaleString(),
        t.resolvedAt ? new Date(t.resolvedAt).toLocaleString() : "",
        t.resolutionNote ? `"${t.resolutionNote.replace(/"/g, '""')}"` : "",
        `"${t.description.replace(/"/g, '""')}"`,
        t.comments ? t.comments.length : 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wTicketFlow_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Filter Logic ---

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      let matchStatus = true;
      if (activeTab === 'history' || filters.status !== 'ALL') {
         matchStatus = filters.status === 'ALL' || t.status === filters.status;
      }

      const matchTopic = filters.topic === 'ALL' || t.topic === filters.topic;
      const matchPriority = filters.priority === 'ALL' || t.priority === filters.priority;
      const matchSearch = t.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                          t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                          t.creatorName.toLowerCase().includes(filters.search.toLowerCase());
      
      let matchDate = true;
      if (filters.dateStart) {
        matchDate = matchDate && t.createdAt >= new Date(filters.dateStart).getTime();
      }
      if (filters.dateEnd) {
        const endDate = new Date(filters.dateEnd);
        endDate.setHours(23, 59, 59, 999);
        matchDate = matchDate && t.createdAt <= endDate.getTime();
      }

      return matchStatus && matchTopic && matchPriority && matchSearch && matchDate;
    });
  }, [tickets, filters, activeTab]);

  // Derived lists for Dashboard
  const openTickets = useMemo(() => filteredTickets.filter(t => t.status === TicketStatus.OPEN), [filteredTickets]);
  const resolvedTickets = useMemo(() => filteredTickets.filter(t => t.status === TicketStatus.RESOLVED), [filteredTickets]);

  // --- Stats ---
  
  const stats = useMemo(() => {
    return {
      open: tickets.filter(t => t.status === TicketStatus.OPEN).length,
      resolved: tickets.filter(t => t.status === TicketStatus.RESOLVED).length,
      urgent: tickets.filter(t => t.priority === TicketPriority.URGENT && t.status === TicketStatus.OPEN).length
    };
  }, [tickets]);

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      isAdmin={isAdmin}
      onToggleAdmin={() => setIsAdmin(!isAdmin)}
      isDarkMode={isDarkMode}
      onToggleTheme={() => setIsDarkMode(!isDarkMode)}
    >
      {/* Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-right-5 duration-300">
          <CheckCircle2 size={20} className="text-green-400" />
          {notification}
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl animate-in zoom-in-95 duration-200 relative">
             <button 
                onClick={() => setSelectedTicket(null)}
                className="absolute -top-12 right-0 md:-right-12 text-white hover:text-gray-200 transition-colors bg-white/10 p-2 rounded-full"
                title="Cerrar ventana"
             >
               <X size={24} />
             </button>
             <TicketCard 
                ticket={selectedTicket}
                isAdmin={isAdmin}
                onResolve={handleResolveTicket}
                onReopen={handleReopenTicket}
                onAddComment={handleAddComment}
                defaultExpanded={true}
             />
          </div>
          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedTicket(null)}></div>
        </div>
      )}

      {/* View Routing */}
      {activeTab === 'users' && (
        <UserManagement 
          users={users} 
          onAddUser={handleAddUser} 
          onDeleteUser={handleDeleteUser} 
        />
      )}

      {activeTab === 'subjects' && (
        <SubjectManagement 
          subjects={subjects} 
          onAddSubject={handleAddSubject} 
          onDeleteSubject={handleDeleteSubject} 
        />
      )}

      {activeTab === 'data' && (
        <DataManagement 
          data={{ tickets, users, subjects }} 
          onImport={handleImportData} 
        />
      )}

      {activeTab === 'create' && (
        <TicketForm 
          users={users}
          subjects={subjects}
          onSubmit={handleCreateTicket} 
          onCancel={() => setActiveTab('dashboard')} 
          onNavigateToUsers={() => setActiveTab('users')}
          onNavigateToSubjects={() => setActiveTab('subjects')}
        />
      )}

      {activeTab === 'mytickets' && (
        <MyTickets 
          tickets={tickets} 
          users={users} 
          isAdmin={isAdmin} 
          onResolve={handleResolveTicket}
          onReopen={handleReopenTicket}
          onAddComment={handleAddComment}
        />
      )}

      {(activeTab === 'dashboard' || activeTab === 'history') && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Stats (Dashboard only) */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default group">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Tickets Abiertos</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.open}</p>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl text-amber-600 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                  <Inbox size={24} />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default group">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Resueltos Total</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.resolved}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl text-green-600 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <CheckCircle2 size={24} />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default group">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Urgentes</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.urgent}</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                  <Flame size={24} />
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 text-gray-800 dark:text-gray-100 transition-all"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
              
              <div className="flex flex-wrap gap-2 lg:gap-4">
                {activeTab === 'history' && (
                  <select 
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:border-indigo-400 cursor-pointer"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value as any})}
                  >
                    <option value="ALL">Todos los Estados</option>
                    <option value={TicketStatus.OPEN}>{TicketStatus.OPEN}</option>
                    <option value={TicketStatus.RESOLVED}>{TicketStatus.RESOLVED}</option>
                  </select>
                )}

                <select 
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:border-indigo-400 cursor-pointer"
                  value={filters.topic}
                  onChange={(e) => setFilters({...filters, topic: e.target.value as any})}
                >
                  <option value="ALL">Todos los Temas</option>
                  {Object.values(TicketTopic).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                <select 
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:border-indigo-400 cursor-pointer"
                  value={filters.priority}
                  onChange={(e) => setFilters({...filters, priority: e.target.value as any})}
                >
                  <option value="ALL">Todas las Prioridades</option>
                  {Object.values(TicketPriority).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2">
                  <CalendarDays size={16} className="text-gray-400" />
                  <input 
                    type="date"
                    className="bg-transparent py-2 text-sm text-gray-600 dark:text-gray-300 focus:outline-none w-32 [color-scheme:light] dark:[color-scheme:dark]"
                    value={filters.dateStart}
                    onChange={(e) => setFilters({...filters, dateStart: e.target.value})}
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="date"
                    className="bg-transparent py-2 text-sm text-gray-600 dark:text-gray-300 focus:outline-none w-32 [color-scheme:light] dark:[color-scheme:dark]"
                    value={filters.dateEnd}
                    onChange={(e) => setFilters({...filters, dateEnd: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Layout Switch: Dashboard (Split) vs History (Unified) */}
          
          {activeTab === 'dashboard' && filters.status === 'ALL' ? (
             // DASHBOARD SPLIT VIEW (New Layout 75% / 25%)
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                
                {/* Column 1: PENDING (Priority - 75% width) */}
                <div className="lg:col-span-3 w-full space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <Flame className="text-orange-500" size={24} />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Pendientes</h3>
                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-0.5 rounded-full">
                      {openTickets.length}
                    </span>
                  </div>

                  {openTickets.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {openTickets
                        // Sort by Priority (Urgent first) then Date
                        .sort((a, b) => {
                             const priorityOrder = { [TicketPriority.URGENT]: 3, [TicketPriority.HIGH]: 2, [TicketPriority.NORMAL]: 1, [TicketPriority.LOW]: 0 };
                             return priorityOrder[b.priority] - priorityOrder[a.priority] || b.createdAt - a.createdAt;
                        })
                        .map(ticket => (
                        <TicketCard 
                          key={ticket.id} 
                          ticket={ticket} 
                          isAdmin={isAdmin} 
                          isHighlighted={ticket.id === highlightedTicketId}
                          onResolve={handleResolveTicket}
                          onReopen={handleReopenTicket}
                          onAddComment={handleAddComment}
                        />
                      ))}
                    </div>
                  ) : (
                     <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
                        <CheckCircle2 size={48} className="mx-auto text-green-500/50 mb-4" />
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">¡Todo limpio!</h4>
                        <p className="text-gray-500 dark:text-gray-400">No hay tickets pendientes por resolver.</p>
                     </div>
                  )}
                </div>

                {/* Column 2: RESOLVED (Sidebar - 25% width - Enhanced) */}
                <div className="lg:col-span-1 w-full space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <Archive className="text-gray-400" size={20} />
                    <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Archivo</h3>
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">
                      {resolvedTickets.length}
                    </span>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-3 border border-gray-100 dark:border-gray-800/50">
                    {resolvedTickets.length > 0 ? (
                      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
                        {resolvedTickets.map(ticket => (
                          <div 
                             key={ticket.id} 
                             onClick={() => setSelectedTicket(ticket)}
                             title={`Ver detalles de: #${ticket.number} ${ticket.title}`}
                             className="group p-3 rounded-xl bg-white dark:bg-gray-800 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900 shadow-sm hover:shadow-md cursor-pointer transition-all"
                          >
                            <div className="flex justify-between items-start gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-400 line-through decoration-gray-300 dark:decoration-gray-600 truncate flex-1">
                                    <span className="mr-1 opacity-70">#{ticket.number}</span>{ticket.title}
                                </span>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                    {ticket.resolvedAt 
                                      ? new Date(ticket.resolvedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                                      : ''}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <UserIcon size={10} className="text-gray-400" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{ticket.creatorName}</span>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {ticket.description || "Sin descripción"}
                            </p>
                            
                            <div className="mt-2 text-[10px] text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                Click para ver detalles
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 text-center py-8">
                        No hay historial reciente.
                      </div>
                    )}
                  </div>
                </div>
             </div>
          ) : (
            // HISTORIAL / FILTERED LIST VIEW (Uses standard cards for everything)
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {activeTab === 'history' ? 'Historial Completo' : 'Resultados de Búsqueda'}
                </h3>
                <div className="flex gap-4 items-center">
                    {activeTab === 'history' && (
                        <button 
                            onClick={handleExportCSV}
                            className="text-sm flex items-center gap-1 text-green-600 dark:text-green-400 hover:underline font-medium"
                            title="Exportar listado actual a Excel/CSV"
                        >
                            <Download size={14} /> Exportar CSV
                        </button>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredTickets.length} resultados
                    </span>
                </div>
              </div>

              {filteredTickets.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredTickets.map(ticket => (
                    <TicketCard 
                      key={ticket.id} 
                      ticket={ticket} 
                      isAdmin={isAdmin} 
                      isHighlighted={ticket.id === highlightedTicketId}
                      onResolve={handleResolveTicket}
                      onReopen={handleReopenTicket}
                      onAddComment={handleAddComment}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed transition-colors">
                  <div className="bg-gray-50 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Filter className="text-gray-400 dark:text-gray-500" size={32} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No se encontraron tickets con estos filtros.</p>
                  <button 
                    onClick={() => setFilters({
                      status: 'ALL',
                      topic: 'ALL',
                      priority: 'ALL',
                      search: '',
                      dateStart: '',
                      dateEnd: ''
                    })}
                    className="mt-2 text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
