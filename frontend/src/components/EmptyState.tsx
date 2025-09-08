import React from 'react';
import { AddTaskButton } from './AddTaskButton';

interface EmptyStateProps {
  onAddTask: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddTask }) => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-[300px] md:h-[380px]'>
      {/* Empty State Message */}
      <div className='flex flex-col items-center justify-center p-0 w-[361px] md:w-[600px] h-[80px] md:h-[120px] flex-none order-0 self-stretch flex-grow-0'>
        <h3
          className='w-[361px] md:w-[600px] h-[24px] md:h-[32px] font-semibold text-[16px] md:text-[20px] leading-6 md:leading-8 text-[var(--foreground)] text-center flex-none order-0 self-stretch flex-grow-0 mb-2 md:mb-4'
          style={{ fontFamily: 'SF Pro' }}
        >
          Nothing to do yet!
        </h3>
      </div>

      {/* Add Task Button */}
      <div className='flex flex-col items-center justify-center p-0 w-[361px] md:w-[600px] h-[44px] md:h-[48px] flex-none order-1 self-stretch flex-grow-0'>
        <AddTaskButton onClick={onAddTask} />
      </div>
    </div>
  );
};
