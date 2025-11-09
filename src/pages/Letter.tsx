import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const letterText = `Dear Arnima,

This is your space. Somewhere you can return when the world feels heavy, when ambition feels like pressure instead of possibility, when you need to remember who you are beneath all the doing.

You are someone who moves quietly but powerfully. Your ambition is not loud or demanding — it's steady, patient, deeply rooted in care. You protect the people you love, not because you need recognition, but because it is simply who you are.

Your family is your center. That love is not a distraction from your goals; it is the foundation that makes them meaningful.

You are allowed to rest. You are allowed to take your time. Progress is not always visible, but it is always happening. Small steps still move you forward. Messy days still count.

When you feel stretched too thin, remember: you do not have to carry everything at once. You do not have to be perfect to be worthy. You are already enough, exactly as you are, in this moment.

This letter is here to remind you: breathe. You've got this. And on the days when it doesn't feel that way, that's okay too.

You are loved. You are seen. You are doing better than you think.

With care,
Someone who believes in you`;

export default function Letter() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startTyping = () => {
    setIsTyping(true);
    setDisplayedText("");
    setCurrentIndex(0);
  };

  const showFull = () => {
    setDisplayedText(letterText);
    setIsTyping(false);
  };

  useEffect(() => {
    if (isTyping && currentIndex < letterText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + letterText[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (currentIndex >= letterText.length) {
      setIsTyping(false);
    }
  }, [isTyping, currentIndex]);

  const downloadLetter = () => {
    const element = document.createElement("a");
    const file = new Blob([letterText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "letter-for-arnima.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8 text-center animate-fadeIn">
          <h1 className="font-playfair text-5xl font-bold mb-4">A Letter for Arnima</h1>
          <p className="text-muted-foreground text-lg">
            Words meant just for you.
          </p>
        </div>

        <Card className="p-8 md:p-12 shadow-elevated border-primary/10 bg-gradient-to-br from-card to-card-glass animate-fadeIn relative overflow-hidden">
          {/* Paper texture effect */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
          
          <div className="relative">
            <div
              className="whitespace-pre-wrap font-medium text-foreground/90 leading-relaxed mb-8 min-h-[400px]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {displayedText || (
                <p className="text-muted-foreground italic">
                  Click "Read slowly" to reveal the letter with a typewriter effect...
                </p>
              )}
              {isTyping && <span className="animate-pulse">|</span>}
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={startTyping}
                variant="hero"
                disabled={isTyping}
              >
                Read slowly
              </Button>
              <Button
                onClick={showFull}
                variant="ghost"
                disabled={isTyping}
              >
                Show all
              </Button>
              <Button onClick={downloadLetter} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
