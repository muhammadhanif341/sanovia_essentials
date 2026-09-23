import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import { initRefreshPolicy } from '@/animations';
import { setOrganizationSchema } from '@/utils/seo';
import App from './App';

// Registers GSAP plugins (via the animations barrel) and installs the ScrollTrigger refresh policy.
initRefreshPolicy();

// Site-wide JSON-LD (Organization + WebSite) — once, not per-route (utils/seo.js handles per-page meta).
setOrganizationSchema();

// StrictMode is ON in development on purpose: it double-mounts every component, which is
// the strongest everyday test that all GSAP setup/cleanup is symmetrical.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
