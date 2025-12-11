import { useState } from 'react';
import { Plus, User, Briefcase, Award, DollarSign, Languages, GraduationCap, Building2, FileText, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const defaultDoctorImages = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face',
];

export function AddDoctorForm() {
  const { addDoctor, fetchDoctors } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    consultationFee: '',
    languages: '',
    education: '',
    hospital: '',
    bio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.specialization || !formData.experience || !formData.consultationFee) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await addDoctor({
        name: formData.name,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        consultationFee: parseInt(formData.consultationFee),
        languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        education: formData.education,
        hospital: formData.hospital,
        bio: formData.bio,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5 and 5.0
        image: defaultDoctorImages[Math.floor(Math.random() * defaultDoctorImages.length)],
      });

      toast({
        title: 'Doctor added!',
        description: `${formData.name} has been added successfully.`,
      });

      // Reset form
      setFormData({
        name: '',
        specialization: '',
        experience: '',
        consultationFee: '',
        languages: '',
        education: '',
        hospital: '',
        bio: '',
      });

      // Refresh doctors list
      await fetchDoctors();
    } catch (error) {
      toast({
        title: 'Failed to add doctor',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Add New Doctor
        </CardTitle>
        <CardDescription>Fill in the details to add a new doctor to the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctor-name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Full Name *
              </Label>
              <Input
                id="doctor-name"
                placeholder="Dr. John Smith"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Specialization *
              </Label>
              <Input
                id="specialization"
                placeholder="Cardiologist"
                value={formData.specialization}
                onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Years of Experience *
              </Label>
              <Input
                id="experience"
                type="number"
                min="1"
                placeholder="10"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Consultation Fee ($) *
              </Label>
              <Input
                id="fee"
                type="number"
                min="1"
                placeholder="150"
                value={formData.consultationFee}
                onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages" className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-primary" />
                Languages
              </Label>
              <Input
                id="languages"
                placeholder="English, Spanish"
                value={formData.languages}
                onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Education
              </Label>
              <Input
                id="education"
                placeholder="MD from Harvard Medical School"
                value={formData.education}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospital" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Hospital/Clinic
            </Label>
            <Input
              id="hospital"
              placeholder="City Medical Center"
              value={formData.hospital}
              onChange={(e) => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Brief description about the doctor's expertise..."
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Doctor
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
