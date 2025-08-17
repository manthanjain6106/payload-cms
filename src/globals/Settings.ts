import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site Settings',
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'My Site',
    },
    {
      name: 'siteURL',
      type: 'text',
      required: true,
      admin: { description: 'e.g. https://www.example.com (no trailing slash)' },
    },
    {
      name: 'defaultSEO',
      label: 'Default SEO',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'twitterUsername', type: 'text' },
        { name: 'noIndex', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'social',
      label: 'Social Links',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
    {
      name: 'organization',
      label: 'Organization (JSON-LD)',
      type: 'group',
      fields: [
        { name: 'legalName', type: 'text' },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}


