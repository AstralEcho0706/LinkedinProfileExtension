console.log(' service worker ');
import {
  pageType,
  LINKEDIN_NONE,
  getRevealInfo,
  uploadPerson,
  getDeepSearchInfo,
  sendUninstallRequest,
  setDataToStorage,
} from './utils/utils';
const isLinkedin = (url: any) => {
  const profilePattern = new RegExp('linkedin.com/');
  return profilePattern.test(url);
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log('0999', changeInfo);

  try {
    if (tab.url && pageType(tab.url) === LINKEDIN_NONE) {
      chrome.tabs.sendMessage(tabId, {
        type: 'tabChanged',
        place: LINKEDIN_NONE,
      });
    }
    if (isLinkedin(tab.url) && changeInfo.status == 'complete') {
      console.log(tabId, pageType(tab.url));
      let needsToSend = true;
      if (tab.url && tab.url.includes('details/')) {
        needsToSend = false;
      }
      if (tab.url && tab.url.includes('recent-activity/')) {
        needsToSend = false;
      }
      if (needsToSend) {
        chrome.tabs.sendMessage(tabId, {
          type: 'tabChanged',
          place: pageType(tab.url),
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

chrome.runtime.onMessage.addListener(async function (msg, sender) {
  console.log(msg.type);

  if (msg.type === 'saleNavScrapingStart') {
    //@ts-ignore
    chrome.tabs.sendMessage(sender?.tab?.id, {
      action: 'saleNavScrapingStart',
      jobChangesInclude: msg.jobChanges,
    });
  }
  if (msg.type === 'checkingDetails') {
    //@ts-ignore
    chrome.tabs.sendMessage(sender?.tab?.id, {
      action: 'checkingDetails',
    });
  }
  if (msg.type === 'uploadPerson') {
    const personSaved = await uploadPerson(msg.dataToSave);
    console.log(personSaved);
    if (
      personSaved &&
      personSaved.status &&
      personSaved.data &&
      personSaved.data._id
    ) {
      const dt = await getRevealInfo(personSaved.data._id, msg.endPoint);
      //@ts-ignore
      chrome.tabs.sendMessage(sender?.tab?.id, {
        action: 'gotRevealInfo',
        dt,
      });
    } else {
      //@ts-ignore
      chrome.tabs.sendMessage(sender?.tab?.id, {
        action: 'gotRevealInfo',
        status: false,
      });
    }
  }
  if (msg.type === 'uploadSrappedPerson') {
    const personSaved = await uploadPerson(msg.dataToSave);
    if (
      personSaved &&
      personSaved.status &&
      personSaved.data &&
      personSaved.data._id
    ) {
      const dt = await getRevealInfo(personSaved.data._id, msg.endPoint);
      //@ts-ignore
      chrome.tabs.sendMessage(sender?.tab?.id, {
        action: 'gotSrappedRevealInfo',
        dt,
        idex: msg.idex,
      });
    } else {
      //@ts-ignore
      chrome.tabs.sendMessage(sender?.tab?.id, {
        action: 'gotSrappedRevealInfo',
        status: false,
      });
    }
  }
  if (msg.type === 'deepSearchSrappedPerson') {
    console.log('sw.tw success!');
    const personSaved = await uploadPerson(msg.dataToSave);
    console.log(personSaved);
    if (
      personSaved &&
      personSaved.status &&
      personSaved.data &&
      personSaved.data._id
    ) {
      const dt = await getDeepSearchInfo(
        personSaved.data._id,
        msg.linkedInUrl,
        msg.endPoint,
      );
      console.log('sw.ts msg.endpoint------>', msg.endPoint);
      console.log('sw.ts dt------>', dt);

      //@ts-ignore
      chrome.tabs.sendMessage(sender?.tab?.id, {
        action: 'gotSrappedRevealInfo',
        dt,
        idex: msg.idex,
      });
    } else {
      //@ts-ignore
      chrome.tabs.sendMessage(sender?.tab?.id, {
        action: 'gotSrappedRevealInfo',
        status: false,
      });
    }
  }
  if (msg.type === 'uploadSavedPerson') {
    const personSaved = await uploadPerson(msg.dataToSave);

    if (
      personSaved &&
      personSaved.status &&
      personSaved.data &&
      personSaved.data._id
    ) {
      const dt = await getRevealInfo(personSaved.data._id, msg.endPoint);
      //@ts-ignore
      chrome.tabs.sendMessage(sender?.tab?.id, {
        action: 'gotSavedRevealInfo',
        dt,
        endpoint: msg.endPoint,
        personSaved,
      });
    } else {
      //@ts-ignore
      chrome.tabs.sendMessage(sender?.tab?.id, {
        action: 'gotSavedRevealInfo',
        status: false,
      });
    }
  }
  if (msg.type === 'uploadHistoryPerson') {
    const personSaved = await uploadPerson(msg.dataToSave);

    if (
      personSaved &&
      personSaved.status &&
      personSaved.data &&
      personSaved.data._id
    ) {
      const dt = await getRevealInfo(personSaved.data._id, msg.endPoint);
      //@ts-ignore
      chrome.tabs.sendMessage(sender?.tab?.id, {
        action: 'gotHistoryRevealInfo',
        dt,
      });
    } else {
      //@ts-ignore
      chrome.tabs.sendMessage(sender?.tab?.id, {
        action: 'gotHistoryRevealInfo',
        status: false,
      });
    }
  }
});

chrome.runtime.onInstalled.addListener(async function () {
  await setDataToStorage({ installed: true });

  // Investigate tabs, if there are kompassai search pages, inject kompassContent.ts to that.
  chrome.tabs.query({ url: "https://master.d2rtvkfs8dx2qd.amplifyapp.com/search" }, function (tabs) {
    tabs.forEach(tab => {
      chrome.tabs.reload(tab.id as number);
    });
  });

});

// chrome.runtime.onSuspend.addListener(async function () {
//   console.log('Extension is being uninstalled.');
//   alert('Uninstall');
//   await sendUninstallRequest();
//   // Perform cleanup or any necessary actions here
// });

chrome.runtime.setUninstallURL(`https://kompassai.com/`, sendUninstallRequest);
