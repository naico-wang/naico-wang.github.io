import { getAllSiteData } from '../utils/common'

const dirList = [
  './architect/**/*.md',
  './blog/**/*.md',
  './interview/**/*.md',
  './fullstack/**/*.md'
];

export default getAllSiteData(dirList)
