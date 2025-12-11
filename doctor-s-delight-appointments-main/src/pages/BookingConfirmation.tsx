import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Mail, Phone, FileText, Home, Printer, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Layout } from '@/components/layout/Layout';
import { BookingStatusCard } from '@/components/booking/BookingStatus';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Booking, Doctor } from '@/types';

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookingById, getDoctorById } = useApp();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch booking and doctor data
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const bookingData = await getBookingById(id);
        setBooking(bookingData);
        
        if (bookingData) {
          const doctorData = await getDoctorById(bookingData.doctorId);
          setDoctor(doctorData);
        }
      } catch (error) {
        console.error('Error loading booking:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, getBookingById, getDoctorById]);

  // Poll for status updates
  useEffect(() => {
    if (!id || !booking || booking.status !== 'PENDING') return;
    
    const interval = setInterval(async () => {
      try {
        const updatedBooking = await getBookingById(id);
        if (updatedBooking && updatedBooking.status !== booking.status) {
          setBooking(updatedBooking);
        }
      } catch (error) {
        console.error('Error polling booking status:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [id, booking, getBookingById]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Booking not found</h1>
          <p className="text-muted-foreground mb-6">The booking you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Booking {booking.status === 'CONFIRMED' ? 'Confirmed' : 'Status'}
            </h1>
            <p className="text-muted-foreground">
              Booking ID: <span className="font-mono text-sm">{booking.id.slice(0, 8)}</span>
            </p>
          </div>

          <BookingStatusCard status={booking.status} />

          <Card className="border-border/50 shadow-card animate-slide-up">
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-semibold mb-4">Appointment Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor Info */}
                {doctor && (
                  <div className="flex items-start gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{doctor.name}</p>
                      <p className="text-sm text-primary">{doctor.specialization}</p>
                      <p className="text-sm text-muted-foreground">{doctor.hospital}</p>
                    </div>
                  </div>
                )}

                {/* Date & Time */}
                {booking.slot && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{format(parseISO(booking.slot.date), 'EEEE, MMMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">
                          {formatTime(booking.slot.startTime)} - {formatTime(booking.slot.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border my-6" />

              <h3 className="font-display text-lg font-semibold mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{booking.patientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{booking.patientEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{booking.patientPhone}</p>
                  </div>
                </div>
                {booking.notes && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="font-medium">{booking.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {doctor && (
                <>
                  <div className="border-t border-border my-6" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Consultation Fee</p>
                      <p className="font-display text-2xl font-bold text-foreground">${doctor.consultationFee}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                      <Link to="/">
                        <Button className="gap-2">
                          <Home className="h-4 w-4" />
                          Back Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BookingConfirmation;
