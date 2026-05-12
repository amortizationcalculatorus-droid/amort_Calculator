import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface SiteContentItem {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  metadata: Json | null;
  updated_at: string;
}

// Cache to avoid refetching on every component mount
let contentCache: SiteContentItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5000; // 5 seconds instead of 1 minute

// Add a global event for cache invalidation
const CACHE_INVALIDATED_EVENT = 'siteContentCacheInvalidated';

export function useSiteContent(prefix?: string) {
  const [items, setItems] = useState<SiteContentItem[]>(contentCache ?? []);
  const [loading, setLoading] = useState(!contentCache);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchContent = useCallback(async () => {
    const { data } = await supabase.from('site_content').select('*');
    contentCache = data ?? [];
    cacheTimestamp = Date.now();
    setItems(contentCache);
    setLoading(false);
  }, []);

  useEffect(() => {
    const now = Date.now();
    // Reduced TTL - will refresh after 5 seconds
    if (contentCache && now - cacheTimestamp < CACHE_TTL) {
      setItems(contentCache);
      setLoading(false);
      return;
    }

    fetchContent();
  }, [refreshKey, fetchContent]);

  useEffect(() => {
    const handleCacheInvalidated = () => {
      // Clear cache immediately and force refresh
      contentCache = null;
      cacheTimestamp = 0;
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener(CACHE_INVALIDATED_EVENT, handleCacheInvalidated);
    
    const handleFocus = () => {
      const now = Date.now();
      // Reduced TTL check
      if (contentCache && now - cacheTimestamp > CACHE_TTL) {
        setRefreshKey(prev => prev + 1);
      }
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener(CACHE_INVALIDATED_EVENT, handleCacheInvalidated);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const filtered = prefix ? items.filter(i => i.section_key.startsWith(prefix)) : items;

  const get = (key: string): SiteContentItem | undefined =>
    items.find(i => i.section_key === key);

  const getText = (key: string, field: 'title' | 'subtitle' | 'content' = 'title'): string =>
    get(key)?.[field] ?? '';

  const getMeta = (key: string): Record<string, any> =>
    (get(key)?.metadata as Record<string, any>) ?? {};

  return { items: filtered, loading, get, getText, getMeta };
}

export function invalidateSiteContentCache() {
  contentCache = null;
  cacheTimestamp = 0;
  // Dispatch event to notify all components using the hook
  window.dispatchEvent(new CustomEvent('siteContentCacheInvalidated'));
}