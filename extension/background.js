chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'selection', title: 'Color this text with Chromagraph', contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'page', title: 'Chromagraph: color whole page', contexts: ['page'] });
  chrome.contextMenus.create({ id: 'clear', title: 'Chromagraph: clear colors', contexts: ['page', 'selection'] });
});
async function run(tab, cmd) {
  if (!tab || !tab.id) return;
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['core.js', 'content.js'] });
    await chrome.tabs.sendMessage(tab.id, { chroma: cmd });
  } catch (e) { console.warn('Chromagraph cannot run on this page:', e.message); }
}
chrome.contextMenus.onClicked.addListener((info, tab) => run(tab, info.menuItemId));
chrome.commands.onCommand.addListener((cmd, tab) => run(tab, cmd));
