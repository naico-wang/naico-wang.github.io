
<style scoped>
.layout-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.aside {
  width: 50%;
  padding: 10px;
}

.main {
  flex: 1;
  padding: 10px;
}
.layout-center {
  padding: 10px;
}

@media (max-width: 740px) {
  .layout-container {
    flex-direction: column;
  }
  .aside {
    width: 100%;
  }
}
</style>

<template>
  <div class="layout-center">
    <slot name="bottom"></slot>
  </div>
  <div class="layout-container">
    <aside class="aside">
      <slot name="aside"></slot>
    </aside>
    <main class="main">
      <slot name="main"></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
