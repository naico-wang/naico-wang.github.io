import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  date: {
    time: number
    string: string
  }
  excerpt: string | undefined
}

declare const data: Post[]

export { data }

export default createContentLoader(['./blog/*/*.md','./blog/*/*/*.md'], {
  transform(raw): data {
  const postMap = {};
  const yearMap = {};
  const posts = raw
   .map(({ url, frontmatter }) => {
    const result = {
     title: frontmatter.title,
     url,
     date: formatDate(frontmatter.date),
     abstract: frontmatter.abstract
    };
    postMap[result.url] = result;

    return result;
   })
   .sort((a, b) => b.date.time - a.date.time);

  posts.forEach((item) => {
   const year = new Date(item.date.string).getFullYear();
   if (!yearMap[year]) {
    yearMap[year] = [];
   }
   yearMap[year].push(item.url);
  });

  return {
   yearMap,
   postMap
  };
 },
})

function formatDate(raw: string): Post['date'] {
  const date = new Date(raw)
  date.setUTCHours(12)
  return {
    time: +date,
    string: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
