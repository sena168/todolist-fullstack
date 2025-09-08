import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateTodo } from '@/hooks/useTodos';
import { Priority } from '@/types/todos';
import { X, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import dayjs from 'dayjs';

const addTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  priority: z
    .string()
    .min(1, 'Priority is required')
    .refine((val) => ['LOW', 'MEDIUM', 'HIGH'].includes(val), {
      message: 'Priority is required',
    }),
  date: z.string().min(1, 'Date is required'),
});

type AddTaskFormData = z.infer<typeof addTaskSchema>;

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
}) => {
  const createTodo = useCreateTodo();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddTaskFormData>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: '',
      priority: '',
      date: '',
    },
  });

  const watchedTitle = watch('title');
  const watchedPriority = watch('priority');
  const watchedDate = watch('date');
  const dateInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const onSubmit = (data: AddTaskFormData) => {
    createTodo.mutate(
      {
        title: data.title,
        priority: data.priority as Priority,
        date: dayjs(data.date).toISOString(),
        completed: false,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
          toast({
            title: 'Task Added!',
            className: 'bg-green-500 text-white border-0',
          });
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${
        theme === 'light' ? 'bg-white/50' : 'bg-black/50'
      } flex items-center justify-center z-50 p-4`}
    >
      <div
        className={`${
          theme === 'light' ? 'bg-white' : 'bg-black'
        } border border-[var(--input-border)] rounded-2xl w-[361px] md:w-[468px]`}
      >
        {/* Add Task Container */}
        <div
          className='flex flex-col items-start p-4 md:p-6'
          style={{
            gap: '16px',
          }}
        >
          {/* Header */}
          <div
            className='flex flex-row justify-between items-center w-[329px] md:w-[420px] h-8 md:h-9'
            style={{
              gap: '144px',
            }}
          >
            {/* Title */}
            <div className='w-[79px] md:w-[102px] h-8 md:h-9 flex-none order-0 flex-grow-0'>
              <h2
                className='w-[79px] md:w-[102px] h-8 md:h-9 font-bold text-[18px] md:text-[24px] leading-8 md:leading-9 text-[var(--foreground)] flex-none order-0 flex-grow-0'
                style={{ fontFamily: 'SF Pro', letterSpacing: '-0.03em' }}
              >
                Add Task
              </h2>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className='w-6 h-6 flex items-center justify-center text-[var(--foreground)] hover:text-[var(--muted)] transition-colors flex-none order-1 flex-grow-0'
            >
              <X className='w-4 h-4' />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col items-start w-[329px] md:w-[420px]'
            style={{
              gap: '16px',
            }}
          >
            {/* Task Input - Large Textarea */}
            <div className='flex flex-col gap-2 w-full'>
              <div className='relative w-full'>
                <div
                  className={`flex flex-row items-start w-full h-[140px] border rounded-lg flex-none self-stretch flex-grow-0 ${
                    errors.title
                      ? 'border-[#D9206E]'
                      : 'border-[var(--input-border)]'
                  }`}
                  style={{ padding: '8px 12px', gap: '8px' }}
                >
                  <textarea
                    {...register('title')}
                    placeholder='Enter your task'
                    className={`w-full h-full bg-transparent placeholder-transparent focus:outline-none resize-none flex-none flex-grow-1 ${
                      errors.title
                        ? 'text-[#D9206E]'
                        : 'text-[var(--foreground)]'
                    }`}
                    style={{
                      fontFamily: 'SF Pro',
                      fontSize: '14px',
                      lineHeight: '28px',
                      letterSpacing: '-0.02em',
                    }}
                  />
                </div>
                <label
                  className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                    watchedTitle
                      ? 'top-1 text-xs text-[var(--muted)]'
                      : 'top-2 text-sm text-[var(--muted)]'
                  }`}
                  style={{ fontFamily: 'SF Pro' }}
                >
                  Enter your task
                </label>
              </div>
              {errors.title && (
                <p
                  className='text-sm text-[#D9206E]'
                  style={{ fontFamily: 'SF Pro' }}
                >
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Priority Dropdown */}
            <div className='flex flex-col gap-2 w-full'>
              <div className='relative w-full'>
                <div
                  className={`flex flex-row justify-center items-center w-full h-12 border rounded-lg flex-none self-stretch flex-grow-0 ${
                    errors.priority
                      ? 'border-[#D9206E]'
                      : 'border-[var(--input-border)]'
                  }`}
                  style={{ padding: '8px 12px', gap: '8px' }}
                >
                  <Select
                    value={watchedPriority || undefined}
                    onValueChange={(value) =>
                      setValue('priority', value as Priority)
                    }
                  >
                    <SelectTrigger
                      className={`w-full h-full bg-transparent border-none focus:ring-0 p-0 ${
                        errors.priority
                          ? 'text-[#D9206E]'
                          : watchedPriority
                          ? 'text-[var(--foreground)]'
                          : 'text-transparent'
                      }`}
                    >
                      <SelectValue
                        placeholder=''
                        className={
                          watchedPriority
                            ? 'text-[var(--foreground)]'
                            : 'text-transparent'
                        }
                        style={{
                          fontFamily: 'SF Pro',
                          fontSize: '14px',
                          lineHeight: '28px',
                          letterSpacing: '-0.02em',
                        }}
                      />
                    </SelectTrigger>
                    <SelectContent className='bg-[var(--card-background)] border border-[var(--input-border)] rounded-lg'>
                      <SelectItem
                        value='LOW'
                        className='text-[var(--foreground)] hover:bg-[var(--secondary)] focus:bg-[var(--secondary)]'
                        style={{ fontFamily: 'SF Pro' }}
                      >
                        Low
                      </SelectItem>
                      <SelectItem
                        value='MEDIUM'
                        className='text-[var(--foreground)] hover:bg-[var(--secondary)] focus:bg-[var(--secondary)]'
                        style={{ fontFamily: 'SF Pro' }}
                      >
                        Medium
                      </SelectItem>
                      <SelectItem
                        value='HIGH'
                        className='text-[var(--foreground)] hover:bg-[var(--secondary)] focus:bg-[var(--secondary)]'
                        style={{ fontFamily: 'SF Pro' }}
                      >
                        High
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <label
                  className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                    watchedPriority
                      ? 'top-1 text-xs text-[var(--muted)]'
                      : 'top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]'
                  }`}
                  style={{ fontFamily: 'SF Pro' }}
                >
                  Select priority
                </label>
              </div>
              {errors.priority && (
                <p
                  className='text-sm text-[#D9206E]'
                  style={{ fontFamily: 'SF Pro' }}
                >
                  {errors.priority.message}
                </p>
              )}
            </div>

            {/* Date Selector */}
            <div className='flex flex-col gap-2 w-full'>
              <div className='relative w-full'>
                <div
                  className={`flex flex-row justify-center items-center w-full h-12 border rounded-lg flex-none self-stretch flex-grow-0 cursor-pointer ${
                    errors.date
                      ? 'border-[#D9206E]'
                      : 'border-[var(--input-border)]'
                  }`}
                  style={{ padding: '8px 12px', gap: '8px' }}
                  onClick={() => dateInputRef.current?.showPicker()}
                >
                  <div className='flex-1 relative'>
                    <Input
                      {...register('date')}
                      ref={dateInputRef}
                      type='date'
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                      style={{
                        fontFamily: 'SF Pro',
                        fontSize: '14px',
                        lineHeight: '28px',
                        letterSpacing: '-0.02em',
                      }}
                      onChange={(e) => {
                        setValue('date', e.target.value);
                      }}
                    />
                    <div
                      className={`w-full h-full flex items-center pointer-events-none ${
                        errors.date
                          ? 'text-[#D9206E]'
                          : watchedDate && watchedDate !== ''
                          ? 'text-[var(--foreground)]'
                          : 'text-transparent'
                      }`}
                      style={{
                        fontFamily: 'SF Pro',
                        fontSize: '14px',
                        lineHeight: '28px',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {watchedDate && watchedDate !== ''
                        ? dayjs(watchedDate).format('D MMMM YYYY')
                        : ''}
                    </div>
                  </div>
                  <div className='w-4 h-4 flex-none order-1 flex-grow-0'>
                    <Calendar
                      className={`w-4 h-4 ${
                        errors.date
                          ? 'text-[#D9206E]'
                          : 'text-[var(--foreground)]'
                      }`}
                    />
                  </div>
                </div>
                <label
                  className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                    watchedDate && watchedDate !== ''
                      ? 'top-1 text-xs text-[var(--muted)]'
                      : 'top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]'
                  }`}
                  style={{ fontFamily: 'SF Pro' }}
                >
                  Select date
                </label>
              </div>
              {errors.date && (
                <p
                  className='text-sm text-[#D9206E]'
                  style={{ fontFamily: 'SF Pro' }}
                >
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Save Button */}
            <Button
              type='submit'
              disabled={createTodo.isPending}
              className='flex flex-row justify-center items-center w-full h-11 md:h-12 bg-[#0C4BCA] hover:bg-[#0A3BA8] rounded-lg flex-none self-stretch flex-grow-0 transition-colors'
              style={{ padding: '8px', gap: '6px' }}
            >
              <span
                className='w-[33px] md:w-[37px] h-7 md:h-[30px] font-semibold text-[14px] md:text-[16px] leading-7 md:leading-[30px] tracking-[-0.02em] text-white flex-none flex-grow-0'
                style={{ fontFamily: 'SF Pro' }}
              >
                {createTodo.isPending ? 'Saving...' : 'Save'}
              </span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
