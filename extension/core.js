function chromaCore(cmd,P,o){
  o=o||{};var d=document,host=o.host||d.documentElement,scope=o.root||d.body,i;
  if(!d.getElementById('chroma-css')){var st=d.createElement('style');st.id='chroma-css';
    var A='var(--chroma-al,1)',T='var(--chroma-t,0)',M='linear-gradient(180deg,transparent,#000 calc('+T+'*42%),#000 calc(100% - '+T+'*42%),transparent)';
    st.textContent='.chroma-w{position:relative;z-index:0}.chroma-g{position:relative}.chroma-g::before{content:"";position:absolute;z-index:-1;pointer-events:none;top:calc('+T+'*-.28em);bottom:calc('+T+'*-.28em);left:calc('+T+'*(1 - var(--aa,1))*-.5em);right:calc('+T+'*(1 - var(--ba,1))*-.5em);background:linear-gradient(90deg,rgb(var(--a)/calc('+A+'*var(--aa,1))) 0,rgb(var(--c)/'+A+') calc('+T+'*50%),rgb(var(--c)/'+A+') calc(100% - '+T+'*50%),rgb(var(--b)/calc('+A+'*var(--ba,1))) 100%);-webkit-mask-image:'+M+';mask-image:'+M+'}.chroma-ink .chroma-g{color:rgb(var(--i))}.chroma-ink .chroma-g::before{display:none}.chroma-flat .chroma-g::before{-webkit-mask-image:none;mask-image:none}';
    (d.head||d.documentElement).appendChild(st)}
  if(cmd==='clear'){var ws=scope.querySelectorAll('.chroma-w');for(i=0;i<ws.length;i++){var pw=ws[i].parentNode;pw.replaceChild(d.createTextNode(ws[i].textContent),ws[i]);pw.normalize()}return 0}
  host.style.setProperty('--chroma-t',o.t==null?.5:o.t);
  host.style.setProperty('--chroma-al',o.al==null?.9:o.al);
  host.classList.toggle('chroma-ink',!!o.ink);host.classList.toggle('chroma-flat',o.t!=null&&o.t<=0);
  if(cmd==='style')return 0;
  var cache={};
  function cl(x,a,b){return Math.max(a,Math.min(b,x))}
  function out(h,s,l){var a=s*Math.min(l,1-l);function f(n){var k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))}return[f(0),f(8),f(4)]}
  function mid(a,b){return((a[0]+b[0])>>1)+' '+((a[1]+b[1])>>1)+' '+((a[2]+b[2])>>1)}
  function col(ch,lb){var key=ch+(lb?1:0);if(cache[key]!==undefined)return cache[key];var x=P[ch]||P[ch.toUpperCase()],v=null;
    if(typeof x==='string'&&/^#[0-9a-f]{6}$/i.test(x)){
      var r=parseInt(x.substr(1,2),16)/255,g=parseInt(x.substr(3,2),16)/255,b=parseInt(x.substr(5,2),16)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,dl=mx-mn,h=0,s=0;
      if(dl>.001){s=dl/(1-Math.abs(2*l-1));h=mx===r?((g-b)/dl)%6:mx===g?(b-r)/dl+2:(r-g)/dl+4;h*=60;if(h<0)h+=360}
      v={c:lb?out(h,s,cl(l,.64,.93)):out(h,Math.min(s,.55),cl(l-.46,.24,.44)),i:lb?out(h,Math.min(s,.8),cl(l-.42,.26,.46)):out(h,s,cl(l,.66,.88))}}
    return cache[key]=v}
  var lp=null,lv=true;function lightBg(el){if(el===lp)return lv;var m=/(\d+)[, ]+(\d+)[, ]+(\d+)/.exec(getComputedStyle(el).color);lp=el;return lv=!m||(m[1]*.299+m[2]*.587+m[3]*.114)<140}
  var r=o.range,sc,so,ec,eo,top=scope,nodes=[],lbs=[],n,count=0;
  if(r){sc=r.startContainer;so=r.startOffset;ec=r.endContainer;eo=r.endOffset;top=r.commonAncestorContainer}
  if(top.nodeType===3){if(top.parentElement){nodes.push(top);lbs.push(lightBg(top.parentElement))}}
  else{var tw=d.createTreeWalker(top,4);while((n=tw.nextNode())){
    var pe=n.parentElement;
    if(!pe||pe.closest('script,style,noscript,textarea,select,option,.chroma-w')||pe.isContentEditable)continue;
    if(r&&!r.intersectsNode(n))continue;
    nodes.push(n);lbs.push(lightBg(pe))}}
  nodes.forEach(function(n,k){
    if(!n.parentElement)return;
    if(n===ec){if(eo<=0)return;if(eo<n.nodeValue.length)n.splitText(eo)}
    if(n===sc&&so>0){if(so>=n.nodeValue.length)return;n=n.splitText(so)}
    var s=n.nodeValue,lb=lbs[k],cs=[],any=false,j;
    for(j=0;j<s.length;j++){cs[j]=col(s[j],lb);if(cs[j])any=true}
    if(!any)return;
    var w=d.createElement('span'),buf='';w.className='chroma-w';
    for(j=0;j<s.length;j++){var c=cs[j];if(!c){buf+=s[j];continue}
      if(buf){w.appendChild(d.createTextNode(buf));buf=''}
      var e=d.createElement('span'),a=cs[j-1],b=cs[j+1],cc=c.c.join(' ');e.className='chroma-g';e.textContent=s[j];
      e.style.cssText='--c:'+cc+';--i:'+c.i.join(' ')+';--a:'+(a?mid(c.c,a.c):cc)+';--b:'+(b?mid(c.c,b.c):cc)+(a?'':';--aa:0')+(b?'':';--ba:0');
      w.appendChild(e);count++}
    if(buf)w.appendChild(d.createTextNode(buf));
    n.parentNode.replaceChild(w,n)});
  return count}
