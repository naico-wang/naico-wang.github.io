<script setup lang="ts">
import { useRouter } from "vitepress";
import { useSidebar } from 'vitepress/theme';

const router = useRouter();
const { sidebar } = useSidebar();
const [ firstItem ] = sidebar.value;
const firstItemLink = firstItem.items ? firstItem.items[0].link : firstItem.link;

router.go(firstItemLink);
</script>
<template></template>
