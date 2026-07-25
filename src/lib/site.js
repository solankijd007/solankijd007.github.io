// Single source of truth for personal details, so nothing is hardcoded twice.

/** Prefix a /public asset path. For username.github.io the basePath is empty. */
export const asset = (path) => path;

export const SITE = {
  name: 'Jagdish Solanki',
  role: 'Full Stack Developer',
  specialism: 'Node.js & TypeScript',
  location: 'Bhuj, Gujarat, India',
  email: 'solankijd5182@gmail.com',
  phone: '+91 91060 20722',
  phoneHref: '+919106020722',
  github: 'https://github.com/solankijd007',
  // TODO(jagdish): swap in your real LinkedIn vanity URL if it differs.
  linkedin: 'https://www.linkedin.com/in/solankijd007',
  resume: '/Jagdish-Solanki-CV.pdf',
  url: 'https://solankijd007.github.io',
  // NOTE(jagdish): the CV lists AeonX as "Sep 2024 – Dec 2025" (ended) while its
  // summary says "currently team lead". The site follows the end date. If you are
  // still there, switch the wording here, in Hero's FACTS, in About's second
  // paragraph, and in layout.jsx's description back to the present tense.
  summary:
    'Full stack developer with 4 years shipping production web products in Node.js, TypeScript and React.js. Most recently team lead at AeonX Digital, where I delivered LogystiX end to end and built SupplierX.',
};
