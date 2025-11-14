import { Link, useLocation, useNavigate } from "react-router-dom";
import { Music, MicOff, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  isMusicPlaying: boolean;
  onMusicToggle: () => void;
}

export const Navigation = ({ isMusicPlaying, onMusicToggle }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/affirmations", label: "Affirmations" },
    { to: "/gallery", label: "Gallery" },
    { to: "/letter", label: "Letter" },
    { to: "/journal", label: "Journal" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="font-playfair text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
        >
          Arnima
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMusicToggle}
            className="ml-2"
          >
            {isMusicPlaying ? <Music className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="ml-2"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMusicToggle}
          >
            {isMusicPlaying ? <Music className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </header>
  );
};
