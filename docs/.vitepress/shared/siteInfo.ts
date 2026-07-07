import type { PageData } from 'vitepress';

export const hostname = 'https://blog.wzb233.com';
export const defaultCoverImage = 'https://img.wizardsbowl.com/const/blog/og-image-fuwanko-1-1.jpg';

export function getUrlByPageData(page: PageData): string {
  return `${hostname}/${page.relativePath.replace(/\.md$/, '')}`;
}