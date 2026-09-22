/**
 * Icon set: 1.5px stroke, 24px grid, `currentColor`. Hand-drawn inline SVG so the
 * project carries no icon dependency. Icons are decorative by default
 * (aria-hidden); pass `title` to expose one to assistive tech.
 *
 * NOTE: `WhatsApp` here is a generic chat-bubble glyph. Use the official WhatsApp
 * glyph (monochrome) once brand-guideline usage is confirmed — see blueprint §5.1.
 */
function Svg({ size = 20, title, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p) => (
  <Svg {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
);
export const ArrowUpRight = (p) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);
export const ChevronLeft = (p) => (
  <Svg {...p}>
    <path d="m15 5-7 7 7 7" />
  </Svg>
);
export const ChevronRight = (p) => (
  <Svg {...p}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
);
export const Plus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const Minus = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);
export const Close = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
export const Check = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
export const Alert = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </Svg>
);
export const Pause = (p) => (
  <Svg {...p}>
    <path d="M9 6v12M15 6v12" />
  </Svg>
);
export const Play = (p) => (
  <Svg {...p}>
    <path d="M8 5.5v13l10-6.5-10-6.5Z" />
  </Svg>
);
export const OrderList = (p) => (
  <Svg {...p}>
    <path d="M5 6h14M5 12h14M5 18h9" />
  </Svg>
);
/* Header utilities. Drawn to the same 24px / 1.5px grid as the rest of the set. */
export const Search = (p) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.25" />
    <path d="m15.25 15.25 5 5" />
  </Svg>
);
export const User = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8.25" r="3.75" />
    <path d="M4.75 20c.6-3.6 3.5-5.75 7.25-5.75s6.65 2.15 7.25 5.75" />
  </Svg>
);
export const Heart = (p) => (
  <Svg {...p}>
    <path d="M12 20.25S3.75 15.2 3.75 9.35A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.25 2.75c0 5.85-8.25 10.9-8.25 10.9Z" />
  </Svg>
);
/** Cart: a shopping bag with a handle. */
export const Bag = (p) => (
  <Svg {...p}>
    <path d="M5.25 8.25h13.5l.9 11.5H4.35l.9-11.5Z" />
    <path d="M9 10.75V7.5a3 3 0 0 1 6 0v3.25" />
  </Svg>
);
export const Replay = (p) => (
  <Svg {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4.5 4.5v4.2h4.2" />
  </Svg>
);
export const WhatsApp = (p) => (
  <Svg {...p}>
    <path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.9L4 20Z" />
    <path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5l1.2-1.2-1.8-1-.8.6a3.3 3.3 0 0 1-1.6-1.6l.6-.8-1-1.8L9 9.5Z" />
  </Svg>
);
export const Instagram = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <path d="M16.8 7.2v.01" />
  </Svg>
);
/* Product UI: quick view, ratings, filter, sort. */
export const Eye = (p) => (
  <Svg {...p}>
    <path d="M2.75 12S6 5.75 12 5.75 21.25 12 21.25 12 18 18.25 12 18.25 2.75 12 2.75 12Z" />
    <circle cx="12" cy="12" r="2.75" />
  </Svg>
);
export const Star = (p) => (
  <Svg {...p}>
    <path d="m12 4 2.35 4.9 5.4.72-3.9 3.78.95 5.4L12 16.2l-4.8 2.6.95-5.4-3.9-3.78 5.4-.72Z" />
  </Svg>
);
export const Sliders = (p) => (
  <Svg {...p}>
    <path d="M4 7h10M17.5 7H20M4 17h4M11.5 17H20" />
    <circle cx="14" cy="7" r="2.25" />
    <circle cx="7.5" cy="17" r="2.25" />
  </Svg>
);
export const ChevronDown = (p) => (
  <Svg {...p}>
    <path d="m5 8.5 7 7 7-7" />
  </Svg>
);
