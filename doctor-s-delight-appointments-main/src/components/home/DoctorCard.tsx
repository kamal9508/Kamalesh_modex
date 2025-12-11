import { Link } from 'react-router-dom';
import { Star, Clock, Award, Languages, ArrowRight } from 'lucide-react';
import { Doctor } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DoctorCardProps {
  doctor: Doctor;
  index: number;
}

export function DoctorCard({ doctor, index }: DoctorCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-card-hover animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm font-semibold gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              {doctor.rating}
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {doctor.name}
            </h3>
            <p className="text-primary font-medium text-sm">{doctor.specialization}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-primary" />
              <span>{doctor.experience} years</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Languages className="h-4 w-4 text-primary" />
              <span>{doctor.languages.slice(0, 2).join(', ')}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">Consultation</span>
              <p className="font-display font-bold text-lg text-foreground">${doctor.consultationFee}</p>
            </div>
            <Link to={`/doctor/${doctor.id}`}>
              <Button className="gap-2 group/btn">
                Book Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
