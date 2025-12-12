
export type ColumnId = 'red' | 'yellow' | 'green';

export interface Task {
  id: string;
  content: string;
  column: ColumnId;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AppState {
  tasks: Task[];
  chatHistory: ChatMessage[];
  progress: number; // 0 to 100
  visitedSections: string[];
}

export type SectionId = 'intro' | 'kanban' | 'focus' | 'reading' | 'offer';

export const LOCAL_STORAGE_KEY = 'tdah_app_data';

// Estado inicial limpio para que el usuario construya su propia info
export const INITIAL_STATE: AppState = {
  tasks: [], // Tablero vacío
  chatHistory: [
    { id: 'welcome', role: 'model', text: 'Hola. Soy tu coach de bolsillo. Si te sientes bloqueado, escríbeme aquí.', timestamp: Date.now() }
  ],
  progress: 0,
  visitedSections: []
};
