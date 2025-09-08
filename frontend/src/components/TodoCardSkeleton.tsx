import React from 'react';

export const TodoCardSkeleton: React.FC = () => {
  return (
    <div className='flex flex-row items-center w-full h-[86px] bg-[var(--card-background)] border border-[var(--card-border)] rounded-2xl animate-pulse'>
      {/* Checkbox skeleton */}
      <div className='w-6 h-6 bg-[var(--secondary)] rounded-lg ml-3' />

      {/* Content skeleton */}
      <div
        className='flex flex-col items-start w-[496px] h-[62px] flex-1'
        style={{ padding: '12px 16px', gap: '4px' }}
      >
        {/* Title skeleton */}
        <div className='w-3/4 h-[30px] bg-[var(--secondary)] rounded' />

        {/* Date and priority skeleton */}
        <div
          className='flex flex-row items-center w-auto h-7'
          style={{ gap: '12px' }}
        >
          <div className='w-20 h-7 bg-[var(--secondary)] rounded' />
          <div className='w-0.5 h-0.5 bg-[var(--secondary)] rounded-full' />
          <div className='w-16 h-6 bg-[var(--secondary)] rounded-lg' />
        </div>
      </div>

      {/* More options skeleton */}
      <div className='w-6 h-6 bg-[var(--secondary)] rounded mr-3' />
    </div>
  );
};
