import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  position?: number
}

declare const data: Post[]
export { data }

export default createContentLoader('design-pattern/**/*.md', {
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        position: frontmatter.position ? Number(frontmatter.position) : undefined
      }))
      .sort((a, b) => {
        const posA = a.position ?? 999
        const posB = b.position ?? 999
        return posA - posB
      })
  }
})