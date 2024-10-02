<template>
  <div class="app-container mx-auto" v-if="appState === 'welcome'">
    <div class="d-flex header-top justify-content-between">
      <img class="" :src="imgUrl" />
      <button class="btn m0 p0" @click="handleBackButtonClick()">
        <img class="" :src="maximize" />
      </button>
    </div>

    <div class="auth-wrapper">
      <div class="auth-title">
        <h2 class="text-center">Welcome</h2>
        <p>Please login to Kompass AI in order to start prospecting.</p>
      </div>
      <div class="auth-buttons-wrapper">
        <div class="auth-buttons text-center">
          <button class="theme-btn-primary" @click="handleGotoLogin()">
            Login to Kompass AI
          </button>
        </div>
        <div class="auth-buttons text-center">
          <button class="theme-btn-stoke" @click="handleGotoRegister()">
            Register me
          </button>
        </div>
      </div>
      <p class="auth-privacy-para">
        By using Kompass AI I agree to the <a href="">Terms of Service</a> and <a href="">Privacy Policy</a>. I also
        agree to recieve emails and communication relating to Kompass AI services and offers.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    imgUrl: String,
    maximize: String,
    appState: String,
    backButtonClick: Function,
    gotoLogin: Function,
    gotoRegister: Function,
  },
  data() {
    return {};
  },

  methods: {
    handleBackButtonClick() {
      if (this.backButtonClick) {
        this.backButtonClick();
      }
    },
    handleGotoLogin() {
      if (this.gotoLogin) {
        this.gotoLogin();
      }
    },
    handleGotoRegister() {
      if (this.gotoRegister) {
        this.gotoRegister();
      }
    },
  },
};
</script>

<style scoped>
@import '../AppStyles.css';
@import '../NavStyles.css';
</style>
