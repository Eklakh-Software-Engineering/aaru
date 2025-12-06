import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagePlus, Loader2 } from "lucide-react";
import type { GalleryMoment } from "@/hooks/useGalleryMoments";

interface GalleryMomentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    description: string,
    momentDate: string,
    imageFile?: File
  ) => Promise<boolean>;
  moment?: GalleryMoment;
  mode: "add" | "edit";
}

export function GalleryMomentForm({ open, onClose, onSubmit, moment, mode }: GalleryMomentFormProps) {
  const [title, setTitle] = useState(moment?.title || "");
  const [description, setDescription] = useState(moment?.description || "");
  const [momentDate, setMomentDate] = useState(moment?.moment_date || new Date().toISOString().split("T")[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(moment?.image_url || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (mode === "add" && !imageFile) return;

    setLoading(true);
    const success = await onSubmit(title, description, momentDate, imageFile || undefined);
    setLoading(false);

    if (success) {
      setTitle("");
      setDescription("");
      setMomentDate(new Date().toISOString().split("T")[0]);
      setImageFile(null);
      setImagePreview(null);
      onClose();
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle(moment?.title || "");
      setDescription(moment?.description || "");
      setMomentDate(moment?.moment_date || new Date().toISOString().split("T")[0]);
      setImageFile(null);
      setImagePreview(moment?.image_url || null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">
            {mode === "add" ? "Add New Moment" : "Edit Moment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative aspect-video rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <ImagePlus className="h-10 w-10 mb-2" />
                <span>Click to upload image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium">Change Image</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter moment title"
              required
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={momentDate}
              onChange={(e) => setMomentDate(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              rows={3}
              className="bg-background/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || (mode === "add" && !imageFile)}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "add" ? "Adding..." : "Saving..."}
                </>
              ) : mode === "add" ? (
                "Add Moment"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
