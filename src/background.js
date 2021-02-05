'use strict';

// https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome#answer-13348618
const isChromium = window.chrome !== null;
const vendorName = window.navigator.vendor;
const isNotOpera = typeof window.opr === 'undefined';
const isNotFirefox = typeof InstallTrigger === 'undefined';

// https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
const validProtocolRegex = new RegExp('^(http|https):$');
const validHostnameRegex = new RegExp('^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$');
const validIpAddressRegex = new RegExp('^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
const validPortRegex = new RegExp('^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$');

function clearData() {
  try {
    // Get user settings for what data to clear
    chrome.storage.sync.get({
      'cookiesSetting': true,
      'localStorageSetting': true,
      'cacheSetting': true,
      'sessionStorageSetting': true,
      'indexedDBSetting': true
    }, function(userPrefs) {
      const userDisabledAllSettings = userPrefs['cookiesSetting'] !== false ||
        userPrefs['localStorageSetting'] !== false ||
        userPrefs['cacheSetting'] !== false ||
        userPrefs['sessionStorageSetting'] !== false ||
        userPrefs['indexedDBSetting'] !== false;

      if (userDisabledAllSettings) {
        // Get user's current url
        chrome.tabs.query({
          active: true,
          currentWindow: true,
        }, function(tabsArray) {
          const currentTabObj = tabsArray[0];
          try {
            const currentTabURL = new URL(currentTabObj.url);

            // https://en.wikipedia.org/wiki/List_of_URI_schemes
            // Assumption: Only URI schemes, http or https, are able to set cookies, items in localStorage, etc.
            const isValidProtocol = currentTabURL.protocol.match(validProtocolRegex);
            const isValidHostname = currentTabURL.hostname.match(validHostnameRegex) || currentTabURL.hostname.match(validIpAddressRegex);
            const isValidPort = currentTabURL.port === '' || currentTabURL.port.match(validPortRegex);
            // Origin is defined as a combination of a valid protocol, FQDN, and port
            const isValidOrigin = isValidProtocol && isValidHostname && isValidPort;

            // Clearing data depending user settings
            if (isValidOrigin) {
              console.log(`Clearing data for ${currentTabURL.origin}`);
              if (userPrefs['sessionStorageSetting'] === true) {
                // https://stackoverflow.com/questions/36216266/clear-session-and-local-storage-for-specific-domain-from-a-chrome-extension#answer-36217002
                chrome.tabs.executeScript(
                    currentTabObj.id, {
                      code: 'sessionStorage.clear();',
                    },
                );
                console.log('sessionStorage cleared');
              }

              chrome.browsingData.remove({
                'origins': [currentTabURL.origin],
              }, {
                'cache': userPrefs['cacheSetting'],
                'cookies': userPrefs['cookiesSetting'],
                'localStorage': userPrefs['localStorageSetting'],
                'indexedDB': userPrefs['indexedDBSetting']
              }, function() {
                if (userPrefs['cacheSetting']) {
                  console.log('cache was cleared');
                };
                if (userPrefs['cookiesSetting']) {
                  console.log('cookies were cleared');
                }
                if (userPrefs['localStorageSetting']) {
                  console.log('localStorage was cleared');
                }
                if (userPrefs['indexedDBSetting']) {
                  console.log('indexedDB was cleared');
                }
                // Update icon to notify user, clearing data was successful
                chrome.browserAction.setIcon(
                    {'path': 'assets/flash.png'},
                );
                setTimeout(function() {
                  chrome.browserAction.setIcon({
                    'path': 'assets/icon.png',
                  });
                }, 1000);

                // https://stackoverflow.com/questions/8342756/chrome-extension-api-for-refreshing-the-page/25246060#25246060
                chrome.tabs.executeScript(
                    currentTabObj.id, {
                      code: 'window.location.reload();',
                    },
                );
                console.log('Current tab reloaded');
              });
            } else {
              console.log(`Cannot clear data for ${currentTabURL.origin}`);
            }
          } catch (e) {
            console.log(e);
          }
        });
      } else {
        console.log('User disabled clearing all data');
      }
    });
  } catch (err) {
    console.log(`Unexpected error when accessing storage: ${err}`);
  }
}

// Check if current browser is Chromium-based
if (isChromium && typeof isChromium !== 'undefined' && vendorName === 'Google Inc.' && isNotOpera && isNotFirefox) {
  chrome.browserAction.onClicked.addListener(function() {
    clearData();
  });
  // Add option for user to clear data from context menu
  chrome.contextMenus.create({
    id: 'clear-data',
    title: 'Wipe my data on this page',
    contexts: ['page'],
  });
  // https://stackoverflow.com/questions/32718645/google-chrome-extension-add-the-tab-to-context-menu#answer-32719354
  chrome.contextMenus.onClicked.addListener(function(info) {
    if (info.menuItemId == 'clear-data') {
      console.log('Clear data activated through context menu');
      clearData();
    }
  });
}


