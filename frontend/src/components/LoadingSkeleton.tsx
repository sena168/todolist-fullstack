import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 4,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center p-0 w-[361px] md:w-[600px] h-[300px] md:h-[380px] ${className}`}
      style={{ gap: '12px' }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className='flex flex-row items-center w-[361px] md:w-[600px] h-[80px] md:h-[86px] bg-[var(--card-background)] border border-[var(--card-border)] rounded-2xl animate-pulse flex-none order-0 self-stretch flex-grow-0'
          style={{ padding: '12px', gap: '12px' }}
        >
          {/* Checkbox skeleton */}
          <div className='w-6 h-6 bg-[var(--secondary)] rounded-lg flex-none order-0 flex-grow-0' />

          {/* Content skeleton */}
          <div
            className='flex flex-col items-start w-[265px] md:w-[496px] h-[56px] md:h-[62px] flex-1'
            style={{ gap: '4px' }}
          >
            {/* Title skeleton */}
            <div className='w-3/4 h-[28px] md:h-[30px] bg-[var(--secondary)] rounded' />

            {/* Date and priority skeleton */}
            <div
              className='flex flex-row items-center w-auto h-6 md:h-7'
              style={{ gap: '8px' }}
            >
              <div className='w-16 md:w-20 h-6 md:h-7 bg-[var(--secondary)] rounded' />
              <div className='w-0.5 h-0.5 bg-[var(--secondary)] rounded-full' />
              <div className='w-12 md:w-16 h-6 bg-[var(--secondary)] rounded-lg' />
            </div>
          </div>

          {/* More options skeleton */}
          <div className='w-6 h-6 bg-[var(--secondary)] rounded flex-none order-2 flex-grow-0' />
        </div>
      ))}
    </div>
  );
};
