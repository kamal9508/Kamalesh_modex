import { Heart, Bone, Brain, Baby, Stethoscope, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const specializations = [
  { id: 'all', label: 'All Doctors', icon: Stethoscope },
  { id: 'Cardiologist', label: 'Cardiology', icon: Heart },
  { id: 'Orthopedic Surgeon', label: 'Orthopedics', icon: Bone },
  { id: 'Neurologist', label: 'Neurology', icon: Brain },
  { id: 'Pediatrician', label: 'Pediatrics', icon: Baby },
  { id: 'Dermatologist', label: 'Dermatology', icon: Eye },
];

interface SpecializationFilterProps {
  selected: string;
  onSelect: (specialization: string) => void;
}

export function SpecializationFilter({ selected, onSelect }: SpecializationFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {specializations.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={selected === id ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(id)}
          className={cn(
            "gap-2 rounded-full transition-all duration-200",
            selected === id 
              ? "shadow-md" 
              : "hover:bg-secondary hover:text-secondary-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
