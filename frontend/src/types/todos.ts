export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO date string
  priority: Priority;
}

export interface NewTodo {
  title: string;
  completed?: boolean;
  date?: string;
  priority?: Priority;
}

export interface UpdateTodo {
  title?: string;
  completed?: boolean;
  date?: string;
  priority?: Priority;
}

// API Response types
export interface PaginatedTodosResponse {
  todos: Todo[];
  totalTodos: number;
  hasNextPage: boolean;
  nextPage: number;
}

export interface ScrollTodosResponse {
  todos: Todo[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

// Filter and sort types
export interface TodoFilters {
  completed?: boolean;
  priority?: Priority;
  dateGte?: string;
  dateLte?: string;
  sort?: 'date' | 'priority';
  order?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationParams extends TodoFilters {
  page: number;
  limit: number;
}

export interface ScrollParams extends TodoFilters {
  nextCursor?: string;
  limit: number;
}
