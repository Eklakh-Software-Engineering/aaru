import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GalleryMoment {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string;
  moment_date: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Default moments using existing assets
const defaultMoments = [
  { title: "Warm moments", description: "Cherished warmth and love", image_url: "/gallery-warm-moments.jpg", moment_date: "2024-01-15" },
  { title: "Family first", description: "Family is everything", image_url: "/gallery-family-first.jpg", moment_date: "2024-02-20" },
  { title: "Self dependent", description: "Dreams and studies", image_url: "/gallery-dreams-study.jpg", moment_date: "2024-03-10" },
  { title: "Quiet strength", description: "Inner peace and strength", image_url: "/gallery-quiet-strength.jpg", moment_date: "2024-04-05" },
  { title: "Travelling with family", description: "Adventures together", image_url: "/gallery-gentle-ambition.jpg", moment_date: "2024-05-12" },
  { title: "Life Partner... not now", description: "Protected love awaits", image_url: "/gallery-protected-love.jpg", moment_date: "2024-06-01" },
];

export function useGalleryMoments(userId: string | undefined) {
  const [moments, setMoments] = useState<GalleryMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMoments = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_moments")
        .select("*")
        .order("moment_date", { ascending: false });

      if (error) throw error;
      setMoments(data || []);
    } catch (error: any) {
      console.error("Error fetching moments:", error);
      toast({
        title: "Error",
        description: "Failed to load gallery moments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const seedDefaultMoments = async () => {
    if (!userId) return;
    
    try {
      const { data: existing } = await supabase
        .from("gallery_moments")
        .select("id")
        .eq("is_default", true)
        .limit(1);

      if (existing && existing.length > 0) return;

      const momentsToInsert = defaultMoments.map((m) => ({
        ...m,
        user_id: userId,
        is_default: true,
      }));

      const { error } = await supabase.from("gallery_moments").insert(momentsToInsert);
      if (error) throw error;
      
      await fetchMoments();
    } catch (error: any) {
      console.error("Error seeding default moments:", error);
    }
  };

  const addMoment = async (
    title: string,
    description: string,
    imageFile: File,
    momentDate: string
  ) => {
    if (!userId) return false;

    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

      const { error } = await supabase.from("gallery_moments").insert({
        user_id: userId,
        title,
        description,
        image_url: urlData.publicUrl,
        moment_date: momentDate,
        is_default: false,
      });

      if (error) throw error;

      toast({ title: "Success", description: "Moment added successfully!" });
      await fetchMoments();
      return true;
    } catch (error: any) {
      console.error("Error adding moment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add moment",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateMoment = async (
    id: string,
    title: string,
    description: string,
    momentDate: string,
    imageFile?: File
  ) => {
    if (!userId) return false;

    try {
      let image_url: string | undefined;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
        image_url = urlData.publicUrl;
      }

      const updateData: Record<string, any> = { title, description, moment_date: momentDate };
      if (image_url) updateData.image_url = image_url;

      const { error } = await supabase
        .from("gallery_moments")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Moment updated successfully!" });
      await fetchMoments();
      return true;
    } catch (error: any) {
      console.error("Error updating moment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update moment",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteMoment = async (id: string) => {
    try {
      const { error } = await supabase.from("gallery_moments").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Success", description: "Moment deleted successfully!" });
      await fetchMoments();
      return true;
    } catch (error: any) {
      console.error("Error deleting moment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete moment",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  useEffect(() => {
    if (userId && !loading && moments.length === 0) {
      seedDefaultMoments();
    }
  }, [userId, loading, moments.length]);

  return { moments, loading, addMoment, updateMoment, deleteMoment, refetch: fetchMoments };
}
