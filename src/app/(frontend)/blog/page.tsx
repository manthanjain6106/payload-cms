import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const metadata: Metadata = {
  title: 'Blog',
}

export const revalidate = 120

export default async function BlogIndex({ searchParams }: { searchParams?: { page?: string } }) {
  const payload = await getPayload({ config: await config })
  const page = Number(searchParams?.page || '1')
  const limit = 10
  const { docs, totalDocs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { publishedAt: { less_than_equal: new Date().toISOString() } },
      ],
    },
    sort: '-publishedAt',
    limit,
    page,
    depth: 2,
  })

  return (
    <main>
      <h1>Blog</h1>
      <ul>
        {docs.map((p: any) => (
          <li key={p.id}>
            <a href={`/blog/${p.slug}`}>{p.title}</a>
          </li>
        ))}
      </ul>
      <nav>
        {page > 1 && <a href={`/blog?page=${page - 1}`}>Previous</a>}
        {page * limit < totalDocs && <a href={`/blog?page=${page + 1}`}>Next</a>}
      </nav>
    </main>
  )
}


