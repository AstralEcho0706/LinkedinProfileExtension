import { getCookie, setCookie } from 'typescript-cookie';
export const REGULAR_PROFILE = 'REGULAR_PROFILE';
export const RECRUITER_PROFILE = 'RECRUITER_PROFILE';
export const SALES_PROFILE = 'SALES_PROFILE';
export const LEAD_PROFILE = 'LEAD_PROFILE';
export const REGULAR_COMPANY = 'REGULAR_COMPANY';
export const SALES_COMPANY = 'SALES_COMPANY';
export const SALES_NAV = 'SALES_NAV';
export const FEEDPAGE = 'FEEDPAGE';
export const LINKEDIN_NONE = 'LINKEDIN_NONE';
export const REGULAR_PROFILE_PATTERN = 'linkedin.com/in/';
export const REGULAR_SEARCH_PATTERN = 'linkedin.com/search/results/people/';
export const SALES_NAV_PROFILE_PATTERN = 'linkedin.com/sales/people/';
export const SALES_NAV_LEAD_PROFILE_PATTERN = 'linkedin.com/sales/lead/';
export const SALES_NAV_SEARCH_PATTERN = 'linkedin.com/sales/search/people';
export const SALES_NAV_LIST_PATTERN = 'linkedin.com/sales/lists/people/';
export const SALES_NAV_COMPANY_PATTERN = 'linkedin.com/sales/company/';
export const SALES_NAV_PATTERN = 'linkedin.com/sales/';
export const FEEDPATTERN = 'linkedin.com/feed/';

export const REGULAR_COMPANY_PATTERN = 'linkedin.com/company/';
// export const KompassAI_URL = 'https://master.d2rtvkfs8dx2qd.amplifyapp.com/';
export const KompassAI_URL =
  'https://wc486q4xk0.execute-api.us-east-1.amazonaws.com/dev/';
// 'https://2mva3bjknd.execute-api.us-east-1.amazonaws.com/dev/';

///// Url identify.
export const getIdentity = function (url: string) {
  let identifier = '';
  if (url && url.includes('/in/')) {
    identifier = url.split('in/')[1].split('/')[0];
  }
  if (url && url.includes('/sales/')) {
    const parts = url.split('/');
    let lastPart = parts[parts.length - 1];
    if (!lastPart) {
      lastPart = parts[parts.length - 2];
    }
    identifier = lastPart.split(',')[0];
  }
  return identifier;
};

///// Get Current Date in this format : 2023-07-28
export const getDate = function () {
  const currentDate = new Date();
  const year = currentDate.getFullYear(); // 4-digit year (e.g., 2023)
  const month = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
  const day = currentDate.getDate(); // Day of the month (1 to 31)
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
  // Output: "2023-07-28" (if today is July 28, 2023)
  return formattedDate;
};

///// Get Data(key) from Chrome Storage.
export async function getDataFromStorage(key: any): Promise<string> {
  return new Promise(resolve => {
    chrome.storage.local.get(key, function (items) {
      if (items) resolve(items[key]);
    });
  });
}

export async function removeDataFromStorage(key: any) {
  chrome.storage.local.remove(key, function () {
    console.log('Value removed successfully.', key);
  });
}

///// Set Data(key) to Chrome Storage.
export function setDataToStorage(value: any) {
  chrome.storage.local.set(value);
}

///// Delay time with timeout.
export const delay = async (timeout: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('true');
    }, timeout);
  });
};

///// Delay time
export const waitElement = async (el: any) => {
  for (let index = 0; index < 50; index++) {
    const el1 = document.querySelector(el) as HTMLElement;
    if (el1) {
      break;
    }
    await delay(200);
  }
  const body = document.querySelector(el);
  return body;
};

////// Get Current Page Type.
export const pageType = (url: any) => {
  const profilePattern = new RegExp(REGULAR_PROFILE_PATTERN);
  const salesNavLeadProfilePattern = new RegExp(SALES_NAV_LEAD_PROFILE_PATTERN);
  const salesNavProfilePattern = new RegExp(SALES_NAV_PROFILE_PATTERN);
  const salesNavSearchPattern = new RegExp(SALES_NAV_SEARCH_PATTERN);
  const regularSearchPattern = new RegExp(REGULAR_SEARCH_PATTERN);
  const salesNavListPattern = new RegExp(SALES_NAV_LIST_PATTERN);
  const regularCompany = new RegExp(REGULAR_COMPANY_PATTERN);
  const salesCompany = new RegExp(SALES_NAV_COMPANY_PATTERN);
  const salesNavPattern = new RegExp(SALES_NAV_PATTERN);
  const feedp = new RegExp(FEEDPATTERN);
  // const recruiterProfilePattern = new RegExp(RECRUITER_PROFILE_PATTERN);
  if (profilePattern.test(url)) {
    return REGULAR_PROFILE;
  }
  if (salesNavLeadProfilePattern.test(url)) {
    return LEAD_PROFILE;
  }
  if (salesNavProfilePattern.test(url)) {
    return SALES_PROFILE;
  }
  if (salesNavSearchPattern.test(url)) {
    return SALES_NAV_SEARCH_PATTERN;
  }
  if (salesNavListPattern.test(url)) {
    // let str = url.split('sales/list/people')[1];
    // if (str.length > 1) return SALES_NAV_SEARCH_PATTERN;
    // else return SALES_NAV;
    return SALES_NAV_SEARCH_PATTERN;
  }
  if (regularSearchPattern.test(url)) {
    return REGULAR_SEARCH_PATTERN;
  }
  if (regularCompany.test(url)) {
    return REGULAR_COMPANY;
  }
  if (salesCompany.test(url)) {
    return SALES_COMPANY;
  }
  if (feedp.test(url)) {
    return FEEDPAGE;
  }
  if (salesNavPattern.test(url)) {
    return SALES_NAV;
  }
  // if (recruiterProfilePattern.test(url)) {
  //   return RECRUITER_PROFILE;
  // }
  return LINKEDIN_NONE;
};

