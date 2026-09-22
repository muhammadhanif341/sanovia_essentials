import { useId, useState } from 'react';
import { cn } from '@/utils/cn';
import './surfaces.css';

/**
 * Accessible accordion (WAI-ARIA disclosure pattern): each trigger is a <button>
 * inside a heading, with aria-expanded + aria-controls; closed panels are `inert`.
 *
 * items: [{ id, title, content }]      level: heading level for the titles (default 3)
 */
export function Accordion({ items, level = 3, multiple = false, defaultOpen = [], className }) {
  const base = useId();
  const [open, setOpen] = useState(() => new Set(defaultOpen));
  const Heading = `h${level}`;

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className={cn('sv-acc', className)}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const btnId = `${base}-${item.id}-btn`;
        const panelId = `${base}-${item.id}-panel`;
        return (
          <div className="sv-acc__item" data-open={isOpen} key={item.id}>
            <Heading className="sv-acc__heading">
              <button
                type="button"
                id={btnId}
                className="sv-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span>{item.title}</span>
                <span className="sv-acc__glyph" aria-hidden="true" />
              </button>
            </Heading>
            <div id={panelId} role="region" aria-labelledby={btnId} className="sv-acc__panel">
              <div className="sv-acc__inner" inert={!isOpen}>
                <div className="sv-acc__content t-body">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
