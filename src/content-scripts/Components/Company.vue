<template>
  <div class="app-container mx-auto">
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
          <img class="img-fluid" :src="linkedIn" @click="openLinkedin" />
          <img class="img-fluid" :src="link" @click="openWebpage" />
        </div>
      </div>
      <div class="company-short-info">
        <!-- <p>{{ cpAbout }} <b>More...</b></p> -->
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
            <div>
              <div class="box-caption" v-if="Number(employeeCount) !== 0">
                <h4>{{ employeeCount }}</h4>
              </div>
              <div class="box-caption" v-else>
                <h4>{{ employeeCountRange }}</h4>
              </div>
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
const emailChecked = ref(false);
const mobileChecked = ref(false);
const isSales = ref(false);
const emit = defineEmits(['close, setLoading, loadContacts']);

const companyDataUpdated = (e: any) => {
  if (!e) return;
  console.log('Company data ', e);
  if (e.about) cpAbout.value = e.about;
  if (e.numberOfContacts) employeeCount.value = e.numberOfContacts;
  if (e.website) pUrl.value = e.website;
  if (e.cpAbout) cpAbout.value = e.cpAbout;
  if (e.industryContent) industryContent.value = e.industryContent;
  if (e.industryTags) industryTags.value = e.industryTags;
  if (e.employees) employees.value = e.employees;
  if (e.yearFounded) yearFounded.value = e.yearFounded;
  if (e.country) country.value = e.country;
  if (e.countryCode) countryCode.value = e.countryCode;
  if (e.name) companyName.value = e.name;
  if (e.tagLine) tagLine.value = e.tagLine;
  if (e.linkedin) companyUrl.value = e.linkedin;
  if (e.headline) headline.value = e.headline;
  if (e.location) location.value = e.location;
  if (e.headquarter) headquarte.value = e.headquarter;
  if (e.moneyRaised) moneyRaised.value = e.moneyRaised;
  if (e.moneyRaisedUnits) moneyRaisedUnits.value = e.moneyRaisedUnits;
  if (e.employeeCountRange) employeeCountRange.value = e.employeeCountRange;
  if (e.website) {
    cpUrl.value = e.website;
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
  companyDataUpdated(props.profileData.companyDetail);
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
</script>

<style scoped>
@import '../Styles/CompanyStyle.css';
</style>
