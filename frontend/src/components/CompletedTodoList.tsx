import React, { useRef, useCallback, useEffect } from 'react';
import { TodoCard } from './TodoCard';
import { useInfiniteTodos, usePaginatedTodos } from '@/hooks/useTodos';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { nextPage, prevPage } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';

interface CompletedTodoListProps {
  onCountChange?: (count: number) => void;
}

export const CompletedTodoList: React.FC<CompletedTodoListProps> = ({
  onCountChange,
}) => {
  const { viewMode, currentPage, limit } = useAppSelector((state) => state.ui);
  const filters = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();

  // Override filters to only show completed todos (ignore date filters)
  const completedFilters = {
    ...filters,
    completed: true,
    // Remove date filters for completed todos - we want all completed todos regardless of date
    dateGte: undefined,
    dateLte: undefined,
  };

  // Infinite scroll query
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: infiniteLoading,
    error: infiniteError,
  } = useInfiniteTodos(completedFilters);

  // Paginated query
  const {
    data: paginatedData,
    isLoading: paginatedLoading,
    error: paginatedError,
  } = usePaginatedTodos({ page: currentPage, limit, ...completedFilters });

  // Intersection Observer for infinite scroll
  const observer = useRef<IntersectionObserver>();
  const lastTodoElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (infiniteLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          root: null, // Use viewport as root
          rootMargin: '100px', // Trigger 100px before the element comes into view
          threshold: 0.1, // Trigger when 10% of the element is visible
        }
      );

      if (node) observer.current.observe(node);
    },
    [infiniteLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Loading state
  const isLoading = viewMode === 'scroll' ? infiniteLoading : paginatedLoading;
  const error = viewMode === 'scroll' ? infiniteError : paginatedError;

  // Get todos based on view mode
  const todos =
    viewMode === 'scroll'
      ? infiniteData?.pages.flatMap((page) => page.todos) || []
      : paginatedData?.todos || [];

  // Notify parent component of todos count change
  useEffect(() => {
    if (onCountChange) {
      onCountChange(todos.length);
    }
  }, [todos.length, onCountChange]);

  // Cleanup intersection observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // Loading skeleton
  if (isLoading && todos.length === 0) {
    return (
      <div
        className='flex flex-col items-center p-0 w-[600px] h-[380px]'
        style={{ gap: '12px' }}
      >
        {Array.from({ length: limit }).map((_, index) => (
          <div
            key={index}
            className='flex flex-row items-center w-full h-[86px] bg-[var(--card-background)] border border-[var(--card-border)] rounded-2xl animate-pulse'
            style={{ padding: '12px', gap: '16px' }}
          >
            <div className='w-6 h-6 bg-[var(--secondary)] rounded-lg' />
            <div
              className='flex flex-col items-start w-[496px] h-[62px] flex-1'
              style={{ gap: '4px' }}
            >
              <div className='w-3/4 h-[30px] bg-[var(--secondary)] rounded' />
              <div
                className='flex flex-row items-center w-auto h-7'
                style={{ gap: '12px' }}
              >
                <div className='w-20 h-7 bg-[var(--secondary)] rounded' />
                <div className='w-0.5 h-0.5 bg-[var(--secondary)] rounded-full' />
                <div className='w-16 h-6 bg-[var(--secondary)] rounded-lg' />
              </div>
            </div>
            <div className='w-6 h-6 bg-[var(--secondary)] rounded' />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center w-full h-[300px] md:h-[380px] bg-[var(--card-background)] border border-[var(--card-border)] rounded-2xl'>
        <AlertCircle className='h-8 w-8 md:h-12 md:w-12 text-[#D9206E] mx-auto mb-2 md:mb-4' />
        <h3 className='text-base md:text-lg font-semibold mb-2 text-[var(--foreground)] text-center'>
          Error loading completed todos
        </h3>
        <p className='text-sm md:text-base text-[var(--muted)] mb-3 md:mb-4 text-center px-4'>
          {error instanceof Error ? error.message : 'Something went wrong'}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className='bg-[#0C4BCA] hover:bg-[#0A3BA8] text-white text-sm md:text-base px-3 py-2 md:px-4 md:py-2'
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (todos.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center w-full h-[300px] md:h-[380px] bg-[var(--card-background)] border border-[var(--card-border)] rounded-2xl'>
        <div className='text-4xl md:text-6xl mb-2 md:mb-4'>✅</div>
        <h3 className='text-base md:text-lg font-semibold mb-2 text-[var(--foreground)] text-center'>
          No completed todos
        </h3>
        <p className='text-sm md:text-base text-[var(--muted)] text-center px-4'>
          Complete some tasks to see them here!
        </p>
      </div>
    );
  }

  return (
    <div
      className='flex flex-col items-center p-0 w-full max-w-[361px] md:max-w-[620px] h-[300px] md:h-[380px] overflow-y-auto -mx-[10px]'
      style={{ gap: '12px' }}
    >
      {/* Render all todos with lazy loading */}
      {todos.map((todo, index) => {
        // For infinite scroll, attach ref to the last element of each page (every 10th item)
        const isLastItemOfPage =
          viewMode === 'scroll' &&
          index === todos.length - 1 &&
          todos.length % limit === 0;

        if (isLastItemOfPage) {
          return (
            <div
              key={todo.id}
              ref={lastTodoElementRef}
              className='flex-none self-stretch flex-grow-0'
            >
              <TodoCard todo={todo} />
            </div>
          );
        }

        return (
          <div key={todo.id} className='flex-none self-stretch flex-grow-0'>
            <TodoCard todo={todo} />
          </div>
        );
      })}

      {/* Loading more indicator for infinite scroll */}
      {viewMode === 'scroll' && isFetchingNextPage && (
        <div className='flex justify-center py-4'>
          <div className='flex items-center gap-2 text-[var(--muted)]'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span className='text-sm'>Loading more completed todos...</span>
          </div>
        </div>
      )}

      {/* Pagination for page mode */}
      {viewMode === 'page' && paginatedData && (
        <div className='flex items-center justify-between pt-4'>
          <p className='text-sm text-[var(--muted)]'>
            Showing {todos.length} of {paginatedData.totalTodos} completed todos
          </p>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => dispatch(prevPage())}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className='px-3 py-2 text-sm text-[var(--foreground)]'>
              Page {currentPage}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => dispatch(nextPage())}
              disabled={!paginatedData.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
