import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        className,
        ...props
      }) {
        // Determine variant based on className
        const isSuccess =
          className?.includes('bg-green-500') || className?.includes('success');
        const isError =
          className?.includes('bg-red-500') ||
          className?.includes('destructive') ||
          className?.includes('error') ||
          title?.toLowerCase().includes('delete') ||
          title?.toLowerCase().includes('error');

        let variant: 'default' | 'success' | 'error' = 'default';
        if (isSuccess) variant = 'success';
        else if (isError) variant = 'error';

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className='flex items-center justify-between w-full'>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription className='hidden md:block'>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
