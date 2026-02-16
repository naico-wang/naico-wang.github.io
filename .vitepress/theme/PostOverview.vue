<script setup lang="ts">
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';

interface Item {
  title: string;
  url: string;
  position?: number;
}

interface SecondLevelGroup {
  name: string;
  displayName: string;
  items: Item[];
  hasThirdLevel: boolean;
  thirdLevelGroups?: Record<string, Item[]>;
}

interface Props {
  items?: Item[];
  pathPrefix: string;
  titleMap: Record<string, string>;
  pageTitle: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => []
});

const kebabToTitleCase = (str: string): string => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getDisplayName = (name: string): string => {
  const normalizedName = name.toLowerCase();
  return props.titleMap[normalizedName] || kebabToTitleCase(name);
};

const getTitleMapOrder = (name: string): number => {
  const normalizedName = name.toLowerCase();
  const keys = Object.keys(props.titleMap);
  const index = keys.indexOf(normalizedName);

  return index >= 0 ? index : 9999;
};

const groupedData = computed<SecondLevelGroup[]>(() => {
  const groups: Record<string, {
    items: Item[];
    thirdLevel: Record<string, Item[]>;
  }> = {};
  
  const items = Array.isArray(props.items) ? props.items : [];
  
  if (items.length === 0) {
    return [];
  }
  
  items.forEach((item: Item) => {
    const regex = new RegExp(`${props.pathPrefix}/(.+)`);
    const match = item.url.match(regex);
    if (!match) return;
    
    const path = match[1];
    const segments = path.split('/');
    
    if (segments.length === 0) return;
    
    const secondLevel = segments[0];
    
    if (!groups[secondLevel]) {
      groups[secondLevel] = {
        items: [],
        thirdLevel: {}
      };
    }

    if (segments.length >= 3) {
      const thirdLevel = segments[1];
      
      if (!groups[secondLevel].thirdLevel[thirdLevel]) {
        groups[secondLevel].thirdLevel[thirdLevel] = [];
      }
      
      groups[secondLevel].thirdLevel[thirdLevel].push(item);
    } else {
      groups[secondLevel].items.push(item);
    }
  });
  
  return Object.entries(groups)
    .map(([name, data]) => {
      const hasThirdLevel = Object.keys(data.thirdLevel).length > 0;
      const sortedThirdLevel: Record<string, Item[]> = {};

      if (hasThirdLevel) {
        Object.entries(data.thirdLevel)
          .sort(([a], [b]) => {
            const orderA = getTitleMapOrder(a);
            const orderB = getTitleMapOrder(b);
            if (orderA !== orderB) {
              return orderA - orderB;
            }

            return a.localeCompare(b);
          })
          .forEach(([key, items]) => {
            sortedThirdLevel[key] = items.sort((a, b) => {
              const posA = a.position ?? 999;
              const posB = b.position ?? 999;
              return posA - posB;
            });
          });
      }

      const sortedItems = data.items.sort((a, b) => {
        const posA = a.position ?? 999;
        const posB = b.position ?? 999;
        return posA - posB;
      });
      
      return {
        name,
        displayName: getDisplayName(name),
        items: sortedItems,
        hasThirdLevel,
        thirdLevelGroups: hasThirdLevel ? sortedThirdLevel : undefined
      };
    })
    .sort((a, b) => {
      const orderA = getTitleMapOrder(a.name);
      const orderB = getTitleMapOrder(b.name);
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return a.name.localeCompare(b.name);
    });
});

const collapsedGroups = ref<string[]>([]);

const toggleGroup = (groupName: string) => {
  const index = collapsedGroups.value.indexOf(groupName);
  if (index > -1) {
    collapsedGroups.value = collapsedGroups.value.filter((name: string) => name !== groupName);
  } else {
    collapsedGroups.value = [...collapsedGroups.value, groupName];
  }
};

const isGroupExpanded = (groupName: string): boolean => {
  return !collapsedGroups.value.includes(groupName);
};
</script>

<template>
  <div class="developer-posts-container">
    <h1 class="title">{{ pageTitle }}</h1>

    <!-- 2列网格布局 -->
    <div v-if="groupedData.length > 0" class="other-sections-container">
      <template v-for="group in groupedData" :key="group.name">
        <div class="group-card" @click="toggleGroup(group.name)">
          <h2 class="second-level-title expandable">
            {{ group.displayName }}
            <span class="expand-icon" :class="{ 'expanded': isGroupExpanded(group.name) }" />
          </h2>

          <div v-if="isGroupExpanded(group.name)" class="content-wrapper">
            <template v-if="group.hasThirdLevel && group.thirdLevelGroups">
              <div class="third-level-container normal-layout">
                <div
                    v-for="([thirdLevelName, items]) in Object.entries(group.thirdLevelGroups)"
                    :key="thirdLevelName"
                    class="third-level-card"
                >
                  <h3 class="third-level-title">{{ getDisplayName(thirdLevelName) }}</h3>
                  <ul class="items-list">
                    <li v-for="item in items" :key="item.url" class="item">
                      <a :href="withBase(item.url)" class="item-link" :title="item.title">{{ item.title }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </template>

            <template v-else>
              <ul class="items-list">
                <li v-for="item in group.items" :key="item.url" class="item">
                  <a :href="withBase(item.url)" class="item-link" :title="item.title">{{ item.title }}</a>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.developer-posts-container {
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  gap: 2rem;
  padding-right: calc((100vw - var(--vp-layout-max-width)) / 5);
  //border-left: solid 1px var(--vp-c-divider);
  min-height: calc(100vh - var(--vp-nav-height));
}

.other-sections-container {
  padding: 0 2rem 2rem;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  padding: 1rem 0 0.5rem;
}

.group-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
  break-inside: avoid;
  page-break-inside: avoid;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;
}

.group-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.second-level-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.second-level-title.expandable {
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}

.second-level-title:has(.expanded) {
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.expand-icon {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
  color: var(--vp-c-text-2);
  background: url("/images/icon-arrow-right.svg") right center no-repeat;
  background-size: contain;
  margin-left: 0.5rem;
  width: 1rem;
  height: 1rem;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.content-wrapper {
  overflow: hidden;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.third-level-container {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.third-level-container.normal-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.third-level-container.normal-layout .third-level-card .items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
}

@media (max-width: 768px) {
  .third-level-container.normal-layout .third-level-card .items-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 479px) {
  .third-level-container.normal-layout .third-level-card .items-list {
    grid-template-columns: 1fr;
  }
}

.third-level-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 0.875rem 1.25rem;
  background-color: var(--vp-c-bg-alt);
  cursor: pointer;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.third-level-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--vp-c-text-1);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  width: 100%;
  min-width: 0;
  overflow-wrap: break-word;
  word-wrap: break-word;
  box-sizing: border-box;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
}

@media (max-width: 768px) {
  .items-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 479px) {
  .items-list {
    grid-template-columns: 1fr;
  }
}

.third-level-card .items-list {
  display: flex;
  flex-direction: column;
  grid-template-columns: unset;
}

.item {
  margin: 0;
  position: relative;
  padding-left: 1rem;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.item:before {
  position: absolute;
  left: 0;
  top: 0.6rem;
  content: '';
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: var(--vp-c-text-1);
}

.item-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 400;
}

.group-card .item-link {
  font-size: 0.875rem;
}

.third-level-card .item-link {
  font-size: 0.8125rem;
}

.item-link:hover {
  color: var(--vp-c-brand);
  border-bottom-color: var(--vp-c-brand);
  text-decoration: underline;
}
</style>
