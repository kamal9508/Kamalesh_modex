import { Doctor, TimeSlot, Proverb } from '@/types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    specialization: 'Cardiologist',
    experience: 15,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    bio: 'Dr. Sarah Mitchell is a renowned cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology and heart failure management.',
    consultationFee: 150,
    languages: ['English', 'Spanish'],
    education: 'MD from Harvard Medical School',
    hospital: 'City Heart Hospital',
  },
  {
    id: '2',
    name: 'Dr. James Wilson',
    specialization: 'Orthopedic Surgeon',
    experience: 12,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    bio: 'Dr. James Wilson is an expert orthopedic surgeon specializing in sports injuries and joint replacement surgeries. He has performed over 2000 successful surgeries.',
    consultationFee: 180,
    languages: ['English'],
    education: 'MD from Johns Hopkins University',
    hospital: 'Metro Orthopedic Center',
  },
  {
    id: '3',
    name: 'Dr. Emily Chen',
    specialization: 'Dermatologist',
    experience: 10,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    bio: 'Dr. Emily Chen is a board-certified dermatologist with expertise in both medical and cosmetic dermatology. She treats various skin conditions with a holistic approach.',
    consultationFee: 120,
    languages: ['English', 'Mandarin'],
    education: 'MD from Stanford University',
    hospital: 'SkinCare Clinic',
  },
  {
    id: '4',
    name: 'Dr. Michael Brown',
    specialization: 'Pediatrician',
    experience: 18,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
    bio: 'Dr. Michael Brown has dedicated his career to children\'s health. With 18 years of experience, he provides comprehensive pediatric care with a gentle and caring approach.',
    consultationFee: 100,
    languages: ['English', 'French'],
    education: 'MD from Yale School of Medicine',
    hospital: 'Children\'s Medical Center',
  },
  {
    id: '5',
    name: 'Dr. Priya Sharma',
    specialization: 'Neurologist',
    experience: 14,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face',
    bio: 'Dr. Priya Sharma is a leading neurologist specializing in headache disorders, epilepsy, and neurodegenerative diseases. She combines cutting-edge treatments with compassionate care.',
    consultationFee: 200,
    languages: ['English', 'Hindi'],
    education: 'MD from Columbia University',
    hospital: 'NeuroScience Institute',
  },
  {
    id: '6',
    name: 'Dr. Robert Taylor',
    specialization: 'General Physician',
    experience: 20,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    bio: 'Dr. Robert Taylor is a trusted family physician with two decades of experience. He provides comprehensive primary care and preventive health services.',
    consultationFee: 80,
    languages: ['English'],
    education: 'MD from University of Michigan',
    hospital: 'Community Health Center',
  },
];

const generateSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const timeSlots = [
    { start: '09:00', end: '09:30' },
    { start: '09:30', end: '10:00' },
    { start: '10:00', end: '10:30' },
    { start: '10:30', end: '11:00' },
    { start: '11:00', end: '11:30' },
    { start: '11:30', end: '12:00' },
    { start: '14:00', end: '14:30' },
    { start: '14:30', end: '15:00' },
    { start: '15:00', end: '15:30' },
    { start: '15:30', end: '16:00' },
    { start: '16:00', end: '16:30' },
    { start: '16:30', end: '17:00' },
  ];

  mockDoctors.forEach(doctor => {
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      timeSlots.forEach((time, index) => {
        // Only mark a few slots as booked (keep most available)
        const isBooked = index === 5 || index === 11; // Only 2 slots booked per day

        slots.push({
          id: generateId(),
          doctorId: doctor.id,
          date: dateStr,
          startTime: time.start,
          endTime: time.end,
          isBooked,
        });
      });
    }
  });

  return slots;
};

export const mockSlots = generateSlots();

export const healthProverbs: Proverb[] = [
  { text: "The greatest wealth is health.", author: "Virgil" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Health is not valued till sickness comes.", author: "Thomas Fuller" },
  { text: "An apple a day keeps the doctor away.", author: "Welsh Proverb" },
  { text: "He who has health has hope, and he who has hope has everything.", author: "Arabian Proverb" },
  { text: "Early to bed and early to rise makes a man healthy, wealthy, and wise.", author: "Benjamin Franklin" },
  { text: "The first wealth is health.", author: "Ralph Waldo Emerson" },
  { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
  { text: "Happiness is the highest form of health.", author: "Dalai Lama" },
  { text: "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear.", author: "Buddha" },
];
