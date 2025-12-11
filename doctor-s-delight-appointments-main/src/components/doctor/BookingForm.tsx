import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Doctor, TimeSlot } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

interface BookingFormProps {
  doctor: Doctor;
  selectedSlot: TimeSlot | null;
  onClose: () => void;
}

export function BookingForm({ doctor, selectedSlot, onClose }: BookingFormProps) {
  const navigate = useNavigate();
  const { bookSlot, isLoading } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      toast({
        title: 'No slot selected',
        description: 'Please select a time slot before booking.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.patientName || !formData.patientEmail || !formData.patientPhone) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const booking = await bookSlot({
        doctorId: doctor.id,
        slotId: selectedSlot.id,
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        notes: formData.notes,
      });

      toast({
        title: 'Booking initiated!',
        description: 'Your appointment is being confirmed.',
      });

      navigate(`/booking/${booking.id}`);
    } catch (error) {
      toast({
        title: 'Booking failed',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatSlotDetails = () => {
    if (!selectedSlot) return null;
    const date = parseISO(selectedSlot.date);
    const [hours, minutes] = selectedSlot.startTime.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${format(date, 'EEEE, MMMM d, yyyy')} at ${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">Book Appointment</h3>
          <p className="text-sm text-muted-foreground mt-1">Fill in your details to confirm booking</p>
        </div>
        {selectedSlot && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Selected Slot</p>
            <p className="text-sm font-medium text-primary">{formatSlotDetails()}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Full Name *
          </Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={formData.patientName}
            onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.patientEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, patientEmail: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.patientPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, patientPhone: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Any symptoms or concerns you'd like to mention..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="pt-4 space-y-3">
          <Button
            type="submit"
            className="w-full h-12 text-base gap-2"
            disabled={!selectedSlot || loading || isLoading}
          >
            {loading || isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Confirm Booking - ${doctor.consultationFee}
              </>
            )}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
