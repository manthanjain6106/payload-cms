export function ArticleJsonLD({
  url,
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
}: {
  url: string
  title: string
  description?: string
  image?: string
  datePublished?: string
  dateModified?: string
  authorName?: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image ? [image] : undefined,
    author: authorName ? { '@type': 'Person', name: authorName } : undefined,
    datePublished,
    dateModified,
    mainEntityOfPage: url,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}


