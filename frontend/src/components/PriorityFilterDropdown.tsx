import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setPriority } from '@/store/slices/filtersSlice';
import { Priority } from '@/types/todos';

interface PriorityFilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PriorityFilterDropdown: React.FC<PriorityFilterDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const currentPriority = useAppSelector((state) => state.filters.priority);

  const handlePrioritySelect = (priority: Priority | undefined) => {
    dispatch(setPriority(priority));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 z-[50]' onClick={onClose} />

      {/* Dropdown Menu */}
      <div
        className='absolute right-0 top-12 z-[51] w-[158px] h-[168px] bg-[var(--card-background)] border border-[var(--card-border)] rounded-2xl flex flex-col items-start p-4'
        style={{ gap: '8px' }}
      >
        {/* All Option */}
        <button
          onClick={() => handlePrioritySelect(undefined)}
          className={`flex flex-row items-center p-0 w-[16px] h-7 hover:opacity-80 transition-opacity ${
            currentPriority === undefined ? 'opacity-100' : 'opacity-70'
          }`}
          style={{ gap: '8px' }}
        >
          <span
            className='w-[16px] h-7 text-[14px] font-normal leading-7 tracking-[-0.02em] text-[var(--foreground)] flex-none order-0 flex-grow-0'
            style={{ fontFamily: 'SF Pro' }}
          >
            All
          </span>
        </button>

        {/* Low Option */}
        <button
          onClick={() => handlePrioritySelect('LOW')}
          className={`flex flex-row items-center p-0 w-[26px] h-7 hover:opacity-80 transition-opacity ${
            currentPriority === 'LOW' ? 'opacity-100' : 'opacity-70'
          }`}
          style={{ gap: '8px' }}
        >
          <span
            className='w-[26px] h-7 text-[14px] font-normal leading-7 tracking-[-0.02em] text-[var(--foreground)] flex-none order-0 flex-grow-0'
            style={{ fontFamily: 'SF Pro' }}
          >
            Low
          </span>
        </button>

        {/* Medium Option */}
        <button
          onClick={() => handlePrioritySelect('MEDIUM')}
          className={`flex flex-row items-center p-0 w-[52px] h-7 hover:opacity-80 transition-opacity ${
            currentPriority === 'MEDIUM' ? 'opacity-100' : 'opacity-70'
          }`}
          style={{ gap: '8px' }}
        >
          <span
            className='w-[52px] h-7 text-[14px] font-normal leading-7 tracking-[-0.02em] text-[var(--foreground)] flex-none order-0 flex-grow-0'
            style={{ fontFamily: 'SF Pro' }}
          >
            Medium
          </span>
        </button>

        {/* High Option */}
        <button
          onClick={() => handlePrioritySelect('HIGH')}
          className={`flex flex-row items-center p-0 w-[30px] h-7 hover:opacity-80 transition-opacity ${
            currentPriority === 'HIGH' ? 'opacity-100' : 'opacity-70'
          }`}
          style={{ gap: '8px' }}
        >
          <span
            className='w-[30px] h-7 text-[14px] font-normal leading-7 tracking-[-0.02em] text-[var(--foreground)] flex-none order-0 flex-grow-0'
            style={{ fontFamily: 'SF Pro' }}
          >
            High
          </span>
        </button>
      </div>
    </>
  );
};
