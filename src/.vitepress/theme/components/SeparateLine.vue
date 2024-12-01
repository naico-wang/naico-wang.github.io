<style lang="scss" scoped>
hr {
  color: var(--vp-c-black);
  border: 0;
  font-size: 14px;
  font-weight: bold;
  padding: 1em 0;
  position: relative;
  margin-top: 20px;

  &:before {
    content: attr(data-content);
    position: absolute;
    padding: 0 1ch;
    line-height: 1px;
    border: solid var(--common-background-color);
    border-width: 0 99vw;
    width: fit-content;
    white-space: nowrap;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>

<template>
<hr :data-content="title" />
</template>

<script setup>
const props = defineProps(['title']);
</script>
