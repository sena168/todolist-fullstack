import React from 'react';

interface SearchEmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  searchQuery,
  onClearSearch,
}) => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-[300px] md:h-[380px] bg-[var(--card-background)] border border-[var(--card-border)] rounded-2xl'>
      <div className='text-4xl md:text-6xl mb-2 md:mb-4'>🔍</div>
      <h3 className='text-base md:text-lg font-semibold mb-2 text-[var(--foreground)] text-center'>
        Try a different keyword.
      </h3>
      <p className='text-sm md:text-base text-[var(--muted)] text-center mb-3 md:mb-4 px-4'>
        No todos found for "{searchQuery}"
      </p>
      <button
        onClick={onClearSearch}
        className='px-3 py-2 md:px-4 md:py-2 bg-[#0C4BCA] hover:bg-[#0A3BA8] text-white text-sm md:text-base rounded-lg transition-colors'
      >
        Clear Search
      </button>
    </div>
  );
};
