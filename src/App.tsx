import { useState, useRef, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { FloatingParticles } from "./components/FloatingParticles";
import { Navigation } from "./components/Navigation";
import { BackToTop } from "./components/BackToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Affirmations from "./pages/Affirmations";
import Gallery from "./pages/Gallery";
import Letter from "./pages/Letter";
import Journal from "./pages/Journal";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Create audio element with uploaded music
    audioRef.current = new Audio('/music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FloatingParticles />
          {user && <Navigation isMusicPlaying={isMusicPlaying} onMusicToggle={toggleMusic} />}
          <Routes>
            <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" replace />} />
            <Route path="/" element={user ? <Home /> : <Navigate to="/auth" replace />} />
            <Route path="/about" element={user ? <About /> : <Navigate to="/auth" replace />} />
            <Route path="/affirmations" element={user ? <Affirmations /> : <Navigate to="/auth" replace />} />
            <Route path="/gallery" element={user ? <Gallery /> : <Navigate to="/auth" replace />} />
            <Route path="/letter" element={user ? <Letter /> : <Navigate to="/auth" replace />} />
            <Route path="/journal" element={user ? <Journal /> : <Navigate to="/auth" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {user && <BackToTop />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
