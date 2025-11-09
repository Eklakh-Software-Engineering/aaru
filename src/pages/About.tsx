import { Card } from "@/components/ui/card";

const qualities = [
  {
    title: "Her Light",
    description: "Ambition shines quietly in small actions. Arnima moves forward by being consistent and kind.",
  },
  {
    title: "Her Strength",
    description: "Protective, reliable — strength that carries others without noise.",
  },
  {
    title: "Her People",
    description: "Family matters most. That love is her foundation.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="font-playfair text-5xl font-bold mb-12 text-center animate-fadeIn">
          About Arnima
        </h1>

        <div className="grid gap-8">
          {qualities.map((quality, index) => (
            <Card
              key={quality.title}
              className="p-8 shadow-soft border-primary/10 bg-gradient-to-br from-card to-card-glass hover:shadow-elevated transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h2 className="font-playfair text-3xl font-bold mb-4 text-primary">
                {quality.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {quality.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
