import { createApp } from 'vue';
import App from './App.vue';
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { createPinia } from 'pinia';
import { getCookie } from 'typescript-cookie';
import { useProfileStore } from '../store/profileData';
import {
  getDataFromStorage,
  setDataToStorage,
  waitElement,
  loadProfile,
  loadSalesProfile,
  REGULAR_COMPANY,
  SALES_COMPANY,
  REGULAR_PROFILE,
  LEAD_PROFILE,
  LINKEDIN_NONE,
  pageType,
  loadCompany,
  SALES_NAV_SEARCH_PATTERN,
  getDate,
  loadSalesCompany,
  loadProfileFromNAVSearch,
  FEEDPAGE,
  SALES_NAV,
  delay,
} from '../utils/utils';
import $ from 'jquery';
import 'gitart-vue-dialog/dist/style.css';
import { plugin as dialogPlugin } from 'gitart-vue-dialog';
import {
  // create naive ui
  create,
  NAffix,
  NTooltip,
  NBadge,
  NCard,
  NTag,
  NPopover,
  NSelect,
  NButton,
} from 'naive-ui';

const naive = create({
  components: [
    NButton,
    NTag,
    NAffix,
    NTooltip,
    NBadge,
    NPopover,
    NCard,
    NSelect,
  ],
});

// console.log('KompassAI content loaded ');
const pinia = createPinia();
const prodfileStore = useProfileStore(pinia);
const app = createApp(App).use(pinia).use(naive);
app.use(BootstrapVue3);
app.use(dialogPlugin);

let offsetX: any, offsetY: any;

function getQueryParamValue(url: string, paramName: string) {
  const queryString = url.split('?')[1];
  if (queryString) {
    const params = new URLSearchParams(queryString);
    return params.get(paramName);
  } else {
    const queryString = url.split('#')[1];
    const params = new URLSearchParams(queryString);
    return params.get(paramName);
  }
}

chrome.runtime.onMessage.addListener(async function (request: any) {
  if (
    request.place === REGULAR_PROFILE ||
    request.place === LEAD_PROFILE ||
    request.place === REGULAR_COMPANY ||
    request.place === SALES_COMPANY ||
    request.place === SALES_NAV_SEARCH_PATTERN ||
    request.place === FEEDPAGE ||
    request.place === SALES_NAV
  ) {
    checkDetailPage();
  } else if (request.place === LINKEDIN_NONE) {
    if (prodfileStore) prodfileStore.updateCEVisible(false);
    const sticky = document.getElementById('kps_sticky');
    if (sticky) sticky.remove();

    const kpsapp = document.getElementById('kpsapp');
    if (kpsapp) {
      prodfileStore.updateCEVisible(false);
    }
  }
  if (request.action === 'saleNavScrapingStart') {
    loadSalesSearch(0);
  }
  if (request.type === 'tabChanged') {
    const page = pageType(window.location.href);
    if (page === SALES_NAV_SEARCH_PATTERN) {
      loadSalesSearch(0, true);
    }
  }
});

