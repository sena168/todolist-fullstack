import React, { useState, useEffect } from 'react';
import { UpcomingHeader } from './UpcomingHeader';
import { DateSelector } from './DateSelector';
import { TodoList } from './TodoList';
import { useAppDispatch } from '@/hooks/redux';
import { setDateGte, setDateLte } from '@/store/slices/filtersSlice';
import dayjs from 'dayjs';

interface UpcomingSectionProps {
  onAddTask?: () => void;
}

export const UpcomingSection: React.FC<UpcomingSectionProps> = ({
  onAddTask,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD') // Start with current date
  );
  const [itemCount, setItemCount] = useState(0);
  const [headerKey, setHeaderKey] = useState(0);
  const dispatch = useAppDispatch();

  // Update date filters when selected date changes
  useEffect(() => {
    const startOfDay = dayjs(selectedDate).startOf('day').toISOString();
    const endOfDay = dayjs(selectedDate).endOf('day').toISOString();

    dispatch(setDateGte(startOfDay));
    dispatch(setDateLte(endOfDay));

    // Force header re-render
    setHeaderKey((prev) => prev + 1);
  }, [selectedDate, dispatch]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handlePreviousDay = () => {
    const previousDay = dayjs(selectedDate)
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    setSelectedDate(previousDay);
  };

  const handleNextDay = () => {
    const nextDay = dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD');
    setSelectedDate(nextDay);
  };

  const handleTodayClick = () => {
    const today = dayjs().format('YYYY-MM-DD');
    setSelectedDate(today);
  };

  const handleCountChange = (count: number) => {
    setItemCount(count);
  };

  const handleAddTask = () => {
    if (onAddTask) {
      onAddTask();
    }
  };

  const formattedDate = dayjs(selectedDate).format('MMM D, YYYY');

  return (
    <>
      {/* Upcoming Header */}
      <div className='flex-none order-3 self-stretch flex-grow-0'>
        <UpcomingHeader
          key={headerKey}
          itemCount={itemCount}
          selectedDate={formattedDate}
          onDateChange={handleDateSelect}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onTodayClick={handleTodayClick}
        />
      </div>

      {/* Date Selector */}
      <div className='flex-none order-4 self-stretch flex-grow-0'>
        <DateSelector
          key={selectedDate}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* Todo List */}
      <div
        className='flex flex-col items-center p-0 w-[361px] md:w-[600px] h-[356px] md:h-[380px] flex-none order-5 self-stretch flex-grow-0'
        style={{ gap: '12px' }}
      >
        <TodoList onAddTask={handleAddTask} onCountChange={handleCountChange} />
      </div>
    </>
  );
};
