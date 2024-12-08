import { getDirectoryData } from '../utils/common'

const dirList = [
  './interview/**/*.md',
  './architect/**/*.md',
  './fullstack/**/*.md',
  './blog/**/*.md'
];

export default getDirectoryData(dirList)
