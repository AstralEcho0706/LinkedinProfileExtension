<template>
  <div class="absolute-anchor-container">
    <div ref="containerRef" class="container">
      <div class="padding" />
      <div class="content">
        <div style="display: inline-block; width: 100%">
          <n-affix
            :trigger-bottom="20"
            position="absolute"
            :listen-to="() => containerRef"
          >
            <n-tag>Affix Trigger Bottom 60px</n-tag>
          </n-affix>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const containerRef = ref<HTMLElement | undefined>(undefined);
    return {
      containerRef,
    };
  },
});
</script>

<style scoped>
.absolute-anchor-container {
  width: 100%;
  height: 200px;
  position: relative;
}

.container {
  height: 200px;
  background-color: rgba(128, 128, 128, 0.3);
  border-radius: 3px;
  overflow: auto;
}

.padding {
  height: 450px;
  width: 100%;
  background-color: rgba(128, 128, 128, 0.15);
}

.content {
  height: 600px;
}
</style>
