<template>
  <div class="balance-area-info">
    <div
      class="balance-level d-flex justify-content-between align-items-center"
    >
      <span>Your Balance</span>
      <h4 class="clicker" @click="buyCredits">Get credits</h4>
    </div>
    <div
      class="balance-button d-flex justify-content-between align-items-center"
    >
      <Button label="Info" class="btn" severity="secondary" raised>
        {{ emailCredits }} email credits
      </Button>
      <Button label="Info" class="btn" severity="secondary" raised>
        {{ phoneCredits }} phone credits
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
const emit = defineEmits([
  'setLoading',
  'setCredits',
  'updateCredits',
  'buyCredits',
]);
const props = defineProps({
  emailCredits: {
    type: Number,
    default: 0,
  },
  phoneCredits: {
    type: Number,
    default: 0,
  },
});
const updateCredits = () => {
  emit('updateCredits');
};

const buyCredits = () => {
  emit('buyCredits');
};

onMounted(async () => {
  emit('updateCredits');
});
</script>

<style scoped>
@import '../AppStyles.css';
@import '../NavStyles.css';
</style>
