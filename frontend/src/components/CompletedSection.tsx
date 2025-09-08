import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { CompletedTodoList } from './CompletedTodoList';

interface CompletedSectionProps {
  onAddTask?: () => void;
}

export const CompletedSection: React.FC<CompletedSectionProps> = ({
  onAddTask: _onAddTask,
}) => {
  const [itemCount, setItemCount] = useState(0);

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
            {/* Completed Title with Icon */}
            <div
              className='flex flex-row items-center w-auto h-9 flex-none order-0 flex-grow-0'
              style={{ gap: '8px' }}
            >
              {/* Checkmark Icon */}
              <div className='w-6 h-6 flex-none order-0 flex-grow-0'>
                <CheckCircle className='w-6 h-6 text-[#0C4BCA]' />
              </div>

              {/* Completed Title */}
              <div className='w-auto h-9 flex-none order-1 flex-grow-0'>
                <h2
                  className='w-auto h-9 font-bold text-[24px] leading-9 text-[var(--foreground)] flex-none order-0 flex-grow-0'
                  style={{ fontFamily: 'SF Pro' }}
                >
                  Completed
                </h2>
              </div>
            </div>

            {/* Count Chip */}
            <div
              className='flex flex-row justify-center items-center min-w-[62px] h-7 bg-[var(--chip-background)] rounded-full flex-none order-1 flex-grow-0'
              style={{ padding: '2px 12px', gap: '8px' }}
            >
              <span
                className='h-6 font-semibold text-[12px] leading-6 text-[var(--foreground)] flex-none order-0 flex-grow-0 whitespace-nowrap'
                style={{ fontFamily: 'SF Pro' }}
              >
                {itemCount} Item{itemCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Empty space for consistency with other tabs */}
          <div className='w-[361px] md:w-[600px] h-7 flex-none order-1 self-stretch flex-grow-0'>
            {/* This space is intentionally left empty to match the layout */}
          </div>
        </div>
      </div>

      {/* Frame 2 - Todo List */}
      <div
        className='flex flex-col items-center p-0 w-[361px] md:w-[600px] h-[356px] md:h-[380px] flex-none order-4 self-stretch flex-grow-0'
        style={{ gap: '12px' }}
      >
        <CompletedTodoList onCountChange={handleCountChange} />
      </div>
    </div>
  );
};
