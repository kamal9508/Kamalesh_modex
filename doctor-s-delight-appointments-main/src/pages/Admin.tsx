import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { AddDoctorForm } from '@/components/admin/AddDoctorForm';
import { AddSlotsForm } from '@/components/admin/AddSlotsForm';
import { BookingsList } from '@/components/admin/BookingsList';
import { useApp } from '@/context/AppContext';
import { DoctorCard } from '@/components/home/DoctorCard';

const Admin = () => {
  const { doctors, bookings } = useApp();

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage doctors, time slots, and view bookings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-medical flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Doctors</p>
                <p className="font-display text-2xl font-bold">{doctors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="font-display text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="font-display text-2xl font-bold">
                  {bookings.filter(b => b.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="bookings" className="gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="doctors" className="gap-2">
              <Users className="h-4 w-4" />
              Doctors
            </TabsTrigger>
            <TabsTrigger value="slots" className="gap-2">
              <Clock className="h-4 w-4" />
              Slots
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="animate-fade-in">
            <BookingsList />
          </TabsContent>

          <TabsContent value="doctors" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AddDoctorForm />
              </div>
              <div className="lg:col-span-2">
                <h3 className="font-display text-lg font-semibold mb-4">Existing Doctors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctors.map((doctor, index) => (
                    <DoctorCard key={doctor.id} doctor={doctor} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="slots" className="animate-fade-in">
            <div className="max-w-md">
              <AddSlotsForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
