import React, { useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

interface UpcomingHeaderProps {
  itemCount: number;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onPreviousDay?: () => void;
  onNextDay?: () => void;
  onTodayClick?: () => void;
}

export const UpcomingHeader: React.FC<UpcomingHeaderProps> = ({
  itemCount,
  selectedDate,
  onDateChange,
  onPreviousDay,
  onNextDay,
  onTodayClick,
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Determine what text to show in the navigation button
  const getNavigationText = () => {
    const selectedDay = dayjs(selectedDate);
    const today = dayjs();

    if (selectedDay.isSame(today, 'day')) {
      return 'Today';
    } else {
      return selectedDay.format('ddd D'); // e.g., "Sun 7", "Mon 8"
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(e.target.value);
  };
  return (
    <div
      className='flex flex-row items-center p-0 w-[361px] md:w-[600px] h-[68px] flex-none order-3 self-stretch flex-grow-0'
      style={{ gap: '12px' }}
    >
      {/* Frame 18 - Main Content */}
      <div
        className='flex flex-col items-start p-0 w-[234px] md:w-[453px] h-[68px] flex-none order-0 flex-grow-1'
        style={{ gap: '4px' }}
      >
        {/* Frame 19 - Title and Count */}
        <div
          className='flex flex-row items-center p-0 w-[234px] md:w-[453px] h-9 flex-none order-0 self-stretch flex-grow-0'
          style={{ gap: '8px' }}
        >
          {/* Upcoming Title */}
          <div className='w-[115px] h-9 flex-none order-0 flex-grow-0'>
            <h2
              className='w-[115px] h-9 font-bold text-[24px] leading-9 text-[var(--foreground)] flex-none order-0 flex-grow-0'
              style={{ fontFamily: 'SF Pro' }}
            >
              Upcoming
            </h2>
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

        {/* Frame 25 - Date Selector */}
        <div
          className='relative flex flex-row items-center p-0 w-[234px] md:w-[453px] h-7 flex-none order-1 self-stretch flex-grow-0'
          style={{ gap: '4px' }}
        >
          {/* Date Display - Clickable */}
          <div
            className='relative flex flex-row items-center cursor-pointer hover:opacity-80 transition-opacity'
            style={{ gap: '4px' }}
          >
            {/* Calendar Icon */}
            <div className='w-4 h-4 flex-none order-0 flex-grow-0'>
              <Calendar className='w-4 h-4 text-[var(--foreground)]' />
            </div>

            {/* Date Display */}
            <div className='w-[78px] h-7 flex-none order-1 flex-grow-0'>
              <span
                className='w-[78px] h-7 font-normal text-[14px] leading-7 tracking-[-0.02em] text-[var(--foreground)] flex-none order-0 flex-grow-0'
                style={{ fontFamily: 'SF Pro' }}
              >
                {selectedDate}
              </span>
            </div>

            {/* Chevron Down */}
            <div className='w-4 h-4 flex-none order-2 flex-grow-0'>
              <ChevronDown className='w-4 h-4 text-[var(--foreground)]' />
            </div>

            {/* Hidden Date Input - Overlay */}
            <input
              ref={dateInputRef}
              type='date'
              value={dayjs(selectedDate).format('YYYY-MM-DD')}
              onChange={handleDateChange}
              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              style={{ zIndex: 10 }}
            />
          </div>
        </div>
      </div>

      {/* Frame 20 - Today Navigation */}
      <div
        className='flex flex-row items-center w-auto min-w-[127px] h-[36px] border border-[var(--border)] rounded-lg flex-none order-1 flex-grow-0'
        style={{ padding: '4px 12px', gap: '12px' }}
      >
        {/* Left Chevron */}
        <button
          onClick={onPreviousDay}
          className='w-5 h-5 flex-none order-0 flex-grow-0 cursor-pointer hover:opacity-80 transition-opacity'
          disabled={!onPreviousDay}
        >
          <ChevronLeft className='w-5 h-5 text-[#717680]' />
        </button>

        {/* Today Text */}
        <button
          onClick={onTodayClick}
          className='w-auto min-w-[39px] h-7 flex-none order-1 flex-grow-0 cursor-pointer hover:opacity-80 transition-opacity'
          disabled={!onTodayClick}
        >
          <span
            className='w-auto h-7 font-normal text-[14px] leading-7 tracking-[-0.02em] text-[var(--foreground)] flex-none order-1 flex-grow-0 whitespace-nowrap'
            style={{ fontFamily: 'SF Pro' }}
          >
            {getNavigationText()}
          </span>
        </button>

        {/* Right Chevron */}
        <button
          onClick={onNextDay}
          className='w-5 h-5 flex-none order-2 flex-grow-0 cursor-pointer hover:opacity-80 transition-opacity'
          disabled={!onNextDay}
        >
          <ChevronRight className='w-5 h-5 text-[var(--foreground)]' />
        </button>
      </div>
    </div>
  );
};
