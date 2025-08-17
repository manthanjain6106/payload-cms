import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: 'published' } }),
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [({ data }) => {
          if (!data) return
          const base = data.title || data.slug
          if (base) {
            data.slug = String(base)
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
          }
        }],
      },
    },
    { name: 'content', type: 'richText' },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'noIndex', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'sitemap',
      label: 'Sitemap',
      type: 'group',
      fields: [
        { name: 'exclude', label: 'Exclude from sitemap', type: 'checkbox', defaultValue: false },
        { name: 'priority', type: 'number', min: 0, max: 1, admin: { step: 0.1 } },
        { name: 'changefreq', type: 'select', options: [
          'always','hourly','daily','weekly','monthly','yearly','never'
        ].map(v => ({ label: v, value: v })), },
      ],
    },
    { name: 'status', type: 'select', defaultValue: 'draft', options: [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
    ], admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}


