import { useEffect } from 'react';
import { site } from '@/data/site';
import { setPageMeta } from '@/utils/seo';

export const formatTitle = (title) => (title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`);

/**
 * Set the document title for a page (SPA route changes don't reload the page), plus the meta
 * description, canonical link and Open Graph/Twitter Card tags that go with it (utils/seo.js).
 * `description` is optional — omit it and the page falls back to `site.description`.
 */
export function useDocumentTitle(title, description) {
  useEffect(() => {
    const fullTitle = formatTitle(title);
    document.title = fullTitle;
    setPageMeta({ title: fullTitle, description });
  }, [title, description]);
}
