import { useState, useEffect } from "react";
import { Navigation } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2200);
    const done = setTimeout(() => onComplete(), 2800);
    return () => {
      clearTimeout(timer);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-600 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6 animate-[fadeInUp_0.8s_ease-out]">
        <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
          <Navigation className="w-8 h-8 text-primary" />
        </div>
        <span className="text-4xl font-bold text-foreground tracking-tight">
          Ride<span className="text-primary">Sure</span>
        </span>
      </div>

      {/* Tagline */}
      <p className="text-muted-foreground text-sm tracking-widest uppercase animate-[fadeInUp_1s_ease-out_0.4s_both]">
        No Stories, Just Deliveries...
      </p>

      {/* Loading bar */}
      <div className="mt-10 w-48 h-1 rounded-full bg-muted overflow-hidden animate-[fadeInUp_1s_ease-out_0.8s_both]">
        <div className="h-full bg-primary rounded-full animate-[loadBar_2s_ease-in-out]" />
      </div>
    </div>
  );
};

export default SplashScreen;
