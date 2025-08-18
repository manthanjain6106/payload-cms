import { getPayload } from 'payload'
import config from '@/payload.config'

export const metadata = { title: 'Tags' }

export const dynamic = 'force-dynamic'

export default async function TagsPage() {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({ collection: 'tags', limit: 1000, depth: 0 })

  return (
    <main>
      <h1>Tags</h1>
      <ul>
        {docs.map((t: any) => (
          <li key={t.id}>
            <a href={`/tag/${t.slug}`}>{t.title}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}


