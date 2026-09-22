import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import { initRefreshPolicy } from '@/animations';
import App from './App';

// Registers GSAP plugins (via the animations barrel) and installs the ScrollTrigger refresh policy.
initRefreshPolicy();

// StrictMode is ON in development on purpose: it double-mounts every component, which is
// the strongest everyday test that all GSAP setup/cleanup is symmetrical.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
