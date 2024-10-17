

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
