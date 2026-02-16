<script setup lang="ts">
import { useData } from 'vitepress'

const { site, theme, page } = useData()

// 可从 frontmatter 覆盖（在 index.md 的 --- 里写 profileName、profileUsername、profileBio 等），否则用站点配置
const fm = page.value?.frontmatter ?? {}
const profile = {
  name: fm.profileName ?? site.value.title ?? 'Naico Wang',
  username: fm.profileUsername ?? 'Naico Wang',
  bio: fm.profileBio ?? theme.value?.description ?? site.value.description ?? '苟利国家生死以，岂因祸福避趋之',
  avatar: fm.profileAvatar ?? '/images/avatar-new.png',
  location: fm.profileLocation ?? '',
  blog: fm.profileBlog ?? '',
  email: fm.profileEmail ?? 'naico.wang@gmail.com',
  socialLinks: theme.value?.socialLinks ?? [],
}

// 工作经历：仅 logo，排在 profile 下面（图片放 src/public/images/）
const workLogos = [
  { logo: '/images/company-marriott.png', name: 'Marriott' },
  { logo: '/images/company-farfetch.png', name: 'Farfetch' },
  { logo: '/images/company-mercer.png', name: 'Mercer' },
  { logo: '/images/company-microsoft.png', name: 'Microsoft' },
  { logo: '/images/company-chinasoft.png', name: '中软' },
  { logo: '/images/company-grain.png', name: 'Grain' },
]

// Skills：前后端、架构、AI、项目管理（4 项）
const expertise = [
  { title: '前后端开发', desc: 'React / Vue 生态与工程化，Node.js 与 BFF，TypeScript 类型与工程实践，性能优化、监控与稳定性保障。', icon: 'code' },
  { title: '架构', desc: '系统与领域建模、微前端与模块化，BFF 与 API 设计，高可用与可扩展方案选型与落地。', icon: 'layers' },
  { title: 'AI Engineering', desc: 'LLM 应用设计与接入，RAG 与检索增强，Agent 与工作流编排，模型选型、评估与生产落地。', icon: 'sparkles' },
  { title: '项目管理与交付', desc: '敏捷与迭代规划，需求拆解与优先级，排期、资源与风险管控，跨团队协作与交付闭环。', icon: 'clipboard' },
]

// 本站内容链接（placeholder，后续替换为真实路径）
const siteLinks = [
  { title: 'AI 开发与工程化', link: '/ai-engineering' },
  { title: '经典设计模式', link: '/design-pattern' },
]

// 图标：按 item.icon 从 .vitepress/components/icons/*.svg 加载，缺省用 default.svg
const iconMap = (import.meta as unknown as { glob: (p: string, o?: { query?: string; import?: string; eager?: boolean }) => Record<string, string> }).glob('./icons/*.svg', { query: '?raw', import: 'default', eager: true })
const getIcon = (name: string): string =>
  iconMap[`./icons/${name}.svg`] ?? iconMap['./icons/default.svg'] ?? ''
</script>