const loadSalesSearch = async function (
  start: number,
  totalNumberOnly = false,
) {
  const dailyLimits: any = (await getDataFromStorage('dailyLimits')) || 0;
  const scrapeCounts: any = await getDataFromStorage('scrapeCounts');
  console.log('KKKK,', dailyLimits, scrapeCounts);
  if (!totalNumberOnly) {
    if (start >= scrapeCounts) {
      prodfileStore.updateScrapingDone(true);
      return;
    }
  }

  if (dailyLimits > 800) {
    prodfileStore.updateScrapingDone(true);
    return;
  }
  const recentSearchId = getQueryParamValue(
    window.location.href,
    'recentSearchId',
  );
  const savedSearchId = getQueryParamValue(
    window.location.href,
    'savedSearchId',
  );
  const query = getQueryParamValue(window.location.href, 'query');
  const liToken: any = getCookie('JSESSIONID');
  const myHeaders = new Headers();
  myHeaders.append('authority', 'www.linkedin.com');
  myHeaders.append('accept', '*/*');
  myHeaders.append('csrf-token', liToken);
  myHeaders.append('x-restli-protocol-version', '2.0.0');
  let pageData;
  const myInit = {
    method: 'GET',
    headers: myHeaders,
  };

  let opt = 'LeadSearchResult-13';
  let dt: any;
  const regex = /https:\/\/www\.linkedin\.com\/sales\/lists\/people\/(\d+)/;
  let listId = '';
  const match = window.location.href.match(regex);
  if (match) {
    listId = match[1];
  }
  if (listId) {
    const myRequest = new Request(
      `https://www.linkedin.com/sales-api/salesApiPeopleSearch?q=peopleSearchQuery&query=(spotlightParam:(selectedType:ALL),doFetchSpotlights:true,doFetchHits:true,doFetchFilters:false,pivotParam:(com.linkedin.sales.search.LeadListPivotRequest:(list:urn%3Ali%3Afs_salesList%3A${listId},sortCriteria:LAST_ACTIVITY,sortOrder:DESCENDING)),list:(scope:LEAD,includeAll:false,excludeAll:false,includedValues:List((id:${listId}))))&start=${start}&count=25&decoration=%28entityUrn%2CprofilePictureDisplayImage%2CfirstName%2ClastName%2CfullName%2Cdegree%2CblockThirdPartyDataSharing%2CcrmStatus%2CgeoRegion%2ClastUpdatedTimeInListAt%2CpendingInvitation%2CnewListEntitySinceLastViewed%2Csaved%2CleadAssociatedAccount~fs_salesCompany%28entityUrn%2Cname%29%2CoutreachActivity%2Cmemorialized%2ClistCount%2CsavedAccount~fs_salesCompany%28entityUrn%2Cname%29%2CnotificationUrnOnLeadList%2CuniquePositionCompanyCount%2CcurrentPositions*%28title%2CcompanyName%2Ccurrent%2CcompanyUrn%29%2CmostRecentEntityNote%28body%2ClastModifiedAt%2CnoteId%2Cseat%2Centity%2CownerInfo%2Cownership%2Cvisibility%29%29`,
      myInit,
    );

    const result = await fetch(myRequest, myInit);
    dt = await result.json();
  } else if (recentSearchId) {
    // console.log(3333);
    const myRequest = new Request(
      `https://www.linkedin.com/sales-api/salesApiLeadSearch?q=recentSearchId&start=${start}&count=25&recentSearchId=${recentSearchId}&decorationId=com.linkedin.sales.deco.desktop.searchv2.${opt}`,
      myInit,
    );
    const result = await fetch(myRequest, myInit);
    dt = await result.json();
  } else if (savedSearchId) {
    opt = 'LeadSearchResult-14';
    let lastViweAt = '';
    const valNmu = getQueryParamValue(window.location.href, 'lastViewedAt');
    if (valNmu) {
      lastViweAt = '&lastViewedAt=' + valNmu;
    }
    const myRequest = new Request(
      `https://www.linkedin.com/sales-api/salesApiLeadSearch?q=savedSearchId&start=${start}&count=25&savedSearchId=${savedSearchId}${lastViweAt}&decorationId=com.linkedin.sales.deco.desktop.searchv2.${opt}`,
      myInit,
    );
    const result = await fetch(myRequest, myInit);
    dt = await result.json();
  } else if (query) {
    // console.log(44444);
    const myRequest = new Request(
      `https://www.linkedin.com/sales-api/salesApiLeadSearch?q=searchQuery&query=${query}&start=${start}&count=25&decorationId=com.linkedin.sales.deco.desktop.searchv2.${opt}`,
      myInit,
    );
    const result = await fetch(myRequest, myInit);
    dt = await result.json();
  } else {
    prodfileStore.updateScrapingDone(true);
  }
  if (dt && dt.paging && dt.paging.total > 0) {
    pageData = dt.paging;
    if (totalNumberOnly) {
      prodfileStore.updateSalesNavTotal(dt.paging.total);
      return;
    }
    if (pageData.total < 25) {
      setDataToStorage({ dailyLimits: dailyLimits + pageData.total });
    } else {
      setDataToStorage({ dailyLimits: dailyLimits + 25 });
    }
    prodfileStore.updateLimits(dailyLimits + 25);
    for (let index = 0; index < dt.elements.length; index++) {
      const element = dt.elements[index];
      const companyID =
        element.currentPositions.length > 0
          ? element.currentPositions[0].companyUrn
          : '';
      // console.log('------', element)
      const cid = companyID
        ? companyID.replace('urn:li:fs_salesCompany:', '')
        : '';
      if (cid) {
        const myRequest = new Request(
          `https://www.linkedin.com/sales-api/salesApiCompanies/${cid}?decoration=%28account%28crmStatus%2Csaved%2Cstarred%29%2CaccountMapInfo%28id%2CaccountMapEntityCount%2CtopAccountMapEntities*~fs_salesProfile%28profilePictureDisplayImage%2CfirstName%2ClastName%29%29%2CcompanyPictureDisplayImage%2CcrmOpportunities%2CemployeeCountInfo%2CemployeeGrowthPercentages%2CnewDecisionMakersCount%2CnewDecisionMakersDisplayCount%2CsharedAlumniSchoolIds%2CentityUrn%2Cindustry%2Clocation%2Cname%2CrevenueRange%2CformattedRevenue%2Cwebsite%2CflagshipCompanyUrl%29`,
          myInit,
        );
        const result = await fetch(myRequest, myInit);
        const company = await result.json();
        const dl: any = (await getDataFromStorage('dailyLimits')) || 0;
        setDataToStorage({ dailyLimits: dl + 1 });
        prodfileStore.updateLimits(dl + 1);
        await delay(350);
        dt.elements[index].cpUrl = company.website;
        dt.elements[index].employeeCount =
          company.employeeCountInfo?.employeeCount;
        dt.elements[index].moneyRaised = company.formattedRevenue?.amount;
        dt.elements[index].moneyRaisedUnits = company.formattedRevenue?.unit;
      }
      let flagshipProfileUrl = '';
      try {
        const indProfile = await loadProfileFromNAVSearch(
          element.entityUrn
            .replace('urn:li:fs_salesProfile:', '')
            .replace('(', '')
            .replace(')', '')
            .split(',')[0],
        );

        flagshipProfileUrl = indProfile.flagshipProfileUrl;
        dt.elements[index].headline = indProfile.headline;
        const dl: any = (await getDataFromStorage('dailyLimits')) || 0;
        setDataToStorage({ dailyLimits: dl + 1 });
        prodfileStore.updateLimits(dl + 1);
        await delay(350);
      } catch (error) {}
      if (flagshipProfileUrl) {
        dt.elements[index].linkedinUrl = flagshipProfileUrl;
      }
    }
    prodfileStore.updateSalesNavResult(dt.elements);
    let totalTime = 2500;
    // console.log(11, pageData);
    if (pageData.total < totalTime) {
      totalTime = pageData.total;
    }
    const elapsed = pageData.start + 25;
    if (elapsed < totalTime) {
      // console.log(99999);

      await loadSalesSearch(elapsed);
    } else {
      // console.log(222222);

      prodfileStore.updateScrapingDone(true);
    }
  } else {
    prodfileStore.updateScrapingDone(true);
  }
};

