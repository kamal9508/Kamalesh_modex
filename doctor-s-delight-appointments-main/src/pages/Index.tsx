import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { ProverbBanner } from '@/components/home/ProverbBanner';
import { DoctorCard } from '@/components/home/DoctorCard';
import { SpecializationFilter } from '@/components/home/SpecializationFilter';
import { useApp } from '@/context/AppContext';

const Index = () => {
  const { doctors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialization =
        selectedSpecialization === 'all' ||
        doctor.specialization === selectedSpecialization;

      return matchesSearch && matchesSpecialization;
    });
  }, [doctors, searchQuery, selectedSpecialization]);

  return (
    <Layout>
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <section className="container py-8">
        <ProverbBanner />
      </section>

      <section className="container py-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Our Expert Doctors
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Choose from our network of highly qualified healthcare professionals
          </p>
          <SpecializationFilter
            selected={selectedSpecialization}
            onSelect={setSelectedSpecialization}
          />
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No doctors found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={index} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Index;
