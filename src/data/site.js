/**
 * Site-wide constants. Anything the client must confirm is marked TBC.
 * Env-overridable values come from .env.local (see .env.example).
 */
const env = import.meta.env;

const whatsappNumber = env.VITE_WHATSAPP_NUMBER ?? '923286097302'; // TBC: number shown on the Instagram profile

export const site = {
  name: 'Sanovia Essentials',
  shortName: 'Sanovia',
  tagline: 'Minimal everyday essentials.',
  description: 'Sanovia Essentials — minimal everyday essentials. Watches and jewellery.',
  url: env.VITE_SITE_URL ?? '',

  // TBC with client: currency and whether prices are shown.
  currency: env.VITE_CURRENCY ?? 'PKR',
  locale: 'en-PK',
  showPrices: true,

  whatsapp: {
    number: whatsappNumber,
    display: '+92 328 6097302', // TBC
    catalogUrl: `https://wa.me/c/${whatsappNumber}`,
  },
  instagram: {
    handle: 'sanovia_essentials',
    url: 'https://www.instagram.com/sanovia_essentials/',
  },
};
