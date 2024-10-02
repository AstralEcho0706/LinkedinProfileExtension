<template>
  <div class="app-container mx-auto">
    <div class="info-details">
      <!-- User Avatar Start -->
      <div class="user-avatar d-flex justify-content-start align-items-center">
        <div class="avatar">
          <!-- <img class="img-fluid" :src="avatar" />      -->
          <img
            class="img-fluid"
            :src="profilePhoto"
            style="height: 54px; width: 54px; border-radius: 10px"
            v-if="profilePhoto"
          />
        </div>
        <div class="user-name-info" style="width: 250px">
          <h3>{{ profileName }}</h3>
          <span>{{ headline }}</span>
        </div>
        <div class="arrow ms-auto" @click="gotoHistory">
          <img class="img-fluid" :src="close" />
        </div>
      </div>
      <!-- User Avatar End -->
    </div>
    <div class="email-address-info">
      <!-- Email List -->
      <div
        class="d-flex justify-content-between align-items-center"
        style="margin:10px"
        v-if="!emailAddress.length"
      >
        <div class="email-checkbox">
          <div class="form-checkmark d-flex align-items-center">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="emailChecked"
              id="email-checkmark1"
            />
            <label for="email-checkmark1"> Email address <br /> </label>
          </div>
        </div>
      </div>
      <div
        class="d-flex justify-content-between align-items-center"
        style="margin:10px"
        v-if="!phoneNumbers.length"
      >
        <div class="email-checkbox">
          <div class="form-checkmark d-flex align-items-center">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="mobileChecked"
              id="phone-checkmark1"
            />
            <label class="form-check-label" for="phone-checkmark1">Phone</label>
          </div>
        </div>
      </div>

      <!-- Reveal Button start-->
      <div
        class="reveal-btn-info text-center"
        v-if="!emailAddress.length || !phoneNumbers.length"
      >
        <button class="btn theme-btn-primary" @click="revealContactInfo">
          Reveal Contact Info
        </button>
        <p>Please ensure you have an active plan or enough credits</p>
      </div>
      <!-- Email List -->
      <div class="email-list" v-if="emailAddress.length">
        <span class="info-items">Email address: </span>
        <p class="info-item" v-for="item in emailAddress" :key="item">
          {{ item }}
        </p>
      </div>
      <div class="email-list" v-else>
        <div v-if="enriched">
          <p class="info-item">No data available.</p>
        </div>
      </div>
      <div
        class="email-list"
        v-if="phoneNumbers.length"
        style="margin-top: 20px"
      >
        <span class="info-items">Phone: </span>
        <p class="info-item" v-for="item in phoneNumbers" :key="item">
          {{ item }}
        </p>
      </div>
      <div class="email-list" v-else style="margin-top: 20px">
        <div v-if="enriched">
          <span class="info-items">Phone: </span>
          <p class="info-item">No data available.</p>
        </div>
      </div>
    </div>
    <div
      class="reveal-btn-info text-center"
      v-if="emailAddress.length || phoneNumbers.length"
    >
      <Button
        class="btn theme-btn-primary"
        @click="saveContactInfo()"
        severity="secondary"
        text
        raised
        >Save Contact
      </Button>
    </div>
    <div class="kompass-ai-info" v-if="companyName">
      <!-- Company Info start-->
      <div class="kompass-company-info d-flex align-items-center">
        <div class="company-logo">
          <img class="img-fluid" :src="companyLogo" v-if="companyLogo" />
          <img class="img-fluid" :src="companyImg" v-else />
        </div>
        <div class="kompass-name-info">
          <h3>{{ companyName }}</h3>
          <span>{{ tagLine }}</span>
        </div>
        <div class="social-links d-flex align-items-center">
          <a :href="companyUrl"><img class="img-fluid" :src="linkedIn" /></a>
          <a :href="cpUrl"><img class="img-fluid" :src="link" /></a>
        </div>
      </div>
      <div class="company-short-info">
        <p>
          {{ isTruncated ? truncatedText : cpAbout }}
        </p>
        <strong
          id="moreBtn"
          v-if="cpAbout.length >= 250"
          @click="isTruncated = !isTruncated"
          >{{ isTruncated ? 'Show More' : 'Show Less' }}</strong
        >
      </div>
      <div class="date-meta">
        <p>{{ yearFounded }} - Present</p>
      </div>
      <div class="box-grid-layout">
        <div
          class="d-flex align-content-between flex-wrap justify-content-between"
        >
          <div class="box">
            <div class="box-icon d-flex align-items-center">
              <img class="img-fluid" :src="person" />
              <span>Employees</span>
            </div>
            <div class="box-caption">
              <h4>{{ employeeCount }}</h4>
            </div>
          </div>
          <div class="box">
            <div class="box-icon d-flex align-items-center">
              <img class="img-fluid" :src="assistant_photo" />
              <span>Founded</span>
            </div>
            <div class="box-caption">
              <h4>{{ yearFounded }}</h4>
            </div>
          </div>
          <div class="box">
            <div class="box-icon d-flex align-items-center">
              <img class="img-fluid" :src="fmd_good" />
              <span>Location</span>
            </div>
            <div class="box-caption">
              <h4>{{ cplocation }}</h4>
            </div>
          </div>
          <div class="box">
            <div class="box-icon d-flex align-items-center">
              <img class="img-fluid" :src="watch_later" />
              <span>Work Time</span>
            </div>
            <div class="box-caption">
              <h4>8:00 - 16:00</h4>
            </div>
          </div>
        </div>
      </div>

      <div class="experience-company">
        <!-- Experience Title -->
        <div class="experience-title">
          <h2>Experience</h2>
        </div>
        <!-- Experience Title -->
        <!-- Experience-company Item -->
        <div
          class="kompass-company-info d-flex align-items-flex-start"
          v-for="item in experiences"
          :key="item.entityUrn"
        >
          <div class="company-logo">
            <img
              class="img-fluid"
              :src="item.logoUrl"
              style="width: 40px"
              v-if="item.logoUrl"
            />
            <img
              class="img-fluid"
              :src="companyImg"
              style="width: 40px"
              v-else
            />
          </div>
          <div class="kompass-name-info">
            <h3>{{ item.title }}</h3>
            <span>{{ item.subtitle }}</span>
            <div class="kompass-experience-info" v-if="item.subSkills">
              <div
                class="kompass-experience-info"
                v-for="it in item.subSkills"
                :key="it.title"
              >
                <h3>{{ it.title }}</h3>
                <span>{{ it.caption }}</span>
              </div>
            </div>
            <div class="kompass-experience-info" v-else>
              <span>{{ item.caption }}</span>
            </div>
          </div>

          <div class="social-links">
            <a :href="item.companyUrl">
              <img class="img-fluid" :src="linkedIn"
            /></a>
            <!-- <a><img class="img-fluid" :src="link" /> -->
            <img
              class="img-fluid"
              :src="bookmark_border1"
              @click="saveCompany(item)"
            />
          </div>
        </div>
      </div>

      <div class="skill-tags">
        <ul>
          <div v-if="skills.length > 5">
            <div v-if="isExpand">
              <li v-for="item in skills" :key="item">
                <span>{{ item }}</span>
              </li>
            </div>
            <div v-else>
              <li v-for="item in skills.slice(0, 5)" :key="item">
                <span>{{ item }}</span>
              </li>
            </div>
          </div>
          <div v-else>
            <li v-for="item in skills" :key="item">
              <span>{{ item }}</span>
            </li>
          </div>
        </ul>
        <strong
          id="moreBtn"
          v-if="skills.length > 5"
          @click="isExpand = !isExpand"
          >{{ isExpand ? 'Less' : 'Expand' }}</strong
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
const toast = useToast();
const props = defineProps({
  profileData: {
    type: Object,
    default: {},
  },
});
const isExpand = ref(false);
const emailAddress: any = ref([]);
const phoneNumbers: any = ref([]);
const skills: any = ref([]);
const profile: any = ref();
const cpAbout = ref('');
const employeeCount = ref('');
const industryContent = ref('');
const industryTags = ref('');
const yearFounded = ref('');
const country = ref('');
const countryCode = ref('');
const profilePhoto = ref('');
const profileName = ref('');
const companyName = ref('');
const specialities = ref([]);
const employees = ref([]);
const tagLine = ref('');
const companyUrl = ref('');
const profileUrl = ref('');
const headline = ref('');
const location = ref('');
const headquarte = ref('');
const moneyRaised = ref('');
const moneyRaisedUnits = ref('');
const employeeCountRange = ref('');
const companyLogo = ref('');
const location_1 = ref('');
const cplocation = ref('');
const cpUrl = ref('');
const pUrl = ref('');
const experiences: any = ref([]);
const emailChecked = ref(true);
const mobileChecked = ref(true);
const isTruncated = ref(true);
const enriched = ref(false);
const truncatedText = computed(() =>
  isTruncated.value ? cpAbout.value.slice(0, 250) : cpAbout.value,
);

