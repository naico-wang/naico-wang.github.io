import { getDirectoryData } from '../utils/common'

const architectDir = ['./interview/*.md', './interview/**/**/.md', './interview/**/*.md']

export default getDirectoryData(architectDir)
