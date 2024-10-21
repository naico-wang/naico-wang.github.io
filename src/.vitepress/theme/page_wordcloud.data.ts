import { getDirectoryData } from '../utils/common'

const dirList = [
  './interview/**/*.md',
  './architect/**/*.md',
  './development/**/*.md',
  './algorithm/basis/*.md',
  './algorithm/integrated/*.md',
  './pattern/**/*.md'
];

export default getDirectoryData(dirList)
