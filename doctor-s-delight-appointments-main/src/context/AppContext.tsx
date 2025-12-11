import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { Doctor, TimeSlot, Booking, User } from '@/types';
import * as api from '@/services/api';

interface AppState {
  doctors: Doctor[];
  bookings: Booking[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  fetchDoctors: () => Promise<void>;
  getDoctorById: (id: string) => Promise<Doctor | null>;
  getSlotsByDoctorId: (doctorId: string) => Promise<TimeSlot[]>;
  getBookingById: (id: string) => Promise<Booking | null>;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<Doctor>;
  addSlots: (slots: Omit<TimeSlot, 'id'>[]) => Promise<TimeSlot[]>;
  bookSlot: (booking: {
    doctorId: string;
    slotId: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    notes?: string;
  }) => Promise<Booking>;
  confirmBooking: (bookingId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  fetchAllBookings: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '1',
    name: 'Kamalesh D',
    email: 'Kamal@gmail.com',
    role: 'patient'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctors on mount
  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.fetchDoctors();
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
      console.error('Error fetching doctors:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all bookings
  const fetchAllBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data on mount
  useEffect(() => {
    fetchDoctors();
    fetchAllBookings();
  }, [fetchDoctors, fetchAllBookings]);

  const getDoctorById = useCallback(async (id: string) => {
    // First check local state
    const localDoctor = doctors.find(d => d.id === id);
    if (localDoctor) return localDoctor;

    // Otherwise fetch from API
    return api.fetchDoctorById(id);
  }, [doctors]);

  const getSlotsByDoctorId = useCallback(async (doctorId: string) => {
    return api.fetchSlotsByDoctorId(doctorId);
  }, []);

  const getBookingById = useCallback(async (id: string) => {
    // First check local state
    const localBooking = bookings.find(b => b.id === id);
    if (localBooking) return localBooking;

    // Otherwise fetch from API
    return api.fetchBookingById(id);
  }, [bookings]);

  const addDoctor = useCallback(async (doctorData: Omit<Doctor, 'id'>) => {
    setIsLoading(true);
    try {
      const newDoctor = await api.addDoctor(doctorData);
      setDoctors(prev => [newDoctor, ...prev]);
      return newDoctor;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSlots = useCallback(async (slotsData: Omit<TimeSlot, 'id'>[]) => {
    setIsLoading(true);
    try {
      const newSlots = await api.addSlots(slotsData);
      return newSlots;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bookSlot = useCallback(async (bookingData: {
    doctorId: string;
    slotId: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    notes?: string;
  }) => {
    setIsLoading(true);
    try {
      const newBooking = await api.bookSlot(
        bookingData.doctorId,
        bookingData.slotId,
        bookingData.patientName,
        bookingData.patientEmail,
        bookingData.patientPhone,
        bookingData.notes
      );

      setBookings(prev => [newBooking, ...prev]);
      return newBooking;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmBooking = useCallback(async (bookingId: string) => {
    await api.confirmBooking(bookingId);
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b)
    );
  }, []);

  const cancelBooking = useCallback(async (bookingId: string) => {
    await api.cancelBooking(bookingId);
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b)
    );
  }, []);

  const setUser = useCallback((user: User | null) => {
    setCurrentUser(user);
  }, []);

  const value = useMemo(
    () => ({
      doctors,
      bookings,
      currentUser,
      isLoading,
      error,
      fetchDoctors,
      getDoctorById,
      getSlotsByDoctorId,
      getBookingById,
      addDoctor,
      addSlots,
      bookSlot,
      confirmBooking,
      cancelBooking,
      fetchAllBookings,
      setUser,
    }),
    [doctors, bookings, currentUser, isLoading, error, fetchDoctors, getDoctorById, getSlotsByDoctorId, getBookingById, addDoctor, addSlots, bookSlot, confirmBooking, cancelBooking, fetchAllBookings, setUser]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
