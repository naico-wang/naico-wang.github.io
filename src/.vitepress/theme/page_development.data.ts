import { getDirectoryData } from '../utils/common'

const scanDir = './development/**/*.md'

export default getDirectoryData(scanDir)
