import { getDirectoryData } from '../utils/common'

const scanDir = ['./interview/*.md', './interview/**/**/.md', './interview/**/*.md']

export default getDirectoryData(scanDir)
