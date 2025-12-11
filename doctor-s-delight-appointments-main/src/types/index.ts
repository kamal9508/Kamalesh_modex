export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  image: string;
  bio: string;
  consultationFee: number;
  languages: string[];
  education: string;
  hospital: string;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  doctorId: string;
  doctor?: Doctor;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  slotId: string;
  slot?: TimeSlot;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'patient';
}

export interface Proverb {
  text: string;
  author: string;
}
