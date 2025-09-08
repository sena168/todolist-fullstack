import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Todo,
  NewTodo,
  UpdateTodo,
  PaginationParams,
  ScrollParams,
} from '@/types/todos';
import { useAppSelector } from './redux';

// Query keys
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: any) => [...todoKeys.lists(), filters] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
};

// Paginated todos query
export const usePaginatedTodos = (params: PaginationParams) => {
  return useQuery({
    queryKey: todoKeys.list({ type: 'paginated', ...params }),
    queryFn: () => api.getTodos(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Infinite scroll todos query
export const useInfiniteTodos = (
  filters: Omit<ScrollParams, 'nextCursor' | 'limit'>
) => {
  const { limit } = useAppSelector((state) => state.ui);

  const queryKey = todoKeys.list({ type: 'infinite', ...filters, limit });

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = '0' }) => {
      return api.getScrollTodos({ ...filters, nextCursor: pageParam, limit });
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    initialPageParam: '0',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create todo mutation
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todo: NewTodo) => api.createTodo(todo),
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueriesData({
        queryKey: todoKeys.lists(),
      });

      // Optimistically update to the new value
      const optimisticTodo: Todo = {
        id: `temp-${Date.now()}`,
        title: newTodo.title,
        completed: newTodo.completed ?? false,
        date: newTodo.date ?? new Date().toISOString(),
        priority: newTodo.priority ?? 'MEDIUM',
      };

      // Update all todo lists
      queryClient.setQueriesData({ queryKey: todoKeys.lists() }, (old: any) => {
        if (!old) return old;

        if (old.pages) {
          // Infinite query
          return {
            ...old,
            pages: old.pages.map((page: any, index: number) =>
              index === 0
                ? { ...page, todos: [optimisticTodo, ...page.todos] }
                : page
            ),
          };
        } else {
          // Paginated query
          return {
            ...old,
            todos: [optimisticTodo, ...old.todos],
            totalTodos: old.totalTodos + 1,
          };
        }
      });

      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

// Update todo mutation
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTodo }) =>
      api.updateTodo(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      const previousTodos = queryClient.getQueriesData({
        queryKey: todoKeys.lists(),
      });

      // Optimistically update
      queryClient.setQueriesData({ queryKey: todoKeys.lists() }, (old: any) => {
        if (!old) return old;

        if (old.pages) {
          // Infinite query
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              todos: page.todos.map((todo: Todo) =>
                todo.id === id ? { ...todo, ...updates } : todo
              ),
            })),
          };
        } else {
          // Paginated query
          return {
            ...old,
            todos: old.todos.map((todo: Todo) =>
              todo.id === id ? { ...todo, ...updates } : todo
            ),
          };
        }
      });

      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

// Delete todo mutation
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteTodo(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      const previousTodos = queryClient.getQueriesData({
        queryKey: todoKeys.lists(),
      });

      // Optimistically remove
      queryClient.setQueriesData({ queryKey: todoKeys.lists() }, (old: any) => {
        if (!old) return old;

        if (old.pages) {
          // Infinite query
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              todos: page.todos.filter((todo: Todo) => todo.id !== id),
            })),
          };
        } else {
          // Paginated query
          return {
            ...old,
            todos: old.todos.filter((todo: Todo) => todo.id !== id),
            totalTodos: Math.max(0, old.totalTodos - 1),
          };
        }
      });

      return { previousTodos };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};
