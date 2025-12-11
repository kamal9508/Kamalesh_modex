import { useMemo, useCallback } from 'react';
import { format, parseISO, isToday, isTomorrow, addDays } from 'date-fns';
import { Clock, CalendarDays } from 'lucide-react';
import { TimeSlot } from '@/types';
import { cn } from '@/lib/utils';

interface SlotGridProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export function SlotGrid({ slots, selectedSlotId, onSelectSlot }: SlotGridProps) {
  const groupedSlots = useMemo(() => {
    const groups: Record<string, TimeSlot[]> = {};
    
    slots.forEach(slot => {
      if (!groups[slot.date]) {
        groups[slot.date] = [];
      }
      groups[slot.date].push(slot);
    });

    // Sort slots within each date by time
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return groups;
  }, [slots]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedSlots).sort();
  }, [groupedSlots]);

  const formatDateLabel = useCallback((dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  }, []);

  const formatTime = useCallback((time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }, []);

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No available slots at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date, dateIndex) => (
        <div key={date} className="animate-slide-up" style={{ animationDelay: `${dateIndex * 0.1}s` }}>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h4 className="font-display font-semibold text-foreground">
              {formatDateLabel(date)}
            </h4>
            <span className="text-xs text-muted-foreground">
              ({groupedSlots[date].filter(s => !s.isBooked).length} available)
            </span>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {groupedSlots[date].map(slot => (
              <button
                key={slot.id}
                disabled={slot.isBooked}
                onClick={() => !slot.isBooked && onSelectSlot(slot)}
                className={cn(
                  "flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  slot.isBooked && "slot-booked",
                  !slot.isBooked && selectedSlotId !== slot.id && "slot-available",
                  selectedSlotId === slot.id && "slot-selected"
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                {formatTime(slot.startTime)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
