import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { PriorityFilterDropdown } from './PriorityFilterDropdown';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { setSearch } from '@/store/slices/filtersSlice';

export const SearchBar: React.FC = () => {
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const currentPriority = useAppSelector((state) => state.filters.priority);
  
  const dispatch = useAppDispatch();

  const getPriorityDisplayText = () => {
    switch (currentPriority) {
      case 'LOW':
        return 'Low';
      case 'MEDIUM':
        return 'Medium';
      case 'HIGH':
        return 'High';
      default:
        return 'Priority';
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearch(searchInput.trim() || undefined));
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    dispatch(setSearch(undefined));
    setIsSearching(false);
  };

  return (
    <div
      className='flex flex-row items-start p-0 w-[361px] md:w-[600px] h-[44px] md:h-[48px] flex-none order-1 self-stretch flex-grow-0'
      style={{ gap: '8px' }}
    >
      {/* Search Input */}
      <div className='flex flex-col justify-center items-start p-0 gap-6 w-[309px] md:w-[486px] h-[44px] md:h-[48px] flex-none order-0 flex-grow-1'>
        <div
          className='flex flex-row items-center w-[309px] md:w-[486px] h-[48px] md:h-[48px] border border-[var(--input-border)] rounded-2xl flex-none order-0 self-stretch flex-grow-0 focus-within:border-[var(--input-border)] focus-within:outline-none'
          style={{ padding: '0px 16px', gap: '6px' }}
        >
          {/* Search Icon */}
          <Search className='w-5 h-5 md:w-6 md:h-6 text-[var(--muted)] flex-none order-0 flex-grow-0' />

          {/* Search Input */}
          <input
            type='text'
            placeholder='Search'
            value={searchInput}
            onChange={handleSearchChange}
            className='flex-1 h-7 font-normal text-[14px] leading-7 tracking-[-0.02em] text-[var(--foreground)] font-["SF_Pro"] bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none placeholder:text-[var(--muted)]'
          />

          {/* Loading Spinner or Clear Button */}
          {isSearching ? (
            <div className='w-4 h-4 flex items-center justify-center'>
              <Loader2 className='w-4 h-4 text-[var(--muted)] animate-spin' />
            </div>
          ) : searchInput ? (
            <button
              onClick={handleClearSearch}
              className='w-4 h-4 flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
          ) : null}
        </div>
      </div>

      {/* Filter Button */}
      <div className='relative flex-none order-1 flex-grow-0'>
        <button
          onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
          className={`flex flex-row items-center w-[44px] md:w-[102px] h-[44px] md:h-[48px] border rounded-2xl flex-none order-1 flex-grow-0 transition-colors ${
            isPriorityDropdownOpen
              ? 'border-[var(--primary)] bg-[var(--primary)]/10'
              : 'border-[var(--input-border)] hover:border-[var(--primary)]'
          }`}
          style={{ padding: '4px 12px', gap: '12px' }}
        >
          {/* Filter Icon */}
          <Filter className='w-5 h-5 text-[var(--foreground)] flex-none order-0 flex-grow-0' />

          {/* Filter Text - Hidden on mobile */}
          <span className='hidden md:block w-[46px] h-7 font-normal text-[14px] leading-7 tracking-[-0.02em] text-[var(--foreground)] font-["SF_Pro"] flex-none order-1 flex-grow-0'>
            {getPriorityDisplayText()}
          </span>
        </button>

        {/* Priority Filter Dropdown */}
        <PriorityFilterDropdown
          isOpen={isPriorityDropdownOpen}
          onClose={() => setIsPriorityDropdownOpen(false)}
        />
      </div>
    </div>
  );
};
