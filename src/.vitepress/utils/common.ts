import { createContentLoader } from 'vitepress'

export const formatDate = (raw: string): any => {
  const date = new Date(raw)

  date.setUTCHours(12)

  return {
    time: +date || 0,
    string: date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-') || ''
  }
}

export const getDirectoryData = (folderName) => {
  return createContentLoader(folderName, {
    transform(data): any {
      return processDataWithCategory(data)
   }
  })
}

export const getAllSiteData = (folderList) => {
  return createContentLoader(folderList, {
    transform(data): any {
      return processDataIgnoreCategory(data)
   }
  })
}

const processDataIgnoreCategory = (data) => {
  const posts = data
    .filter(item => item.frontmatter.exclude !== true)
    .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
    .map(({url, frontmatter}) => ({
      url,
      title: frontmatter.title,
      date: formatDate(frontmatter.date).string,
      category: frontmatter.category
    }))

  return {
    posts,
    count: posts.length || 0
  }
}

const processDataWithCategory = (data) => {
  return Object.entries(
    data
      .filter(item => item.frontmatter.exclude !== true)
      .sort((a, b) => new Date(a.frontmatter.date) - new Date(b.frontmatter.date))
      .reduce((acc, item) => {
        const category = item.frontmatter.category;

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push({
          url: item.url,
          title: item.frontmatter.title,
          category: item.frontmatter.category,
          date: formatDate(item.frontmatter.date)
        });

        return acc;
      }, {})
  ).map(([category, posts]) => ({
    category,
    postCount: posts.length || 0,
    data: posts
  }));
}
