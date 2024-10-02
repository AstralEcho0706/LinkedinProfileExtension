import { ref } from 'vue';
import { defineStore } from 'pinia';
type Nullable<T> = T | null | undefined;

export const useProfileStore = defineStore('profile', () => {
  const showCE = ref<Boolean>(false);
  const contactInfo = ref<Nullable<any>>(null);
  const companyData = ref<Nullable<any>>(null);
  const skills = ref<Nullable<any>>(null);
  const experiences = ref<Nullable<any>>(null);
  const salesData = ref<Nullable<any>>(null);
  const scrapingDone = ref<Boolean>(false);
  const commands = ref<Nullable<any>>(null);
  const salesTotal = ref<Nullable<any>>(0);
  const dlimits = ref<Nullable<any>>(0);
  const btnAdded = ref<Nullable<any>>(null);

  function updateCompanyData(piece?: any) {
    companyData.value = piece;
  }
  function updateCommands(piece?: any) {
    commands.value = piece;
  }
  function buttonAdded(piece?: any) {
    btnAdded.value = piece;
  }
  function updateLimits(piece?: any) {
    dlimits.value = piece;
  }
  function updateContactInfo(piece?: any) {
    contactInfo.value = piece;
  }
  function updateSkills(piece?: any) {
    skills.value = piece;
  }
  function updateExperiences(piece?: any) {
    experiences.value = piece;
  }
  function updateCEVisible(piece: Boolean) {
    showCE.value = piece;
  }
  function updateScrapingDone(piece: Boolean) {
    scrapingDone.value = piece;
  }
  function updateSalesNavResult(piece: any) {
    salesData.value = piece;
  }
  function updateSalesNavTotal(piece: any) {
    salesTotal.value = piece;
  }
  function getCEVisible() {
    return showCE.value;
  }
  return {
    showCE,
    updateCEVisible,
    getCEVisible,
    contactInfo,
    companyData,
    updateCompanyData,
    updateContactInfo,
    updateSkills,
    skills,
    updateExperiences,
    experiences,
    updateSalesNavResult,
    updateSalesNavTotal,
    salesData,
    updateScrapingDone,
    scrapingDone,
    updateCommands,
    commands,
    salesTotal,
    updateLimits,
    dlimits,
    buttonAdded,
    btnAdded
  };
});
