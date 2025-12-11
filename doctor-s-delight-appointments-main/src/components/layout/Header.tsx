import { Link, useLocation } from 'react-router-dom';
import { Heart, Calendar, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Find Doctors', icon: Heart },
    { href: '/admin', label: 'Admin Panel', icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-medical shadow-sm">
            <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold text-foreground">MedBook</span>
            <span className="text-[10px] text-muted-foreground -mt-1">Healthcare Simplified</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} to={href}>
              <Button
                variant={isActive(href) ? "secondary" : "ghost"}
                className={cn(
                  "gap-2 transition-all duration-200",
                  isActive(href) && "bg-secondary text-secondary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            Kamalesh D
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-up">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant={isActive(href) ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <Button variant="outline" className="w-full gap-2">
                <User className="h-4 w-4" />
                John Doe
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
