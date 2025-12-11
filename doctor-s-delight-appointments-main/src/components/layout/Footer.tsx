import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-medical">
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-display text-xl font-bold">MedBook</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted partner for finding the best healthcare professionals. 
              Book appointments instantly, anytime, anywhere.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Find Doctors</Link></li>
              <li><Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">Admin Panel</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Specializations</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cardiology</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Orthopedics</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Dermatology</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pediatrics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                +91 9677905096
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                kd9508@srmist.edu.in
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>SRMIST, SRM Nagar, Potheri, Kattankulathur – 603 203, Kancheepuram District, Tamil Nadu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MedBook. All rights reserved. Built with care for your health.</p>
        </div>
      </div>
    </footer>
  );
}
