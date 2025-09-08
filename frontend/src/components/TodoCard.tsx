import React, { useState, useRef, useEffect } from 'react';
import { Todo, Priority } from '@/types/todos';
import { useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos';
import { MoreHorizontal, Edit, Trash2, Loader2 } from 'lucide-react';
import { EditTaskModal } from './EditTaskModal';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import dayjs from 'dayjs';

interface TodoCardProps {
  todo: Todo;
}

const getPriorityStyles = (priority: Priority) => {
  switch (priority) {
    case 'LOW':
      return {
        bg: 'bg-[#079455]',
        text: 'text-white',
        label: 'Low',
        width: 'w-[44px]',
        textWidth: 'w-[28px]',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-[#FDB022]',
        text: 'text-black',
        label: 'Medium',
        width: 'w-[70px]',
        textWidth: 'w-[54px]',
      };
    case 'HIGH':
      return {
        bg: 'bg-[#D9206E]',
        text: 'text-white',
        label: 'High',
        width: 'w-[48px]',
        textWidth: 'w-[32px]',
      };
    default:
      return {
        bg: 'bg-[#079455]',
        text: 'text-white',
        label: 'Low',
        width: 'w-[44px]',
        textWidth: 'w-[28px]',
      };
  }
};

export const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check if this todo is being updated or deleted
  const isUpdating = updateTodo.isPending;
  const isDeleting = deleteTodo.isPending;
  const isProcessing = isUpdating || isDeleting;

  // Calculate menu position when menu opens
  useEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8, // 8px gap below button
        right: window.innerWidth - rect.right, // Distance from right edge
      });
    }
  }, [isMenuOpen]);

  const handleToggleCompleted = () => {
    updateTodo.mutate({
      id: todo.id,
      updates: { completed: !todo.completed },
    });
  };

  const handleDelete = () => {
    // Show toast immediately for better UX
    const deleteToast = toast({
      title: 'Task deleted!',
      description: '',
      className: 'bg-red-500 text-white border-red-500',
    });

    deleteTodo.mutate(todo.id, {
      onSuccess: () => {
        setIsMenuOpen(false);
      },
      onError: (error) => {
        console.error('Error deleting task:', error);
        // Dismiss the success toast and show error toast
        deleteToast.dismiss();
        toast({
          title: 'Error deleting task',
          description: 'Please try again.',
          variant: 'destructive',
        });
        setIsMenuOpen(false);
      },
    });
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  const priorityStyles = getPriorityStyles(todo.priority);

  return (
    <div
      className='flex flex-row items-center w-[361px] md:w-[600px] h-[80px] md:h-[86px] bg-[var(--card-background)] border border-[var(--card-border)] rounded-2xl flex-none order-0 self-stretch flex-grow-0'
      style={{ padding: '12px', gap: '16px' }}
    >
      {/* Checkbox */}
      <div
        className={`w-6 h-6 border rounded-lg flex items-center justify-center flex-none order-0 flex-grow-0 ${
          isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        } ${
          todo.completed
            ? 'bg-[#0C4BCA] border-[#0C4BCA]'
            : 'bg-transparent border-[var(--border)]'
        }`}
        style={{ borderWidth: '1.2px', borderRadius: '7.2px' }}
        onClick={isProcessing ? undefined : handleToggleCompleted}
      >
        {isUpdating ? (
          <Loader2 className='w-4 h-4 text-white animate-spin' />
        ) : todo.completed ? (
          <svg
            className='w-4 h-4 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
        ) : null}
      </div>

      {/* Content */}
      <div
        className='flex flex-col items-start p-0 w-[265px] md:w-[496px] h-[56px] md:h-[62px] flex-none order-1 flex-grow-1'
        style={{ gap: '4px' }}
      >
        {/* Title */}
        <h3
          className={`w-[265px] md:w-[496px] h-[28px] md:h-[30px] text-[14px] md:text-[16px] font-semibold leading-[28px] md:leading-[30px] tracking-[-0.02em] flex-none order-0 self-stretch flex-grow-0 ${
            todo.completed
              ? 'line-through text-[var(--muted)]'
              : 'text-[var(--foreground)]'
          }`}
          style={{ fontFamily: 'SF Pro' }}
        >
          {todo.title}
        </h3>

        {/* Details */}
        <div
          className='flex flex-row items-center p-0 w-[125px] md:w-[148px] h-[24px] md:h-[28px] flex-none order-1 flex-grow-0'
          style={{ gap: '8px' }}
        >
          {/* Date */}
          <span
            className='w-[67px] md:w-[78px] h-[16px] md:h-[28px] text-[12px] md:text-[14px] font-normal leading-[16px] md:leading-[28px] tracking-[-0.02em] text-[var(--muted)] flex-none order-0 flex-grow-0'
            style={{ fontFamily: 'SF Pro' }}
          >
            {formatDate(todo.date)}
          </span>

          {/* Ellipse 1 - Separator dot */}
          <div className='w-0.5 h-0.5 bg-[#252B37] rounded-full flex-none order-1 flex-grow-0' />

          {/* Label - Priority badge */}
          <div
            className={`flex flex-row justify-center items-center ${priorityStyles.width} h-[24px] ${priorityStyles.bg} rounded-lg flex-none order-2 flex-grow-0`}
            style={{ padding: '8px', gap: '8px' }}
          >
            <span
              className={`${priorityStyles.textWidth} h-[24px] text-[12px] font-semibold leading-[24px] tracking-[-0.02em] ${priorityStyles.text} flex-none order-0 flex-grow-0`}
              style={{ fontFamily: 'SF Pro' }}
            >
              {priorityStyles.label}
            </span>
          </div>
        </div>
      </div>

      {/* Three Dots Menu - Right side with proper styling */}
      <div className='relative flex-none order-2 flex-grow-0'>
        <button
          ref={buttonRef}
          onClick={isProcessing ? undefined : handleMenuToggle}
          disabled={isProcessing}
          className={`w-6 h-6 flex items-center justify-center transition-colors ${
            isProcessing
              ? 'text-[#666] cursor-not-allowed'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          {isDeleting ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <MoreHorizontal className='w-4 h-4' />
          )}
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className='fixed inset-0 z-[9998]'
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu - Use fixed positioning to escape container clipping */}
            <div
              className={`fixed z-[9999] w-[196px] h-[100px] ${
                theme === 'light' ? 'bg-white' : 'bg-black'
              } border border-[var(--card-border)] rounded-2xl flex flex-col items-start p-4`}
              style={{
                gap: '20px',
                top: `${menuPosition.top}px`,
                right: `${menuPosition.right}px`,
              }}
            >
              {/* Edit Option */}
              <button
                onClick={handleEdit}
                className='flex flex-row items-center p-0 w-[57px] h-6 hover:opacity-80 transition-opacity'
                style={{ gap: '8px' }}
              >
                <Edit className='w-5 h-5 text-[var(--foreground)] flex-none order-0 flex-grow-0' />
                <span
                  className='w-[29px] h-6 text-[16px] font-normal leading-6 tracking-[-0.02em] text-[var(--foreground)] flex-none order-1 flex-grow-0'
                  style={{ fontFamily: 'SF Pro' }}
                >
                  Edit
                </span>
              </button>

              {/* Delete Option */}
              <button
                onClick={handleDelete}
                className='flex flex-row items-center p-0 w-[76px] h-6 hover:opacity-80 transition-opacity'
                style={{ gap: '8px' }}
              >
                <Trash2 className='w-5 h-5 text-[#D9206E] flex-none order-0 flex-grow-0' />
                <span
                  className='w-[48px] h-6 text-[16px] font-normal leading-6 tracking-[-0.02em] text-[#D9206E] flex-none order-1 flex-grow-0'
                  style={{ fontFamily: 'SF Pro' }}
                >
                  Delete
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        todo={{
          id: todo.id,
          task: todo.title,
          priority: todo.priority,
          dueDate: todo.date,
        }}
      />
    </div>
  );
};
