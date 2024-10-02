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
    <div class="skill-tags">
      <ul>
        <li v-for="item in skills" :key="item">
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>
    <div class="email-address-info">
      <!-- Email List -->
      <div
        class="email-list d-flex justify-content-between align-items-center"
        v-if="!emailAddress.length"
      >
        <div :class="[isSales ? 'email-checkbox-sales' : 'email-checkbox']">
          <div
            class="form-checkmark d-flex align-items-center"
            style="padding-left: 10px"
          >
            <input
              type="checkbox"
              class="checkbox"
              value=""
              checked
              id="email-checkmark"
              v-model="emailChecked"
            />
            <label for="email-checkmark"> Email address <br /> </label>
          </div>
        </div>
        <div class="email-credit">
          <span>1 credit</span>
        </div>
      </div>
      <div
        class="email-list d-flex justify-content-between align-items-center"
        v-if="!phoneNumbers.length"
      >
        <div :class="[isSales ? 'email-checkbox-sales' : 'email-checkbox']">
          <div class="form-checkmark d-flex align-items-center">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="mobileChecked"
              id="phone-checkmark1"
            />
            <label class="form-check-label" for="phone-checkmark1"
              >Phone</label
            >
          </div>
        </div>
        <div class="email-credit">
          <span>3 credit</span>
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
          <span
            icon="pi pi-check"
            class="rounded"
            text
            raised
            rounded
            aria-label="Filter"
          >
            <img class="img-fluid" :src="linkedIn" @click="openLinkedin" />
          </span>
          <span
            icon="pi pi-check"
            class="rounded"
            text
            raised
            rounded
            aria-label="Filter"
          >
            <img class="img-fluid" :src="link" @click="openWebpage" />
          </span>
        </div>
      </div>
      <div class="company-short-info">
        <p>{{ cpAbout }}</p>
      </div>
      <div class="date-meta" v-if="yearFounded">
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
            <span
              icon="pi pi-check"
              class="rounded"
              text
              raised
              rounded
              aria-label="Filter"
            >
              <a :href="item.companyUrl">
                <img class="img-fluid" :src="linkedIn" />
              </a>
            </span>
            <span
              icon="pi pi-check"
              class="rounded"
              text
              raised
              rounded
              aria-label="Filter"
            >
              <img
                class="img-fluid"
                :src="bookmark_border1"
                @click="saveCompany(item)"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watchEffect } from 'vue';
import { useToast } from 'vue-toastification';
const toast = useToast();
const props = defineProps({
  profileData: {
    type: Object,
    default: {},
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
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
const emailChecked = ref(false);
const mobileChecked = ref(false);
const isSales = ref(false);
const emit = defineEmits(['close', 'setLoading', 'saveCompany', 'saveContactInfo']);

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
    type: 'uploadSavedPerson',
    dataToSave,
    endPoint,
  });
};

const companyDataUpdated = (e: any) => {
  if (!e) return;
  if (e.cpAbout) cpAbout.value = e.cpAbout;
  if (e.numberOfEmployees) employeeCount.value = e.numberOfEmployees;
  if (e.domain) pUrl.value = e.domain;
  if (e.cpAbout) cpAbout.value = e.cpAbout;
  if (e.industryContent) industryContent.value = e.industryContent;
  if (e.industryTags) industryTags.value = e.industryTags;
  if (e.employees) employees.value = e.employees;
  if (e.founded) yearFounded.value = e.founded;
  if (e.country) country.value = e.country;
  if (e.countryCode) countryCode.value = e.countryCode;
  if (e.profilePhoto) profilePhoto.value = e.profilePhoto;
  if (e.profileName) profileName.value = e.profileName;
  if (e.name) companyName.value = e.name;
  if (e.tagLine) tagLine.value = e.tagLine;
  if (e.linkedin) companyUrl.value = e.linkedin;
  if (e.headline) headline.value = e.headline;
  if (e.location) location.value = e.location;
  if (e.headquarter) headquarte.value = e.headquarter;
  if (e.moneyRaised) moneyRaised.value = e.moneyRaised;
  if (e.moneyRaisedUnits) moneyRaisedUnits.value = e.moneyRaisedUnits;
  if (e.employeeCountRange) employeeCountRange.value = e.employeeCountRange;
  if (e.domain) {
    cpUrl.value = e.domain;
    try {
      if (e.headquarter?.address?.city)
        location_1.value = e.headquarter?.address?.city || '';
    } catch (error) {}
  }
  if (e.logo) companyLogo.value = e.logo;
  if (e.specialities) specialities.value = e.specialities || [];
  if (e.location) cplocation.value = e.location || '';
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

onMounted(() => {
  console.log('history mount', props.profileData);
  profile.value = props.profileData;
  skills.value = profile.value.skills;
  profilePhoto.value = props.profileData.photo;
  profileName.value = props.profileData.name;
  headline.value = props.profileData.title;
  profileUrl.value = props.profileData.linkedin;
  console.log('history ', profileUrl.value);

  experiences.value = profile.value.employeeHistories;
  if (profile.value.validPhones) {
    phoneNumbers.value = profile.value.validPhones.map(
      (e: any) => e.phoneNumber,
    );
  }
  if (profile.value && profile.value.personalEmails) {
    emailAddress.value = profile.value.personalEmails.map((e: any) => e.email);
  }
  if (profile.value && profile.value.riskyEmails) {
    emailAddress.value = [
      ...emailAddress.value,
      ...profile.value.riskyEmails.map((e: any) => e.email),
    ];
  }
  if (profile.value && profile.value.workEmails) {
    emailAddress.value = [
      ...emailAddress.value,
      ...profile.value.workEmails.map((e: any) => e.email),
    ];
  }
  companyDataUpdated(profile.value.company);
  isSales.value = window.location.href.includes('sales/lead');
});

function updateEnrichData(e: any) {
  console.log('updateEnrichData', e);
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
const openLinkedin = async () => {
  console.log(companyUrl.value);
  window.open(companyUrl.value, '_blank');
};
const openWebpage = async () => {
  console.log(cpUrl.value);

  window.open('https://' + cpUrl.value, '_blank');
};
const saveCompany = async (e: any) => {
  //@ts-ignore
  emit('saveCompany', e);
};
const saveContactInfo = async () => {
  emit('saveContactInfo');
};
const gotoHistory = () => {
  //@ts-ignore
  emit('close');
};
</script>

<style scoped>
@import '../Styles/ContactStyle.css';
</style>
