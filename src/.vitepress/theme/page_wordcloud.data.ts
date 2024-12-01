import { getDirectoryData } from '../utils/common'

const dirList = [
  './interview/**/*.md',
  './architect/**/*.md',
  './fullstack/**/*.md',
  './pattern/*.md',
  './blog/**/*.md'
];

export default getDirectoryData(dirList)
