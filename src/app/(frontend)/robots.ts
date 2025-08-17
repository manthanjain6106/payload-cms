import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'settings' })
  const base = settings?.siteURL || ''
  const noIndex = settings?.defaultSEO?.noIndex

  return {
    rules: [
      {
        userAgent: '*',
        allow: noIndex ? [] : ['/'],
        disallow: noIndex ? ['/'] : [],
      },
    ],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  }
}


