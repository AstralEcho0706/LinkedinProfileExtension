<template>
  <div
    class="tab-pane fade"
    id="nav-history"
    role="tabpanel"
    aria-labelledby="nav-history-tab"
  >
    <div class="history-content-info">
      <History
        v-if="historyClickedItem"
        :profileData="historyClickedItem"
        @saveCompany="saveCompany"
        @close="handleClose"
      ></History>
      <div class="search-header" v-if="!historyClickedItem">
        <h2 class="search-title">Search History</h2>
        <div class="search-field search-bg-icon">
          <input
            type="text"
            class="form-control"
            placeholder="Search by name"
            v-model="searchText"
          />
        </div>
      </div>
      <div class="search-user-list" v-if="!historyClickedItem">
        <span class="align-items-center recent-title d-flex">
          <img class="img-fluid" :src="update" /> Recent Searches</span
        >
        <!-- Repeat item list -->
        <div v-if="searchText">
          <div
            class="search-user-item mb-2 align-items-center d-flex"
            v-for="item in searchedData"
            :key="item.id"
          >
            <div class="avatar">
              <img
                class="clicker"
                style=" width: 40px; height: 40px; border-radius: 10px;"
                :src="item.profilePhoto"
                @click="handleHistoryClicked(item)"
              />
            </div>
            <div
              class="name-designation clicker"
              style="width: 250px"
              @click="handleHistoryClicked(item)"
            >
              <span>{{ item.profileName }}</span>
              <p>{{ item.headline }}</p>
            </div>
            <div
              class="bookmark-badge"
              v-if="
                item.profile.emailAddress.length ||
                item.profile.phoneNumbers.length
              "
              style="width: 60px"
            >
              <img
                class="img-fluid clicker"
                :src="bookmark_border"
                @click="handleSaveContactInfo()"
              />
              <img
                class="img-fluid clicker"
                :src="keyboard_arrow_right"
                @click="handleHistoryClicked(item)"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div
            class="search-user-item mb-2 align-items-center d-flex"
            v-for="item in searchHistory"
            :key="item.id"
          >
            <div class="avatar">
              <img
                class="clicker"
                style=" width: 40px; height: 40px; border-radius: 10px;"
                :src="item.profilePhoto"
                @click="handleHistoryClicked(item)"
              />
            </div>
            <div
              class="name-designation clicker"
              style="width: 250px"
              @click="handleHistoryClicked(item)"
            >
              <span>{{ item.profileName }}</span>
              <p>{{ item.headline }}</p>
            </div>
            <div
              class="bookmark-badge"
              v-if="
                item.profile.emailAddress.length ||
                item.profile.phoneNumbers.length
              "
              style="width: 60px"
            >
              <img
                class="img-fluid clicker"
                :src="bookmark_border"
                @click="handleSaveContactInfo()"
              />
              <img
                class="img-fluid clicker"
                :src="keyboard_arrow_right"
                @click="handleHistoryClicked(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getDataFromStorage } from '../../utils/utils';
import { ref, watchEffect } from 'vue';
interface Profile {
  emailAddress: string;
  phoneNumbers: string;
}
interface Item {
  id: string;
  profilePhoto: string;
  profileName: string;
  headline: string;
  profile: Profile;
  // Add more properties based on the actual structure of the 'item' object
}
const searchText = ref('');
const searchedData: any = ref([]);
watchEffect(() => searchingHistory(searchText));
export default {
  props: {
    searchHistory: Array,
    historyClickedItem: Object,
    saveCompany: Function,
    onClose: Function,
    update: String,
    bookmark_border: String,
    kBrand: String,
    keyboard_arrow_right: String,
    historyClicked: Function,
    saveContactInfo: Function,
  },
  data() {
    return {
      // Assuming this is how you are initializing searchedData
      searchText,
      searchedData: [] as Item[], // Initialize searchedData as an array of type Item
      searchHistory: [] as Item[],
    };
  },

  methods: {
    handleHistoryClicked(item: any) {
      if (this.historyClicked) {
        this.historyClicked(item);
      }
    },
    handleSaveContactInfo() {
      if (this.saveContactInfo) {
        this.saveContactInfo();
      }
    },
    handleClose() {
      if (this.onClose) {
        this.onClose();
      }
    },
  },
};
const searchingHistory = async (ef: any) => {
  console.log(ef);
  if (ef) {
    let historyData: any = await getDataFromStorage('history');
    if (historyData && historyData.length > 0) {
      const filtered = historyData.filter((e: any) => {
        const history = JSON.parse(e);
        if (history.profileName.toLowerCase().includes(ef.toLowerCase())) {
          return true;
        }
      });
      searchedData.value = filtered.map((e: any) => {
        const history = JSON.parse(e);
        return {
          name: history.profileName,
          profilePhoto: history.profilePhoto,
          profileUrl: history.profileUrl,
          profileName: history.profileName,
          headline: history.headline,
          profile: history,
        };
      });
    }
  }
};
</script>

<style scoped>
@import '../AppStyles.css';
@import '../NavStyles.css';
</style>
