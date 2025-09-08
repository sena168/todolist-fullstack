import {
  Todo,
  NewTodo,
  UpdateTodo,
  PaginatedTodosResponse,
  ScrollTodosResponse,
  PaginationParams,
  ScrollParams,
} from '@/types/todos';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API request failed: ${response.statusText}`
    );
  }

  return response.json();
}

export const api = {
  // Get todos with pagination
  getTodos: async (
    params: PaginationParams
  ): Promise<PaginatedTodosResponse> => {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    if (params.completed !== undefined) {
      searchParams.append('completed', params.completed.toString());
    }
    if (params.priority) {
      searchParams.append('priority', params.priority);
    }
    if (params.dateGte) {
      searchParams.append('dateGte', params.dateGte);
    }
    if (params.dateLte) {
      searchParams.append('dateLte', params.dateLte);
    }
    if (params.sort) {
      searchParams.append('sort', params.sort);
    }
    if (params.order) {
      searchParams.append('order', params.order);
    }
    if (params.search) {
      searchParams.append('search', params.search);
    }

    return fetchApi<PaginatedTodosResponse>(`/todos?${searchParams}`);
  },

  // Get todos with infinite scroll
  getScrollTodos: async (
    params: ScrollParams
  ): Promise<ScrollTodosResponse> => {
    const searchParams = new URLSearchParams();

    if (params.completed !== undefined) {
      searchParams.append('completed', params.completed.toString());
    }
    if (params.priority) {
      searchParams.append('priority', params.priority);
    }
    if (params.dateGte) {
      searchParams.append('dateGte', params.dateGte);
    }
    if (params.dateLte) {
      searchParams.append('dateLte', params.dateLte);
    }
    if (params.sort) {
      searchParams.append('sort', params.sort);
    }
    if (params.order) {
      searchParams.append('order', params.order);
    }
    if (params.search) {
      searchParams.append('search', params.search);
    }
    if (params.nextCursor) {
      searchParams.append('nextCursor', params.nextCursor);
    }
    searchParams.append('limit', params.limit.toString());

    return fetchApi<ScrollTodosResponse>(`/todos/scroll?${searchParams}`);
  },

  // Create a new todo
  createTodo: async (todo: NewTodo): Promise<Todo> => {
    return fetchApi<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  },

  // Update a todo
  updateTodo: async (id: string, updates: UpdateTodo): Promise<Todo> => {
    return fetchApi<Todo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    return fetchApi<void>(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};

export { ApiError };
