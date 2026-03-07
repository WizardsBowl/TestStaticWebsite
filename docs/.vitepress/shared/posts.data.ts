import { createContentLoader } from 'vitepress'
import type { PostData } from '../type'
import { hostname, ogDefaultImage } from './siteInfo'

declare const data: PostData[]
export { data }

export default createContentLoader('**/*.md', {
    transform(rawData) {
        return rawData.map(page => {
            return {
                title: page.frontmatter.title || '[文章标题]',
                description: page.frontmatter.description || '[内容概要]',
                tags: page.frontmatter.tags || [],
                url: page.url,
                coverImage: page.frontmatter.ogImage || ogDefaultImage
            }
        })
    },
})