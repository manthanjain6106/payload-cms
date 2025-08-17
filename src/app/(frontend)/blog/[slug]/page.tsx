import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ArticleJsonLD } from './jsonld'

type RouteParams = { params: Promise<{ slug: string }> }

export async function generateMetadata(props: RouteParams): Promise<Metadata> {
  const params = await props.params
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: params.slug } },
    limit: 1,
    depth: 2,
  })
  const post: any = docs[0]
  const settings = await payload.findGlobal({ slug: 'settings' })

  if (!post) return {}

  const title = post.seo?.title || post.title
  const description = post.seo?.description
  const image = post.seo?.image?.url
  const base = settings?.siteURL || ''

  return {
    title,
    description,
    alternates: { canonical: `${base}/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: 'article',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
      site: settings?.defaultSEO?.twitterUsername ?? undefined,
    },
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
  }
}

export default async function PostPage(props: RouteParams) {
  const params = await props.params
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: params.slug } },
    limit: 1,
    depth: 3,
  })
  const post: any = docs[0]
  if (!post) return notFound()
  const settings = await payload.findGlobal({ slug: 'settings' })
  const base = settings?.siteURL || ''

  return (
    <article>
      <h1>{post.title}</h1>
      {post.excerpt && <p>{post.excerpt}</p>}
      {post.coverImage?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage.url} alt={post.coverImage.alt || ''} />
      )}
      {/* TODO: Render rich text properly; for now, JSON stringify for dev */}
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(post.content, null, 2)}</pre>
      <ArticleJsonLD
        url={`${base}/blog/${post.slug}`}
        title={post.title}
        description={post.seo?.description || post.excerpt}
        image={post.seo?.image?.url || post.coverImage?.url}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
        authorName={post.author?.name}
      />
    </article>
  )
}


