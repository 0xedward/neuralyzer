# Neuralyzer

Neuralyzer is a Chrome extension that clears the cache, cookies, localStorage, IndexedDB and sessionStorage on the tab you are currently on. The extension can be activated by clicking the extension icon on your browser toolbar or by right-clicking the page you are on and selecting the extension's menu item.

![Neuralyzer Demo Run on Google](/screenshots/demo.gif)

You can also customize what data you want to be cleared, when the extension is run, on the options page.

![](/screenshots/options_page.png)

This extension is useful when you don't trust the security or privacy of the website you are currently on. For example, running the extension before leaving a site will help if you want to ensure you have logged out of a site or prevent a site from tracking you across visits.

Here are some other examples, with some assumptions made about the site you are currently on:
- You can use this extension to clear your session to render [CSRF](https://owasp.org/www-community/attacks/csrf) useless
- You can use this extension to clear first party tracking cookies
- You can use this extension to clear your cache to prevent [cache fingerprinting](https://www.usenix.org/system/files/sec19fall_shusterman_prepub.pdf)
- You can use this extension to clear localStorage and IndexedDB to help prevent [evercookies](https://en.wikipedia.org/wiki/Evercookie)

## Installing extension from repo
1. Download this repo as a ZIP file from GitHub.
2. Unzip the file. The unzipped folder is likely named `neuralyzer-main`
3. In Chrome, go to the extensions page - chrome://extensions
4. Enable Developer Mode.
5. Click Load unpacked button and select the src folder that was extracted (`neuralyzer-main/src`) or drag the extracted src folder anywhere on the page to import it

## Permissions Audit
If you are curious or concerned about the permissions requested by this extension, the following is a brief explainer for each permission and where you can find it used in code:

- `activeTab` is used [to get the current page's URL](https://github.com/0xedward/neuralyzer/blob/main/src/background.js#L31-L34) to ensure only the data stored by the current page's url is cleared and [to clear sessionStorage](https://github.com/0xedward/neuralyzer/blob/main/src/background.js#L52-L58)
- `browsingData` is used [to clear localStorage, cookies, IndexedDB and cache](https://github.com/0xedward/neuralyzer/blob/main/src/background.js#L60-L66)
- `contextMenus` is used [to create a menu item that allows users to clear their current page's localStorage, cookies, cache and sessionStorage](https://github.com/0xedward/neuralyzer/blob/main/src/background.js#L116-L121) by right-clicking on any webpage
- `storage` is used [to store user preferences on what data is to be cleared](https://github.com/0xedward/neuralyzer/blob/main/src/options/options.js#L11-L21) when the extension is activated

## Credits
Extension icons was created by [Sean Sun](https://github.com/seanqsun)
