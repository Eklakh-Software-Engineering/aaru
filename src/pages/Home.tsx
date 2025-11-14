import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import miniGallery1 from "@/assets/mini-gallery-1.jpg";
import miniGallery2 from "@/assets/mini-gallery-2.jpg";
import miniGallery3 from "@/assets/mini-gallery-3.jpg";
import miniGallery4 from "@/assets/mini-gallery-4.jpg";

const quotes = [
  "You are allowed to take time; your ambition does not demand your exhaustion.",
  "Progress looks messy — it still counts.",
  "Protect your peace like you protect the people you love.",
  "Small, steady steps are the bravest kind of unstoppable.",
  "Remember: rest is part of the plan.",
];

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [showBreathing, setShowBreathing] = useState(false);

  const randomQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(newQuote);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-scale-up">
                Hey Arnima —<br />breathe. You've got this.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A small, quiet place made to remind you of who you are: ambitious, protective, and loved.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/affirmations">
                <Button variant="hero" size="lg">
                  Daily Affirmations
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="ghost" size="lg">
                  See Memories
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={randomQuote} variant="outline">
                  Show Today's Thought
                </Button>
                <Button onClick={() => setShowBreathing(!showBreathing)} variant="ghost">
                  Soothing Mode
                </Button>
              </div>
              
              <Card className="p-6 shadow-soft border-primary/10 bg-gradient-to-br from-card to-card-glass animate-fadeIn hover:shadow-glow transition-all duration-300">
                <p className="text-foreground/80 italic leading-relaxed">
                  "{currentQuote}"
                </p>
              </Card>
            </div>

            {showBreathing && (
              <Card className="p-8 text-center shadow-glow border-primary/20 animate-fadeIn">
                <div className="flex justify-center mb-6">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/30 animate-breathe" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Follow the circle: inhale as it grows, exhale as it shrinks.<br />
                  Close when you feel lighter.
                </p>
                <Button variant="ghost" onClick={() => setShowBreathing(false)}>
                  Close
                </Button>
              </Card>
            )}
          </div>

          {/* Right Column - Mini Gallery */}
          <Card className="p-6 shadow-elevated border-primary/10 bg-gradient-to-br from-card to-card-glass animate-scale-up overflow-hidden relative group" style={{ animationDelay: "0.2s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
            <h3 className="font-playfair text-2xl font-bold mb-6">Mini Gallery</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[miniGallery1, miniGallery2, miniGallery3, miniGallery4].map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg hover:scale-105 transition-transform cursor-pointer overflow-hidden shadow-soft"
                >
                  <img 
                    src={img} 
                    alt={`Memory ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <Link to="/letter">
              <Button variant="ghost" className="w-full">
                Open Letter
              </Button>
            </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
