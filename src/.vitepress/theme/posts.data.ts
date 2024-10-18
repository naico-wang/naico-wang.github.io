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

const arraySearchDirs = ['./blog/*/*.md', './interview/*/*.md', './design-pettern/*.md']


export default createContentLoader(arraySearchDirs, {
  excerpt: true,
  transform(raw): any {
  const tags: string[] = []
  const postCount = (raw || []).length
  const posts = raw
   .map(({ url, frontmatter }) => {
    const tagList = url.split('/')
    const listLength = tagList.length
    const tag = listLength > 2 ? tagList[listLength - 2] : ''
    const result = {
     title: frontmatter.title,
     url,
     date: formatDate(frontmatter.date),
     abstract: frontmatter.abstract,
     tag
    }

    if (!tags.includes(tag)) {
      tags.push(tag)
    }

    return result
   })
   .sort((a, b) => b.date.time - a.date.time)

  return {
    posts,
    tags,
    postCount
  }
 }
})
