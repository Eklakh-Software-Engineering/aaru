import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, X, Plus, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGalleryMoments, type GalleryMoment } from "@/hooks/useGalleryMoments";
import { GalleryMomentForm } from "@/components/GalleryMomentForm";
import { GalleryCard } from "@/components/GalleryCard";

export default function Gallery() {
  const [userId, setUserId] = useState<string | undefined>();
  const [selectedMoment, setSelectedMoment] = useState<GalleryMoment | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMoment, setEditingMoment] = useState<GalleryMoment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { moments, loading, addMoment, updateMoment, deleteMoment } = useGalleryMoments(userId);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
    });
  }, []);

  const openLightbox = (moment: GalleryMoment) => setSelectedMoment(moment);
  const closeLightbox = () => setSelectedMoment(null);

  const currentIndex = selectedMoment ? moments.findIndex((m) => m.id === selectedMoment.id) : -1;

  const nextImage = () => {
    if (currentIndex !== -1 && moments.length > 0) {
      const nextIndex = (currentIndex + 1) % moments.length;
      setSelectedMoment(moments[nextIndex]);
    }
  };

  const prevImage = () => {
    if (currentIndex !== -1 && moments.length > 0) {
      const prevIndex = currentIndex === 0 ? moments.length - 1 : currentIndex - 1;
      setSelectedMoment(moments[prevIndex]);
    }
  };

  const handleAddMoment = async (title: string, description: string, momentDate: string, imageFile?: File) => {
    if (!imageFile) return false;
    return addMoment(title, description, imageFile, momentDate);
  };

  const handleEditMoment = async (title: string, description: string, momentDate: string, imageFile?: File) => {
    if (!editingMoment) return false;
    return updateMoment(editingMoment.id, title, description, momentDate, imageFile);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      await deleteMoment(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const formattedDate = selectedMoment?.moment_date
    ? new Date(selectedMoment.moment_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center animate-fadeIn">
          <h1 className="font-playfair text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-muted-foreground text-lg mb-6">Cherished moments captured in time.</p>
          {userId && (
            <Button onClick={() => setFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Moment
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : moments.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>No moments yet. Add your first cherished moment!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moments.map((moment, index) => (
              <GalleryCard
                key={moment.id}
                moment={moment}
                index={index}
                isOwner={userId === moment.user_id}
                onView={() => openLightbox(moment)}
                onEdit={() => {
                  setEditingMoment(moment);
                  setFormOpen(true);
                }}
                onDelete={() => setDeleteConfirmId(moment.id)}
              />
            ))}
          </div>
        )}

        {/* Lightbox */}
        <Dialog open={selectedMoment !== null} onOpenChange={closeLightbox}>
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

              {selectedMoment && (
                <div className="animate-fadeIn">
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <img
                      src={selectedMoment.image_url}
                      alt={selectedMoment.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center text-white text-xl font-medium mb-2">
                    {selectedMoment.title}
                  </p>
                  {formattedDate && (
                    <p className="text-center text-white/70 text-sm flex items-center justify-center gap-1 mb-2">
                      <Calendar className="h-4 w-4" />
                      {formattedDate}
                    </p>
                  )}
                  {selectedMoment.description && (
                    <p className="text-center text-white/80 text-base mb-4 max-w-lg mx-auto">
                      {selectedMoment.description}
                    </p>
                  )}
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

        {/* Add/Edit Form */}
        <GalleryMomentForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingMoment(null);
          }}
          onSubmit={editingMoment ? handleEditMoment : handleAddMoment}
          moment={editingMoment || undefined}
          mode={editingMoment ? "edit" : "add"}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this moment?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this moment from your gallery.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
