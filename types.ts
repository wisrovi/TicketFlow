
export enum TicketStatus {
  OPEN = 'ABIERTO',
  RESOLVED = 'RESUELTO',
}

export enum TicketTopic {
  GITHUB = 'GitHub',
  CONSULTA = 'Consulta',
  BUG = 'Bug/Error',
  ACCESO = 'Accesos',
  OTRO = 'Otro',
}

export enum TicketPriority {
  LOW = 'Baja',
  NORMAL = 'Normal',
  HIGH = 'Alta',
  URGENT = 'Urgente',
}

export interface User {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  title: string;
}

export interface Comment {
  id: string;
  authorName: string;
  isAdmin: boolean;
  text: string;
  createdAt: number;
}

export interface Ticket {
  id: string;
  number: number; // Sequential ID
  title: string;
  description: string;
  creatorName: string; // We store the name for display, selected from User list
  creatorId: string;   // Reference to User ID
  topic: TicketTopic;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: number; // Timestamp
  resolvedAt?: number; // Timestamp
  resolutionNote?: string; // How it was resolved
  aiSolution?: string; // Stored AI insight
  comments?: Comment[]; // Thread of conversation
}

export interface FilterState {
  status: TicketStatus | 'ALL';
  topic: TicketTopic | 'ALL';
  priority: TicketPriority | 'ALL';
  search: string;
  dateStart: string; // YYYY-MM-DD
  dateEnd: string; // YYYY-MM-DD
}

export interface AppData {
  tickets: Ticket[];
  users: User[];
  subjects: Subject[];
}