import markdownItPlantuml from 'markdown-it-plantuml'

export const markdownConfig = {
    math: true,
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },
    // theme: 'one-dark-pro',
    config: (md) => {
      md.use(markdownItPlantuml, {
        openMarker: '```plantuml',
        closeMarker: '```',
        imageFormat: 'svg',
      })
    }
  }
