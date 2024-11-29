import { getDirectoryData } from '../utils/common'

const dirList = [
  './interview/**/*.md',
  './architect/**/*.md',
  './development/**/*.md',
  './algorithm/**/*.md',
  './pattern/*.md',
  './react/**/*.md',
  './vue/*.md'
];

export default getDirectoryData(dirList)