<template>
  <div class="home-layout">
    <aside class="profile-sidebar">
      <div class="profile-card">
        <div class="profile-avatar-wrap">
          <img
            v-if="profile.avatar"
            class="profile-avatar"
            :src="profile.avatar"
            :alt="profile.name"
            @error="($event.target as HTMLImageElement).style.display = 'none'"
          />
          <div v-else class="profile-avatar profile-avatar-placeholder">
            {{ profile.name?.charAt(0) || 'N' }}
          </div>
        </div>
        <h1 class="profile-name">{{ profile.name }}</h1>
        <p v-if="profile.bio" class="profile-bio">{{ profile.bio }}</p>
        <div v-if="profile.location || profile.blog" class="profile-details">
          <span v-if="profile.location" class="profile-detail">
            <svg class="profile-icon" viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path fill="currentColor" d="M8 0a8 8 0 0 0-8 8c0 4.418 5.25 8 8 8s8-3.582 8-8a8 8 0 0 0-8-8Zm0 14.5a6.5 6.5 0 0 1-6.5-6.5 6.5 6.5 0 0 1 13 0 6.5 6.5 0 0 1-6.5 6.5Z"/></svg>
            {{ profile.location }}
          </span>
          <a v-if="profile.blog" :href="profile.blog" class="profile-detail profile-link" target="_blank" rel="noopener">
            <svg class="profile-icon" viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
            {{ profile.blog.replace(/^https?:\/\//, '').replace(/\/$/, '') }}
          </a>
        </div>
        <div v-if="profile.socialLinks?.length" class="profile-social">
          <a
            v-for="link in profile.socialLinks"
            :key="link.link"
            :href="link.link"
            class="profile-social-link"
            :aria-label="link.ariaLabel || link.icon"
            target="_blank"
            rel="noopener"
          >
            <span v-if="link.icon === 'github'" class="profile-social-icon">
              <svg viewBox="0 0 16 16" width="20" height="20"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
            </span>
            <span v-else-if="link.icon === 'linkedin'" class="profile-social-icon">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </span>
            <span v-else class="profile-social-icon">🔗</span>
          </a>
        </div>
        <!-- 工作经历：仅 logo，排在 profile 下 -->
        <section class="profile-card-work">
          <h2 class="profile-card-work-title">Experience</h2>
          <div class="work-logos">
            <div
              v-for="(item, i) in workLogos"
              :key="i"
              class="work-logo-wrap"
            >
              <img
                class="work-logo"
                :src="item.logo"
                :alt="item.name"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div>
    </aside>
    <main class="home-main">
      <!-- 01 Introduction：简介与联系方式写死在组件内，便于控制样式 -->
      <section class="home-section home-section-intro">
        <h2 class="section-title section-title-mono">01 - Introduction</h2>
        <div class="intro-content">
          <p class="intro-p">
            擅长全栈应用开发以及现有软件应用架构治理，在几家外企和互联网公司经历过从 0 到 1 的产品与团队建设。日常会关注工程化、性能与稳定性、以及如何把技术方案讲清楚、落下去。
          </p>
          <p class="intro-p">
            近几年花了不少时间在 AI 工程上：LLM 应用、RAG、Agent 等怎么在实际业务里用起来，模型选型和成本、效果之间的平衡，这些都会在笔记里慢慢写。同时也在持续琢磨架构和协作：微前端、BFF、领域建模、跨团队需求拆解与交付节奏，算是「既写代码也管项目」的那一类。
          </p>
          <p class="intro-p">
            这个网站是个人知识库，用来沉淀技术笔记和思考。写下来的东西会先服务自己的复盘与检索，若恰好对你有用，欢迎一起交流。
          </p>
          <p class="intro-contact-label"><strong>联系方式</strong></p>
          <ul class="intro-contact-list">
            <li>邮箱：<a href="mailto:naico.wang@gmail.com" class="intro-link">naico.wang@gmail.com</a></li>
            <li>LinkedIn：<a href="https://www.linkedin.com/in/naico-wang-49554891/" class="intro-link" target="_blank" rel="noopener">naico-wang</a></li>
          </ul>
        </div>
      </section>
      <!-- 02 擅长领域 -->
      <section class="home-section">
        <h2 class="section-title section-title-mono">02 - Skills</h2>
        <div class="cards-expertise">
          <article
            v-for="(item, i) in expertise"
            :key="i"
            class="card card-expertise"
          >
            <div class="card-expertise-header">
              <div class="card-expertise-icon" v-html="getIcon(item.icon)" />
              <h3 class="card-expertise-title">{{ item.title }}</h3>
            </div>
            <p class="card-expertise-desc">{{ item.desc }}</p>
          </article>
        </div>
      </section>
      <!-- 03 本站内容 -->
      <section class="home-section">
        <h2 class="section-title section-title-mono">03 - Site Contents</h2>
        <div class="site-links">
          <a
            v-for="(item, i) in siteLinks"
            :key="i"
            class="site-link-card card"
            :href="item.link"
          >
            <span class="site-link-title">{{ item.title }}</span>
            <span class="site-link-arrow">→</span>
          </a>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  gap: 2rem;
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  padding: 2rem 1.5rem;
  align-items: stretch;
}

.profile-sidebar {
  flex-shrink: 0;
  width: 296px;
}

.profile-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-avatar-wrap {
  margin-bottom: 1.75rem;
}

.profile-avatar {
  width: 100%;
  max-width: 160px;
  aspect-ratio: 1;
  border-radius: 50%;
  object-fit: cover;
}

.profile-avatar-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg-soft);
  font-size: 4rem;
  font-weight: 600;
  line-height: 1;
}

.profile-name {
  margin: 0 0 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--vp-c-text-1);
}

.profile-bio {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

.profile-detail {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.profile-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.profile-link:hover {
  text-decoration: underline;
}

.profile-icon {
  flex-shrink: 0;
  opacity: 0.8;
}

.profile-social {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.profile-social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: var(--vp-c-text-2);
  transition: color 0.2s, background-color 0.2s;
}

.profile-social-link:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.profile-social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 工作经历：在 profile 卡片内部 */
.profile-card-work {
  width: 100%;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  text-align: left;
}

.profile-card-work-title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.work-logos {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.work-logo-wrap {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    border-color: var(--vp-c-brand);
  }
}

.work-logo {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.home-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.home-section {
  width: 100%;
}

.intro-content {
  font-size: 0.875rem;
  border: solid 1px var(--vp-c-divider);
  border-radius: 16px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  padding: 1.25rem 1.5rem;
}

.intro-heading {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.intro-p {
  margin: 0 0 1rem;
}

.intro-p:last-of-type {
  margin-bottom: 1rem;
}

.intro-contact-label {
  margin: 0 0 0.5rem;
  font-size: 0.9375rem;
  color: var(--vp-c-text-1);
}

.intro-contact-list {
  margin: 0;
  padding-left: 1.25rem;
}

.intro-contact-list li {
  list-style: disc;
  margin-bottom: 0.25rem;
}

.intro-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.intro-link:hover {
  text-decoration: underline;
}

.section-title {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.section-title-mono {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', Consolas, monospace;
}

/* 03 本站内容链接：默认两列，窄屏一列 */
.site-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.site-link-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: border-color 0.2s, box-shadow 0.2s, color 0.2s;
}

.site-link-card:hover {
  color: var(--vp-c-brand-1);
}

.site-link-title {
  font-size: 0.9375rem;
  font-weight: 500;
}

.site-link-arrow {
  font-size: 1rem;
  opacity: 0.7;
}

/* 通用卡片 */
.card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

/* 擅长领域：小卡片网格 */
.cards-expertise {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
}

.card-expertise {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.card-expertise-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-expertise-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--vp-c-brand-1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-expertise-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.card-expertise-desc {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .home-layout {
    flex-direction: column;
    padding: 1rem;
    min-height: auto;
  }

  .profile-sidebar {
    width: 100%;
    position: static;
  }

  .profile-card {
    max-width: 320px;
    margin: 0 auto;
    min-height: 0;
  }

  .cards-expertise {
    grid-template-columns: 1fr;
  }

  .site-links {
    grid-template-columns: 1fr;
  }
}
</style>
