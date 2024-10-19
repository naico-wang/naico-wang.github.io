import { createContentLoader } from 'vitepress'
import { formatDate } from '../utils/common'

interface Post {
  title: string
  url: string
  date: {
    time: number
    string: string
  }
  abstract: string | undefined
}

type Tags = string[]

declare const data: { posts: Post[], tags: Tags}

export { data }

export default createContentLoader('./fullstack/**/*.md', {
  transform(raw): any {
  const tags: string[] = []
  const postCount = (raw || []).length
  const posts = raw
    .filter(_ => _.frontmatter.exclude !== true)
    .map(({ url, frontmatter }) => {
      const { title, abstract, tag } = frontmatter;
      if (tag && !tags.includes(tag)) {
        tags.push(tag)
      }
      return {
        title,
        url,
        date: formatDate(frontmatter.date),
        abstract,
        tag
      }
    })
    .sort((a, b) => b.date.time - a.date.time)

  return {
    posts,
    tags,
    postCount
  }
 }
})
