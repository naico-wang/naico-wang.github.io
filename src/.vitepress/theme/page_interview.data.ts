import { getDirectoryData } from '../utils/common'

const scanDir = './interview/**/*.md';

export default getDirectoryData(scanDir)
