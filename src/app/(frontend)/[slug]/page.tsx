import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

type RouteParams = { params: Promise<{ slug: string }> }

export const revalidate = 120

export async function generateMetadata(
  props: RouteParams
): Promise<Metadata> {
  const { params } = props
  const resolvedParams = await params

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: resolvedParams.slug } },
    limit: 1,
    depth: 1,
  })
  const page: any = docs[0]
  if (!page) return {}
  const settings = await payload.findGlobal({ slug: 'settings' })
  const base = settings?.siteURL || ''
  const title = page.seo?.title || page.title
  const description = page.seo?.description
  const image = page.seo?.image?.url
  return {
    title,
    description,
    alternates: { canonical: `${base}/${page.slug}` },
    openGraph: { title, description, images: image ? [{ url: image }] : undefined },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
      site: settings?.defaultSEO?.twitterUsername ?? undefined,
    },
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
  }
}

export default async function CMSPage(props: RouteParams) {
  const { params } = props
  const resolvedParams = await params

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: resolvedParams.slug } },
    limit: 1,
    depth: 2,
  })
  const page: any = docs[0]
  if (!page) return notFound()
  return (
    <article>
      <h1>{page.title}</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(page.content, null, 2)}</pre>
    </article>
  )
}


