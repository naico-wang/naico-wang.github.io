import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * 侧边栏生成工具
 *
 * 这个模块提供了自动生成VitePress侧边栏配置的功能。
 * 它会递归扫描指定目录，根据文件结构和分类配置生成侧边栏菜单。
 *
 * 主要功能：
 * - 自动解析目录结构和Markdown文件
 * - 支持通过 _category_.json 文件配置目录属性
 * - 支持通过 frontmatter 配置页面属性
 * - 支持通过 frontmatter 的 hide 属性隐藏页面
 */

interface CategoryInfo {
  label?: string;
  position?: number;
  collapsed?: boolean;
}

interface Frontmatter {
  title?: string;
  position?: number;
  sidebar_position?: number;
  hide?: boolean;
  [key: string]: any;
}

interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
  position: number;
  collapsed?: boolean;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(__dirname, '../../src');
const DEFAULT_POSITION = 999;
const DEFAULT_COLLAPSED = true;

const isProduction = process.env.NODE_ENV === 'production';

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
    if (!isProduction) {
      console.error(`Error parsing _category_.json in ${dirPath}:`, error);
    }
    return null;
  }
}

/**
 * 递归读取目录并生成侧边栏项
 */
function readDirectory(dirPath: string, relativePath = ''): SidebarItem[] {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  const fileItems: SidebarItem[] = [];
  const dirItems: SidebarItem[] = [];

  for (const item of items) {
    const itemPath = path.join(dirPath, item.name);
    const itemRelativePath = path.join(relativePath, item.name);

    if (item.isDirectory()) {
      // 递归处理子目录
      const subItems = readDirectory(itemPath, itemRelativePath);
      
      if (subItems.length > 0) {
        // 读取子目录的分类信息
        const subCategoryInfo = readCategoryInfo(itemPath);
        
        dirItems.push({
          text: subCategoryInfo?.label || item.name,
          items: subItems,
          position: subCategoryInfo?.position ?? DEFAULT_POSITION,
          collapsed: subCategoryInfo?.collapsed ?? DEFAULT_COLLAPSED
        });
      }
    } else if (item.isFile() && item.name.endsWith('.md')) {
      // 处理 Markdown 文件
      try {
        const content = fs.readFileSync(itemPath, 'utf8');
        const frontmatter = parseFrontmatter(content);

        // 如果 frontmatter 中设置了 hide: true，则跳过该文件
        if (frontmatter.hide === true) {
          continue;
        }

        // 生成相对于 src 目录的路径作为链接
        const relativeToSrc = path.relative(srcRoot, itemPath).replace(/\\/g, '/');
        
        // 从 frontmatter 获取 title 和 position
        // 支持 position 和 sidebar_position 两种字段名（保持兼容性）
        let filePosition = frontmatter.position ?? frontmatter.sidebar_position ?? DEFAULT_POSITION;
        // 如果是 index.md，则 position 设置为 -1
        if (item.name === 'index.md') {
          filePosition = -1;
        }
        const fileTitle = frontmatter.title || item.name.replace(/\.md$/, '');

        fileItems.push({
          text: fileTitle,
          link: `/${relativeToSrc.replace(/\.md$/, '')}`,
          position: filePosition
        });
      } catch (error) {
        if (!isProduction) {
          console.error(`Error reading file ${itemPath}:`, error);
        }
      }
    }
  }

  return [...fileItems, ...dirItems].sort((a, b) => a.position - b.position);
}

/**
 * 为指定路径生成侧边栏配置
 * @param section 相对于src目录的路径（目录名字）
 * @returns 侧边栏项目数组
 */
export function generateSidebarForPath(section: string): SidebarItem[] {
  try {
    const baseDir = path.join(srcRoot, section);
    
    // 检查目录是否存在
    if (!fs.existsSync(baseDir)) {
      if (!isProduction) {
        console.error(`x 目录不存在: ${baseDir}`);
      }
      return [];
    }

    if (!fs.statSync(baseDir).isDirectory()) {
      if (!isProduction) {
        console.error(`x 路径不是目录: ${baseDir}`);
      }
      return [];
    }

    const result = readDirectory(baseDir, section);

    if (!isProduction) {
      console.log(` ➜ 生成 ${section} 目录的侧边栏配置成功，共 ${result.length} 项`);
    }

    return result;
  } catch (error) {
    if (!isProduction) {
      console.error(`x 生成 ${section} 目录的侧边栏配置时出错:`, error);
    }
    return [];
  }
}
