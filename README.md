# Extension Template

Chrome + Firefox extension for exporting source latex from `marast.fit.cvut.cz` (quizes + excercises)

## Build

```bash
npm install
npm run build:chrome
npm run build:firefox
```

## Download

Pre-built zips (`extension-chrome.zip`, `extension-firefox.zip`) are attached to each GH release. Grab latest at [Releases](https://github.com/kristiankunc/MarEx/releases/latest).

## Load

- Chrome: `chrome://extensions` -> Developer mode -> Load unpacked -> `dist/chrome`
- Firefox: `about:debugging#/runtime/this-firefox` -> Load Temporary Add-on -> `dist/firefox/manifest.json`

AI Disclosure: This extension was largely AI generated (with human verification).
