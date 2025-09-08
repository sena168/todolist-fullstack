import React, { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateTodo } from '@/hooks/useTodos';
import { Priority } from '@/types/todos';
import { Plus } from 'lucide-react';
import dayjs from 'dayjs';

const addTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  date: z.string().min(1, 'Date is required'),
});

type AddTodoFormData = z.infer<typeof addTodoSchema>;

export const AddTodoForm: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const createTodo = useCreateTodo();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddTodoFormData>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: {
      title: '',
      priority: 'MEDIUM',
      date: dayjs().format('YYYY-MM-DD'),
    },
  });

  const watchedPriority = watch('priority');

  const onSubmit = (data: AddTodoFormData) => {
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
          setIsExpanded(false);
        },
      }
    );
  };

  const handleCancel = () => {
    reset();
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className='flex flex-row justify-center items-center w-[300px] h-12 bg-[#0C4BCA] rounded-lg hover:bg-[#0C4BCA]/90 transition-colors'
        style={{ padding: '8px', gap: '6px' }}
      >
        <Plus className='w-5 h-5 text-white' />
        <span className='w-[70px] h-[30px] text-[16px] font-semibold leading-[30px] tracking-[-0.02em] text-white'>
          Add Task
        </span>
      </button>
    );
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg'>Add New Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Input
              {...register('title')}
              placeholder='What needs to be done?'
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className='text-sm text-destructive mt-1'>
                {errors.title.message}
              </p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Select
                value={watchedPriority}
                onValueChange={(value) =>
                  setValue('priority', value as Priority)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='LOW'>Low Priority</SelectItem>
                  <SelectItem value='MEDIUM'>Medium Priority</SelectItem>
                  <SelectItem value='HIGH'>High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                {...register('date')}
                type='date'
                className={errors.date ? 'border-destructive' : ''}
              />
              {errors.date && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div className='flex gap-2 pt-2'>
            <Button
              type='submit'
              disabled={createTodo.isPending}
              className='flex-1'
            >
              {createTodo.isPending ? 'Adding...' : 'Add Todo'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              disabled={createTodo.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
