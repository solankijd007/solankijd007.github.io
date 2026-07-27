// Shared because this list feeds two consumers: the Projects section and the
// JSON-LD graph in layout.jsx. Keeping one copy means the structured data can
// never drift from what the page actually shows — which is exactly the kind of
// mismatch search engines penalise.

export const PROJECTS = [
  {
    id: '01',
    name: 'LogystiX',
    domain: 'logystix.cloud',
    href: 'https://logystix.cloud',
    status: 'Live',
    role: 'Team lead · delivered end to end',
    description:
      'SaaS logistics platform taken from architecture through production launch — inquiry and quotation flows on multi-tenant, role-based access.',
    stack: ['Node.js', 'TypeScript', 'React.js', 'MySQL', 'Docker'],
  },
  {
    id: '02',
    name: 'SupplierX',
    domain: 'aeonx.supplierx.cloud',
    href: 'https://aeonx.supplierx.cloud',
    status: 'Live',
    role: 'Backend architecture & delivery',
    description:
      'Procure-to-Pay SaaS: supplier onboarding with PAN/GST verification, purchase order and approval workflows, and SAP integration on a multi-tenant Node.js backend.',
    stack: ['Node.js', 'TypeScript', 'React.js', 'MySQL'],
  },
  {
    id: '03',
    name: 'Hunter Home CMS',
    domain: 'hunterhome.co.nz',
    href: 'https://hunterhome.co.nz',
    status: 'Live',
    role: 'Backend & integrations',
    description:
      'Admin and content-management backend for a New Zealand retailer, built on the BigCommerce API.',
    stack: ['Node.js', 'BigCommerce API'],
  },
  {
    id: '04',
    name: 'DIT Academy',
    domain: 'academy.ditcloud.in',
    href: 'https://academy.ditcloud.in',
    status: 'Live',
    role: 'Full stack · also taught on it',
    description:
      'Training platform for the company internship programme, where I also taught Node.js and Python to interns.',
    stack: ['Node.js', 'React.js', 'MySQL'],
  },
];

export const ALSO_DELIVERED = [
  'Memory Kite',
  'PHC',
  'Afford A Boost',
  'Arabic Book A Month (custom Shopify app)',
];
