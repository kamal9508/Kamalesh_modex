import { useState } from 'react';
import { Plus, Calendar, Clock, User, Loader2 } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const timeOptions = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

export function AddSlotsForm() {
  const { doctors, addSlots, isLoading } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    duration: '30',
  });

  const generateTimeSlots = (startTime: string, endTime: string, durationMinutes: number) => {
    const slots: { start: string; end: string }[] = [];
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const startStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      
      currentMin += durationMinutes;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
      
      if (currentHour > endHour || (currentHour === endHour && currentMin > endMin)) break;
      
      const endStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      slots.push({ start: startStr, end: endStr });
    }
    
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.doctorId || !formData.date) {
      toast({
        title: 'Missing information',
        description: 'Please select a doctor and date.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const timeSlots = generateTimeSlots(
        formData.startTime,
        formData.endTime,
        parseInt(formData.duration)
      );

      const newSlots = timeSlots.map(time => ({
        doctorId: formData.doctorId,
        date: formData.date,
        startTime: time.start,
        endTime: time.end,
        isBooked: false,
      }));

      await addSlots(newSlots);

      toast({
        title: 'Slots added!',
        description: `${newSlots.length} time slots have been added for ${format(new Date(formData.date), 'MMMM d, yyyy')}.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to add slots',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Add Time Slots
        </CardTitle>
        <CardDescription>Create available appointment slots for doctors.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="select-doctor" className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Select Doctor *
            </Label>
            <Select
              value={formData.doctorId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, doctorId: value }))}
            >
              <SelectTrigger id="select-doctor">
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map(doctor => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slot-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Date *
            </Label>
            <Input
              id="slot-date"
              type="date"
              min={format(new Date(), 'yyyy-MM-dd')}
              max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}
              >
                <SelectTrigger id="start-time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Select
                value={formData.endTime}
                onValueChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}
              >
                <SelectTrigger id="end-time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Slot Duration (minutes)</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
            >
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Generate Slots
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
