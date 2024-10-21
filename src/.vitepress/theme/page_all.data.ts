import { getAllSiteData } from '../utils/common'

const dirList = ['./algorithm/**/*.md', './architect/**/*.md', './development/**/*.md', './interview/**/*.md', './pattern/**/*.md'];

export default getAllSiteData(dirList)
