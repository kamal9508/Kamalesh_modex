import { Search, Calendar, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HeroSection({ searchQuery, onSearchChange }: HeroSectionProps) {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden medical-pattern">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm font-medium text-secondary-foreground animate-fade-in">
            <Shield className="h-4 w-4" />
            Trusted by 50,000+ patients
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground animate-slide-up">
            Find & Book
            <span className="block text-primary">Expert Doctors</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-slide-up stagger-1">
            Schedule appointments with top healthcare professionals in just a few clicks. 
            Quality care, convenient booking.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto animate-slide-up stagger-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search doctors, specializations..."
                className="pl-10 h-12 bg-background border-border"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Button size="lg" className="h-12 px-8 gap-2">
              <Calendar className="h-5 w-5" />
              Find Doctors
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-6 text-sm text-muted-foreground animate-fade-in stagger-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Instant Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Verified Doctors</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Easy Scheduling</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
