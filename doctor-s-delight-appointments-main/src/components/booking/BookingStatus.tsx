import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { BookingStatus as Status } from '@/types';
import { cn } from '@/lib/utils';

interface BookingStatusProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  PENDING: {
    icon: Clock,
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20',
    iconClass: 'text-warning',
    description: 'Your booking is being processed...',
  },
  CONFIRMED: {
    icon: CheckCircle,
    label: 'Confirmed',
    className: 'bg-success/10 text-success border-success/20',
    iconClass: 'text-success',
    description: 'Your appointment has been confirmed!',
  },
  FAILED: {
    icon: XCircle,
    label: 'Failed',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    iconClass: 'text-destructive',
    description: 'Booking could not be completed.',
  },
  CANCELLED: {
    icon: XCircle,
    label: 'Cancelled',
    className: 'bg-muted text-muted-foreground border-border',
    iconClass: 'text-muted-foreground',
    description: 'This booking has been cancelled.',
  },
};

export function BookingStatusBadge({ status, size = 'md' }: BookingStatusProps) {
  const config = statusConfig[status];
  const Icon = status === 'PENDING' ? Loader2 : config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        config.className,
        sizeClasses[size]
      )}
    >
      <Icon className={cn('h-4 w-4', config.iconClass, status === 'PENDING' && 'animate-spin')} />
      {config.label}
    </span>
  );
}

export function BookingStatusCard({ status }: { status: Status }) {
  const config = statusConfig[status];
  const Icon = status === 'PENDING' ? Loader2 : config.icon;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 rounded-2xl border text-center',
      config.className
    )}>
      <div className={cn(
        'w-20 h-20 rounded-full flex items-center justify-center mb-4',
        status === 'CONFIRMED' && 'bg-success/20',
        status === 'PENDING' && 'bg-warning/20',
        status === 'FAILED' && 'bg-destructive/20',
        status === 'CANCELLED' && 'bg-muted'
      )}>
        <Icon className={cn(
          'h-10 w-10',
          config.iconClass,
          status === 'PENDING' && 'animate-spin'
        )} />
      </div>
      <h3 className="font-display text-2xl font-bold mb-2">{config.label}</h3>
      <p className="text-sm opacity-80">{config.description}</p>
    </div>
  );
}
