import { createContentLoader } from 'vitepress'

export const formatDate = (raw: string): any => {
  const date = new Date(raw)

  date.setUTCHours(12)

  return {
    time: +date || 0,
    string: date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) || ''
  }
}

export const getDirectoryData = (folder) => {
  return createContentLoader(folder, {
  transform(data): any {
    return Object.entries(
      data
        .filter(item => item.frontmatter.exclude !== true)
        .reduce((acc, item) => {
          const category = item.frontmatter.category;

          if (!acc[category]) {
            acc[category] = [];
          }

          acc[category].push({
            url: item.url,
            title: item.frontmatter.title,
            abstract: item.frontmatter.abstract,
            category: item.frontmatter.category,
            date: formatDate(item.frontmatter.date)
          });

          return acc;
        }, {})
    ).map(([category, posts]) => ({
      category,
      postCount: posts.length,
      data: posts
    }));
 }
})
}
