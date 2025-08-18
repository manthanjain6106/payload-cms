import { getPayload } from 'payload'
import config from '@/payload.config'

export const metadata = { title: 'Categories' }

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({ collection: 'categories', limit: 1000, depth: 0 })

  return (
    <main>
      <h1>Categories</h1>
      <ul>
        {docs.map((c: any) => (
          <li key={c.id}>
            <a href={`/category/${c.slug}`}>{c.title}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}


