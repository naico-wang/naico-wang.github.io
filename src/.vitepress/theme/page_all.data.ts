import { getAllSiteData } from '../utils/common'

const dirList = [
  './algorithm/**/*.md',
  './architect/**/*.md',
  './development/**/*.md',
  './interview/**/*.md',
  './pattern/**/*.md',
  './react/**/*.md',
  './vue/*.md',
  './onepic/*.md'
];

export default getAllSiteData(dirList)
