export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}

export function formatDateTime(date: number | Date): string {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function getPathFromLink(link: string): string {
  return `${link.replace(/\.html$/, '').replace(/\/$/, '/index')}.md`
}