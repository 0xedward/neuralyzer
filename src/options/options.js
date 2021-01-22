'use strict';

function saveOptions() {
  const isCookiesChecked = document.getElementById('cookies').checked;
  const isLocalStorageChecked = document.getElementById('localStorage').checked;
  const isCacheChecked = document.getElementById('cache').checked;
  const isSessionStorageChecked = document.getElementById('sessionStorage').checked;
  const status = document.getElementById('status');

  try {
    chrome.storage.sync.set({
      cookiesSetting: isCookiesChecked,
      localStorageSetting: isLocalStorageChecked,
      cacheSetting: isCacheChecked,
      sessionStorageSetting: isSessionStorageChecked,
    }, function() {
      status.textContent = `Your settings have been saved`;
      setTimeout(function() {
        status.textContent = '';
      }, 1000);
    });
  } catch (err) {
    status.textContent = `An unexpected error occurred: ${err}`;
  }
}

function restoreOptions() {
  try {
    chrome.storage.sync.get({
      'cookiesSetting': true,
      'localStorageSetting': true,
      'cacheSetting': true,
      'sessionStorageSetting': true,
    }, function(items) {
      document.getElementById('cookies').checked = items['cookiesSetting'];
      document.getElementById('localStorage').checked = items['localStorageSetting'];
      document.getElementById('cache').checked = items['cacheSetting'];
      document.getElementById('sessionStorage').checked = items['sessionStorageSetting'];
    });
  } catch (err) {
    console.log(`Unexpected error when accessing storage from options page: ${err}`);
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