///// Remove Http in Url.
function removeHttp(url: any) {
  return url.replace(/^https?:\/\//, '');
}

///// Load Skills
const loadSkills = async function (e: any, prodfileStore: any) {
  const liToken: any = getCookie('JSESSIONID');
  if (!e) {
    return;
  }
  var myHeaders = new Headers();
  myHeaders.append('authority', 'www.linkedin.com');
  myHeaders.append('accept', 'application/vnd.linkedin.normalized+json+2.1');
  myHeaders.append('csrf-token', liToken);
  var myInit = {
    method: 'GET',
    headers: myHeaders,
  };

  e = encodeURIComponent(e);
  var piRequest = new Request(
    `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(profileUrn:${e},sectionType:skills,locale:en_US)&&queryId=voyagerIdentityDashProfileComponents.543467fc9cab5d1d500b2085101defd9`,
  );
  const profileInfo = await fetch(piRequest, myInit);
  let pidt = await profileInfo.json();
  let all_skills: any = [];
  for (let index = 0; index < pidt.included.length; index++) {
    const el = pidt.included[index];
    if (el.entityUrn && el.entityUrn.includes('ALL_SKILLS')) {
      if (
        el.components &&
        el.components.elements &&
        el.components.elements.length > 0
      ) {
        const skills = el.components.elements.map(
          (e: any) => e.components.entityComponent.titleV2.text.text,
        );
        all_skills = [...all_skills, ...skills];
        //console.log({ skills })
        break;
      }
    }
  }
  prodfileStore.updateSkills(all_skills);
};

///// Load Experiences.
const loadExperiences = async function (e: any, prodfileStore: any) {
  if (!e) {
    return;
  }
  const liToken: any = getCookie('JSESSIONID');
  var myHeaders = new Headers();
  myHeaders.append('authority', 'www.linkedin.com');
  myHeaders.append('accept', 'application/vnd.linkedin.normalized+json+2.1');
  myHeaders.append('csrf-token', liToken);
  var myInit = {
    method: 'GET',
    headers: myHeaders,
  };
  e = encodeURIComponent(e);
  var piRequest = new Request(
    `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(profileUrn:${e},sectionType:experience,locale:en_US)&&queryId=voyagerIdentityDashProfileComponents.543467fc9cab5d1d500b2085101defd9`,
  );
  const profileInfo = await fetch(piRequest, myInit);
  let pidt = await profileInfo.json();
  //console.log("pidt - 22", pidt)
  let skills: any = [];
  for (let index = 0; index < pidt.included.length; index++) {
    const el = pidt.included[index];
    if (el.decorationType && el.decorationType.includes('LINE_SEPARATED')) {
      if (
        el.components &&
        el.components.elements &&
        el.components.elements.length > 0
      ) {
        el.components.elements.forEach((e: any) => {
          //console.log(e)
          skills.push({
            title: e.components.entityComponent.titleV2?.text.text,
            caption: e.components.entityComponent.caption?.text,
            subtitle: e.components.entityComponent.subtitle?.text,
            entityUrn:
              e.components.entityComponent.subComponents?.components[0]
                ?.components['*pagedListComponent'],
            companyUrl: e.components.entityComponent.image?.actionTarget,
            companyUrn:
              e.components.entityComponent.image?.attributes[0]?.detailData[
                '*companyLogo'
              ],
          });
        });
      }
    }
  }
  //console.log({ skills })
  skills.forEach((skill: any) => {
    for (let index = 0; index < pidt.included.length; index++) {
      const el = pidt.included[index];
      if (el.entityUrn && el.entityUrn === skill.companyUrn) {
        if (
          el.logoResolutionResult &&
          el.logoResolutionResult.vectorImage &&
          el.logoResolutionResult.vectorImage.artifacts &&
          el.logoResolutionResult.vectorImage.artifacts.length > 0
        ) {
          try {
            const logoUrl =
              el.logoResolutionResult.vectorImage.artifacts[0]
                .fileIdentifyingUrlPathSegment;
            skill.logoUrl =
              el.logoResolutionResult.vectorImage.rootUrl + logoUrl;
          } catch (error) {}
          break;
        }
      }
    }
  });

  let moreExp = false;
  if (skills.length > 0) {
    const filters = skills.filter((e: any) => e.entityUrn);
    if (filters.length > 0) {
      moreExp = true;
    }
  }
  if (moreExp) {
    skills.forEach((skill: any) => {
      for (let index = 0; index < pidt.included.length; index++) {
        const el = pidt.included[index];
        if (el.entityUrn && el.entityUrn === skill.entityUrn) {
          if (
            el.components &&
            el.components.elements &&
            el.components.elements.length > 0
          ) {
            const subSkills = el.components.elements.map((e: any) => {
              return {
                title: e.components.entityComponent.titleV2.text.text,
                caption: e.components.entityComponent.caption?.text,
              };
            });
            skill.subSkills = subSkills;
            break;
          }
        }
      }
    });
  }
  prodfileStore.updateExperiences(skills);
  return skills;
};

///// Get Company Number.
const getCompanyNumber = async function (e: any) {
  const liToken: any = getCookie('JSESSIONID');
  var myHeaders = new Headers();
  myHeaders.append('authority', 'www.linkedin.com');
  myHeaders.append('accept', 'application/vnd.linkedin.normalized+json+2.1');
  myHeaders.append('csrf-token', liToken);
  var myInit = {
    method: 'GET',
    headers: myHeaders,
  };
  e = encodeURIComponent(e);
  var piRequest = new Request(
    `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(universalName:${e})&queryId=voyagerOrganizationDashCompanies.66b63095f5bc90a4972aaa61dd2ea70b`,
  );
  const profileInfo = await fetch(piRequest, myInit);
  let pidt = await profileInfo.json();
  return pidt.included[0].entityUrn.replace('urn:li:fsd_company:', '');
};

///// Load Company.
export const loadCompany = async function (
  companySegment: any,
  prodfileStore: any,
) {
  let companyNumber = 0;
  try {
    companyNumber = await getCompanyNumber(companySegment);
  } catch (error) {}
  if (companyNumber === 0) {
    return;
  }
  try {
    const liToken = getCookie('JSESSIONID') || '';
    var myHeaders = new Headers();
    myHeaders.append('authority', 'www.linkedin.com');
    myHeaders.append('accept', 'application/vnd.linkedin.normalized+json+2.1');
    myHeaders.append('csrf-token', liToken);
    var myInit = {
      method: 'GET',
      headers: myHeaders,
    };
    var myRequest = new Request(
      `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(companyUrns:List(urn%3Ali%3Afsd_company%3A${companyNumber}))&&queryId=voyagerOrganizationDashCompanies.7438df531083f4701db00fd95de5ea57`,
    );
    const result = await fetch(myRequest, myInit);
    const dt = await result.json();
    let entityUrn = 'urn:li:fsd_company:' + companyNumber;
    const ele = dt.included.filter((f: any) => f.entityUrn === entityUrn);
    const cpdt = ele[0];

    // console.log('cpdt ', cpdt)

    let moneyRaised = '',
      moneyRaisedUnits = '',
      cpAbout = '',
      employeeCount = '',
      yearFounded = '',
      industryTags = '',
      country = '',
      countryCode = '',
      cplocation = '',
      inc = '',
      cpUrl,
      companyName = '',
      tagLine = '',
      companyUrl = '',
      specialities = [];
    companyName = cpdt.name;
    tagLine = cpdt.tagline;
    specialities = cpdt.specialities;
    companyUrl = cpdt.url;
    try {
      if (cpdt.websiteUrl) {
        // cpUrl = removeHttp(cpdt.websiteUrl)
        cpUrl = cpdt.websiteUrl;
      }
      cpAbout = cpdt.description;
      employeeCount = cpdt.employeeCount;
      yearFounded = cpdt.foundedOn ? cpdt.foundedOn.year : '';
    } catch (error) {
      console.log(565656, error);
    }

    try {
      var getCountryNames = new Intl.DisplayNames(['en'], {
        type: 'region',
      });
      countryCode = cpdt.headquarter.address.country;
      country = getCountryNames.of(countryCode) || '';
      cplocation = country + ', ' + cpdt.headquarter.address.city;
    } catch (error) {
      //
      // //console.log(323, error);
    }
    try {
      const urm = cpdt['*industryV2Taxonomy'][0];
      console.log(urm, urm);
      const ele1 = dt.included.filter((f: any) => f.entityUrn === urm);
      console.log('ele1', ele1);

      industryTags = ele1[0].name;
    } catch (error) {}

    let logoUrl = '';
    try {
      logoUrl =
        cpdt.logoResolutionResult.vectorImage.artifacts[0]
          .fileIdentifyingUrlPathSegment;
      logoUrl = cpdt.logoResolutionResult.vectorImage.rootUrl + logoUrl;
    } catch (error) {
      console.log(323, error);
    }
    const companyData = {
      cpUrl,
      cpAbout,
      employeeCount,
      industryContent: inc,
      industryTags,
      specialities,
      yearFounded,
      country,
      countryCode,
      companyName,
      tagLine,
      companyUrl,
      headline: '',
      location: '',
      cplocation,
      moneyRaised,
      moneyRaisedUnits,
      employeeCountRange: cpdt.employeeCountRange,
      companyLogo: logoUrl,
    };
    // console.log(23232, companyData);
    prodfileStore.updateCompanyData(companyData);

    loadEmployees(companyNumber, prodfileStore);
  } catch (error) {
    //console.log(326, error)
  }
};

///// Load Company Data with CompanyNumber.
export const loadCompanyData = async function (companyNumber: any) {
  if (!companyNumber) {
    return;
  }
  try {
    const liToken = getCookie('JSESSIONID') || '';
    var myHeaders = new Headers();
    myHeaders.append('authority', 'www.linkedin.com');
    myHeaders.append('accept', 'application/vnd.linkedin.normalized+json+2.1');
    myHeaders.append('csrf-token', liToken);
    var myInit = {
      method: 'GET',
      headers: myHeaders,
    };
    var myRequest = new Request(
      `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(companyUrns:List(urn%3Ali%3Afsd_company%3A${companyNumber}))&&queryId=voyagerOrganizationDashCompanies.7438df531083f4701db00fd95de5ea57`,
    );
    const result = await fetch(myRequest, myInit);
    const dt = await result.json();
    let entityUrn = 'urn:li:fsd_company:' + companyNumber;
    const ele = dt.included.filter((f: any) => f.entityUrn === entityUrn);
    const cpdt = ele[0];
    let moneyRaised = '',
      moneyRaisedUnits = '',
      cpAbout = '',
      employeeCount = '',
      yearFounded = '',
      industryTags = '',
      country = '',
      countryCode = '',
      cplocation = '',
      inc = '',
      cpUrl,
      companyName = '',
      tagLine = '',
      companyUrl = '',
      specialities = [];
    companyName = cpdt.name;
    tagLine = cpdt.tagline;
    specialities = cpdt.specialities;
    companyUrl = cpdt.url;
    try {
      if (cpdt.websiteUrl) {
        cpUrl = cpdt.websiteUrl;
      }
      cpAbout = cpdt.description;
      employeeCount = cpdt.employeeCount;
      yearFounded = cpdt.foundedOn ? cpdt.foundedOn.year : '';
    } catch (error) {
      // console.log(565656, error);
    }
    try {
      var getCountryNames = new Intl.DisplayNames(['en'], {
        type: 'region',
      });
      countryCode = cpdt.headquarter.address.country;
      country = getCountryNames.of(countryCode) || '';
      // console.log('cpdt.headquarter', cpdt.headquarter);
      cplocation = country + ', ' + cpdt.headquarter.address.city;
    } catch (error) {
      // //console.log(323, error);
    }
    try {
      const urm = cpdt['*industryV2Taxonomy'][0];
      // console.log(urm, urm);
      const ele1 = dt.included.filter((f: any) => f.entityUrn === urm);
      // console.log('ele1', ele1);
      industryTags = ele1[0].name;
    } catch (error) {}

    let logoUrl = '';
    try {
      logoUrl =
        cpdt.logoResolutionResult.vectorImage.artifacts[0]
          .fileIdentifyingUrlPathSegment;
      logoUrl = cpdt.logoResolutionResult.vectorImage.rootUrl + logoUrl;
    } catch (error) {
      // console.log(323, error);
    }
    const companyData = {
      cpUrl,
      cpAbout,
      employeeCount,
      industryContent: inc,
      industryTags,
      specialities,
      yearFounded,
      country,
      countryCode,
      companyName,
      tagLine,
      companyUrl,
      cplocation,
      moneyRaised,
      moneyRaisedUnits,
      employeeCountRange: cpdt.employeeCountRange,
      companyLogo: logoUrl,
    };
    return companyData;
  } catch (error) {
    //console.log(326, error)
  }
};

///// Load Profile.
export const loadProfile = async function (
  e: any,
  profileURL: any,
  prodfileStore: any,
) {
  if (!e) e = 0;
  try {
    let profilePhoto = '',
      profileName = '',
      companySegment = '',
      companyName = '',
      profileSegment = '';

    let companyUrl = '';
    let profileUrl = profileURL;
    if (profileURL === '')
      profileUrl = (window.location.host + window.location.pathname).replace(
        'www.',
        '',
      );
    else profileUrl = profileURL.replace('https://www.', '');
    var myHeaders = new Headers();
    myHeaders.append('authority', 'www.linkedin.com');
    myHeaders.append('accept', 'application/vnd.linkedin.normalized+json+2.1');
    const liToken = getCookie('JSESSIONID') || '';
    myHeaders.append('csrf-token', liToken);
    var myInit = {
      method: 'GET',
      headers: myHeaders,
    };
    const companyData = {
      profilePhoto,
      profileName,
      companyName,
      companyUrl,
      profileUrl,
      headline: '',
      location: '',
    };
    if (profileURL === '')
      profileSegment = window.location.pathname.split('in/')[1].split('/')[0];
    else profileSegment = profileUrl.split('in/')[1].split('/')[0];
    let profileUrn = '';
    try {
      if (profileSegment) {
        var piRequest = new Request(
          `https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=${profileSegment}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.WebTopCardCore-6`,
        );
        const profileInfo = await fetch(piRequest, myInit);
        let pidt = await profileInfo.json();
        // console.log("99, pidt ", pidt)
        let headLine = '',
          location = '';
        let decodedProfileSegment = decodeURIComponent(profileSegment);
        for (let index = 0; index < pidt.included.length; index++) {
          const el = pidt.included[index];
          if (
            Object.keys(el).includes('publicIdentifier') &&
            el.publicIdentifier === decodedProfileSegment
          ) {
            // console.log(' fine ', el)
            profileName = el.firstName + ' ' + el.lastName;
            headLine = el.headline;
            location = el.geoLocation.geoUrn;
            profileUrn = el.entityUrn;
            try {
              profilePhoto =
                el.profilePicture.displayImageReference.vectorImage.rootUrl +
                el.profilePicture.displayImageReference.vectorImage.artifacts[1]
                  .fileIdentifyingUrlPathSegment;
            } catch (error) {}
            break;
          }
        }
        // console.log("headLine", headLine)
        if (location) {
          for (let index = 0; index < pidt.included.length; index++) {
            const el = pidt.included[index];
            if (
              Object.keys(el).includes('entityUrn') &&
              el.entityUrn === location
            ) {
              location = el.defaultLocalizedName;
              break;
            }
          }
        }
        // console.log("loc", location)
        companyData.headline = headLine;
        companyData.location = location;
        companyData.profileName = profileName;
        companyData.profilePhoto = profilePhoto;
        prodfileStore.updateCompanyData({ ...companyData });
      }
    } catch (error) {
      // console.log(325, error);
    }
    try {
      await loadSkills(profileUrn, prodfileStore);
    } catch (error) {}
    try {
      const exps = await loadExperiences(profileUrn, prodfileStore);
      if (exps.length > 0) {
        if (exps[0].subtitle.indexOf(' · ') > -1)
          companyName = exps[0].subtitle.split(' · ')[0];
        else companyName = exps[0].subtitle;
        companyUrl = exps[0].companyUrl;
        companyData.companyUrl = companyUrl;
        companyData.companyName = companyName;
      }
    } catch (error) {
      console.log('error', error);
    }
    companySegment =
      new URL(companyUrl).pathname.split('/').filter(Boolean).pop() || '';
    // console.log(11, companyData)
    prodfileStore.updateCompanyData(companyData);
    // console.log(' ------ 1 --------- ')
    if (companySegment && liToken && !companySegment.includes('all')) {
      // console.log(1111111)
      try {
        var myRequest = new Request(
          `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(companyUrns:List(urn%3Ali%3Afsd_company%3A${companySegment}))&&queryId=voyagerOrganizationDashCompanies.7438df531083f4701db00fd95de5ea57`,
        );
        const result = await fetch(myRequest, myInit);
        const dt = await result.json();
        // console.log('dt ', dt)
        let entityUrn = 'urn:li:fsd_company:' + companySegment;
        const ele = dt.included.filter((f: any) => f.entityUrn === entityUrn);
        const cpdt = ele[0];
        // console.log('cpdt ', cpdt)
        companyName = cpdt.name;
        let moneyRaised = '',
          moneyRaisedUnits = '',
          cpAbout = '',
          employeeCount = '',
          yearFounded = '',
          industryTags = '',
          country = '',
          countryCode = '',
          cplocation = '',
          inc = '',
          cpUrl;
        try {
          if (cpdt.websiteUrl) {
            cpUrl = removeHttp(cpdt.websiteUrl);
          }
          cpAbout = cpdt.description;

          employeeCount = cpdt.employeeCount;
          yearFounded = cpdt.foundedOn ? cpdt.foundedOn.year : '';
        } catch (error) {
          // console.log(565656, error);
        }

        try {
          var getCountryNames = new Intl.DisplayNames(['en'], {
            type: 'region',
          });
          countryCode = cpdt.headquarter.address.country;
          country = getCountryNames.of(countryCode) || '';
          cplocation = country + ', ' + cpdt.headquarter.address.city;
        } catch (error) {
          //
          // console.log(323, error);
        }

        let logoUrl = '';
        try {
          logoUrl =
            cpdt.logoResolutionResult.vectorImage.artifacts[0]
              .fileIdentifyingUrlPathSegment;
          logoUrl = cpdt.logoResolutionResult.vectorImage.rootUrl + logoUrl;
        } catch (error) {
          // console.log(666, { error });
        }
        // console.log(666, { logoUrl })
        const companyData = {
          cpUrl,
          cpAbout,
          employeeCount,
          industryContent: inc,
          industryTags,
          yearFounded,
          country,
          countryCode,
          profilePhoto,
          profileName,
          companyName,
          companyUrl,
          profileUrl,
          headline: '',
          location: '',
          cplocation,
          moneyRaised,
          moneyRaisedUnits,
          employeeCountRange: cpdt.employeeCountRange,
          companyLogo: logoUrl,
        };
        prodfileStore.updateCompanyData(companyData);
      } catch (error) {
        // console.log(326, error)
      }
    }
  } catch (error) {
    console.error(error);
  }
};

///// Load Profile From NAVSearch.
export const loadProfileFromNAVSearch = async function (identity: any) {
  try {
    const liToken = getCookie('JSESSIONID') || '';

    var myHeaders = new Headers();
    myHeaders.append('authority', 'www.linkedin.com');
    myHeaders.append('accept', 'application/vnd.linkedin.normalized+json+2.1');
    myHeaders.append('csrf-token', liToken);
    myHeaders.append('x-restli-protocol-version', '2.0.0');
    var myInit = {
      method: 'GET',
      headers: myHeaders,
    };
    var myRequest = new Request(
      `https://www.linkedin.com/sales-api/salesApiProfiles/(profileId:${identity},authType:name)?decoration=%28entityUrn%2CobjectUrn%2CfirstName%2ClastName%2CfullName%2Cheadline%2CcontactInfo%2CcrmStatus%2CpendingInvitation%2Cunlocked%2CflagshipProfileUrl%2CnumOfConnections%2CnumOfSharedConnections%29`,
    );
    const result = await fetch(myRequest, myInit);
    const pidt = await result.json();
    // console.log('load profile - ', pidt)
    return pidt.data;
  } catch (error) {
    console.log('error ', error);
  }
};
export const loadSaleNavProfile = async (identity: any) => {
  let profilePhoto = '',
    profileName = '',
    profileUrl = '',
    defaultCompanyUrn = '',
    companyName = '',
    companyUrl = '',
    headline = '',
    companyData;
  const liToken = getCookie('JSESSIONID') || '';
  try {
    var myHeaders = new Headers();
    myHeaders.append('authority', 'www.linkedin.com');
    myHeaders.append('accept', 'application/vnd.linkedin.normalized+json+2.1');
    myHeaders.append('csrf-token', liToken);
    myHeaders.append('x-restli-protocol-version', '2.0.0');
    var myInit = {
      method: 'GET',
      headers: myHeaders,
    };
    var myRequest = new Request(
      `https://www.linkedin.com/sales-api/salesApiProfiles/(profileId:${identity},authType:name)?decoration=%28entityUrn%2CobjectUrn%2CprofilePictureDisplayImage%2CfirstName%2ClastName%2CfullName%2Cheadline%2CmemberBadges%2ClatestTouchPointActivity%2Cpronoun%2Cdegree%2CprofileUnlockInfo%2Clocation%2ClistCount%2Csummary%2CsavedLead%2CdefaultPosition%2CcontactInfo%2CcrmStatus%2CpendingInvitation%2Cunlocked%2CflagshipProfileUrl%2CfullNamePronunciationAudio%2Cmemorialized%2CnumOfConnections%2CnumOfSharedConnections%2CshowTotalConnectionsPage%2Cpositions*%28companyName%2Ccurrent%2Cnew%2Cdescription%2CendedOn%2CposId%2CstartedOn%2Ctitle%2Clocation%2CrichMedia*%2CcompanyUrn~fs_salesCompany%28entityUrn%2Cname%2CcompanyPictureDisplayImage%2Cwebsite%2CflagshipCompanyUrl%29%29%2CcrmManualMatched%2Cskills*%29`,
    );
    const result = await fetch(myRequest, myInit);
    const pidt = await result.json();
    // console.log('load sales profile - ', pidt)
    const data = pidt.data;
    profileUrl = data.flagshipProfileUrl;
    profileName = data.fullName;
    headline = data.headline;
    try {
      companyName = data.defaultPosition.companyName;

      defaultCompanyUrn = data.defaultPosition.companyUrn.replace(
        'urn:li:fs_salesCompany:',
        '',
      );

      // console.log(90909, defaultCompanyUrn)
      companyUrl =
        'https://www.linkedin.com/sales/company/' + defaultCompanyUrn;
    } catch (error) {}
    profilePhoto =
      data.profilePictureDisplayImage.artifacts[1]
        .fileIdentifyingUrlPathSegment;

    companyData = {
      profilePhoto,
      profileName,
      companyName,
      headline,
      profileUrl,
      companyUrl,
    };
    if (defaultCompanyUrn) {
      try {
        var myHeaders = new Headers();
        myHeaders.append('authority', 'www.linkedin.com');
        myHeaders.append(
          'accept',
          'application/vnd.linkedin.normalized+json+2.1',
        );
        myHeaders.append('csrf-token', liToken);
        myHeaders.append('x-restli-protocol-version', '2.0.0');
        var myInit = {
          method: 'GET',
          headers: myHeaders,
        };
        var myRequest = new Request(
          `https://www.linkedin.com/sales-api/salesApiCompanies/${defaultCompanyUrn}?decoration=%28entityUrn%2Cname%2Caccount%28saved%2CnoteCount%2ClistCount%2CcrmStatus%2Cstarred%29%2CpictureInfo%2CcompanyPictureDisplayImage%2Cdescription%2Cindustry%2Clocation%2Cheadquarters%2Cwebsite%2CrevenueRange%2CcrmOpportunities%2CflagshipCompanyUrl%2Cspecialties%2Ctype%2CyearFounded%2CemployeeDisplayCount%29`,
        );
        const result = await fetch(myRequest, myInit);
        const pidt = await result.json();
        const data = pidt.data;
        let photo = '';
        try {
          photo =
            data.companyPictureDisplayImage.rootUrl +
            data.companyPictureDisplayImage.artifacts[0]
              .fileIdentifyingUrlPathSegment;
        } catch (error) {}
        companyData = {
          ...companyData,
          cpUrl: data.website,
          cpAbout: data.description,
          companyName: data.name,
          employeeCount: data.employeeDisplayCount,
          industryContent: data.industry,
          yearFounded: data.yearFounded,
          companyLogo: photo,
          cplocation: data.location,
          companyUrl,
        };
      } catch (error) {}
    }
  } catch (error) {}
  return companyData;
};
///// Load Sales Profile Data.
export const loadSalesProfile = async function (
  e: any,
  profileURL: any,
  prodfileStore: any,
) {
  const liToken = getCookie('JSESSIONID') || '';

  let profilePhoto = '',
    profileName = '',
    profileUrl = '',
    defaultCompanyUrn = '',
    companyName = '',
    companyUrl = '';
  let headline = '';
  let skills = [];

  try {
    const url = profileURL === '' ? window.location.href : profileURL;
    const parts = url.split('/');
    let lastPart = parts[parts.length - 1];
    if (!lastPart) {
      lastPart = parts[parts.length - 2];
    }
    const identity = lastPart.split(',')[0];
    console.log('identity', identity);

    try {
      var myHeaders = new Headers();
      myHeaders.append('authority', 'www.linkedin.com');
      myHeaders.append(
        'accept',
        'application/vnd.linkedin.normalized+json+2.1',
      );
      myHeaders.append('csrf-token', liToken);
      myHeaders.append('x-restli-protocol-version', '2.0.0');
      var myInit = {
        method: 'GET',
        headers: myHeaders,
      };
      var myRequest = new Request(
        `https://www.linkedin.com/sales-api/salesApiProfiles/(profileId:${identity},authType:name)?decoration=%28entityUrn%2CobjectUrn%2CprofilePictureDisplayImage%2CfirstName%2ClastName%2CfullName%2Cheadline%2CmemberBadges%2ClatestTouchPointActivity%2Cpronoun%2Cdegree%2CprofileUnlockInfo%2Clocation%2ClistCount%2Csummary%2CsavedLead%2CdefaultPosition%2CcontactInfo%2CcrmStatus%2CpendingInvitation%2Cunlocked%2CflagshipProfileUrl%2CfullNamePronunciationAudio%2Cmemorialized%2CnumOfConnections%2CnumOfSharedConnections%2CshowTotalConnectionsPage%2Cpositions*%28companyName%2Ccurrent%2Cnew%2Cdescription%2CendedOn%2CposId%2CstartedOn%2Ctitle%2Clocation%2CrichMedia*%2CcompanyUrn~fs_salesCompany%28entityUrn%2Cname%2CcompanyPictureDisplayImage%2Cwebsite%2CflagshipCompanyUrl%29%29%2CcrmManualMatched%2Cskills*%29`,
      );
      const result = await fetch(myRequest, myInit);
      const pidt = await result.json();
      // console.log('load sales profile - ', pidt)
      const data = pidt.data;
      const included = pidt.included;
      profileUrl = data.flagshipProfileUrl;
      profileName = data.fullName;
      headline = data.headline;
      try {
        companyName = data.defaultPosition.companyName;
        defaultCompanyUrn = data.defaultPosition.companyUrn.replace(
          'urn:li:fs_salesCompany:',
          '',
        );
        // console.log(90909, defaultCompanyUrn)
        companyUrl =
          'https://www.linkedin.com/sales/company/' + defaultCompanyUrn;
      } catch (error) {}
      profilePhoto =
        data.profilePictureDisplayImage.artifacts[1]
          .fileIdentifyingUrlPathSegment;
      skills = data.skills.map((skill: any) => skill.name);
      const positions = data.positions;
      let exps: any = [];
      function numToShortMonthName(num: any) {
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        if (num >= 1 && num <= 12) {
          return months[num - 1];
        } else {
          return '';
        }
      }
      positions.forEach((position: any) => {
        const companyItem = included.filter(
          (e: any) => e.entityUrn === position.companyUrn,
        );
        let photo = '',
          website = '',
          regularCompany = '',
          companyName1 = '',
          companyUrl1 = '',
          companyUrn = position.companyUrn;
        try {
          if (companyItem.length > 0) {
            photo =
              companyItem[0].companyPictureDisplayImage.rootUrl +
              companyItem[0].companyPictureDisplayImage.artifacts[0]
                .fileIdentifyingUrlPathSegment;
          }
        } catch (error) {}
        try {
          companyUrl1 =
            'https://www.linkedin.com/sales/company/' +
            position.companyUrn.replace('urn:li:fs_salesCompany:', '');
        } catch (error) {}
        try {
          companyName1 = companyItem[0].name;
          website = companyItem[0].website;
          regularCompany = companyItem[0].flagshipCompanyUrl;
        } catch (error) {}
        let endDAta = 'Current',
          employ_date = '',
          caption = '';
        try {
          endDAta = position.current
            ? 'Present'
            : numToShortMonthName(position.endedOn.month) +
              ' ' +
              position.endedOn.year;
        } catch (error) {}
        try {
          endDAta = position.current
            ? 'Present'
            : numToShortMonthName(position.endedOn.month) +
              ' ' +
              position.endedOn.year;
          caption =
            numToShortMonthName(position.startedOn.month) +
            ' ' +
            position.startedOn.year +
            ' - ' +
            endDAta;
          employ_date =
            numToShortMonthName(position.startedOn.month) +
            ' ' +
            position.startedOn.year;
        } catch (error) {}

        exps.push({
          title: position.title,
          subtitle: position.companyName,
          logoUrl: photo,
          current: position.current,
          companyUrl: companyUrl1,
          position,
          caption,
          employ_date,
          website,
          companyUrn,
          regularCompany,
          companyName: companyName1,
        });
      });
      const groupedData = exps.reduce((acc: any, obj: any) => {
        const key = obj.subtitle;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
      const reorderedArray = Object.values(groupedData).flat();
      prodfileStore.updateExperiences(reorderedArray);
      // prodfileStore.updateCompanyData(companyData)
    } catch (error) {
      console.log('error ', error);
    }
    const companyData = {
      profilePhoto,
      profileName,
      companyName,
      headline,
      profileUrl,
      companyUrl,
    };
    prodfileStore.updateCompanyData({ ...companyData });
    prodfileStore.updateSkills(skills);
    if (defaultCompanyUrn) {
      try {
        var myHeaders = new Headers();
        myHeaders.append('authority', 'www.linkedin.com');
        myHeaders.append(
          'accept',
          'application/vnd.linkedin.normalized+json+2.1',
        );
        myHeaders.append('csrf-token', liToken);
        myHeaders.append('x-restli-protocol-version', '2.0.0');
        var myInit = {
          method: 'GET',
          headers: myHeaders,
        };
        var myRequest = new Request(
          `https://www.linkedin.com/sales-api/salesApiCompanies/${defaultCompanyUrn}?decoration=%28entityUrn%2Cname%2Caccount%28saved%2CnoteCount%2ClistCount%2CcrmStatus%2Cstarred%29%2CpictureInfo%2CcompanyPictureDisplayImage%2Cdescription%2Cindustry%2Clocation%2Cheadquarters%2Cwebsite%2CrevenueRange%2CcrmOpportunities%2CflagshipCompanyUrl%2Cspecialties%2Ctype%2CyearFounded%2CemployeeDisplayCount%29`,
        );
        const result = await fetch(myRequest, myInit);
        const pidt = await result.json();
        const data = pidt.data;
        let photo = '';
        try {
          photo =
            data.companyPictureDisplayImage.rootUrl +
            data.companyPictureDisplayImage.artifacts[0]
              .fileIdentifyingUrlPathSegment;
        } catch (error) {}
        const companyData = {
          cpUrl: data.website,
          cpAbout: data.description,
          companyName: data.name,
          employeeCount: data.employeeDisplayCount,
          industryContent: data.industry,
          yearFounded: data.yearFounded,
          companyLogo: photo,
          cplocation: data.location,
          companyUrl,
        };
        prodfileStore.updateCompanyData(companyData);
      } catch (error) {
        console.log('error ', error);
      }
    }
  } catch (error) {
    console.log('error ', error);
  }
};

///// Load Employees Data.
export const loadEmployees = async (e: any, prodfileStore: any) => {
  const liToken: any = getCookie('JSESSIONID');
  var myHeaders = new Headers();
  myHeaders.append('authority', 'www.linkedin.com');
  myHeaders.append('accept', '*/*');
  myHeaders.append('csrf-token', liToken);
  myHeaders.append('x-restli-protocol-version', '2.0.0');
  var myInit = {
    method: 'GET',
    headers: myHeaders,
  };
  const myRequest = new Request(
    `https://www.linkedin.com/voyager/api/graphql?variables=(start:0,origin:FACETED_SEARCH,query:(flagshipSearchIntent:ORGANIZATIONS_PEOPLE_ALUMNI,queryParameters:List((key:currentCompany,value:List(${e})),(key:resultType,value:List(ORGANIZATION_ALUMNI))),includeFiltersInResponse:true),count:12)&queryId=voyagerSearchDashClusters.4e3a683a1f4fe74a332a91483895e031`,
    myInit,
  );
  const result = await fetch(myRequest, myInit);
  const data = await result.json();
  console.log({ result: data });

  return data;
};

///// Load Sales Company Data.
export const loadSalesCompany = async function (e: any, prodfileStore: any) {
  const liToken: any = getCookie('JSESSIONID');
  var myHeaders = new Headers();
  myHeaders.append('authority', 'www.linkedin.com');
  myHeaders.append('accept', '*/*');
  myHeaders.append('csrf-token', liToken);
  myHeaders.append('x-restli-protocol-version', '2.0.0');
  var myInit = {
    method: 'GET',
    headers: myHeaders,
  };
  const myRequest = new Request(
    `https://www.linkedin.com/sales-api/salesApiCompanies/${e}?decoration=%28entityUrn%2Cname%2Caccount%28saved%2CnoteCount%2ClistCount%2CcrmStatus%2Cstarred%29%2CpictureInfo%2CcompanyPictureDisplayImage%2Cdescription%2Cindustry%2Clocation%2Cheadquarters%2Cwebsite%2CrevenueRange%2CcrmOpportunities%2CemployeeCountInfo%2CflagshipCompanyUrl%2CemployeeGrowthPercentages%2Cemployees*~fs_salesProfile%28entityUrn%2CfirstName%2ClastName%2CfullName%2Cheadline%2CflagshipProfileUrl%2Cskills*%2Clocation%2CpictureInfo%2CprofilePictureDisplayImage%29%2Cspecialties%2Ctype%2CyearFounded%29`,
    myInit,
  );
  const result = await fetch(myRequest, myInit);
  const data = await result.json();
  let moneyRaised = '',
    moneyRaisedUnits = '',
    cpAbout = '',
    employeeCount = '',
    yearFounded = '',
    industryTags = '',
    country = '',
    countryCode = '',
    cplocation = '',
    inc = '',
    cpUrl,
    companyName = '',
    tagLine = '',
    companyUrl = '',
    specialities: any = [],
    employees: any = [];

  cpAbout = data.description;
  industryTags = data.industry;
  specialities = data.specialties;
  cpUrl = data.flagshipCompanyUrl;
  companyUrl = data.website;
  yearFounded = data.yearFounded;
  country = data.headquarters.country;
  cplocation = data.location;
  companyName = data.name;
  employeeCount = data.employeeCountInfo?.employeeCount;
  try {
    for (const key in data.employeesResolutionResults) {
      const element = data.employeesResolutionResults[key];
      let skills: any = [];
      try {
        skills = element.skills.map((e: any) => e.name).slice(0, 5);
      } catch (error) {}
      employees.push({
        name: element.fullName,
        headline: element.headline,
        skills,
        photo:
          element.profilePictureDisplayImage?.artifacts[0]
            .fileIdentifyingUrlPathSegment,
        profileUrl: element.flagshipProfileUrl,
        location: element.location,
      });
    }
  } catch (error) {}
  let companyLogo = '';
  try {
    companyLogo =
      data.companyPictureDisplayImage.rootUrl +
      data.companyPictureDisplayImage.artifacts[0]
        .fileIdentifyingUrlPathSegment;
  } catch (error) {}

  const companyData = {
    cpUrl,
    cpAbout,
    employeeCount,
    industryContent: data.industryTags,
    industryTags,
    specialities,
    yearFounded,
    country,
    countryCode,
    companyName,
    tagLine,
    companyUrl,
    headline: '',
    location: '',
    cplocation,
    moneyRaised,
    moneyRaisedUnits,
    employeeCountRange: '',
    companyLogo,
    employees,
  };
  // console.log(23232, companyData);
  prodfileStore.updateCompanyData(companyData);
};

///// deep search info func.
export const getDeepSearchInfo = async (
  id: any,
  linkedinUrl: any,
  endPoint: any,
) => {
  const token = await getDataFromStorage('idToken');
  var raw = JSON.stringify({
    inputs: [
      {
        adaptId: '57c4f798e4b0fc2acf1c92b9',
        url: 'linkedin.com/in/adamderry1',
      },
    ],
  });
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  console.log(`${KompassAI_URL}${endPoint}`);
  const result = await fetch(`${KompassAI_URL}${endPoint}`, requestOptions);
  const dt = await result.json();
  console.log('utils dt---------->', dt);
  return dt;
};

///// Reveal info func.
export const getRevealInfo = async (id: any, endPoint: any) => {
  console.log('sw.tw success!');
  const token = await getDataFromStorage('idToken');
  var raw = JSON.stringify({
    inputs: [{ profileId: id }],
  });
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  console.log(`${KompassAI_URL}${endPoint}`);
  const result = await fetch(`${KompassAI_URL}${endPoint}`, requestOptions);
  const dt = await result.json();
  console.log('return success!');
  return dt;
};

///// Upload person.
export const uploadPerson = async (raw: any) => {
  const token = await getDataFromStorage('idToken');
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  const result = await fetch(
    `${KompassAI_URL}live_search/upload/person`,
    requestOptions,
  );
  const dt = await result.json();
  return dt;
};

///// Get list API CALL.
export const getList = async () => {
  // console.log('getList --- ')
  const token = await getDataFromStorage('idToken');
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  const result = await fetch(
    `${KompassAI_URL}list?listType=chromeExt`,
    requestOptions,
  );
  const dt = await result.json();
  return dt;
};

///// Create a list.
export const createList = async (listName: any) => {
  const token = await getDataFromStorage('idToken');
  var raw = JSON.stringify({
    listTitle: listName,
    listType: 'chromeExt',
  });
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
  };
  const result = await fetch(`${KompassAI_URL}list`, requestOptions);
  const dt = await result.json();
  return dt;
};

///// Saving contacts.
export const saveContact = async (listTitle: any, profileIds: any) => {
  const token = await getDataFromStorage('idToken');
  const raw = JSON.stringify({
    listTitle: listTitle,
    profileIds: [profileIds],
  });
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  const result = await fetch(
    `${KompassAI_URL}live_search/save/chromeExt`,
    requestOptions,
  );
  const dt = await result.json();
  return dt;
};
///// Saving several contacts.
export const saveMultiContact = async (listTitle: any, profileIds: any[]) => {
  const token = await getDataFromStorage('idToken');
  const raw = JSON.stringify({
    listTitle: listTitle,
    profileIds: profileIds,
  });
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  const result = await fetch(
    `${KompassAI_URL}live_search/save/chromeExt`,
    requestOptions,
  );
  const dt = await result.json();
  return dt;
};

///// Saving several contacts.
export const saveToCRMContact = async (type: any, profileIds: any[]) => {
  const token = await getDataFromStorage('idToken');
  const raw = JSON.stringify({
    ids: profileIds,
  });

  let url = `${KompassAI_URL}salesforce/v2/data?pushMethod=contacts&profileType=extension`;
  if (type === 'hubspot') {
    url = `${KompassAI_URL}hubspot/data?profileType=extension&pushMethod=contacts`;
  }
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  try {
    const result = await fetch(url, requestOptions);
    console.log(result);
    if (result.status == 200) {
      const dt = await result.json();
      return dt;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

///// Upload salesNav data.
export const saveSalesNav = async (profiles: any) => {
  const token = await getDataFromStorage('idToken');
  const raw = JSON.stringify({
    profiles: profiles,
  });
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  const result = await fetch(
    `${KompassAI_URL}live_search/upload/salesNav`,
    requestOptions,
  );
  const dt = await result.json();
  return dt;
};

///// Upload salesNav data.
export const contactLoadAPI = async (id: any) => {
  const token = await getDataFromStorage('idToken');
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  const result = await fetch(`${KompassAI_URL}list/${id}`, requestOptions);
  const dt = await result.json();
  return dt;
};

///// Save favourite.
export const saveFavourite = async (raw: any) => {
  const token = await getDataFromStorage('idToken');
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  const result = await fetch(
    `${KompassAI_URL}kompass_search/favorite`,
    requestOptions,
  );
  const dt = await result.json();
  return dt;
};

///// Get list API CALL.
export const getFavourites = async () => {
  const token = await getDataFromStorage('idToken');
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  const result = await fetch(
    `${KompassAI_URL}kompass_search/favorite`,
    requestOptions,
  );
  const dt = await result.json();
  return dt;
};

///// Sned Install Api.
export const sendInstallRequest = async () => {
  const token = await getDataFromStorage('idToken');
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  const result = await fetch(`${KompassAI_URL}crx/install`, requestOptions);
};

///// Sned Install Api.
export const sendUninstallRequest = async () => {
  const token = await getDataFromStorage('idToken');
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  const result = await fetch(`${KompassAI_URL}crx/uninstall`, requestOptions);

  const blob = new Blob([], { type: 'text/csv' });

  // Create a download link
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'data.csv';

  // Trigger download
  downloadLink.click();
};
///// Get Credits by User.
export const getCredits = async () => {
  const token = await getDataFromStorage('idToken');
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  const result = await fetch(
    `${KompassAI_URL}credits/getUserCredits`,
    requestOptions,
  );
  const dt = await result.json();
  return dt;
};
