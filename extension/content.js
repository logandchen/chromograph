if (!window.__chromagraphOn) {
  window.__chromagraphOn = true;
  var chromaDemo = function () {
    var p = {}, L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', D = '0123456789', i;
    function h2(h, s, l) { s /= 100; l /= 100; var a = s * Math.min(l, 1 - l); function f(n) { var k = (n + h / 30) % 12; return ('0' + Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16)).slice(-2); } return '#' + f(0) + f(8) + f(4); }
    for (i = 0; i < 26; i++) p[L[i]] = h2((i * 47) % 360, 80, [80, 86, 83][i % 3]);
    for (i = 0; i < 10; i++) p[D[i]] = h2((i * 36 + 15) % 360, 82, 82);
    return p;
  };
  chrome.runtime.onMessage.addListener(function (m) {
    if (!m || !m.chroma) return;
    chrome.storage.local.get({ palette: null, t: 0.5, al: 0.9, ink: false }, function (s) {
      var P = s.palette || chromaDemo(), o = { t: s.t, al: s.al, ink: s.ink };
      var sel = getSelection(), r = sel.rangeCount && !sel.isCollapsed ? sel.getRangeAt(0) : null;
      var painted = !!document.querySelector('.chroma-w'), c = m.chroma;
      if (c === 'toggle') c = r ? 'selection' : painted ? 'clear' : 'page';
      if (c === 'style') { if (painted) chromaCore('style', P, o); }
      else if (c === 'clear') chromaCore('clear');
      else if (c === 'selection') { if (r) { o.range = r; chromaCore('paint', P, o); sel.removeAllRanges(); } }
      else if (c === 'page') chromaCore('paint', P, o);
    });
  });
}
