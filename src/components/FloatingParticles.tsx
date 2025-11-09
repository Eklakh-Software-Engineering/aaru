import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      size: 12 + Math.random() * 12,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-float opacity-10"
          style={{
            left: `${particle.left}%`,
            top: "-50px",
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <Heart
            className="text-primary"
            size={particle.size}
            fill="currentColor"
          />
        </div>
      ))}
    </div>
  );
};
