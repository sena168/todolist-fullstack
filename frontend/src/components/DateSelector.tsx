import React from 'react';
import dayjs from 'dayjs';

interface DateSelectorProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  // Generate 8 days with selected date in the middle (3 days before, selected date, 4 days after)
  const generateDays = () => {
    const days = [];
    const selectedDay = dayjs(selectedDate);

    // Add 3 days before selected date
    for (let i = -3; i < 0; i++) {
      const date = selectedDay.add(i, 'day');
      days.push({
        day: date.format('ddd'),
        date: date.format('D'),
        fullDate: date.format('YYYY-MM-DD'),
        isSelected: date.format('YYYY-MM-DD') === selectedDate,
        isToday: date.isSame(dayjs(), 'day'),
      });
    }

    // Add selected date
    days.push({
      day: selectedDay.format('ddd'),
      date: selectedDay.format('D'),
      fullDate: selectedDay.format('YYYY-MM-DD'),
      isSelected: true,
      isToday: selectedDay.isSame(dayjs(), 'day'),
    });

    // Add 4 days after selected date
    for (let i = 1; i <= 4; i++) {
      const date = selectedDay.add(i, 'day');
      days.push({
        day: date.format('ddd'),
        date: date.format('D'),
        fullDate: date.format('YYYY-MM-DD'),
        isSelected: date.format('YYYY-MM-DD') === selectedDate,
        isToday: date.isSame(dayjs(), 'day'),
      });
    }

    return days;
  };

  const days = generateDays();

  return (
    <div className='flex flex-row items-start p-0 w-[361px] md:w-[600px] h-[44px] flex-none order-4 self-stretch flex-grow-0 overflow-x-auto'>
      {days.map((day) => (
        <div
          key={day.fullDate}
          className={`flex flex-col justify-center items-center p-2 w-[45px] md:w-[75px] h-[44px] flex-none flex-grow-1 cursor-pointer ${
            day.isSelected
              ? 'border-b-2 border-[#0C4BCA]'
              : 'border-b border-[var(--border)]'
          }`}
          style={{ gap: '8px' }}
          onClick={() => onDateSelect(day.fullDate)}
        >
          <div
            className='flex flex-row justify-center items-center p-0 w-[29px] md:w-[59px] h-7 flex-none order-0 self-stretch flex-grow-0'
            style={{ gap: '8px' }}
          >
            {/* Day Name */}
            <div className='w-auto h-7 flex-none order-0 flex-grow-0'>
              <span
                className={`w-auto h-7 text-[12px] md:text-[14px] leading-7 text-center tracking-[-0.02em] flex-none order-0 flex-grow-0 ${
                  day.isSelected
                    ? 'text-[var(--foreground)]'
                    : 'text-[var(--muted)]'
                }`}
                style={{ fontFamily: 'SF Pro' }}
              >
                {day.day}
              </span>
            </div>

            {/* Date Number */}
            {day.isSelected ? (
              <div
                className='flex flex-col justify-center items-center p-0 w-6 h-6 bg-[var(--primary)] rounded-lg flex-none order-1 flex-grow-0'
                style={{ gap: '8px' }}
              >
                <span
                  className='w-6 h-7 text-[12px] md:text-[14px] leading-7 text-center tracking-[-0.02em] text-white flex-none order-0 self-stretch flex-grow-0'
                  style={{ fontFamily: 'SF Pro' }}
                >
                  {day.date}
                </span>
              </div>
            ) : (
              <div className='w-auto h-7 flex-none order-1 flex-grow-0'>
                <span
                  className='w-auto h-7 text-[12px] md:text-[14px] leading-7 text-center tracking-[-0.02em] text-[var(--muted)] flex-none order-1 flex-grow-0'
                  style={{ fontFamily: 'SF Pro' }}
                >
                  {day.date}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
