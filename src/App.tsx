import { useState, useRef, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FloatingParticles } from "./components/FloatingParticles";
import { Navigation } from "./components/Navigation";
import { BackToTop } from "./components/BackToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Affirmations from "./pages/Affirmations";
import Gallery from "./pages/Gallery";
import Letter from "./pages/Letter";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create a very soft ambient sound using Web Audio API
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 432; // Calming frequency
      gainNode.gain.value = 0; // Start muted
      
      oscillator.start();
      
      audioRef.current = {
        play: () => {
          gainNode.gain.setTargetAtTime(0.01, audioContext.currentTime, 0.5);
          return Promise.resolve();
        },
        pause: () => {
          gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.5);
        },
      } as any;
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FloatingParticles />
          <Navigation isMusicPlaying={isMusicPlaying} onMusicToggle={toggleMusic} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/affirmations" element={<Affirmations />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/letter" element={<Letter />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BackToTop />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
