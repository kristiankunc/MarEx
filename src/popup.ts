import browser from 'webextension-polyfill';
import { extractPageData, formatPageText, type PageData } from './page';

const ALLOWED_ORIGIN = 'https://marast.fit.cvut.cz';

async function main() {
  const textarea = document.querySelector('textarea')!;
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id || !tab.url?.startsWith(`${ALLOWED_ORIGIN}/`)) {
    textarea.value = 'Open a marast.fit.cvut.cz page first.';
    return;
  }

  let results;
  try {
    results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      world: 'MAIN',
      func: extractPageData,
    });
  } catch (error) {
    textarea.value = `Could not read this page: ${error}`;
    return;
  }

  const data = results[0]?.result as PageData | undefined;
  if (!data || data.type === 'none') {
    textarea.value = 'No quiz or exercise found on this page.';
    return;
  }

  const text = formatPageText(data);
  textarea.value = text;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore — the selected textarea below is the reliable fallback
  }
  textarea.focus();
  textarea.select();
}

main();
