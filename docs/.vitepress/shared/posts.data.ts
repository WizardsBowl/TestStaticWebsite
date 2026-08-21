import { createContentLoader } from 'vitepress'
import type { PostData } from '../type/index.ts'
import { hostname, defaultCoverImage } from './siteInfo.ts'
import { getGitCreatedTimestamp } from './getGitTimestamp.ts'
import { getPathFromLink } from './utils.ts'

declare const data: PostData[]
export { data }

export default createContentLoader('**/*.md', {
    async transform(rawData) {
        const promises = rawData.map(async page => {
            const createdTimestamp = await getGitCreatedTimestamp(`docs/${getPathFromLink(page.url)}`);
            return {
                title: page.frontmatter.title || '[文章标题]',
                description: page.frontmatter.description || '[内容概要]',
                date: createdTimestamp || Date.now(),
                tags: page.frontmatter.tags || [],
                url: page.url,
                coverImage: page.frontmatter.cover || defaultCoverImage
            };
        });
        const postsData = await Promise.all(promises);
        return postsData.sort((a, b) => b.date - a.date);
    },
})