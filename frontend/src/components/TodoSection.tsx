import React, { useState } from 'react';
import { TodoList } from './TodoList';
import { useAppDispatch } from '@/hooks/redux';
import { setDateGte, setDateLte } from '@/store/slices/filtersSlice';
import dayjs from 'dayjs';

interface TodoSectionProps {
  onAddTask: () => void;
}

export const TodoSection: React.FC<TodoSectionProps> = ({ onAddTask }) => {
  const dispatch = useAppDispatch();
  const [itemCount, setItemCount] = useState(0);
  const today = dayjs().format('MMM D, YYYY');

  // Set filters for today's todos
  React.useEffect(() => {
    const startOfDay = dayjs().startOf('day').toISOString();
    const endOfDay = dayjs().endOf('day').toISOString();

    dispatch(setDateGte(startOfDay));
    dispatch(setDateLte(endOfDay));

    // Cleanup when component unmounts
    return () => {
      dispatch(setDateGte(undefined));
      dispatch(setDateLte(undefined));
    };
  }, [dispatch]);

  const handleCountChange = (count: number) => {
    setItemCount(count);
  };

  return (
    <div className='flex flex-col items-start p-0 gap-4 w-[361px] md:w-[600px] flex-none order-3 self-stretch flex-grow-0'>
      {/* Frame 18 - Date Section */}
      <div
        className='flex flex-row items-center p-0 w-[361px] md:w-[600px] h-[68px]'
        style={{ gap: '16px' }}
      >
        {/* Frame 3 - Date Section */}
        <div
          className='flex flex-col items-start p-0 w-[361px] md:w-[600px] h-[68px] flex-none order-0 flex-grow-1'
          style={{ gap: '4px' }}
        >
          {/* Frame 19 - Title and Count */}
          <div
            className='flex flex-row items-center p-0 w-[361px] md:w-[600px] h-9 flex-none order-0 self-stretch flex-grow-0'
            style={{ gap: '8px' }}
          >
            {/* Today Title */}
            <div className='w-[67px] h-9 flex-none order-0 flex-grow-0'>
              <h2 className='w-[67px] h-9 font-bold text-[24px] leading-9 text-[var(--foreground)] font-["SF_Pro"]'>
                Today
              </h2>
            </div>

            {/* Count Chip */}
            <div
              className='flex flex-row justify-center items-center min-w-[62px] h-7 bg-[var(--chip-background)] rounded-full flex-none order-1 flex-grow-0'
              style={{ padding: '2px 12px', gap: '8px' }}
            >
              <span className='h-6 font-semibold text-[12px] leading-6 text-[var(--foreground)] font-["SF_Pro"] whitespace-nowrap'>
                {itemCount} Item{itemCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Date */}
          <div className='w-[361px] md:w-[600px] h-7 flex-none order-1 self-stretch flex-grow-0'>
            <p className='w-[361px] md:w-[600px] h-7 font-normal text-[14px] leading-7 tracking-[-0.02em] text-[var(--muted)] font-["SF_Pro"]'>
              {today}
            </p>
          </div>
        </div>
      </div>

      {/* Frame 2 - Todo List */}
      <div
        className='flex flex-col items-center p-0 w-[361px] md:w-[600px] h-[356px] md:h-[380px] flex-none order-4 self-stretch flex-grow-0'
        style={{ gap: '12px' }}
      >
        <TodoList onAddTask={onAddTask} onCountChange={handleCountChange} />
      </div>
    </div>
  );
};