const checkDetailPage = async () => {
  injectButtonCode();
  const body = await waitElement('body');
  if (!body) return;
  const page = pageType(window.location.href);
  chrome.runtime.sendMessage({ type: 'checkingDetails' });
  // console.log(6796796, page);

  if (page === LINKEDIN_NONE) {
    if (prodfileStore) prodfileStore.updateCEVisible(false);
    const sticky = document.getElementById('kps_sticky');
    if (sticky) {
      sticky.remove();
    }
    const kpsapp = document.getElementById('kpsapp');
    if (kpsapp) {
      prodfileStore.updateCEVisible(false);
    }
    return false;
  }
  const isSales = window.location.href.includes('sales/lead');
  const stickyState = await getDataFromStorage('kps_sticky');
  const autoOpen: any = await getDataFromStorage('autoOpen');
  const isRegular = window.location.href.includes(
    'https://www.linkedin.com/in/',
  );

  if (autoOpen === false) setDataToStorage({ kps_sticky: 'show' });
  else setDataToStorage({ kps_sticky: 'hide' });

  if (page === SALES_COMPANY) {
    let segment = new URL(window.location.href).pathname.split('/')[3];
    loadSalesCompany(segment, prodfileStore);
  } else if (page === REGULAR_COMPANY) {
    let segment = new URL(window.location.href).pathname.split('/')[2];
    loadCompany(segment, prodfileStore);
  } else if (isSales) loadSalesProfile(0, '', prodfileStore);
  else if (isRegular) loadProfile(0, '', prodfileStore);
  if (stickyState === 'show') {
    prodfileStore.updateCEVisible(false);
  } else {
    prodfileStore.updateCEVisible(true);
  }

  if (page === REGULAR_PROFILE) {
    const selectorProfile = 'section[data-member-id] .ph5';

    const card = await waitElement(selectorProfile);
    const kompassBtnWrapper = document.querySelector('#kompassBtnWrapper');
    if (card && !kompassBtnWrapper) {
      $(selectorProfile).append(
        '<div id="kompassBtnWrapper">' +
          `<div id="kompassicon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 40 40" fill="none"><g clip-path="url(#clip0_171_4779)"><path d="M32.2075 40H7.79255C3.48872 40 0 36.5113 0 32.2075V7.79255C0 3.48872 3.48872 0 7.79255 0H32.2075C32.7271 0 35.4863 0.050945 37.7177 2.28234C39.1278 3.6925 40 5.64063 40 7.79255V32.2075C40 36.5113 36.5113 40 32.2075 40Z" fill="#000000"/><path d="M30.7054 13.8996L17.044 30.8929C15.8947 32.2806 14.0566 32.7758 12.3672 32.1583C11.385 31.8017 10.576 31.1068 10.0951 30.2041L10.0869 30.1919H10.0849C10.0625 30.143 10.0421 30.1002 10.0217 30.0614C9.59582 29.2708 9.59989 28.1724 9.59989 28.1724C9.59174 27.4041 9.56525 19.4567 9.59989 7.57227C11.3096 7.5743 13.0214 7.57838 14.7311 7.58042V25.6944L14.996 25.3786C15.8233 24.3841 24.5798 13.7142 25.4092 12.7198L31.71 12.6525L30.7074 13.8996H30.7054Z" fill="white"/><path d="M32.6271 32.4243H25.4439L22.1325 29.0661L21.7412 28.6687L24.967 24.6562L25.505 25.2003L27.9545 27.6844C29.5134 29.2617 31.0703 30.843 32.6292 32.4243H32.6271Z" fill="white"/></g><defs><clipPath id="clip0_171_4779"><rect width="40" height="40" fill="white"/></clipPath></defs></svg></div>` +
          `<div id = "kps_find_email"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 2H2.33333C1.6 2 1.00667 2.6 1.00667 3.33333L1 11.3333C1 12.0667 1.6 12.6667 2.33333 12.6667H7.66667V11.3333H2.33333V4.66667L7.66667 8L13 4.66667V8H14.3333V3.33333C14.3333 2.6 13.7333 2 13 2ZM7.66667 6.66667L2.33333 3.33333H13L7.66667 6.66667ZM11.2267 14L8.86667 11.64L9.80667 10.7L11.22 12.1133L14.0467 9.28667L15 10.2267L11.2267 14Z" fill="#000000"/></svg><span>Access Email </span></div>` +
          `<div id = "kps_find_phone"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 2H2.33333C1.6 2 1.00667 2.6 1.00667 3.33333L1 11.3333C1 12.0667 1.6 12.6667 2.33333 12.6667H7.66667V11.3333H2.33333V4.66667L7.66667 8L13 4.66667V8H14.3333V3.33333C14.3333 2.6 13.7333 2 13 2ZM7.66667 6.66667L2.33333 3.33333H13L7.66667 6.66667ZM11.2267 14L8.86667 11.64L9.80667 10.7L11.22 12.1133L14.0467 9.28667L15 10.2267L11.2267 14Z" fill="#000000"/></svg><span>Access Phone </span></div>` +
          // `<div id = "kps_view_contact"><span>View contact in plugin</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12.6667 12.6667H3.33333V3.33333H8V2H3.33333C2.59333 2 2 2.6 2 3.33333V12.6667C2 13.4 2.59333 14 3.33333 14H12.6667C13.4 14 14 13.4 14 12.6667V8H12.6667V12.6667ZM9.33333 2V3.33333H11.7267L5.17333 9.88667L6.11333 10.8267L12.6667 4.27333V6.66667H14V2H9.33333Z" fill="#000000"/></svg></div>`
          '<div id = "kps_find_all">Access Email and Phone </div>' +
          '</div>',
      );
      const kompassicon = document.getElementById('kompassicon');
      kompassicon?.addEventListener('click', function () {
        const divele = document.querySelector('#kps_sticky') as HTMLElement;
        const updated = !prodfileStore.getCEVisible();
        // console.log(44, prodfileStore.getCEVisible());
        // console.log(55, updated);

        prodfileStore.updateCEVisible(updated);
        if (updated) {
          divele.style.display = 'none';
          chrome.storage.local.set({ kps_sticky: 'hide' });
        } else {
          divele.style.display = 'flex';
          chrome.storage.local.set({ kps_sticky: 'show' });
        }
      });
      const kps_find_all = document.getElementById('kps_find_all');
      kps_find_all?.addEventListener('click', function () {
        prodfileStore.updateCEVisible(true);
        const divele = document.querySelector('#kps_sticky') as HTMLElement;
        if (divele) {
          divele.style.display = 'none';
          chrome.storage.local.set({ kps_sticky: 'hide' });
          chrome.storage.local.set({ kps_commands: 'kps_find_all' });
          prodfileStore.updateCommands(Math.random());
        }
      });
      const kps_find_email = document.getElementById('kps_find_email');
      kps_find_email?.addEventListener('click', function () {
        prodfileStore.updateCEVisible(true);
        const divele = document.querySelector('#kps_sticky') as HTMLElement;
        if (divele) {
          divele.style.display = 'none';
          chrome.storage.local.set({ kps_sticky: 'hide' });
          chrome.storage.local.set({ kps_commands: 'kps_find_email' });

          prodfileStore.updateCommands(Math.random());
        }
      });
      const kps_view_contact = document.getElementById('kps_view_contact');
      kps_view_contact?.addEventListener('click', function () {
        prodfileStore.updateCEVisible(true);
        const divele = document.querySelector('#kps_sticky') as HTMLElement;
        if (divele) {
          divele.style.display = 'none';
          chrome.storage.local.set({ kps_sticky: 'hide' });
          chrome.storage.local.set({ kps_commands: 'kps_view_contact' });

          prodfileStore.updateCommands(Math.random());
        }
      });

      const kps_find_phone = document.getElementById('kps_find_phone');
      kps_find_phone?.addEventListener('click', function () {
        prodfileStore.updateCEVisible(true);
        const divele = document.querySelector('#kps_sticky') as HTMLElement;
        if (divele) {
          divele.style.display = 'none';
          chrome.storage.local.set({ kps_sticky: 'hide' });
          chrome.storage.local.set({ kps_commands: 'kps_find_phone' });
          prodfileStore.updateCommands(Math.random());
        }
      });
    }
    if (autoOpen === false) prodfileStore.updateCEVisible(false);
    else prodfileStore.updateCEVisible(true);
  }
  if (page === SALES_NAV_SEARCH_PATTERN) {
    const loggedIN = await getDataFromStorage('idToken');
    if (loggedIN) {
      const selectorProfile = '[class*="sticky-nav"] .p4';
      const card = await waitElement(selectorProfile);
      if (card) {
        const kpsbtn = document.querySelector('#kps-select-all-button');
        if (kpsbtn) return;
        $(selectorProfile).append(`<div id="kps-select-all-button">
        <div class=" kps-btn-wrapper kps-zp">
            <div style="margin: 5px 0px 0px 11px;">
                <div class="kps-btns">
                                <div id="kompassBtnWrapper">
                                  <div id="kompassicon">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 40 40" fill="none"><g clip-path="url(#clip0_171_4779)"><path d="M32.2075 40H7.79255C3.48872 40 0 36.5113 0 32.2075V7.79255C0 3.48872 3.48872 0 7.79255 0H32.2075C32.7271 0 35.4863 0.050945 37.7177 2.28234C39.1278 3.6925 40 5.64063 40 7.79255V32.2075C40 36.5113 36.5113 40 32.2075 40Z" fill="#000000"/><path d="M30.7054 13.8996L17.044 30.8929C15.8947 32.2806 14.0566 32.7758 12.3672 32.1583C11.385 31.8017 10.576 31.1068 10.0951 30.2041L10.0869 30.1919H10.0849C10.0625 30.143 10.0421 30.1002 10.0217 30.0614C9.59582 29.2708 9.59989 28.1724 9.59989 28.1724C9.59174 27.4041 9.56525 19.4567 9.59989 7.57227C11.3096 7.5743 13.0214 7.57838 14.7311 7.58042V25.6944L14.996 25.3786C15.8233 24.3841 24.5798 13.7142 25.4092 12.7198L31.71 12.6525L30.7074 13.8996H30.7054Z" fill="white"/><path d="M32.6271 32.4243H25.4439L22.1325 29.0661L21.7412 28.6687L24.967 24.6562L25.505 25.2003L27.9545 27.6844C29.5134 29.2617 31.0703 30.843 32.6292 32.4243H32.6271Z" fill="white"/></g><defs><clipPath id="clip0_171_4779"><rect width="40" height="40" fill="white"/></clipPath></defs></svg>
                                  </div>
                                  
                                  <div id = "kps_sales_find_email">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 2H2.33333C1.6 2 1.00667 2.6 1.00667 3.33333L1 11.3333C1 12.0667 1.6 12.6667 2.33333 12.6667H7.66667V11.3333H2.33333V4.66667L7.66667 8L13 4.66667V8H14.3333V3.33333C14.3333 2.6 13.7333 2 13 2ZM7.66667 6.66667L2.33333 3.33333H13L7.66667 6.66667ZM11.2267 14L8.86667 11.64L9.80667 10.7L11.22 12.1133L14.0467 9.28667L15 10.2267L11.2267 14Z" fill="#000000"/></svg><span> Email </span>
                                  </div>
                                <div id = "kps_sales_find_phone">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 2H2.33333C1.6 2 1.00667 2.6 1.00667 3.33333L1 11.3333C1 12.0667 1.6 12.6667 2.33333 12.6667H7.66667V11.3333H2.33333V4.66667L7.66667 8L13 4.66667V8H14.3333V3.33333C14.3333 2.6 13.7333 2 13 2ZM7.66667 6.66667L2.33333 3.33333H13L7.66667 6.66667ZM11.2267 14L8.86667 11.64L9.80667 10.7L11.22 12.1133L14.0467 9.28667L15 10.2267L11.2267 14Z" fill="#000000"/></svg><span> Phone </span>
                                </div>
                            <div id = "kps_sales_find_all"> Email and Phone </div>
                            <div id = "kps_sales_push_to_crm" style='display:none'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 2H2.33333C1.6 2 1.00667 2.6 1.00667 3.33333L1 11.3333C1 12.0667 1.6 12.6667 2.33333 12.6667H7.66667V11.3333H2.33333V4.66667L7.66667 8L13 4.66667V8H14.3333V3.33333C14.3333 2.6 13.7333 2 13 2ZM7.66667 6.66667L2.33333 3.33333H13L7.66667 6.66667ZM11.2267 14L8.86667 11.64L9.80667 10.7L11.22 12.1133L14.0467 9.28667L15 10.2267L11.2267 14Z" fill="#000000"/></svg><span> Push to CRM </span>
                            </div>

                            <div id = "kps_sales_add_to_list" style='display:none'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 2H2.33333C1.6 2 1.00667 2.6 1.00667 3.33333L1 11.3333C1 12.0667 1.6 12.6667 2.33333 12.6667H7.66667V11.3333H2.33333V4.66667L7.66667 8L13 4.66667V8H14.3333V3.33333C14.3333 2.6 13.7333 2 13 2ZM7.66667 6.66667L2.33333 3.33333H13L7.66667 6.66667ZM11.2267 14L8.86667 11.64L9.80667 10.7L11.22 12.1133L14.0467 9.28667L15 10.2267L11.2267 14Z" fill="#000000"/></svg><span> Add to list </span>

                        </div>
           
                            </div>
                            </div></div></div>
                            </div>`);
        prodfileStore.buttonAdded(Math.random());
      }
    }
  }
};

