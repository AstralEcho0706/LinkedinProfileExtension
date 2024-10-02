<template>
  <div class="app-container mx-auto" v-if="appState === 'login'">
    <div class="d-flex header-top justify-content-between">
      <img class="" :src="imgUrl" />
      <button class="btn m0 p0" @click="handleBackButtonClick()">
        <img class="" :src="maximize" />
      </button>
    </div>
    <div class="auth-wrapper">
      <div class="auth-title">
        <h2 class="text-center">Login to Kompass AI</h2>
        <p>Please choose the option to login to the Kompass AI</p>
      </div>
      <div class="auth-input-fields">
        <div class="form-group">
          <label>Login</label>
          <input type="text" class="form-control" placeholder="User Name or Email" v-model="userEmailModel" />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" class="form-control" placeholder="*******" v-model="userPasswordModel" />
        </div>
      </div>

      <div class="auth-remember-access">
        <input type="checkbox" value="" :id="isSales ? 'common-checkmark-blue' : 'common-checkmark'" />
        <label :for="isSales ? 'common-checkmark-blue' : 'common-checkmark'">
          Remember me
        </label>
      </div>

      <div class="auth-buttons text-center">
        <button class="theme-btn-primary btn-rounded" @click="handleLogin()">
          Login to Kompass AI
        </button>
        <p class="gotologin" @click="handleGotoRegister()">
          Register to Kompass AI
        </p>
      </div>
      <!-- Auth Button -->
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    imgUrl: String,
    maximize: String,
    appState: String,
    userEmail: String,
    userPassword: String,
    isSales: Boolean,
    backButtonClick: Function,
    login: Function,
    gotoRegister: Function,
  },

  data() {
    return {
      // Local data properties initialization
      userEmailModel: this.userEmail,
      userPasswordModel: this.userPassword,
    };
  },
  computed: {
    userEmail: {
      get() {
        console.log(this.userEmailModel);
        let strObject: String = new String(this.userEmailModel);
        return strObject;
      },
      set(value: any) {
        console.log(value);
        let str: string = value.toString();
        console.log(str);
        this.userEmailModel = str;
        console.log(this.userEmailModel);
      },
    },
    userPassword: {
      get() {
        let strObject: String = new String(this.userPasswordModel);
        return strObject;
      },
      set(value: any) {
        let str: string = value.toString();
        this.userPasswordModel = str;
      },
    },
  },
  watch: {
    userEmailModel(newVal) {
      this.userEmailModel = newVal;
      // Handle userEmailModel changes, if needed
    },
    userPasswordModel(newVal) {
      this.userPasswordModel = newVal;
      // Handle userPasswordModel changes, if needed
    },
  },

  methods: {
    handleBackButtonClick() {
      if (this.backButtonClick) {
        this.backButtonClick();
      }
    },
    handleLogin() {
      if (this.login) {
        this.login(this.userEmailModel, this.userPasswordModel);
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
