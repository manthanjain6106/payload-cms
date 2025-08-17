import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return {
        and: [
          {
            status: { equals: 'published' },
            publishedAt: { less_than_equal: new Date().toISOString() },
          },
        ],
      }
    },
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeChange: [({ data, originalDoc }) => {
      if (!data) return data
      const nextStatus = data.status ?? originalDoc?.status
      if (nextStatus === 'published' && !data.publishedAt) {
        data.publishedAt = new Date().toISOString()
      }
      return data
    }],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated from title if left blank.',
      },
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
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown in lists and previews.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      defaultValue: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: '', version: 1 },
              ],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'video',
      label: 'Video Upload or Embed',
      type: 'group',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'oembed',
          label: 'oEmbed URL (YouTube, Vimeo, etc.)',
          type: 'text',
        },
      ],
    },
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
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}


