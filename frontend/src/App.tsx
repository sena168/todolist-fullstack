import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { TabNavigation } from '@/components/TabNavigation';
import { TodoSection } from '@/components/TodoSection';
import { UpcomingSection } from '@/components/UpcomingSection';
import { CompletedSection } from '@/components/CompletedSection';
import { AddTaskModal } from '@/components/AddTaskModal';
import { setDateGte, setDateLte } from '@/store/slices/filtersSlice';
import dayjs from 'dayjs';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<
    'today' | 'upcoming' | 'completed'
  >('today');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // Set appropriate filters based on active tab
  useEffect(() => {
    if (activeTab === 'today') {
      const today = dayjs();
      const startOfDay = today.startOf('day').toISOString();
      const endOfDay = today.endOf('day').toISOString();
      dispatch(setDateGte(startOfDay));
      dispatch(setDateLte(endOfDay));
    } else if (activeTab === 'completed') {
      // Clear date filters for completed tab - show all completed todos regardless of date
      dispatch(setDateGte(undefined));
      dispatch(setDateLte(undefined));
    }
    // For 'upcoming' tab, let UpcomingSection manage its own date filters
  }, [activeTab, dispatch]);

  const renderContent = () => {
    switch (activeTab) {
      case 'upcoming':
        return (
          <UpcomingSection onAddTask={() => setIsAddTaskModalOpen(true)} />
        );
      case 'completed':
        return (
          <>
            {/* Completed Section */}
            <div className='flex-none order-3 self-stretch flex-grow-0'>
              <CompletedSection onAddTask={() => setIsAddTaskModalOpen(true)} />
            </div>
          </>
        );
      case 'today':
      default:
        return (
          <>
            {/* Todo Section */}
            <div className='flex-none order-3 self-stretch flex-grow-0'>
              <TodoSection onAddTask={() => setIsAddTaskModalOpen(true)} />
            </div>
          </>
        );
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'light' ? 'bg-white' : 'bg-black'
      } flex justify-center items-start pt-6 md:pt-[104px]`}
    >
      {/* Frame 4 - Main Content - Mobile First Responsive */}
      <div
        className='w-[361px] md:w-[600px] h-auto md:h-[766px] flex flex-col items-center p-0'
        style={{ gap: '20px' }}
      >
        {/* Header */}
        <div className='flex-none order-0 self-stretch flex-grow-0'>
          <Header />
        </div>

        {/* Search Bar */}
        <div className='flex-none order-1 self-stretch flex-grow-0'>
          <SearchBar />
        </div>

        {/* Tab Navigation */}
        <div className='flex-none order-2 self-stretch flex-grow-0'>
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Dynamic Content based on active tab */}
        {renderContent()}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppContent />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
