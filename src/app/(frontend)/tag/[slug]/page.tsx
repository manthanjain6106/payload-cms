import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

type RouteParams = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: RouteParams): Promise<Metadata> {
  const params = await props.params
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({ collection: 'tags', where: { slug: { equals: params.slug } }, limit: 1 })
  const tag: any = docs[0]
  if (!tag) return {}
  return { title: `Tag: ${tag.title}` }
}

export default async function TagPage(props: RouteParams) {
  const params = await props.params
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({ collection: 'tags', where: { slug: { equals: params.slug } }, limit: 1 })
  const tag: any = docs[0]
  if (!tag) return notFound()

  const posts = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { tags: { contains: tag.id } },
        { status: { equals: 'published' } },
        { publishedAt: { less_than_equal: new Date().toISOString() } },
      ],
    },
    sort: '-publishedAt',
    limit: 20,
    depth: 2,
  })

  return (
    <main>
      <h1>Tag: {tag.title}</h1>
      <ul>
        {posts.docs.map((p: any) => (
          <li key={p.id}>
            <a href={`/blog/${p.slug}`}>{p.title}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}


