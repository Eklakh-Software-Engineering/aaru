import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar, Loader2 } from "lucide-react";
import type { GalleryMoment } from "@/hooks/useGalleryMoments";
import { useSignedImageUrl } from "@/hooks/useSignedImageUrl";

interface GalleryCardProps {
  moment: GalleryMoment;
  index: number;
  isOwner: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function GalleryCard({ moment, index, isOwner, onView, onEdit, onDelete }: GalleryCardProps) {
  const { signedUrl, loading: imageLoading } = useSignedImageUrl(moment.image_url);
  
  const formattedDate = moment.moment_date
    ? new Date(moment.moment_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Card
      onClick={onView}
      className="group overflow-hidden cursor-pointer shadow-soft border-primary/10 hover:shadow-elevated transition-all duration-300 animate-fadeIn relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {isOwner && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="glass"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {!moment.is_default && (
            <Button
              variant="glass"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/20"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="aspect-square relative overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <img
            src={signedUrl || ""}
            alt={moment.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="p-4 bg-gradient-to-br from-card to-card-glass">
        <p className="text-center font-medium text-foreground mb-1">{moment.title}</p>
        {formattedDate && (
          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </p>
        )}
        {moment.description && (
          <p className="text-center text-sm text-muted-foreground mt-2 line-clamp-2">
            {moment.description}
          </p>
        )}
      </div>
    </Card>
  );
}
