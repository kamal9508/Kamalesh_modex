import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Award, Languages, GraduationCap, Building2, Clock, DollarSign, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SlotGrid } from '@/components/doctor/SlotGrid';
import { BookingForm } from '@/components/doctor/BookingForm';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doctor, TimeSlot } from '@/types';

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getDoctorById, getSlotsByDoctorId, isLoading } = useApp();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [doctorData, slotsData] = await Promise.all([
          getDoctorById(id),
          getSlotsByDoctorId(id),
        ]);
        setDoctor(doctorData);
        setSlots(slotsData);
      } catch (error) {
        console.error('Error loading doctor data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, getDoctorById, getSlotsByDoctorId]);

  const handleSlotSelect = useCallback((slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!doctor) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Doctor not found</h1>
          <p className="text-muted-foreground mb-6">The doctor you're looking for doesn't exist.</p>
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

  return (
    <Layout>
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Doctors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden border-border/50 shadow-card animate-slide-up">
              <div className="relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-64 object-cover object-top"
                />
                <div className="absolute bottom-3 right-3">
                  <Badge className="bg-background/90 backdrop-blur-sm text-foreground gap-1.5 px-3 py-1.5">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    {doctor.rating}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">{doctor.name}</h1>
                  <p className="text-primary font-medium">{doctor.specialization}</p>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">{doctor.bio}</p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{doctor.experience} years exp.</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>${doctor.consultationFee}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm col-span-2">
                    <Languages className="h-4 w-4 text-primary" />
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm col-span-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>{doctor.education}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm col-span-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>{doctor.hospital}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Slots and Booking */}
          <div className="lg:col-span-2 space-y-6">
            {showBookingForm && selectedSlot ? (
              <div className="animate-scale-in">
                <BookingForm
                  doctor={doctor}
                  selectedSlot={selectedSlot}
                  onClose={() => {
                    setShowBookingForm(false);
                    setSelectedSlot(null);
                  }}
                />
              </div>
            ) : (
              <Card className="border-border/50 shadow-card animate-slide-up stagger-1">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Available Time Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SlotGrid
                    slots={slots}
                    selectedSlotId={selectedSlot?.id || null}
                    onSelectSlot={handleSlotSelect}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDetail;
