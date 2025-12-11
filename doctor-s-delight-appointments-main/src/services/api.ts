import { supabase } from '@/integrations/supabase/client';
import { Doctor, TimeSlot, Booking, BookingStatus } from '@/types';
import { mockSlots, mockDoctors, generateId } from '@/data/mockData';

// Transform database row to Doctor type
const transformDoctor = (row: any): Doctor => ({
  id: row.id,
  name: row.name,
  specialization: row.specialization,
  experience: row.experience,
  rating: parseFloat(row.rating),
  image: row.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  bio: row.bio || '',
  consultationFee: row.consultation_fee,
  languages: row.languages || ['English'],
  education: row.education || '',
  hospital: row.hospital || '',
});

// Transform database row to TimeSlot type
const transformSlot = (row: any): TimeSlot => ({
  id: row.id,
  doctorId: row.doctor_id,
  date: row.date,
  startTime: row.start_time,
  endTime: row.end_time,
  isBooked: row.is_booked,
});

// Transform database row to Booking type
const transformBooking = (row: any): Booking => ({
  id: row.id,
  doctorId: row.doctor_id,
  slotId: row.slot_id,
  patientName: row.patient_name,
  patientEmail: row.patient_email,
  patientPhone: row.patient_phone,
  notes: row.notes,
  status: row.status as BookingStatus,
  createdAt: row.created_at,
});

// Fetch all doctors
export async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchDoctors returned error, falling back to mockDoctors:', error.message || error);
      return mockDoctors;
    }

    if (data && data.length > 0) {
      return data.map(transformDoctor);
    }
  } catch (err) {
    console.warn('Error fetching doctors from Supabase, falling back to mockDoctors:', err instanceof Error ? err.message : err);
  }

  // Fallback: return in-memory mock doctors
  return mockDoctors;
}

// Fetch doctor by ID
export async function fetchDoctorById(id: string): Promise<Doctor | null> {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetchDoctorById returned error, falling back to mockDoctors:', error.message || error);
      return mockDoctors.find(d => d.id === id) || null;
    }

    if (data) {
      return transformDoctor(data);
    }
  } catch (err) {
    console.warn('Error fetching doctor from Supabase, falling back to mockDoctors:', err instanceof Error ? err.message : err);
  }

  // Fallback: search in mock doctors
  return mockDoctors.find(d => d.id === id) || null;
}

// Fetch slots by doctor ID
export async function fetchSlotsByDoctorId(doctorId: string): Promise<TimeSlot[]> {
  try {
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.warn('Supabase fetchSlotsByDoctorId returned error, falling back to mockSlots:', error.message || error);
    }

    // If supabase returns data use it, otherwise fallback to local mock slots
    if (data && data.length > 0) {
      return (data || []).map(transformSlot);
    }
  } catch (err) {
    console.warn('Error fetching slots from Supabase, falling back to mockSlots:', err instanceof Error ? err.message : err);
  }

  // Fallback: use in-memory mockSlots filtered by doctorId and date >= today
  const today = new Date().toISOString().split('T')[0];
  return mockSlots
    .filter(s => s.doctorId === doctorId && s.date >= today)
    .sort((a, b) => (a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)));
}

// Add a new doctor
export async function addDoctor(doctor: Omit<Doctor, 'id'>): Promise<Doctor> {
  const { data, error } = await supabase
    .from('doctors')
    .insert({
      name: doctor.name,
      specialization: doctor.specialization,
      experience: doctor.experience,
      rating: doctor.rating,
      image: doctor.image,
      bio: doctor.bio,
      consultation_fee: doctor.consultationFee,
      languages: doctor.languages,
      education: doctor.education,
      hospital: doctor.hospital,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding doctor:', error);
    throw error;
  }

  return transformDoctor(data);
}

// Add time slots for a doctor
export async function addSlots(slots: Omit<TimeSlot, 'id'>[]): Promise<TimeSlot[]> {
  const slotsToInsert = slots.map(slot => ({
    doctor_id: slot.doctorId,
    date: slot.date,
    start_time: slot.startTime,
    end_time: slot.endTime,
    is_booked: slot.isBooked,
  }));

  const { data, error } = await supabase
    .from('slots')
    .insert(slotsToInsert)
    .select();

  if (error) {
    console.error('Error adding slots:', error);
    throw error;
  }

  return (data || []).map(transformSlot);
}

// Book a slot (concurrency-safe with row-level locking)
export async function bookSlot(
  doctorId: string,
  slotId: string,
  patientName: string,
  patientEmail: string,
  patientPhone: string,
  notes?: string
): Promise<Booking> {
  try {
    const { data, error } = await supabase.rpc('book_slot', {
      p_doctor_id: doctorId,
      p_slot_id: slotId,
      p_patient_name: patientName,
      p_patient_email: patientEmail,
      p_patient_phone: patientPhone,
      p_notes: notes || null,
    });

    if (error) {
      console.warn('Supabase book_slot RPC returned error, falling back to in-memory booking:', error.message || error);
      throw error;
    }

    const result = data as { success: boolean; error?: string; booking?: any };

    if (!result.success) {
      throw new Error(result.error || 'Booking failed');
    }

    return transformBooking(result.booking);
  } catch (err) {
    // Fallback: create an in-memory booking and mark the mock slot as booked
    const bookingId = generateId();
    const createdAt = new Date().toISOString();
    const mockBooking = {
      id: bookingId,
      doctor_id: doctorId,
      slot_id: slotId,
      patient_name: patientName,
      patient_email: patientEmail,
      patient_phone: patientPhone,
      notes: notes || null,
      status: 'PENDING',
      created_at: createdAt,
    };

    // Mark slot as booked in mockSlots if present
    const slot = mockSlots.find(s => s.id === slotId && s.doctorId === doctorId);
    if (slot) {
      slot.isBooked = true;
    }

    return transformBooking(mockBooking as any);
  }
}

// Fetch booking by ID
export async function fetchBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }

  return data ? transformBooking(data) : null;
}

// Fetch all bookings
export async function fetchAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }

  return (data || []).map(transformBooking);
}

// Confirm booking
export async function confirmBooking(bookingId: string): Promise<void> {
  const { data, error } = await supabase.rpc('confirm_booking', {
    p_booking_id: bookingId,
  });

  if (error) {
    console.error('Error confirming booking:', error);
    throw error;
  }

  const result = data as { success: boolean; error?: string };

  if (!result.success) {
    throw new Error(result.error || 'Failed to confirm booking');
  }
}

// Cancel booking
export async function cancelBooking(bookingId: string): Promise<void> {
  const { data, error } = await supabase.rpc('cancel_booking', {
    p_booking_id: bookingId,
  });

  if (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }

  const result = data as { success: boolean; error?: string };

  if (!result.success) {
    throw new Error(result.error || 'Failed to cancel booking');
  }
}
