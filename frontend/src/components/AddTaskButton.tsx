import React from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface AddTaskButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({
  onClick,
  isLoading = false,
}) => {
  return (
    <button
      className={`flex flex-row justify-center items-center w-[361px] md:w-[300px] h-[44px] md:h-12 rounded-lg flex-none order-6 flex-grow-0 transition-colors ${
        isLoading
          ? 'bg-[#0A3BA8] cursor-not-allowed opacity-70'
          : 'bg-[var(--primary)] cursor-pointer hover:bg-[#0A3BA8]'
      }`}
      style={{ padding: '8px', gap: '6px' }}
      onClick={isLoading ? undefined : onClick}
      disabled={isLoading}
    >
      {/* Plus Icon or Loading Spinner */}
      <div className='w-5 h-5 flex-none order-0 flex-grow-0'>
        {isLoading ? (
          <Loader2 className='w-5 h-5 text-white animate-spin' />
        ) : (
          <Plus className='w-5 h-5 text-white' />
        )}
      </div>

      {/* Button Text */}
      <div className='w-[61px] md:w-[70px] h-[28px] md:h-[30px] flex-none order-1 flex-grow-0'>
        <span
          className='w-[61px] md:w-[70px] h-[28px] md:h-[30px] font-semibold text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.02em] text-white flex-none order-1 flex-grow-0'
          style={{ fontFamily: 'SF Pro' }}
        >
          {isLoading ? 'Adding...' : 'Add Task'}
        </span>
      </div>
    </button>
  );
};
