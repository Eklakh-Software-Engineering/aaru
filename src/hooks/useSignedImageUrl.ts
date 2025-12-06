import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to get a signed URL for storage images.
 * Returns the original URL if it's a local asset (starts with /).
 * For storage paths, generates a signed URL with 1 hour expiry.
 */
export function useSignedImageUrl(imagePath: string | null | undefined) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imagePath) {
      setSignedUrl(null);
      setLoading(false);
      return;
    }

    // If it's a local asset (starts with /), use it directly
    if (imagePath.startsWith("/")) {
      setSignedUrl(imagePath);
      setLoading(false);
      return;
    }

    // If it's already a full URL (for backwards compatibility), use it directly
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      setSignedUrl(imagePath);
      setLoading(false);
      return;
    }

    // Generate signed URL for storage paths
    const getSignedUrl = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: signedUrlError } = await supabase.storage
          .from("gallery")
          .createSignedUrl(imagePath, 3600); // 1 hour expiry

        if (signedUrlError) throw signedUrlError;
        
        setSignedUrl(data.signedUrl);
      } catch (err: any) {
        console.error("Error getting signed URL:", err);
        setError(err.message);
        setSignedUrl(null);
      } finally {
        setLoading(false);
      }
    };

    getSignedUrl();
  }, [imagePath]);

  return { signedUrl, loading, error };
}
