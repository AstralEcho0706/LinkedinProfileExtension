<template>
  <h1>{{ getHello('KompassAI') }}</h1>
  <a :href="getExtensionUrl('src/options/index.html')" target="_blank">
    Open options page
  </a>
</template>
<script setup lang="ts">
function getExtensionUrl(path: string) {
  return chrome.runtime.getURL(path);
}
function getHello(name: string) {
  return `Hello ${name}!`;
}
</script>

<style scoped>
@import '../common.css';
</style>
