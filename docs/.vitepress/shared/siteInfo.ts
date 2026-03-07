import type { PageData } from 'vitepress';

export const hostname = 'https://www.wzb233.com';
export const ogDefaultImage = 'https://img.wizardsbowl.com/const/blog/og-image-fuwanko-1.jpg';

export function getUrlByPageData(page: PageData): string {
  return `${hostname}/${page.relativePath.replace(/\.md$/, '')}`;
}