const revealContactInfo = async () => {
  if (emailAddress.value.length > 0 && !mobileChecked.value) {
    toast.info('Please select phone');
    return;
  }
  if (phoneNumbers.value.length > 0 && !emailChecked.value) {
    toast.info('Please select email ');
    return;
  }
  if (!emailChecked.value && !mobileChecked.value) {
    toast.info('Please select email or phone');
    return;
  }
  const dataToSave = JSON.stringify({
    cpUrl: cpUrl.value,
    cpAbout: cpAbout.value,
    employeeCount: employeeCount.value,
    yearFounded: yearFounded.value,
    country: country.value,
    countryCode: countryCode.value,
    profilePhoto: profilePhoto.value,
    profileName: profileName.value,
    companyName: companyName.value,
    companyUrl: companyUrl.value,
    profileUrl: profileUrl.value,
    headline: headline.value,
    location: location.value,
    cplocation: cplocation.value,
    moneyRaised: moneyRaised.value,
    moneyRaisedUnits: moneyRaisedUnits.value,
    companyLogo: companyLogo.value,
    experiences: experiences.value,
    skills: skills.value,
  });
  let endPoint = 'live_search/enrich/email';
  if (emailChecked.value && mobileChecked.value) {
    emailAddress.value = [];
    phoneNumbers.value = [];
    endPoint = 'live_search/enrich/all';
  } else if (mobileChecked.value) {
    phoneNumbers.value = [];
    endPoint = 'live_search/enrich/phone';
  } else if (emailChecked.value) {
    emailAddress.value = [];
  }
  //@ts-ignore
  emit('setLoading', true);
  chrome.runtime.sendMessage({
    type: 'uploadHistoryPerson',
    dataToSave,
    endPoint,
  });
};

