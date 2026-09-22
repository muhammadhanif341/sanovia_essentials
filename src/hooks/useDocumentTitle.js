import { useEffect } from 'react';
import { site } from '@/data/site';

export const formatTitle = (title) => (title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`);

/** Set the document title for a page (SPA route changes don't reload the page). */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = formatTitle(title);
  }, [title]);
}
