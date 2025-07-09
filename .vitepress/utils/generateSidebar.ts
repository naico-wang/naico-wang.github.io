import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface CategoryInfo {
  label?: string;
  position?: number;
  collapsed?: boolean;
}

interface Frontmatter {
  title?: string;
  position?: number;
  [key: string]: any;
}

interface FileItem {
  name: string;
  path: string;
  relativePath: string;
  frontmatter: Frontmatter;
}

interface DirectoryItem {
  name: string;
  path: string;
  relativePath: string;
}

interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
  position: number;
  collapsed?: boolean;
}

interface DirectoryResult {
  label?: string;
  position?: number;
  items: SidebarItem[];
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../../src');
const excludeDirs = ['public', 'markdown-assets'];
const excludeFiles = ['index', 'tech-radar'];
const DEFAULT_POSITION = 999;

/**
 * 解析frontmatter内容
 */
function parseFrontmatter(content: string): Frontmatter {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  const frontmatter: Frontmatter = {};
  const frontmatterContent = frontmatterMatch[1];

  frontmatterContent.split('\n').forEach((line: string) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    if (!key || !value) return;

    // 解析不同类型的值
    if (value === 'true') {
      frontmatter[key] = true;
    } else if (value === 'false') {
      frontmatter[key] = false;
    } else if (/^\d+$/.test(value)) {
      frontmatter[key] = Number(value);
    } else {
      // 移除引号
      frontmatter[key] = value.replace(/^["'](.+)["']$/, '$1');
    }
  });

  return frontmatter;
}

/**
 * 读取并解析分类信息
 */
function readCategoryInfo(dirPath: string): CategoryInfo | null {
  const categoryPath = path.join(dirPath, '_category_.json');
  if (!fs.existsSync(categoryPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(categoryPath, 'utf8'));
  } catch (error) {
    console.error(`Error parsing _category_.json in ${dirPath}:`, error);
    return null;
  }
}

/**
 * 检查是否应该排除该项目
 */
function shouldExcludeItem(name: string, isDirectory: boolean): boolean {
  if (name.startsWith('.') || name.startsWith('_')) return true;
  if (isDirectory && excludeDirs.includes(name)) return true;
  if (!isDirectory) {
    if (!name.endsWith('.md')) return true;

    const nameWithoutExt = name.replace(/\.md$/, '');

    if (excludeFiles.includes(nameWithoutExt)) return true;
  }
  return false;
}

function readDirectory(dirPath: string, relativePath = ''): DirectoryResult {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  const categoryInfo = readCategoryInfo(dirPath);

  const files: FileItem[] = [];
  const directories: DirectoryItem[] = [];

  for (const item of items) {
    if (shouldExcludeItem(item.name, item.isDirectory())) continue;

    const itemPath = path.join(dirPath, item.name);
    const itemRelativePath = path.join(relativePath, item.name);

    if (item.isDirectory()) {
      directories.push({
        name: item.name,
        path: itemPath,
        relativePath: itemRelativePath
      });
    } else if (item.isFile()) {
      try {
        const content = fs.readFileSync(itemPath, 'utf8');
        const frontmatter = parseFrontmatter(content);

        files.push({
          name: item.name,
          path: itemPath,
          relativePath: itemRelativePath,
          frontmatter
        });
      } catch (error) {
        console.error(`Error reading file ${itemPath}:`, error);
      }
    }
  }

  const subDirs: (DirectoryItem & DirectoryResult)[] = [];
  for (const dir of directories) {
    const subDir = readDirectory(dir.path, dir.relativePath);
    if (subDir.items.length > 0) {
      subDirs.push({ ...dir, ...subDir });
    }
  }

  const fileItems: SidebarItem[] = files.map(file => ({
    text: file.frontmatter.title || file.name.replace(/\.md$/, ''),
    link: '/' + file.relativePath.replace(/\.md$/, ''),
    position: file.frontmatter.position ?? DEFAULT_POSITION
  }));

  // 处理目录项
  const dirItems: SidebarItem[] = subDirs.map(dir => {
    const dirCategoryInfo = readCategoryInfo(dir.path);

    return {
      text: dirCategoryInfo?.label || dir.name,
      items: dir.items,
      position: dirCategoryInfo?.position ?? DEFAULT_POSITION,
      collapsed: dirCategoryInfo?.collapsed
    };
  });

  // 合并并排序所有项目
  const allItems = [...fileItems, ...dirItems].sort((a, b) => a.position - b.position);

  return {
    label: categoryInfo?.label,
    position: categoryInfo?.position,
    items: allItems
  };
}

/**
 * 递归转换侧边栏项目，添加collapsed属性
 * @param item 侧边栏项目
 */
function transformSidebarItem(item: SidebarItem): SidebarItem {
  const transformed: SidebarItem = {
    text: item.text,
    position: item.position
  };

  if (item.link) {
    transformed.link = item.link;
  }

  if (item.items && item.items.length > 0) {
    transformed.items = item.items.map(transformSidebarItem);
    // 使用item中已设置的collapsed属性，默认为false
    transformed.collapsed = item.collapsed;
  }

  return transformed;
}

/**
 * 生成侧边栏配置
 * @returns 侧边栏配置数组
 */
export function generateSidebar(): SidebarItem[] {
  console.log('正在生成侧边栏配置...');

  try {
    const result = readDirectory(srcDir);
    const sidebar = result.items.map(transformSidebarItem);

    console.log('侧边栏配置已生成，共', sidebar.length, '个顶级项目');
    return sidebar;
  } catch (error) {
    console.error('生成侧边栏配置时出错:', error);
    return defaultSidebar;
  }
}

/**
 * 默认侧边栏配置
 */
export const defaultSidebar: SidebarItem[] = [];

let sidebar: SidebarItem[]
try {
  sidebar = generateSidebar()
} catch (error) {
  console.error('生成侧边栏时出错:', error)

  sidebar = defaultSidebar
}

export default sidebar