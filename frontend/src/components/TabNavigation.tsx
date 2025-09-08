import React from 'react';

interface TabNavigationProps {
  activeTab: 'today' | 'upcoming' | 'completed';
  onTabChange: (tab: 'today' | 'upcoming' | 'completed') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'today' as const, label: 'Today' },
    { id: 'upcoming' as const, label: 'Upcoming' },
    { id: 'completed' as const, label: 'Completed' },
  ];

  return (
    <div
      className='flex flex-row items-center w-[361px] md:w-[600px] h-[48px] md:h-[52px] bg-[var(--tab-background)] border border-[var(--tab-border)] rounded-2xl flex-none order-2 self-stretch flex-grow-0'
      style={{ padding: '8px' }}
    >
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className={`flex flex-row justify-center items-center w-[115px] md:w-[194.67px] h-8 md:h-9 rounded-lg flex-none flex-grow-1 cursor-pointer ${
            activeTab === tab.id
              ? 'bg-[var(--primary)]'
              : 'hover:bg-[var(--secondary)] transition-colors'
          }`}
          style={{
            padding: '4px 12px',
            gap: '8px',
            order: index,
          }}
          onClick={() => onTabChange(tab.id)}
        >
          <span
            className={`w-auto h-7 text-[14px] leading-7 tracking-[-0.02em] flex-none order-0 flex-grow-0 font-["SF_Pro"] ${
              activeTab === tab.id
                ? 'font-semibold text-white'
                : 'font-normal text-[var(--foreground)]'
            }`}
          >
            {tab.label}
          </span>
        </div>
      ))}
    </div>
  );
};
