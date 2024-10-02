<template>
  <div class="tab-pane fade" id="nav-more" role="tabpanel" aria-labelledby="nav-more-tab"
    :class="{ active: selectedTab === 3, show: selectedTab === 3 }">
    <div class="more-content-info">
      <div class="search-header">
        <h2 class="search-title">More information</h2>
      </div>
      <div class="brand">
        <button class="theme-btn-primary" @click="handleVisitKompassAI">
          Visit KompassAI platform
        </button>
      </div>
      <div class="join-us-button" @click="handleJoinUs()">
        <a class="theme-btn-stoke"><img class="img-fluid" :src="linkedin" @click="handleJoinUs()" />
          Join Us</a>
      </div>
      <div class="block-box">
        <div class="more-url-content mb-3 d-flex align-items-center justify-content-between">
          <div class="list-name d-flex align-items-center">
            <span class="d-flex align-items-center justify-content-center"><img class="img-fluid" :src="toc" />&nbsp;
              Plugin position</span>
          </div>
          <div class="switch-buttons">
            <span id="plugin-left" class="left">
              <img class="img-fluid" :src="arrowCircleLeft" @click="handleMoveLeft()" />
            </span>
            <span id="plugin-right" class="right">
              <img class="img-fluid" :src="arrowCircleRight" @click="handleMoveRight()" />
            </span>
          </div>
        </div>
        <div class="more-url-content d-flex align-items-center justify-content-between">
          <div class="list-name d-flex align-items-center">
            <span class="d-flex align-items-center justify-content-center"><img class="img-fluid"
                :src="integrationInstructions" />&nbsp;
              Auto open</span>
          </div>
          <div class="toggle-buttons">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch"
                :id="isSales ? 'common-checkmark-blue' : 'common-checkmark'" v-model="autoOpen"
                @change="handleAutoOpen" />
              <label class="form-check-label" :for="isSales ? 'common-checkmark-blue' : 'common-checkmark'"></label>
            </div>
          </div>
        </div>
      </div>
      <div class="block-box">
        <div class="more-url-content mb-3 d-flex align-items-center justify-content-between clicker"
          @click="handleListsInKompassAI">
          <div class="list-name d-flex align-items-center">
            <span class="d-flex align-items-center justify-content-center"><img class="img-fluid" :src="toc" />&nbsp;
              Lists in KompassAI
              platform</span>
          </div>
          <div class="switch-urls">
            <img class="img-fluid" :src="rightUrl" />
          </div>
        </div>
        <div class="more-url-content mb-3 d-flex align-items-center justify-content-between clicker">
          <div class="list-name d-flex align-items-center" @click="handleGotoIntegration">
            <span class="d-flex align-items-center justify-content-center"><img class="img-fluid"
                :src="integrationInstructions" />&nbsp;
              Integration</span>
          </div>
          <div class="switch-urls">
            <img class="img-fluid" :src="rightUrl" />
          </div>
        </div>
        <div class="more-url-content mb-3 d-flex align-items-center justify-content-between clicker"
          @click="handleGotoPrivacy">
          <div class="list-name d-flex align-items-center">
            <span class="d-flex align-items-center justify-content-center"><img class="img-fluid"
                :src="supervisorAccount" />&nbsp; Privacy
              Policy</span>
          </div>
          <div class="switch-urls">
            <img class="img-fluid" :src="rightUrl" />
          </div>
        </div>
        <div class="more-url-content d-flex align-items-center justify-content-between clicker"
          @click="handleGotoHelpCenter">
          <div class="list-name d-flex align-items-center">
            <span class="d-flex align-items-center justify-content-center"><img class="img-fluid"
                :src="supervisorAccount" />&nbsp; Help
              centre</span>
          </div>
          <div class="switch-urls">
            <img class="img-fluid" :src="rightUrl" />
          </div>
        </div>
      </div>
      <div class="block-box logout">
        <div class="more-url-content d-flex align-items-center justify-content-between clicker" @click="handleLogout">
          <div class="list-name d-flex align-items-center">
            <span>Logout</span>
          </div>
          <div class="switch-urls">
            <img class="img-fluid" :src="rightUrl" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { getDataFromStorage, setDataToStorage } from '../../utils/utils';
export default {
  props: {
    kBrand: String,
    linkedin: String,
    toc: String,
    arrowCircleLeft: String,
    arrowCircleRight: String,
    integrationInstructions: String,
    rightUrl: String,
    supervisorAccount: String,
    isSales: Boolean,
    selectedTab: Number,
    OnLogout: Function,
    joinUs: Function,
    visitKompassAI: Function,
    listsInKompassAI: Function,
    gotoHelpCenter: Function,
    gotoPrivacy: Function,
    gotoIntegration: Function,
    moveLeft: Function,
    moveRight: Function,
  },
  setup(props) {
    const autoOpen = ref(true); // Initialize autoOpen using ref
    const { moveLeft, moveRight } = props;
    onMounted(async () => {
      const openFlag: any = await getDataFromStorage('autoOpen'); // Fetch autoOpen value from
      const align: any = await getDataFromStorage('align');
      if (moveLeft && moveRight) {
        if (align === 'left') moveLeft();
        else moveRight();
      }
      if (openFlag !== undefined) {
        autoOpen.value = openFlag; // Set the fetched value as the initial value for autoOpen
      }
    });

    return {
      // Your returned values
      autoOpen,
    };
  },
  data() {
    // let openFlag = getDataFromStorage('autoOpen');
    // return {
    //   // Local data properties initialization
    //   autoOpen: openFlag,
    // };
  },
  methods: {
    handleJoinUs() {
      if (this.joinUs) {
        this.joinUs();
      }
    },
    handleVisitKompassAI() {
      if (this.visitKompassAI) {
        this.visitKompassAI();
      }
    },
    handleListsInKompassAI() {
      if (this.listsInKompassAI) {
        this.listsInKompassAI();
      }
    },
    handleGotoHelpCenter() {
      if (this.gotoHelpCenter) {
        this.gotoHelpCenter();
      }
    },
    handleGotoPrivacy() {
      if (this.gotoPrivacy) {
        this.gotoPrivacy();
      }
    },
    handleGotoIntegration() {
      if (this.gotoIntegration) {
        this.gotoIntegration();
      }
    },
    handleLogout() {
      if (this.OnLogout) {
        this.OnLogout();
      }
    },
    handleMoveLeft() {
      if (this.moveLeft) {
        this.moveLeft();
      }
    },
    handleMoveRight() {
      if (this.moveRight) {
        this.moveRight();
      }
    },
    handleAutoOpen() {
      setDataToStorage({ autoOpen: this.autoOpen });
    },
  },
};
</script>

<style scoped>
@import '../AppStyles.css';
@import '../NavStyles.css';
</style>
