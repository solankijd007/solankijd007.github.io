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
  // Verified against the profile's "Public profile & URL" field. Both of these
  // feed `sameAs` in the JSON-LD graph, which is how a search engine confirms
  // these accounts and this site are the same person — check the live URL
  // before changing either.
  linkedin: 'https://www.linkedin.com/in/solankijd007',
  resume: '/Jagdish-Solanki-CV.pdf',
  url: 'https://solankijd007.github.io',
  // The CV's own summary says "currently team lead" while its dates say
  // "Sep 2024 – Dec 2025". Confirmed with Jagdish on 2026-07-27: the role has
  // ended and he is not currently employed, so the past tense here is correct
  // and the CV summary is the stale half. This is also why the JSON-LD in
  // layout.jsx omits `worksFor` — schema.org reads it as *current* employment.
  // If that changes, update the tense here, in Hero's FACTS, in About's second
  // paragraph and in layout.jsx's description, and add `worksFor` back.
  summary:
    'Full stack developer with 4 years shipping production web products in Node.js, TypeScript and React.js. Most recently team lead at AeonX Digital, where I delivered LogystiX end to end and built SupplierX.',
};
