const $ = id => document.getElementById(id);
let S = { palette: null, t: 0.5, al: 0.9, ink: false };
async function send(cmd) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['core.js', 'content.js'] });
    await chrome.tabs.sendMessage(tab.id, { chroma: cmd });
  } catch (e) { $('msg').textContent = 'Cannot run on this page.'; }
}
function sync() {
  $('t').value = S.t * 100; $('al').value = S.al * 100;
  $('ink').textContent = S.ink ? 'Colored letters' : 'Highlight';
  $('msg').textContent = S.palette ? Object.keys(S.palette).length + ' colors saved' : 'Using placeholder colors';
}
function set(k, v) { S[k] = v; chrome.storage.local.set({ [k]: v }, () => send('style')); sync(); }
chrome.storage.local.get(S, s => { S = s; sync(); });
['selection', 'page', 'clear'].forEach(c => $(c).onclick = () => send(c));
$('t').oninput = e => set('t', e.target.value / 100);
$('al').oninput = e => set('al', e.target.value / 100);
$('ink').onclick = () => set('ink', !S.ink);
$('save').onclick = () => {
  try {
    const o = JSON.parse($('code').value), p = {};
    for (const k in o) if ([...k].length === 1 && /^#[0-9a-f]{6}$/i.test(o[k])) p[k.toUpperCase()] = o[k];
    if (!Object.keys(p).length) throw 0;
    S.palette = p; chrome.storage.local.set({ palette: p }); $('code').value = ''; sync();
  } catch (e) { $('msg').textContent = 'That is not a palette code.'; }
};