const injectButtonCode = async function () {
  const limitDay = await getDataFromStorage('limitDay');
  const currentDay = getDate();
  if (limitDay !== currentDay) {
    setDataToStorage({ limitDay: currentDay });
    setDataToStorage({ dailyLimits: 0 });
  }
  const page = pageType(window.location.href);
  if (page === LINKEDIN_NONE) {
    // console.log('injectButtonCode 2', page);
    if (prodfileStore) prodfileStore.updateCEVisible(false);
    const sticky = document.getElementById('kps_sticky');
    if (sticky) {
      sticky.remove();
    }
    const kpsapp = document.getElementById('kpsapp');
    if (kpsapp) {
      prodfileStore.updateCEVisible(false);
    }
    return false;
  }
  const body = await waitElement('body');
  if (!body) return;
  const kpsapp = document.querySelector('#kpsapp');
  if (!kpsapp) {
    // el.style.paddingRight = '320px'
    try {
      //console.log('stickyState', stickyState)
      document
        .querySelector('body')
        ?.insertAdjacentHTML('afterend', '<div id="kpsapp">hello</div>');
      app.use(Toast);
      app.mount('#kpsapp');
    } catch (error) {
      console.error(error);
    }
  }
  const extension_id = chrome.runtime.id;
  //console.log(extension_id)
  if (!document.getElementById('kps_sticky')) {
    const divele = document.createElement('div');
    divele.style.cssText =
      'position:fixed;top: 50%;right: -6px;z-index:1000000;';
    divele.className = 'kps_sticky';
    divele.id = 'kps_sticky';
    const loaderId = setInterval(async () => {
      if (document.body) {
        clearInterval(loaderId);
        document.body.appendChild(divele);
        $('#kps_sticky').css('left', 'auto');
        $('#kps_sticky').css('right', '0px');
        if (!document.getElementById('kps_append_button')) {
          $('#kps_sticky').append(
            '<img id="kps_append_button" style=" width: 36px; " src="chrome-extension://' +
              extension_id +
              '/sticky.png">' +
              `<div class="kpi-companion-grip" id="kpi-companion-grip"><span aria-label="Move" color="blurple" size="3" class="kpi-companion-e3kwv2"><svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 12a.125.125 0 100-.25.125.125 0 000 .25zm-1.875-.125a1.875 1.875 0 113.75 0 1.875 1.875 0 01-3.75 0zM18.125 12a.125.125 0 100-.25.125.125 0 000 .25zm-1.875-.125a1.875 1.875 0 113.75 0 1.875 1.875 0 01-3.75 0zM5.875 12a.125.125 0 100-.25.125.125 0 000 .25zM4 11.875a1.875 1.875 0 113.75 0 1.875 1.875 0 01-3.75 0z" fill="currentColor"></path></svg></span><span aria-label="Move" color="blurple" size="3" class="kpi-companion-e3kwv2"><svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 12a.125.125 0 100-.25.125.125 0 000 .25zm-1.875-.125a1.875 1.875 0 113.75 0 1.875 1.875 0 01-3.75 0zM18.125 12a.125.125 0 100-.25.125.125 0 000 .25zm-1.875-.125a1.875 1.875 0 113.75 0 1.875 1.875 0 01-3.75 0zM5.875 12a.125.125 0 100-.25.125.125 0 000 .25zM4 11.875a1.875 1.875 0 113.75 0 1.875 1.875 0 01-3.75 0z" fill="currentColor"></path></svg></span></div>`,
          );
          var kps_append_button = document.getElementById('kps_append_button');
          kps_append_button?.addEventListener('click', function () {
            const updated = !prodfileStore.getCEVisible();
            prodfileStore.updateCEVisible(updated);
            if (updated) {
              divele.style.display = 'none';
              chrome.storage.local.set({ kps_sticky: 'hide' });
            }
          });
        }
        const stickyState = await getDataFromStorage('kps_sticky');
        if (stickyState === 'show') {
          divele.style.display = 'flex';
        } else {
          divele.style.display = 'none';
        }

        // Get the draggable element
        const dragElement = document.getElementById('kpi-companion-grip');
        let isDragging = false;
        dragElement?.addEventListener('mousedown', e => {
          offsetX = e.clientX - divele.getBoundingClientRect().left;
          offsetY = e.clientY - divele.getBoundingClientRect().top;
          isDragging = true;
          dragElement.classList.add('dragging');
        });
        document.addEventListener('mousemove', e => {
          if (isDragging && dragElement) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            divele.style.left = `${newX}px`;
            divele.style.top = `${newY}px`;
            $('#kps_sticky').css('right', 'auto');
          }
        });
        document.addEventListener('mouseup', () => {
          if (isDragging && dragElement) {
            isDragging = false;
            dragElement.classList.remove('dragging');
          }
        });
      }
    }, 100);
  }
};

const page = pageType(window.location.href);
if (page === SALES_NAV_SEARCH_PATTERN) {
  checkDetailPage();
}
