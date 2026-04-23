// hooks/useFavicon.ts
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFavicon = () => {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('metadata')
          .eq('section_key', 'site_brand')
          .single();

        const faviconUrl = (data?.metadata as any)?.favicon_url;
        
        if (faviconUrl) {
          // Update standard favicon
          let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
          if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
          }
          favicon.href = faviconUrl;
          favicon.type = faviconUrl.toLowerCase().endsWith('.svg') 
            ? 'image/svg+xml' 
            : faviconUrl.toLowerCase().endsWith('.png')
            ? 'image/png'
            : 'image/x-icon';

          // Also update Apple touch icon
          let appleIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
          if (!appleIcon) {
            appleIcon = document.createElement('link');
            appleIcon.rel = 'apple-touch-icon';
            document.head.appendChild(appleIcon);
          }
          appleIcon.href = faviconUrl;

          console.log('Favicon updated to:', faviconUrl);
        }
      } catch (error) {
        console.error('Failed to update favicon:', error);
      }
    };

    updateFavicon();
  }, []);
};