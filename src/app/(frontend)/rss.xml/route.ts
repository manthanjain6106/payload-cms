import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'settings' })
  const base = settings?.siteURL || ''

  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { publishedAt: { less_than_equal: new Date().toISOString() } },
      ],
    },
    limit: 50,
    sort: '-publishedAt',
    depth: 2,
  })

  const items = posts
    .map((p: any) => `
      <item>
        <title><![CDATA[${p.title}]]></title>
        <link>${base}/blog/${p.slug}</link>
        <guid>${base}/blog/${p.slug}</guid>
        ${p.excerpt ? `<description><![CDATA[${p.excerpt}]]></description>` : ''}
        ${p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''}
      </item>
    `)
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title><![CDATA[${settings?.siteName || 'RSS'}]]></title>
      <link>${base}</link>
      <description><![CDATA[Latest posts from ${settings?.siteName || ''}]]></description>
      ${items}
    </channel>
  </rss>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}


