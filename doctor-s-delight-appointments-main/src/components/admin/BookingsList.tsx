import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, User, Clock, X, CheckCircle, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BookingStatusBadge } from '@/components/booking/BookingStatus';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Doctor, TimeSlot } from '@/types';
import * as api from '@/services/api';

export function BookingsList() {
  const { bookings, doctors, confirmBooking, cancelBooking, fetchAllBookings } = useApp();
  const [slotsMap, setSlotsMap] = useState<Record<string, TimeSlot>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch slot details for each booking
  useEffect(() => {
    const fetchSlots = async () => {
      const uniqueDoctorIds = [...new Set(bookings.map(b => b.doctorId))];
      const allSlots: TimeSlot[] = [];

      for (const doctorId of uniqueDoctorIds) {
        try {
          const slots = await api.fetchSlotsByDoctorId(doctorId);
          allSlots.push(...slots);
        } catch (error) {
          console.error('Error fetching slots:', error);
        }
      }

      const map: Record<string, TimeSlot> = {};
      allSlots.forEach(slot => {
        map[slot.id] = slot;
      });
      setSlotsMap(map);
    };

    if (bookings.length > 0) {
      fetchSlots();
    }
  }, [bookings]);

  const enrichedBookings = useMemo(() => {
    return bookings.map(booking => {
      const doctor = doctors.find(d => d.id === booking.doctorId);
      const slot = slotsMap[booking.slotId];
      return { ...booking, doctor, slot };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings, doctors, slotsMap]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleConfirm = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await confirmBooking(bookingId);
      toast({ title: 'Booking confirmed successfully' });
    } catch (error) {
      toast({
        title: 'Failed to confirm booking',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await cancelBooking(bookingId);
      toast({ title: 'Booking cancelled successfully' });
    } catch (error) {
      toast({
        title: 'Failed to cancel booking',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (enrichedBookings.length === 0) {
    return (
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            All Bookings
          </CardTitle>
          <CardDescription>View and manage all appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bookings yet.</p>
            <p className="text-sm mt-2">Bookings will appear here once patients start booking appointments.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          All Bookings
        </CardTitle>
        <CardDescription>View and manage all appointments ({enrichedBookings.length} total).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedBookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{booking.patientName}</p>
                        <p className="text-xs text-muted-foreground">{booking.patientEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.doctor?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{booking.doctor?.specialization}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.slot ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {format(parseISO(booking.slot.date), 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(booking.slot.startTime)} - {formatTime(booking.slot.endTime)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Loading...</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} size="sm" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {actionLoading === booking.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          {booking.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 text-success border-success/20 hover:bg-success/10"
                                onClick={() => handleConfirm(booking.id)}
                              >
                                <CheckCircle className="h-3 w-3" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                                onClick={() => handleCancel(booking.id)}
                              >
                                <X className="h-3 w-3" />
                                Cancel
                              </Button>
                            </>
                          )}
                          {booking.status === 'CONFIRMED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                              onClick={() => handleCancel(booking.id)}
                            >
                              <X className="h-3 w-3" />
                              Cancel
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
