import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  globalStyles: path.join(__dirname, 'docs/styles/custom.css'),
  title: '智库 - Naico Wang',
  description: 'Naico智库',
  icon: '/logo.png',
  logo: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  logoText: 'Naico智库',
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/web-infra-dev/rspress',
      },
      {
        icon: 'linkedin',
        mode: 'link',
        content: 'https://github.com/web-infra-dev/rspress',
      },
    ],
    outlineTitle: '本页内容导航',
    sourceCodeText: 'Code Source',
    enableScrollToTop: true
  },
});