function updateEnrichData(e: any) {
  console.log('updateEnrichData', e);
  enriched.value = true;
  const data = e;
  if (mobileChecked.value) {
    if (data.validPhones) {
      phoneNumbers.value = data.validPhones.map((e: any) => e.phoneNumber);
    }
  }
  if (emailChecked.value) {
    if (data.validEmails && data.validEmails.personalEmails) {
      emailAddress.value = data.validEmails.personalEmails.map(
        (e: any) => e.email,
      );
    }
    if (data.validEmails && data.validEmails.riskyEmails) {
      emailAddress.value = [
        ...emailAddress.value,
        ...data.validEmails.riskyEmails.map((e: any) => e.email),
      ];
    }
    if (data.validEmails && data.validEmails.workEmails) {
      emailAddress.value = [
        ...emailAddress.value,
        ...data.validEmails.workEmails.map((e: any) => e.email),
      ];
    }
  }
  if (mobileChecked.value && emailChecked.value) {
    if (emailAddress.value.length === 0 && phoneNumbers.value.length === 0) {
      return toast.info('contact not found ');
    }
  } else if (mobileChecked.value) {
    if (phoneNumbers.value.length === 0) {
      return toast.info('phone not found ');
    }
  } else {
    if (emailAddress.value.length === 0) {
      return toast.info('email not found ');
    }
  }
}

