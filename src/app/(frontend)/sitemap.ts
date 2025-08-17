import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: await config })

  const settings = await payload.findGlobal({ slug: 'settings' })
  const base = settings?.siteURL || ''

  const pages = await payload.find({
    collection: 'pages',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
  })

  const posts = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { publishedAt: { less_than_equal: new Date().toISOString() } },
        { 'sitemap.exclude': { not_equals: true } },
      ],
    },
    limit: 5000,
    depth: 0,
  })

  const routes: MetadataRoute.Sitemap = []

  // Home
  if (base) routes.push({ url: `${base}/`, lastModified: new Date() })

  for (const page of pages.docs) {
    routes.push({
      url: `${base}/${page.slug}`.replace(/\/+$/, ''),
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: (page as any).sitemap?.changefreq,
      priority: (page as any).sitemap?.priority,
    })
  }

  for (const post of posts.docs) {
    routes.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: (post as any).sitemap?.changefreq,
      priority: (post as any).sitemap?.priority,
    })
  }

  return routes
}


