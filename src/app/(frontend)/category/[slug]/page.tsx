import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

type RouteParams = { params: Promise<{ slug: string }> }

export async function generateMetadata(props: RouteParams): Promise<Metadata> {
  const params = await props.params
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({ collection: 'categories', where: { slug: { equals: params.slug } }, limit: 1 })
  const cat: any = docs[0]
  if (!cat) return {}
  return { title: `Category: ${cat.title}`, description: cat.description }
}

export default async function CategoryPage(props: RouteParams) {
  const params = await props.params
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({ collection: 'categories', where: { slug: { equals: params.slug } }, limit: 1 })
  const cat: any = docs[0]
  if (!cat) return notFound()

  const posts = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { categories: { contains: cat.id } },
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
      <h1>Category: {cat.title}</h1>
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


