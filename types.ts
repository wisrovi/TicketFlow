
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

export interface User {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  title: string;
}

export interface Ticket {
  id: string;
  number: number; // Sequential ID
  title: string;
  description: string;
  creatorName: string; // We store the name for display, selected from User list
  creatorId: string;   // Reference to User ID
  topic: TicketTopic;
  status: TicketStatus;
  createdAt: number; // Timestamp
  resolvedAt?: number; // Timestamp
  aiSolution?: string; // Stored AI insight
}

export interface FilterState {
  status: TicketStatus | 'ALL';
  topic: TicketTopic | 'ALL';
  search: string;
  dateStart: string; // YYYY-MM-DD
  dateEnd: string; // YYYY-MM-DD
}

export interface AppData {
  tickets: Ticket[];
  users: User[];
  subjects: Subject[];
}
