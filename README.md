# Neuralyzer
## Installing extension from repo
1. Download this repo as a ZIP file from GitHub.
2. Unzip the file. The unzipped folder is likely named `neuralyzer-main`
3. In Chrome, go to the extensions page - chrome://extensions
4. Enable Developer Mode.
5. Click Load unpacked button and select the src folder that was extracted (`neuralyzer-main/src`) or drag the extracted src folder anywhere on the page to import it

## Permissions Audit
If you are curious or concerned about the permissions requested by this extension, the following is a brief explainer for each permission and where you can find it used in code:

- `activeTab` is used [to get the current page's url](https://github.com/0xedward/neuralyzer/blob/main/src/background.js#L31-L34) to ensure only the data stored by the current page's url is cleared and [to clear sessionStorage](https://github.com/0xedward/neuralyzer/blob/main/src/background.js#L52-L58)
- `browsingData` is used [to clear localStorage, cookies and cache](https://github.com/0xedward/neuralyzer/blob/main/src/background.js#L60-L66)
- `contextMenus` is used [to create a menu item to allow users to clear their current page's localStorage, cookies, cache and sessionStorage](https://github.com/0xedward/neuralyzer/blob/main/src/background.js#L116-L121) by right clicking on any webpage
- `storage` is used [to store user preferences on what data is to be cleared](https://github.com/0xedward/neuralyzer/blob/main/src/options/options.js#L11-L21) when the extension is activated

## Credits
Extension icons was created by [Sean Sun](https://github.com/seanqsun)