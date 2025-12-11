import { useEffect, useState, useMemo } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { healthProverbs } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export function ProverbBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const proverb = useMemo(() => healthProverbs[currentIndex], [currentIndex]);

  const nextProverb = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % healthProverbs.length);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(nextProverb, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-medical p-6 md:p-8 text-primary-foreground">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative flex items-start gap-4">
        <div className="hidden md:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Quote className="h-6 w-6" />
        </div>
        
        <div className={`flex-1 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <blockquote className="text-lg md:text-xl font-medium leading-relaxed mb-2">
            "{proverb.text}"
          </blockquote>
          <cite className="text-sm text-primary-foreground/80 not-italic">
            — {proverb.author}
          </cite>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextProverb}
          className="shrink-0 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center gap-1.5 mt-6">
        {healthProverbs.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsAnimating(false);
              }, 300);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
