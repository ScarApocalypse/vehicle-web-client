
import defaultSettings from '@/settings'
/* 设置网页title 区域*/
const title = defaultSettings.title || '小慕读书'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
