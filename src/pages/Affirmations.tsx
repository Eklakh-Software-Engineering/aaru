import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const defaultAffirmations = [
  "Ambition wrapped in care.",
  "A protector who softens when needed.",
  "One day at a time; one victory at a time.",
  "Your family is your quiet backbone.",
  "You can be both fierce and gentle.",
];

export default function Affirmations() {
  const [affirmations, setAffirmations] = useState<string[]>(defaultAffirmations);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [newAffirmation, setNewAffirmation] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("affirmations");
    if (saved) {
      setAffirmations(JSON.parse(saved));
    }
  }, []);

  const toggleReveal = (index: number) => {
    const newRevealed = new Set(revealed);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
      // Soft chime sound feedback
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLXiTYIG2W47OykUxELTqPh8Ll1IQU8k9nxwnsrBSl4yPDgjkILFGK36+qmWRQJS5zi8bllHQU=");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
    setRevealed(newRevealed);
  };

  const addAffirmation = () => {
    if (newAffirmation.trim()) {
      const updated = [...affirmations, newAffirmation.trim()];
      setAffirmations(updated);
      localStorage.setItem("affirmations", JSON.stringify(updated));
      setNewAffirmation("");
      toast.success("Affirmation added with love");
    }
  };

  const shuffleAffirmations = () => {
    const shuffled = [...affirmations].sort(() => Math.random() - 0.5);
    setAffirmations(shuffled);
    setRevealed(new Set());
    toast.success("Affirmations shuffled");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center animate-fadeIn">
          <h1 className="font-playfair text-5xl font-bold mb-4">Affirmations</h1>
          <p className="text-muted-foreground text-lg">
            Click any card to reveal — add your own at the bottom.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {affirmations.map((affirmation, index) => (
            <Card
              key={index}
              onClick={() => toggleReveal(index)}
              className={`p-6 min-h-[140px] flex items-center justify-center text-center cursor-pointer transition-all duration-500 hover:scale-105 shadow-soft border-primary/10 ${
                revealed.has(index)
                  ? "bg-gradient-to-br from-primary/20 to-accent/20 shadow-glow"
                  : "bg-gradient-to-br from-card to-card-glass"
              }`}
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <p
                className={`font-medium transition-all duration-300 ${
                  revealed.has(index)
                    ? "text-foreground text-lg"
                    : "text-muted-foreground text-sm"
                }`}
              >
                {revealed.has(index) ? affirmation : "Click to reveal"}
              </p>
            </Card>
          ))}
        </div>

        <Card className="p-8 shadow-elevated border-primary/10 bg-gradient-to-br from-card to-card-glass animate-fadeIn">
          <h3 className="font-playfair text-2xl font-bold mb-4">Add Your Own</h3>
          <Textarea
            placeholder="Write an affirmation..."
            value={newAffirmation}
            onChange={(e) => setNewAffirmation(e.target.value)}
            className="mb-4 border-primary/20 focus:border-primary/40 bg-white/50"
            rows={3}
          />
          <div className="flex gap-4">
            <Button onClick={addAffirmation} variant="hero">
              Add Affirmation
            </Button>
            <Button onClick={shuffleAffirmations} variant="ghost">
              <Shuffle className="mr-2 h-4 w-4" />
              Shuffle
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