defineExpose({
  updateEnrichData,
});

const companyDataUpdated = (e: any) => {
  if (!e) return;
  if (e.cpAbout) cpAbout.value = e.cpAbout;
  if (e.employeeCount) employeeCount.value = e.employeeCount;
  if (e.pUrl) pUrl.value = e.pUrl;
  if (e.cpAbout) cpAbout.value = e.cpAbout;
  if (e.industryContent) industryContent.value = e.industryContent;
  if (e.industryTags) industryTags.value = e.industryTags;
  if (e.employees) employees.value = e.employees;

  if (e.yearFounded) yearFounded.value = e.yearFounded;
  if (e.country) country.value = e.country;
  if (e.countryCode) countryCode.value = e.countryCode;
  if (e.profilePhoto) profilePhoto.value = e.profilePhoto;
  if (e.profileName) profileName.value = e.profileName;
  if (e.companyName) companyName.value = e.companyName;
  if (e.tagLine) tagLine.value = e.tagLine;
  if (e.companyUrl) companyUrl.value = e.companyUrl;
  if (e.profileUrl) profileUrl.value = e.profileUrl;
  if (e.headline) headline.value = e.headline;
  if (e.location) location.value = e.location;
  if (e.headquarter) headquarte.value = e.headquarter;
  if (e.moneyRaised) moneyRaised.value = e.moneyRaised;
  if (e.moneyRaisedUnits) moneyRaisedUnits.value = e.moneyRaisedUnits;
  if (e.employeeCountRange) employeeCountRange.value = e.employeeCountRange;
  if (e.cpUrl) {
    cpUrl.value = e.cpUrl;
    try {
      if (e.headquarter?.address?.city)
        location_1.value = e.headquarter?.address?.city || '';
    } catch (error) {}
  }
  if (e.companyLogo) companyLogo.value = e.companyLogo;
  if (e.specialities) specialities.value = e.specialities || [];
  if (e.cplocation) cplocation.value = e.cplocation || '';
};
const companyImg = computed(() => chrome.runtime.getURL(`company.svg`));
const linkedIn = computed(() => chrome.runtime.getURL(`LinkedIn.svg`));
const link = computed(() => chrome.runtime.getURL(`link.svg`));
const bookmark_border1 = computed(() =>
  chrome.runtime.getURL(`bookmark_border1.svg`),
);
const person = computed(() => chrome.runtime.getURL(`person.svg`));
const assistant_photo = computed(() =>
  chrome.runtime.getURL(`assistant_photo.svg`),
);
const fmd_good = computed(() => chrome.runtime.getURL(`fmd_good.svg`));
const watch_later = computed(() => chrome.runtime.getURL(`watch_later.svg`));
const close = computed(() => chrome.runtime.getURL(`close.svg`));
const saveCompany = async (e: any) => {
  //@ts-ignore
  emit('saveCompany', e);
};
const saveContactInfo = async () => {
  emit('saveContactInfo');
};

const updateHistoryClickedItem = async () => {
  emit('updateHistoryClickedItem', profile);
};
onMounted(() => {
  console.log('history mount', props.profileData);
  profile.value = props.profileData.profile;
  skills.value = profile.value.skills;
  profilePhoto.value = props.profileData.profilePhoto;
  profileName.value = props.profileData.profileName;
  headline.value = props.profileData.headline;
  experiences.value = profile.value.experiences;
  emailAddress.value = profile.value.emailAddress || [];
  phoneNumbers.value = profile.value.phoneNumbers || [];
  companyDataUpdated(profile.value.companyData);
});
const emit = defineEmits([
  'close',
  'saveCompany',
  'setLoading',
  'saveContactInfo',
  'updateHistoryClickedItem',
]);

const gotoHistory = () => {
  emit('close');
};
</script>

<style scoped>
@import '../Styles/HistoryStyle.css';
@import '../AppStyles.css';
</style>
