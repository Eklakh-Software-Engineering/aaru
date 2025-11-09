import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import warmMoments from "@/assets/gallery-warm-moments.jpg";
import familyFirst from "@/assets/gallery-family-first.jpg";
import dreamsStudy from "@/assets/gallery-dreams-study.jpg";
import quietStrength from "@/assets/gallery-quiet-strength.jpg";
import gentleAmbition from "@/assets/gallery-gentle-ambition.jpg";
import protectedLove from "@/assets/gallery-protected-love.jpg";

const images = [
  { id: 1, caption: "Warm moments", src: warmMoments },
  { id: 2, caption: "Family first", src: familyFirst },
  { id: 3, caption: "Self dependent", src: dreamsStudy },
  { id: 4, caption: "Quiet strength", src: quietStrength },
  { id: 5, caption: "Travelling with family", src: gentleAmbition },
  { id: 6, caption: "Life Partner... not now", src: protectedLove },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (id: number) => {
    setSelectedImage(id);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage % images.length) + 1);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 1 ? images.length : selectedImage - 1);
    }
  };

  const currentImage = images.find((img) => img.id === selectedImage);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center animate-fadeIn">
          <h1 className="font-playfair text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-muted-foreground text-lg">
            Cherished moments captured in time.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <Card
              key={image.id}
              onClick={() => openLightbox(image.id)}
              className="group overflow-hidden cursor-pointer shadow-soft border-primary/10 hover:shadow-elevated transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <div className="p-4 bg-gradient-to-br from-card to-card-glass">
                <p className="text-center font-medium text-foreground">
                  {image.caption}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={selectedImage !== null} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
            <div className="relative">
              <Button
                variant="glass"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={closeLightbox}
              >
                <X className="h-5 w-5" />
              </Button>

              {currentImage && (
                <div className="animate-fadeIn">
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <img 
                      src={currentImage.src} 
                      alt={currentImage.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center text-white text-xl font-medium mb-4">
                    {currentImage.caption}
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-4">
                <Button variant="glass" onClick={prevImage}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="glass" onClick={nextImage}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
