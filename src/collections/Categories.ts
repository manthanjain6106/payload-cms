import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
        description: 'URL-friendly identifier generated from the title.',
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
      name: 'description',
      type: 'textarea',
    },
  ],
}


