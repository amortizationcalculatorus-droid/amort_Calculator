import { useEffect, useState } from 'react';
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
const CACHE_TTL = 60000; // 1 minute

export function useSiteContent(prefix?: string) {
  const [items, setItems] = useState<SiteContentItem[]>(contentCache ?? []);
  const [loading, setLoading] = useState(!contentCache);

  useEffect(() => {
    const now = Date.now();
    if (contentCache && now - cacheTimestamp < CACHE_TTL) {
      setItems(contentCache);
      setLoading(false);
      return;
    }

    supabase.from('site_content').select('*').then(({ data }) => {
      contentCache = data ?? [];
      cacheTimestamp = Date.now();
      setItems(contentCache);
      setLoading(false);
    });
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

// Force refresh on next mount (call after admin saves)
export function invalidateSiteContentCache() {
  contentCache = null;
  cacheTimestamp = 0;
}
