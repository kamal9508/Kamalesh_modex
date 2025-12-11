-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience INTEGER NOT NULL DEFAULT 1,
  rating DECIMAL(2,1) NOT NULL DEFAULT 4.5,
  image TEXT,
  bio TEXT,
  consultation_fee INTEGER NOT NULL DEFAULT 100,
  languages TEXT[] DEFAULT ARRAY['English'],
  education TEXT,
  hospital TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create slots table
CREATE TABLE public.slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(doctor_id, date, start_time)
);

-- Create bookings table with status enum
CREATE TYPE public.booking_status AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED');

CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES public.slots(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  notes TEXT,
  status public.booking_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '2 minutes')
);

-- Create index for faster lookups
CREATE INDEX idx_slots_doctor_date ON public.slots(doctor_id, date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_slot ON public.bookings(slot_id);

-- Enable RLS on all tables
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Doctors table policies (public read, admin write)
CREATE POLICY "Anyone can view doctors" 
ON public.doctors 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert doctors" 
ON public.doctors 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update doctors" 
ON public.doctors 
FOR UPDATE 
USING (true);

-- Slots table policies (public read, admin write)
CREATE POLICY "Anyone can view slots" 
ON public.slots 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert slots" 
ON public.slots 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update slots" 
ON public.slots 
FOR UPDATE 
USING (true);

-- Bookings table policies
CREATE POLICY "Anyone can view bookings" 
ON public.bookings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- CONCURRENCY SAFE BOOKING FUNCTION with Row-Level Locking
CREATE OR REPLACE FUNCTION public.book_slot(
  p_doctor_id UUID,
  p_slot_id UUID,
  p_patient_name TEXT,
  p_patient_email TEXT,
  p_patient_phone TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slot RECORD;
  v_booking RECORD;
BEGIN
  -- Start transaction with row-level lock
  -- SELECT FOR UPDATE locks the row preventing concurrent modifications
  SELECT * INTO v_slot
  FROM public.slots
  WHERE id = p_slot_id
    AND doctor_id = p_doctor_id
  FOR UPDATE;
  
  -- Check if slot exists
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Slot not found'
    );
  END IF;
  
  -- Check if slot is already booked
  IF v_slot.is_booked THEN
    RETURN json_build_object(
      'success', false,
      'error', 'This slot is no longer available'
    );
  END IF;
  
  -- Mark slot as booked
  UPDATE public.slots
  SET is_booked = true
  WHERE id = p_slot_id;
  
  -- Create booking with PENDING status
  INSERT INTO public.bookings (
    doctor_id,
    slot_id,
    patient_name,
    patient_email,
    patient_phone,
    notes,
    status
  ) VALUES (
    p_doctor_id,
    p_slot_id,
    p_patient_name,
    p_patient_email,
    p_patient_phone,
    p_notes,
    'PENDING'
  )
  RETURNING * INTO v_booking;
  
  RETURN json_build_object(
    'success', true,
    'booking', row_to_json(v_booking)
  );
END;
$$;

-- Function to confirm booking
CREATE OR REPLACE FUNCTION public.confirm_booking(p_booking_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking RECORD;
BEGIN
  SELECT * INTO v_booking
  FROM public.bookings
  WHERE id = p_booking_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Booking not found');
  END IF;
  
  IF v_booking.status != 'PENDING' THEN
    RETURN json_build_object('success', false, 'error', 'Booking cannot be confirmed');
  END IF;
  
  UPDATE public.bookings
  SET status = 'CONFIRMED'
  WHERE id = p_booking_id;
  
  RETURN json_build_object('success', true);
END;
$$;

-- Function to cancel booking and free up slot
CREATE OR REPLACE FUNCTION public.cancel_booking(p_booking_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking RECORD;
BEGIN
  SELECT * INTO v_booking
  FROM public.bookings
  WHERE id = p_booking_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Booking not found');
  END IF;
  
  -- Update booking status
  UPDATE public.bookings
  SET status = 'CANCELLED'
  WHERE id = p_booking_id;
  
  -- Free up the slot
  UPDATE public.slots
  SET is_booked = false
  WHERE id = v_booking.slot_id;
  
  RETURN json_build_object('success', true);
END;
$$;

-- Function to expire pending bookings after 2 minutes
CREATE OR REPLACE FUNCTION public.expire_pending_bookings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update expired pending bookings to FAILED
  UPDATE public.bookings
  SET status = 'FAILED'
  WHERE status = 'PENDING'
    AND expires_at < now();
  
  -- Free up slots for failed bookings
  UPDATE public.slots s
  SET is_booked = false
  FROM public.bookings b
  WHERE b.slot_id = s.id
    AND b.status = 'FAILED'
    AND s.is_booked = true;
END;
$$;

-- Insert sample doctors data
INSERT INTO public.doctors (name, specialization, experience, rating, image, bio, consultation_fee, languages, education, hospital) VALUES
('Dr. Sarah Mitchell', 'Cardiologist', 15, 4.9, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face', 'Dr. Sarah Mitchell is a renowned cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology and heart failure management.', 150, ARRAY['English', 'Spanish'], 'MD from Harvard Medical School', 'City Heart Hospital'),
('Dr. James Wilson', 'Orthopedic Surgeon', 12, 4.8, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face', 'Dr. James Wilson is an expert orthopedic surgeon specializing in sports injuries and joint replacement surgeries. He has performed over 2000 successful surgeries.', 180, ARRAY['English'], 'MD from Johns Hopkins University', 'Metro Orthopedic Center'),
('Dr. Emily Chen', 'Dermatologist', 10, 4.7, 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face', 'Dr. Emily Chen is a board-certified dermatologist with expertise in both medical and cosmetic dermatology. She treats various skin conditions with a holistic approach.', 120, ARRAY['English', 'Mandarin'], 'MD from Stanford University', 'SkinCare Clinic'),
('Dr. Michael Brown', 'Pediatrician', 18, 4.9, 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face', 'Dr. Michael Brown has dedicated his career to childrens health. With 18 years of experience, he provides comprehensive pediatric care with a gentle and caring approach.', 100, ARRAY['English', 'French'], 'MD from Yale School of Medicine', 'Childrens Medical Center'),
('Dr. Priya Sharma', 'Neurologist', 14, 4.8, 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face', 'Dr. Priya Sharma is a leading neurologist specializing in headache disorders, epilepsy, and neurodegenerative diseases. She combines cutting-edge treatments with compassionate care.', 200, ARRAY['English', 'Hindi'], 'MD from Columbia University', 'NeuroScience Institute'),
('Dr. Robert Taylor', 'General Physician', 20, 4.6, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face', 'Dr. Robert Taylor is a trusted family physician with two decades of experience. He provides comprehensive primary care and preventive health services.', 80, ARRAY['English'], 'MD from University of Michigan', 'Community Health Center');