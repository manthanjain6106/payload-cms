import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

type RouteParams = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: RouteParams): Promise<Metadata> {
  const params = await props.params
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({ collection: 'authors', where: { slug: { equals: params.slug } }, limit: 1 })
  const author: any = docs[0]
  if (!author) return {}
  return { title: `Author: ${author.name}`, description: author.bio }
}

export default async function AuthorPage(props: RouteParams) {
  const params = await props.params
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({ collection: 'authors', where: { slug: { equals: params.slug } }, limit: 1 })
  const author: any = docs[0]
  if (!author) return notFound()

  const posts = await payload.find({
    collection: 'posts',
    where: { author: { equals: author.id }, status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 20,
    depth: 2,
  })

  return (
    <main>
      <h1>Author: {author.name}</h1>
      {author.bio && <p>{author.bio}</p>}
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


