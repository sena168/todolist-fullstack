import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggleTheme = () => {
    toggleTheme();
  };

  return (
    <div
      className={`flex flex-row justify-between items-center p-0 w-[361px] md:w-[600px] h-[64px] md:h-[70px] ${
        theme === 'light' ? 'bg-white' : 'bg-black'
      }`}
      style={{ gap: '24px' }}
    >
      {/* Frame 15 - Title Section */}
      <div
        className='flex flex-col items-start p-0 w-[271px] md:w-[334px] h-[64px] md:h-[70px] flex-none order-0 flex-grow-0'
        style={{ gap: '2px' }}
      >
        {/* Main Title */}
        <div className='w-[271px] md:w-[334px] h-[34px] md:h-[38px] flex-none order-0 flex-grow-0'>
          <h1
            className='w-[271px] md:w-[334px] h-[34px] md:h-[38px] font-bold text-[20px] md:text-[28px] leading-[34px] md:leading-[38px] tracking-[-0.02em] text-[var(--foreground)] flex-none order-0 flex-grow-0'
            style={{ fontFamily: 'SF Pro' }}
          >
            What's on Your Plan Today?
          </h1>
        </div>

        {/* Subtitle */}
        <div className='w-[181px] md:w-[207px] h-[28px] md:h-[24px] flex-none order-1 flex-grow-0'>
          <p
            className='w-[181px] md:w-[207px] h-[28px] md:h-[24px] font-normal text-[14px] md:text-[16px] leading-[28px] md:leading-[24px] tracking-[-0.02em] text-[var(--muted)] flex-none order-1 flex-grow-0'
            style={{ fontFamily: 'SF Pro' }}
          >
            Your productivity starts now.
          </p>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className='flex flex-row items-center p-2 gap-2 w-[72px] md:w-[88px] h-[40px] md:h-[48px] bg-[var(--secondary)] border border-[var(--border)] rounded-2xl flex-none order-1 flex-grow-0'>
        {/* Light Theme Button */}
        <div
          className={`flex flex-row justify-center items-center p-1.5 md:p-2 gap-1.5 md:gap-2 w-6 h-6 md:w-8 md:h-8 rounded-xl flex-none order-0 flex-grow-0 cursor-pointer ${
            theme === 'light' ? 'bg-[var(--primary)]' : ''
          }`}
          onClick={handleToggleTheme}
        >
          <Sun
            className={`w-4 h-4 md:w-5 md:h-5 ${
              theme === 'light' ? 'text-white' : 'text-[var(--foreground)]'
            }`}
          />
        </div>

        {/* Dark Theme Button */}
        <div
          className={`flex flex-row justify-center items-center p-1.5 md:p-2 gap-1.5 md:gap-2 w-6 h-6 md:w-8 md:h-8 rounded-xl flex-none order-1 flex-grow-0 cursor-pointer ${
            theme === 'dark' ? 'bg-[var(--primary)]' : ''
          }`}
          onClick={handleToggleTheme}
        >
          <Moon
            className={`w-4 h-4 md:w-5 md:h-5 ${
              theme === 'dark' ? 'text-white' : 'text-[var(--foreground)]'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
