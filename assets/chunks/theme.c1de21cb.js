import{d as w,o as c,c as m,r as g,a as ee,t as I,n as q,_ as x,b as C,w as b,e as S,T as We,u as an,i as Vt,f as Je,g as T,h as L,j as de,k as d,l as u,p as oe,m as se,q as be,s as ze,v as on,x as R,y as je,z as fn,A as nt,B as Et,C as we,F as G,D as X,E as vn,G as Le,H as j,I as tt,J as ke,K as Ie,L as Oe,M as Ke,N as Dt,O as ce,P as at,Q as it,R as ot,S as Ce,U as _n,V as kn,W as qt,X as st,Y as rt,Z as Ot,$ as He,a0 as lt,a1 as ct,a2 as Ft,a3 as Gt,a4 as Ht,a5 as Bt,a6 as ut,a7 as Rt,a8 as Wt,a9 as Jt,aa as Kt}from"./framework.48927342.js";const Ut=w({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(t){return(e,n)=>(c(),m("span",{class:q(["VPBadge",e.type])},[g(e.$slots,"default",{},()=>[ee(I(e.text),1)],!0)],2))}});const Qt=x(Ut,[["__scopeId","data-v-c19d1005"]]),Xt={key:0,class:"VPBackdrop"},Zt=w({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(t){return(e,n)=>(c(),C(We,{name:"fade"},{default:b(()=>[e.show?(c(),m("div",Xt)):S("",!0)]),_:1}))}});const Yt=x(Zt,[["__scopeId","data-v-6f45e10a"]]),A=an;function ea(t,e){let n,a=!1;return()=>{n&&clearTimeout(n),a?n=setTimeout(t,e):(t(),(a=!0)&&setTimeout(()=>a=!1,e))}}function sn(t){return/^\//.test(t)?t:`/${t}`}function Ne(t){if(Vt(t))return t;const{site:e}=A(),{pathname:n,search:a,hash:i}=new URL(t,"http://a.com"),o=n.endsWith("/")||n.endsWith(".html")?t:t.replace(/(?:(^\.+)\/)?.*$/,`$1${n.replace(/(\.md)?$/,e.value.cleanUrls?"":".html")}${a}${i}`);return Je(o)}function Ae({removeCurrent:t=!0,correspondingLink:e=!1}={}){const{site:n,localeIndex:a,page:i,theme:o}=A(),s=T(()=>{var r,p;return{label:(r=n.value.locales[a.value])==null?void 0:r.label,link:((p=n.value.locales[a.value])==null?void 0:p.link)||(a.value==="root"?"/":`/${a.value}/`)}});return{localeLinks:T(()=>Object.entries(n.value.locales).flatMap(([r,p])=>t&&s.value.label===p.label?[]:{text:p.label,link:na(p.link||(r==="root"?"/":`/${r}/`),o.value.i18nRouting!==!1&&e,i.value.relativePath.slice(s.value.link.length-1),!n.value.cleanUrls)})),currentLang:s}}function na(t,e,n,a){return e?t.replace(/\/$/,"")+sn(n.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,a?".html":"")):t}const ta=t=>(oe("data-v-9e2a4ec2"),t=t(),se(),t),aa={class:"NotFound"},ia={class:"code"},oa={class:"title"},sa=ta(()=>d("div",{class:"divider"},null,-1)),ra={class:"quote"},la={class:"action"},ca=["href","aria-label"],ua=w({__name:"NotFound",setup(t){const{site:e,theme:n}=A(),{localeLinks:a}=Ae({removeCurrent:!1}),i=L("/");return de(()=>{var s;const o=window.location.pathname.replace(e.value.base,"").replace(/(^.*?\/).*$/,"/$1");a.value.length&&(i.value=((s=a.value.find(({link:l})=>l.startsWith(o)))==null?void 0:s.link)||a.value[0].link)}),(o,s)=>{var l,r,p,h,k;return c(),m("div",aa,[d("p",ia,I(((l=u(n).notFound)==null?void 0:l.code)??"404"),1),d("h1",oa,I(((r=u(n).notFound)==null?void 0:r.title)??"PAGE NOT FOUND"),1),sa,d("blockquote",ra,I(((p=u(n).notFound)==null?void 0:p.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),d("div",la,[d("a",{class:"link",href:u(Je)(i.value),"aria-label":((h=u(n).notFound)==null?void 0:h.linkLabel)??"go to home"},I(((k=u(n).notFound)==null?void 0:k.linkText)??"Take me home"),9,ca)])])}}});const da=x(ua,[["__scopeId","data-v-9e2a4ec2"]]);function dt(t,e){if(Array.isArray(t))return Fe(t);if(t==null)return[];e=sn(e);const n=Object.keys(t).sort((i,o)=>o.split("/").length-i.split("/").length).find(i=>e.startsWith(sn(i))),a=n?t[n]:[];return Array.isArray(a)?Fe(a):Fe(a.items,a.base)}function ma(t){const e=[];let n=0;for(const a in t){const i=t[a];if(i.items){n=e.push(i);continue}e[n]||e.push({items:[]}),e[n].items.push(i)}return e}function pa(t){const e=[];function n(a){for(const i of a)i.text&&i.link&&e.push({text:i.text,link:i.link,docFooterText:i.docFooterText}),i.items&&n(i.items)}return n(t),e}function rn(t,e){return Array.isArray(e)?e.some(n=>rn(t,n)):be(t,e.link)?!0:e.items?rn(t,e.items):!1}function Fe(t,e){return[...t].map(n=>{const a={...n},i=a.base||e;return i&&a.link&&(a.link=i+a.link),a.items&&(a.items=Fe(a.items,i)),a})}function me(){const{frontmatter:t,page:e,theme:n}=A(),a=on("(min-width: 960px)"),i=L(!1),o=T(()=>{const _=n.value.sidebar,v=e.value.relativePath;return _?dt(_,v):[]}),s=L(o.value);R(o,(_,v)=>{JSON.stringify(_)!==JSON.stringify(v)&&(s.value=o.value)});const l=T(()=>t.value.sidebar!==!1&&s.value.length>0&&t.value.layout!=="home"),r=T(()=>p?t.value.aside==null?n.value.aside==="left":t.value.aside==="left":!1),p=T(()=>t.value.layout==="home"?!1:t.value.aside!=null?!!t.value.aside:n.value.aside!==!1),h=T(()=>l.value&&a.value),k=T(()=>l.value?ma(s.value):[]);function f(){i.value=!0}function y(){i.value=!1}function M(){i.value?y():f()}return{isOpen:i,sidebar:s,sidebarGroups:k,hasSidebar:l,hasAside:p,leftAside:r,isSidebarEnabled:h,open:f,close:y,toggle:M}}function ha(t,e){let n;je(()=>{n=t.value?document.activeElement:void 0}),de(()=>{window.addEventListener("keyup",a)}),fn(()=>{window.removeEventListener("keyup",a)});function a(i){i.key==="Escape"&&t.value&&(e(),n==null||n.focus())}}const mt=L(ze?location.hash:"");ze&&window.addEventListener("hashchange",()=>{mt.value=location.hash});function ga(t){const{page:e}=A(),n=L(!1),a=T(()=>t.value.collapsed!=null),i=T(()=>!!t.value.link),o=L(!1),s=()=>{o.value=be(e.value.relativePath,t.value.link)};R([e,t,mt],s),de(s);const l=T(()=>o.value?!0:t.value.items?rn(e.value.relativePath,t.value.items):!1),r=T(()=>!!(t.value.items&&t.value.items.length));je(()=>{n.value=!!(a.value&&t.value.collapsed)}),nt(()=>{(o.value||l.value)&&(n.value=!1)});function p(){a.value&&(n.value=!n.value)}return{collapsed:n,collapsible:a,isLink:i,isActiveLink:o,hasActiveLink:l,hasChildren:r,toggle:p}}function fa(){const{hasSidebar:t}=me(),e=on("(min-width: 960px)"),n=on("(min-width: 1280px)");return{isAsideEnabled:T(()=>!n.value&&!e.value?!1:t.value?n.value:e.value)}}const va=71;function bn(t){return typeof t.outline=="object"&&!Array.isArray(t.outline)&&t.outline.label||t.outlineTitle||"On this page"}function yn(t){const e=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(n=>n.id&&n.hasChildNodes()).map(n=>{const a=Number(n.tagName[1]);return{title:_a(n),link:"#"+n.id,level:a}});return ka(e,t)}function _a(t){let e="";for(const n of t.childNodes)if(n.nodeType===1){if(n.classList.contains("VPBadge")||n.classList.contains("header-anchor"))continue;e+=n.textContent}else n.nodeType===3&&(e+=n.textContent);return e.trim()}function ka(t,e){if(e===!1)return[];const n=(typeof e=="object"&&!Array.isArray(e)?e.level:e)||2,[a,i]=typeof n=="number"?[n,n]:n==="deep"?[2,6]:n;t=t.filter(s=>s.level>=a&&s.level<=i);const o=[];e:for(let s=0;s<t.length;s++){const l=t[s];if(s===0)o.push(l);else{for(let r=s-1;r>=0;r--){const p=t[r];if(p.level<l.level){(p.children||(p.children=[])).push(l);continue e}}o.push(l)}}return o}function ba(t,e){const{isAsideEnabled:n}=fa(),a=ea(o,100);let i=null;de(()=>{requestAnimationFrame(o),window.addEventListener("scroll",a)}),Et(()=>{s(location.hash)}),fn(()=>{window.removeEventListener("scroll",a)});function o(){if(!n.value)return;const l=[].slice.call(t.value.querySelectorAll(".outline-link")),r=[].slice.call(document.querySelectorAll(".content .header-anchor")).filter(y=>l.some(M=>M.hash===y.hash&&y.offsetParent!==null)),p=window.scrollY,h=window.innerHeight,k=document.body.offsetHeight,f=Math.abs(p+h-k)<1;if(r.length&&f){s(r[r.length-1].hash);return}for(let y=0;y<r.length;y++){const M=r[y],_=r[y+1],[v,P]=ya(y,M,_);if(v){s(P);return}}}function s(l){i&&i.classList.remove("active"),l==null?i=null:i=t.value.querySelector(`a[href="${decodeURIComponent(l)}"]`);const r=i;r?(r.classList.add("active"),e.value.style.top=r.offsetTop+33+"px",e.value.style.opacity="1"):(e.value.style.top="33px",e.value.style.opacity="0")}}function Pn(t){return t.parentElement.offsetTop-va}function ya(t,e,n){const a=window.scrollY;return t===0&&a===0?[!0,null]:a<Pn(e)?[!1,null]:!n||a<Pn(n)?[!0,e.hash]:[!1,null]}const ja=["href","title"],wa=w({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(t){function e({target:n}){const a=n.href.split("#")[1],i=document.getElementById(decodeURIComponent(a));i==null||i.focus({preventScroll:!0})}return(n,a)=>{const i=we("VPDocOutlineItem",!0);return c(),m("ul",{class:q(n.root?"root":"nested")},[(c(!0),m(G,null,X(n.headers,({children:o,link:s,title:l})=>(c(),m("li",null,[d("a",{class:"outline-link",href:s,onClick:e,title:l},I(l),9,ja),o!=null&&o.length?(c(),C(i,{key:0,headers:o},null,8,["headers"])):S("",!0)]))),256))],2)}}});const jn=x(wa,[["__scopeId","data-v-14ca443e"]]),Ma=t=>(oe("data-v-8c5d4870"),t=t(),se(),t),Sa={class:"content"},xa={class:"outline-title",role:"heading","aria-level":"2"},za={"aria-labelledby":"doc-outline-aria-label"},$a=Ma(()=>d("span",{class:"visually-hidden",id:"doc-outline-aria-label"}," Table of Contents for current page ",-1)),Ta=w({__name:"VPDocAsideOutline",setup(t){const{frontmatter:e,theme:n}=A(),a=vn([]);Le(()=>{a.value=yn(e.value.outline??n.value.outline)});const i=L(),o=L();return ba(i,o),(s,l)=>(c(),m("div",{class:q(["VPDocAsideOutline",{"has-outline":a.value.length>0}]),ref_key:"container",ref:i,role:"navigation"},[d("div",Sa,[d("div",{class:"outline-marker",ref_key:"marker",ref:o},null,512),d("div",xa,I(u(bn)(u(n))),1),d("nav",za,[$a,j(jn,{headers:a.value,root:!0},null,8,["headers"])])])],2))}});const La=x(Ta,[["__scopeId","data-v-8c5d4870"]]),Ca={class:"VPDocAsideCarbonAds"},Na=w({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(t){const e=()=>null;return(n,a)=>(c(),m("div",Ca,[j(u(e),{"carbon-ads":n.carbonAds},null,8,["carbon-ads"])]))}}),Pa=t=>(oe("data-v-224c7d66"),t=t(),se(),t),Ia={class:"VPDocAside"},Aa=Pa(()=>d("div",{class:"spacer"},null,-1)),Va=w({__name:"VPDocAside",setup(t){const{theme:e}=A();return(n,a)=>(c(),m("div",Ia,[g(n.$slots,"aside-top",{},void 0,!0),g(n.$slots,"aside-outline-before",{},void 0,!0),j(La),g(n.$slots,"aside-outline-after",{},void 0,!0),Aa,g(n.$slots,"aside-ads-before",{},void 0,!0),u(e).carbonAds?(c(),C(Na,{key:0,"carbon-ads":u(e).carbonAds},null,8,["carbon-ads"])):S("",!0),g(n.$slots,"aside-ads-after",{},void 0,!0),g(n.$slots,"aside-bottom",{},void 0,!0)]))}});const Ea=x(Va,[["__scopeId","data-v-224c7d66"]]);function Da(){const{theme:t,page:e}=A();return T(()=>{const{text:n="Edit this page",pattern:a=""}=t.value.editLink||{};let i;return typeof a=="function"?i=a(e.value):i=a.replace(/:path/g,e.value.filePath),{url:i,text:n}})}function qa(){const{page:t,theme:e,frontmatter:n}=A();return T(()=>{var r,p,h,k,f,y,M,_;const a=dt(e.value.sidebar,t.value.relativePath),i=pa(a),o=i.findIndex(v=>be(t.value.relativePath,v.link)),s=((r=e.value.docFooter)==null?void 0:r.prev)===!1&&!n.value.prev||n.value.prev===!1,l=((p=e.value.docFooter)==null?void 0:p.next)===!1&&!n.value.next||n.value.next===!1;return{prev:s?void 0:{text:(typeof n.value.prev=="string"?n.value.prev:typeof n.value.prev=="object"?n.value.prev.text:void 0)??((h=i[o-1])==null?void 0:h.docFooterText)??((k=i[o-1])==null?void 0:k.text),link:(typeof n.value.prev=="object"?n.value.prev.link:void 0)??((f=i[o-1])==null?void 0:f.link)},next:l?void 0:{text:(typeof n.value.next=="string"?n.value.next:typeof n.value.next=="object"?n.value.next.text:void 0)??((y=i[o+1])==null?void 0:y.docFooterText)??((M=i[o+1])==null?void 0:M.text),link:(typeof n.value.next=="object"?n.value.next.link:void 0)??((_=i[o+1])==null?void 0:_.link)}}})}const Oa={},Fa={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Ga=d("path",{d:"M18,23H4c-1.7,0-3-1.3-3-3V6c0-1.7,1.3-3,3-3h7c0.6,0,1,0.4,1,1s-0.4,1-1,1H4C3.4,5,3,5.4,3,6v14c0,0.6,0.4,1,1,1h14c0.6,0,1-0.4,1-1v-7c0-0.6,0.4-1,1-1s1,0.4,1,1v7C21,21.7,19.7,23,18,23z"},null,-1),Ha=d("path",{d:"M8,17c-0.3,0-0.5-0.1-0.7-0.3C7,16.5,6.9,16.1,7,15.8l1-4c0-0.2,0.1-0.3,0.3-0.5l9.5-9.5c1.2-1.2,3.2-1.2,4.4,0c1.2,1.2,1.2,3.2,0,4.4l-9.5,9.5c-0.1,0.1-0.3,0.2-0.5,0.3l-4,1C8.2,17,8.1,17,8,17zM9.9,12.5l-0.5,2.1l2.1-0.5l9.3-9.3c0.4-0.4,0.4-1.1,0-1.6c-0.4-0.4-1.2-0.4-1.6,0l0,0L9.9,12.5z M18.5,2.5L18.5,2.5L18.5,2.5z"},null,-1),Ba=[Ga,Ha];function Ra(t,e){return c(),m("svg",Fa,Ba)}const Wa=x(Oa,[["render",Ra]]),ge=w({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(t){const e=t,n=T(()=>e.tag??(e.href?"a":"span")),a=T(()=>e.href&&tt.test(e.href));return(i,o)=>(c(),C(ke(n.value),{class:q(["VPLink",{link:i.href,"vp-external-link-icon":a.value,"no-icon":i.noIcon}]),href:i.href?u(Ne)(i.href):void 0,target:i.target??(a.value?"_blank":void 0),rel:i.rel??(a.value?"noreferrer":void 0)},{default:b(()=>[g(i.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),Ja={class:"VPLastUpdated"},Ka=["datetime"],Ua=w({__name:"VPDocFooterLastUpdated",setup(t){const{theme:e,page:n,frontmatter:a,lang:i}=A(),o=T(()=>new Date(a.value.lastUpdated??n.value.lastUpdated)),s=T(()=>o.value.toISOString()),l=L("");return de(()=>{je(()=>{var r,p,h;l.value=new Intl.DateTimeFormat((p=(r=e.value.lastUpdated)==null?void 0:r.formatOptions)!=null&&p.forceLocale?i.value:void 0,((h=e.value.lastUpdated)==null?void 0:h.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(o.value)})}),(r,p)=>{var h;return c(),m("p",Ja,[ee(I(((h=u(e).lastUpdated)==null?void 0:h.text)||u(e).lastUpdatedText||"Last updated")+": ",1),d("time",{datetime:s.value},I(l.value),9,Ka)])}}});const Qa=x(Ua,[["__scopeId","data-v-2cb0580f"]]),Xa={key:0,class:"VPDocFooter"},Za={key:0,class:"edit-info"},Ya={key:0,class:"edit-link"},ei={key:1,class:"last-updated"},ni={key:1,class:"prev-next"},ti={class:"pager"},ai=["href"],ii=["innerHTML"],oi=["innerHTML"],si={class:"pager"},ri=["href"],li=["innerHTML"],ci=["innerHTML"],ui=w({__name:"VPDocFooter",setup(t){const{theme:e,page:n,frontmatter:a}=A(),i=Da(),o=qa(),s=T(()=>e.value.editLink&&a.value.editLink!==!1),l=T(()=>n.value.lastUpdated&&a.value.lastUpdated!==!1),r=T(()=>s.value||l.value||o.value.prev||o.value.next);return(p,h)=>{var k,f,y,M,_,v;return r.value?(c(),m("footer",Xa,[g(p.$slots,"doc-footer-before",{},void 0,!0),s.value||l.value?(c(),m("div",Za,[s.value?(c(),m("div",Ya,[j(ge,{class:"edit-link-button",href:u(i).url,"no-icon":!0},{default:b(()=>[j(Wa,{class:"edit-link-icon","aria-label":"edit icon"}),ee(" "+I(u(i).text),1)]),_:1},8,["href"])])):S("",!0),l.value?(c(),m("div",ei,[j(Qa)])):S("",!0)])):S("",!0),(k=u(o).prev)!=null&&k.link||(f=u(o).next)!=null&&f.link?(c(),m("nav",ni,[d("div",ti,[(y=u(o).prev)!=null&&y.link?(c(),m("a",{key:0,class:"pager-link prev",href:u(Ne)(u(o).prev.link)},[d("span",{class:"desc",innerHTML:((M=u(e).docFooter)==null?void 0:M.prev)||"Previous page"},null,8,ii),d("span",{class:"title",innerHTML:u(o).prev.text},null,8,oi)],8,ai)):S("",!0)]),d("div",si,[(_=u(o).next)!=null&&_.link?(c(),m("a",{key:0,class:"pager-link next",href:u(Ne)(u(o).next.link)},[d("span",{class:"desc",innerHTML:((v=u(e).docFooter)==null?void 0:v.next)||"Next page"},null,8,li),d("span",{class:"title",innerHTML:u(o).next.text},null,8,ci)],8,ri)):S("",!0)])])):S("",!0)])):S("",!0)}}});const di=x(ui,[["__scopeId","data-v-92573369"]]),mi={},pi={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},hi=d("path",{d:"M9,19c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l5.3-5.3L8.3,6.7c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l6,6c0.4,0.4,0.4,1,0,1.4l-6,6C9.5,18.9,9.3,19,9,19z"},null,-1),gi=[hi];function fi(t,e){return c(),m("svg",pi,gi)}const wn=x(mi,[["render",fi]]),vi={key:0,class:"VPDocOutlineDropdown"},_i={key:0,class:"items"},ki=w({__name:"VPDocOutlineDropdown",setup(t){const{frontmatter:e,theme:n}=A(),a=L(!1);Le(()=>{a.value=!1});const i=vn([]);return Le(()=>{i.value=yn(e.value.outline??n.value.outline)}),(o,s)=>i.value.length>0?(c(),m("div",vi,[d("button",{onClick:s[0]||(s[0]=l=>a.value=!a.value),class:q({open:a.value})},[ee(I(u(bn)(u(n)))+" ",1),j(wn,{class:"icon"})],2),a.value?(c(),m("div",_i,[j(jn,{headers:i.value},null,8,["headers"])])):S("",!0)])):S("",!0)}});const bi=x(ki,[["__scopeId","data-v-ac15962b"]]),yi=t=>(oe("data-v-dcd5a9aa"),t=t(),se(),t),ji={class:"container"},wi=yi(()=>d("div",{class:"aside-curtain"},null,-1)),Mi={class:"aside-container"},Si={class:"aside-content"},xi={class:"content"},zi={class:"content-container"},$i={class:"main"},Ti=w({__name:"VPDoc",setup(t){const{theme:e}=A(),n=Ie(),{hasSidebar:a,hasAside:i,leftAside:o}=me(),s=T(()=>n.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(l,r)=>{const p=we("Content");return c(),m("div",{class:q(["VPDoc",{"has-sidebar":u(a),"has-aside":u(i)}])},[g(l.$slots,"doc-top",{},void 0,!0),d("div",ji,[u(i)?(c(),m("div",{key:0,class:q(["aside",{"left-aside":u(o)}])},[wi,d("div",Mi,[d("div",Si,[j(Ea,null,{"aside-top":b(()=>[g(l.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":b(()=>[g(l.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":b(()=>[g(l.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":b(()=>[g(l.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":b(()=>[g(l.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":b(()=>[g(l.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):S("",!0),d("div",xi,[d("div",zi,[g(l.$slots,"doc-before",{},void 0,!0),j(bi),d("main",$i,[j(p,{class:q(["vp-doc",[s.value,u(e).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),j(di,null,{"doc-footer-before":b(()=>[g(l.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),g(l.$slots,"doc-after",{},void 0,!0)])])]),g(l.$slots,"doc-bottom",{},void 0,!0)],2)}}});const Li=x(Ti,[["__scopeId","data-v-dcd5a9aa"]]),Ci=w({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{}},setup(t){const e=t,n=T(()=>e.href&&tt.test(e.href)),a=T(()=>e.tag||e.href?"a":"button");return(i,o)=>(c(),C(ke(a.value),{class:q(["VPButton",[i.size,i.theme]]),href:i.href?u(Ne)(i.href):void 0,target:n.value?"_blank":void 0,rel:n.value?"noreferrer":void 0},{default:b(()=>[ee(I(i.text),1)]),_:1},8,["class","href","target","rel"]))}});const Ni=x(Ci,[["__scopeId","data-v-9e21ae76"]]),Pi=["src","alt"],Ii=w({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(t){return(e,n)=>{const a=we("VPImage",!0);return e.image?(c(),m(G,{key:0},[typeof e.image=="string"||"src"in e.image?(c(),m("img",Oe({key:0,class:"VPImage"},typeof e.image=="string"?e.$attrs:{...e.image,...e.$attrs},{src:u(Je)(typeof e.image=="string"?e.image:e.image.src),alt:e.alt??(typeof e.image=="string"?"":e.image.alt||"")}),null,16,Pi)):(c(),m(G,{key:1},[j(a,Oe({class:"dark",image:e.image.dark,alt:e.image.alt},e.$attrs),null,16,["image","alt"]),j(a,Oe({class:"light",image:e.image.light,alt:e.image.alt},e.$attrs),null,16,["image","alt"])],64))],64)):S("",!0)}}});const Be=x(Ii,[["__scopeId","data-v-09ae590e"]]),Ai=t=>(oe("data-v-8e80f52b"),t=t(),se(),t),Vi={class:"container"},Ei={class:"main"},Di={key:0,class:"name"},qi=["innerHTML"],Oi=["innerHTML"],Fi=["innerHTML"],Gi={key:0,class:"actions"},Hi={key:0,class:"image"},Bi={class:"image-container"},Ri=Ai(()=>d("div",{class:"image-bg"},null,-1)),Wi=w({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(t){const e=Ke("hero-image-slot-exists");return(n,a)=>(c(),m("div",{class:q(["VPHero",{"has-image":n.image||u(e)}])},[d("div",Vi,[d("div",Ei,[g(n.$slots,"home-hero-info",{},()=>[n.name?(c(),m("h1",Di,[d("span",{innerHTML:n.name,class:"clip"},null,8,qi)])):S("",!0),n.text?(c(),m("p",{key:1,innerHTML:n.text,class:"text"},null,8,Oi)):S("",!0),n.tagline?(c(),m("p",{key:2,innerHTML:n.tagline,class:"tagline"},null,8,Fi)):S("",!0)],!0),n.actions?(c(),m("div",Gi,[(c(!0),m(G,null,X(n.actions,i=>(c(),m("div",{key:i.link,class:"action"},[j(Ni,{tag:"a",size:"medium",theme:i.theme,text:i.text,href:i.link},null,8,["theme","text","href"])]))),128))])):S("",!0)]),n.image||u(e)?(c(),m("div",Hi,[d("div",Bi,[Ri,g(n.$slots,"home-hero-image",{},()=>[n.image?(c(),C(Be,{key:0,class:"image-src",image:n.image},null,8,["image"])):S("",!0)],!0)])])):S("",!0)])],2))}});const Ji=x(Wi,[["__scopeId","data-v-8e80f52b"]]),Ki=w({__name:"VPHomeHero",setup(t){const{frontmatter:e}=A();return(n,a)=>u(e).hero?(c(),C(Ji,{key:0,class:"VPHomeHero",name:u(e).hero.name,text:u(e).hero.text,tagline:u(e).hero.tagline,image:u(e).hero.image,actions:u(e).hero.actions},{"home-hero-info":b(()=>[g(n.$slots,"home-hero-info")]),"home-hero-image":b(()=>[g(n.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):S("",!0)}}),Ui={},Qi={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Xi=d("path",{d:"M19.9,12.4c0.1-0.2,0.1-0.5,0-0.8c-0.1-0.1-0.1-0.2-0.2-0.3l-7-7c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l5.3,5.3H5c-0.6,0-1,0.4-1,1s0.4,1,1,1h11.6l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l7-7C19.8,12.6,19.9,12.5,19.9,12.4z"},null,-1),Zi=[Xi];function Yi(t,e){return c(),m("svg",Qi,Zi)}const eo=x(Ui,[["render",Yi]]),no={class:"box"},to={key:0,class:"icon"},ao=["innerHTML"],io=["innerHTML"],oo=["innerHTML"],so={key:4,class:"link-text"},ro={class:"link-text-value"},lo=w({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(t){return(e,n)=>(c(),C(ge,{class:"VPFeature",href:e.link,rel:e.rel,target:e.target,"no-icon":!0,tag:e.link?"a":"div"},{default:b(()=>[d("article",no,[typeof e.icon=="object"&&e.icon.wrap?(c(),m("div",to,[j(Be,{image:e.icon,alt:e.icon.alt,height:e.icon.height||48,width:e.icon.width||48},null,8,["image","alt","height","width"])])):typeof e.icon=="object"?(c(),C(Be,{key:1,image:e.icon,alt:e.icon.alt,height:e.icon.height||48,width:e.icon.width||48},null,8,["image","alt","height","width"])):e.icon?(c(),m("div",{key:2,class:"icon",innerHTML:e.icon},null,8,ao)):S("",!0),d("h2",{class:"title",innerHTML:e.title},null,8,io),e.details?(c(),m("p",{key:3,class:"details",innerHTML:e.details},null,8,oo)):S("",!0),e.linkText?(c(),m("div",so,[d("p",ro,[ee(I(e.linkText)+" ",1),j(eo,{class:"link-text-icon"})])])):S("",!0)])]),_:1},8,["href","rel","target","tag"]))}});const co=x(lo,[["__scopeId","data-v-c0d13d3f"]]),uo={key:0,class:"VPFeatures"},mo={class:"container"},po={class:"items"},ho=w({__name:"VPFeatures",props:{features:{}},setup(t){const e=t,n=T(()=>{const a=e.features.length;if(a){if(a===2)return"grid-2";if(a===3)return"grid-3";if(a%3===0)return"grid-6";if(a>3)return"grid-4"}else return});return(a,i)=>a.features?(c(),m("div",uo,[d("div",mo,[d("div",po,[(c(!0),m(G,null,X(a.features,o=>(c(),m("div",{key:o.title,class:q(["item",[n.value]])},[j(co,{icon:o.icon,title:o.title,details:o.details,link:o.link,"link-text":o.linkText,rel:o.rel,target:o.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):S("",!0)}});const go=x(ho,[["__scopeId","data-v-cde15fe6"]]),fo=w({__name:"VPHomeFeatures",setup(t){const{frontmatter:e}=A();return(n,a)=>u(e).features?(c(),C(go,{key:0,class:"VPHomeFeatures",features:u(e).features},null,8,["features"])):S("",!0)}}),vo={class:"VPHome"},_o=w({__name:"VPHome",setup(t){return(e,n)=>{const a=we("Content");return c(),m("div",vo,[g(e.$slots,"home-hero-before",{},void 0,!0),j(Ki,null,{"home-hero-info":b(()=>[g(e.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-image":b(()=>[g(e.$slots,"home-hero-image",{},void 0,!0)]),_:3}),g(e.$slots,"home-hero-after",{},void 0,!0),g(e.$slots,"home-features-before",{},void 0,!0),j(fo),g(e.$slots,"home-features-after",{},void 0,!0),j(a)])}}});const ko=x(_o,[["__scopeId","data-v-0eaa9813"]]),bo={},yo={class:"VPPage"};function jo(t,e){const n=we("Content");return c(),m("div",yo,[g(t.$slots,"page-top"),j(n),g(t.$slots,"page-bottom")])}const wo=x(bo,[["render",jo]]),Mo=w({__name:"VPContent",setup(t){const{page:e,frontmatter:n}=A(),{hasSidebar:a}=me();return(i,o)=>(c(),m("div",{class:q(["VPContent",{"has-sidebar":u(a),"is-home":u(n).layout==="home"}]),id:"VPContent"},[u(e).isNotFound?g(i.$slots,"not-found",{key:0},()=>[j(da)],!0):u(n).layout==="page"?(c(),C(wo,{key:1},{"page-top":b(()=>[g(i.$slots,"page-top",{},void 0,!0)]),"page-bottom":b(()=>[g(i.$slots,"page-bottom",{},void 0,!0)]),_:3})):u(n).layout==="home"?(c(),C(ko,{key:2},{"home-hero-before":b(()=>[g(i.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info":b(()=>[g(i.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-image":b(()=>[g(i.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":b(()=>[g(i.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":b(()=>[g(i.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":b(()=>[g(i.$slots,"home-features-after",{},void 0,!0)]),_:3})):u(n).layout&&u(n).layout!=="doc"?(c(),C(ke(u(n).layout),{key:3})):(c(),C(Li,{key:4},{"doc-top":b(()=>[g(i.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":b(()=>[g(i.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":b(()=>[g(i.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":b(()=>[g(i.$slots,"doc-before",{},void 0,!0)]),"doc-after":b(()=>[g(i.$slots,"doc-after",{},void 0,!0)]),"aside-top":b(()=>[g(i.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":b(()=>[g(i.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":b(()=>[g(i.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":b(()=>[g(i.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":b(()=>[g(i.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":b(()=>[g(i.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}});const So=x(Mo,[["__scopeId","data-v-519768f5"]]),xo={class:"container"},zo=["innerHTML"],$o=["innerHTML"],To=w({__name:"VPFooter",setup(t){const{theme:e,frontmatter:n}=A(),{hasSidebar:a}=me();return(i,o)=>u(e).footer&&u(n).footer!==!1?(c(),m("footer",{key:0,class:q(["VPFooter",{"has-sidebar":u(a)}])},[d("div",xo,[u(e).footer.message?(c(),m("p",{key:0,class:"message",innerHTML:u(e).footer.message},null,8,zo)):S("",!0),u(e).footer.copyright?(c(),m("p",{key:1,class:"copyright",innerHTML:u(e).footer.copyright},null,8,$o)):S("",!0)])],2)):S("",!0)}});const Lo=x(To,[["__scopeId","data-v-2dac7930"]]),Co={class:"header"},No={class:"outline"},Po=w({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(t){const e=t,{theme:n}=A(),a=L(!1),i=L(0),o=L();Le(()=>{a.value=!1});function s(){a.value=!a.value,i.value=window.innerHeight+Math.min(window.scrollY-e.navHeight,0)}function l(p){p.target.classList.contains("outline-link")&&(o.value&&(o.value.style.transition="none"),ce(()=>{a.value=!1}))}function r(){a.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(p,h)=>(c(),m("div",{class:"VPLocalNavOutlineDropdown",style:Dt({"--vp-vh":i.value+"px"})},[p.headers.length>0?(c(),m("button",{key:0,onClick:s,class:q({open:a.value})},[ee(I(u(bn)(u(n)))+" ",1),j(wn,{class:"icon"})],2)):(c(),m("button",{key:1,onClick:r},I(u(n).returnToTopLabel||"Return to top"),1)),j(We,{name:"flyout"},{default:b(()=>[a.value?(c(),m("div",{key:0,ref_key:"items",ref:o,class:"items",onClick:l},[d("div",Co,[d("a",{class:"top-link",href:"#",onClick:r},I(u(n).returnToTopLabel||"Return to top"),1)]),d("div",No,[j(jn,{headers:p.headers},null,8,["headers"])])],512)):S("",!0)]),_:1})],4))}});const Io=x(Po,[["__scopeId","data-v-aaf7fb06"]]),Ao={},Vo={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},Eo=d("path",{d:"M17,11H3c-0.6,0-1-0.4-1-1s0.4-1,1-1h14c0.6,0,1,0.4,1,1S17.6,11,17,11z"},null,-1),Do=d("path",{d:"M21,7H3C2.4,7,2,6.6,2,6s0.4-1,1-1h18c0.6,0,1,0.4,1,1S21.6,7,21,7z"},null,-1),qo=d("path",{d:"M21,15H3c-0.6,0-1-0.4-1-1s0.4-1,1-1h18c0.6,0,1,0.4,1,1S21.6,15,21,15z"},null,-1),Oo=d("path",{d:"M17,19H3c-0.6,0-1-0.4-1-1s0.4-1,1-1h14c0.6,0,1,0.4,1,1S17.6,19,17,19z"},null,-1),Fo=[Eo,Do,qo,Oo];function Go(t,e){return c(),m("svg",Vo,Fo)}const Ho=x(Ao,[["render",Go]]),Bo=["aria-expanded"],Ro={class:"menu-text"},Wo=w({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(t){const{theme:e,frontmatter:n}=A(),{hasSidebar:a}=me(),{y:i}=at(),o=vn([]),s=L(0);de(()=>{s.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),Le(()=>{o.value=yn(n.value.outline??e.value.outline)});const l=T(()=>o.value.length===0&&!a.value),r=T(()=>({VPLocalNav:!0,fixed:l.value,"reached-top":i.value>=s.value}));return(p,h)=>u(n).layout!=="home"&&(!l.value||u(i)>=s.value)?(c(),m("div",{key:0,class:q(r.value)},[u(a)?(c(),m("button",{key:0,class:"menu","aria-expanded":p.open,"aria-controls":"VPSidebarNav",onClick:h[0]||(h[0]=k=>p.$emit("open-menu"))},[j(Ho,{class:"menu-icon"}),d("span",Ro,I(u(e).sidebarMenuLabel||"Menu"),1)],8,Bo)):S("",!0),j(Io,{headers:o.value,navHeight:s.value},null,8,["headers","navHeight"])],2)):S("",!0)}});const Jo=x(Wo,[["__scopeId","data-v-3ea5a6e8"]]);function Ko(){const t=L(!1);function e(){t.value=!0,window.addEventListener("resize",i)}function n(){t.value=!1,window.removeEventListener("resize",i)}function a(){t.value?n():e()}function i(){window.outerWidth>=768&&n()}const o=Ie();return R(()=>o.path,n),{isScreenOpen:t,openScreen:e,closeScreen:n,toggleScreen:a}}const Uo={},Qo={class:"VPSwitch",type:"button",role:"switch"},Xo={class:"check"},Zo={key:0,class:"icon"};function Yo(t,e){return c(),m("button",Qo,[d("span",Xo,[t.$slots.default?(c(),m("span",Zo,[g(t.$slots,"default",{},void 0,!0)])):S("",!0)])])}const es=x(Uo,[["render",Yo],["__scopeId","data-v-47733c00"]]),ns={},ts={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},as=d("path",{d:"M12.1,22c-0.3,0-0.6,0-0.9,0c-5.5-0.5-9.5-5.4-9-10.9c0.4-4.8,4.2-8.6,9-9c0.4,0,0.8,0.2,1,0.5c0.2,0.3,0.2,0.8-0.1,1.1c-2,2.7-1.4,6.4,1.3,8.4c2.1,1.6,5,1.6,7.1,0c0.3-0.2,0.7-0.3,1.1-0.1c0.3,0.2,0.5,0.6,0.5,1c-0.2,2.7-1.5,5.1-3.6,6.8C16.6,21.2,14.4,22,12.1,22zM9.3,4.4c-2.9,1-5,3.6-5.2,6.8c-0.4,4.4,2.8,8.3,7.2,8.7c2.1,0.2,4.2-0.4,5.8-1.8c1.1-0.9,1.9-2.1,2.4-3.4c-2.5,0.9-5.3,0.5-7.5-1.1C9.2,11.4,8.1,7.7,9.3,4.4z"},null,-1),is=[as];function os(t,e){return c(),m("svg",ts,is)}const ss=x(ns,[["render",os]]),rs={},ls={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},cs=it('<path d="M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18zM12,8c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4c2.2,0,4-1.8,4-4C16,9.8,14.2,8,12,8z"></path><path d="M12,4c-0.6,0-1-0.4-1-1V1c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,3.6,12.6,4,12,4z"></path><path d="M12,24c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,23.6,12.6,24,12,24z"></path><path d="M5.6,6.6c-0.3,0-0.5-0.1-0.7-0.3L3.5,4.9c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C6.2,6.5,5.9,6.6,5.6,6.6z"></path><path d="M19.8,20.8c-0.3,0-0.5-0.1-0.7-0.3l-1.4-1.4c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C20.3,20.7,20,20.8,19.8,20.8z"></path><path d="M3,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S3.6,13,3,13z"></path><path d="M23,13h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S23.6,13,23,13z"></path><path d="M4.2,20.8c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C4.7,20.7,4.5,20.8,4.2,20.8z"></path><path d="M18.4,6.6c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C18.9,6.5,18.6,6.6,18.4,6.6z"></path>',9),us=[cs];function ds(t,e){return c(),m("svg",ls,us)}const ms=x(rs,[["render",ds]]),ps=w({__name:"VPSwitchAppearance",setup(t){const{isDark:e}=A(),n=Ke("toggle-appearance",()=>{e.value=!e.value});return(a,i)=>(c(),C(es,{title:"toggle dark mode",class:"VPSwitchAppearance","aria-checked":u(e),onClick:u(n)},{default:b(()=>[j(ms,{class:"sun"}),j(ss,{class:"moon"})]),_:1},8,["aria-checked","onClick"]))}});const Mn=x(ps,[["__scopeId","data-v-de8c4290"]]),hs={key:0,class:"VPNavBarAppearance"},gs=w({__name:"VPNavBarAppearance",setup(t){const{site:e}=A();return(n,a)=>u(e).appearance&&u(e).appearance!=="force-dark"?(c(),m("div",hs,[j(Mn)])):S("",!0)}});const fs=x(gs,[["__scopeId","data-v-c37f87ef"]]),Sn=L();let pt=!1,en=0;function vs(t){const e=L(!1);if(ze){!pt&&_s(),en++;const n=R(Sn,a=>{var i,o,s;a===t.el.value||(i=t.el.value)!=null&&i.contains(a)?(e.value=!0,(o=t.onFocus)==null||o.call(t)):(e.value=!1,(s=t.onBlur)==null||s.call(t))});fn(()=>{n(),en--,en||ks()})}return ot(e)}function _s(){document.addEventListener("focusin",ht),pt=!0,Sn.value=document.activeElement}function ks(){document.removeEventListener("focusin",ht)}function ht(){Sn.value=document.activeElement}const bs={},ys={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},js=d("path",{d:"M12,16c-0.3,0-0.5-0.1-0.7-0.3l-6-6c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-6,6C12.5,15.9,12.3,16,12,16z"},null,-1),ws=[js];function Ms(t,e){return c(),m("svg",ys,ws)}const gt=x(bs,[["render",Ms]]),Ss={},xs={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},zs=d("circle",{cx:"12",cy:"12",r:"2"},null,-1),$s=d("circle",{cx:"19",cy:"12",r:"2"},null,-1),Ts=d("circle",{cx:"5",cy:"12",r:"2"},null,-1),Ls=[zs,$s,Ts];function Cs(t,e){return c(),m("svg",xs,Ls)}const Ns=x(Ss,[["render",Cs]]),Ps={class:"VPMenuLink"},Is=w({__name:"VPMenuLink",props:{item:{}},setup(t){const{page:e}=A();return(n,a)=>(c(),m("div",Ps,[j(ge,{class:q({active:u(be)(u(e).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,target:n.item.target,rel:n.item.rel},{default:b(()=>[ee(I(n.item.text),1)]),_:1},8,["class","href","target","rel"])]))}});const Ue=x(Is,[["__scopeId","data-v-cc062915"]]),As={class:"VPMenuGroup"},Vs={key:0,class:"title"},Es=w({__name:"VPMenuGroup",props:{text:{},items:{}},setup(t){return(e,n)=>(c(),m("div",As,[e.text?(c(),m("p",Vs,I(e.text),1)):S("",!0),(c(!0),m(G,null,X(e.items,a=>(c(),m(G,null,["link"in a?(c(),C(Ue,{key:0,item:a},null,8,["item"])):S("",!0)],64))),256))]))}});const Ds=x(Es,[["__scopeId","data-v-92227db6"]]),qs={class:"VPMenu"},Os={key:0,class:"items"},Fs=w({__name:"VPMenu",props:{items:{}},setup(t){return(e,n)=>(c(),m("div",qs,[e.items?(c(),m("div",Os,[(c(!0),m(G,null,X(e.items,a=>(c(),m(G,{key:a.text},["link"in a?(c(),C(Ue,{key:0,item:a},null,8,["item"])):(c(),C(Ds,{key:1,text:a.text,items:a.items},null,8,["text","items"]))],64))),128))])):S("",!0),g(e.$slots,"default",{},void 0,!0)]))}});const Gs=x(Fs,[["__scopeId","data-v-b948172a"]]),Hs=["aria-expanded","aria-label"],Bs={key:0,class:"text"},Rs=["innerHTML"],Ws={class:"menu"},Js=w({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(t){const e=L(!1),n=L();vs({el:n,onBlur:a});function a(){e.value=!1}return(i,o)=>(c(),m("div",{class:"VPFlyout",ref_key:"el",ref:n,onMouseenter:o[1]||(o[1]=s=>e.value=!0),onMouseleave:o[2]||(o[2]=s=>e.value=!1)},[d("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":e.value,"aria-label":i.label,onClick:o[0]||(o[0]=s=>e.value=!e.value)},[i.button||i.icon?(c(),m("span",Bs,[i.icon?(c(),C(ke(i.icon),{key:0,class:"option-icon"})):S("",!0),i.button?(c(),m("span",{key:1,innerHTML:i.button},null,8,Rs)):S("",!0),j(gt,{class:"text-icon"})])):(c(),C(Ns,{key:1,class:"icon"}))],8,Hs),d("div",Ws,[j(Gs,{items:i.items},{default:b(()=>[g(i.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}});const xn=x(Js,[["__scopeId","data-v-19908537"]]),Ks={discord:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>',facebook:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',github:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',instagram:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>',linkedin:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',mastodon:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Mastodon</title><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></svg>',slack:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Slack</title><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>',twitter:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z"/></svg>',x:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',youtube:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'},Us=["href","aria-label","innerHTML"],Qs=w({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(t){const e=t,n=T(()=>typeof e.icon=="object"?e.icon.svg:Ks[e.icon]);return(a,i)=>(c(),m("a",{class:"VPSocialLink no-icon",href:a.link,"aria-label":a.ariaLabel??(typeof a.icon=="string"?a.icon:""),target:"_blank",rel:"noopener",innerHTML:n.value},null,8,Us))}});const Xs=x(Qs,[["__scopeId","data-v-bd7c34ff"]]),Zs={class:"VPSocialLinks"},Ys=w({__name:"VPSocialLinks",props:{links:{}},setup(t){return(e,n)=>(c(),m("div",Zs,[(c(!0),m(G,null,X(e.links,({link:a,icon:i,ariaLabel:o})=>(c(),C(Xs,{key:a,icon:i,link:a,ariaLabel:o},null,8,["icon","link","ariaLabel"]))),128))]))}});const zn=x(Ys,[["__scopeId","data-v-483bd59c"]]),er={key:0,class:"group translations"},nr={class:"trans-title"},tr={key:1,class:"group"},ar={class:"item appearance"},ir={class:"label"},or={class:"appearance-action"},sr={key:2,class:"group"},rr={class:"item social-links"},lr=w({__name:"VPNavBarExtra",setup(t){const{site:e,theme:n}=A(),{localeLinks:a,currentLang:i}=Ae({correspondingLink:!0}),o=T(()=>a.value.length&&i.value.label||e.value.appearance||n.value.socialLinks);return(s,l)=>o.value?(c(),C(xn,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:b(()=>[u(a).length&&u(i).label?(c(),m("div",er,[d("p",nr,I(u(i).label),1),(c(!0),m(G,null,X(u(a),r=>(c(),C(Ue,{key:r.link,item:r},null,8,["item"]))),128))])):S("",!0),u(e).appearance?(c(),m("div",tr,[d("div",ar,[d("p",ir,I(u(n).darkModeSwitchLabel||"Appearance"),1),d("div",or,[j(Mn)])])])):S("",!0),u(n).socialLinks?(c(),m("div",sr,[d("div",rr,[j(zn,{class:"social-links-list",links:u(n).socialLinks},null,8,["links"])])])):S("",!0)]),_:1})):S("",!0)}});const cr=x(lr,[["__scopeId","data-v-43da03e4"]]),ur=t=>(oe("data-v-c7027d6e"),t=t(),se(),t),dr=["aria-expanded"],mr=ur(()=>d("span",{class:"container"},[d("span",{class:"top"}),d("span",{class:"middle"}),d("span",{class:"bottom"})],-1)),pr=[mr],hr=w({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(t){return(e,n)=>(c(),m("button",{type:"button",class:q(["VPNavBarHamburger",{active:e.active}]),"aria-label":"mobile navigation","aria-expanded":e.active,"aria-controls":"VPNavScreen",onClick:n[0]||(n[0]=a=>e.$emit("click"))},pr,10,dr))}});const gr=x(hr,[["__scopeId","data-v-c7027d6e"]]),fr=["innerHTML"],vr=w({__name:"VPNavBarMenuLink",props:{item:{}},setup(t){const{page:e}=A();return(n,a)=>(c(),C(ge,{class:q({VPNavBarMenuLink:!0,active:u(be)(u(e).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,target:n.item.target,rel:n.item.rel,tabindex:"0"},{default:b(()=>[d("span",{innerHTML:n.item.text},null,8,fr)]),_:1},8,["class","href","target","rel"]))}});const _r=x(vr,[["__scopeId","data-v-0d02db25"]]),kr=w({__name:"VPNavBarMenuGroup",props:{item:{}},setup(t){const e=t,{page:n}=A(),a=o=>"link"in o?be(n.value.relativePath,o.link,!!e.item.activeMatch):o.items.some(a),i=T(()=>a(e.item));return(o,s)=>(c(),C(xn,{class:q({VPNavBarMenuGroup:!0,active:u(be)(u(n).relativePath,o.item.activeMatch,!!o.item.activeMatch)||i.value}),button:o.item.text,items:o.item.items},null,8,["class","button","items"]))}}),br=t=>(oe("data-v-ed562961"),t=t(),se(),t),yr={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},jr=br(()=>d("span",{id:"main-nav-aria-label",class:"visually-hidden"},"Main Navigation",-1)),wr=w({__name:"VPNavBarMenu",setup(t){const{theme:e}=A();return(n,a)=>u(e).nav?(c(),m("nav",yr,[jr,(c(!0),m(G,null,X(u(e).nav,i=>(c(),m(G,{key:i.text},["link"in i?(c(),C(_r,{key:0,item:i},null,8,["item"])):(c(),C(kr,{key:1,item:i},null,8,["item"]))],64))),128))])):S("",!0)}});const Mr=x(wr,[["__scopeId","data-v-ed562961"]]);var In;const ft=typeof window<"u",Sr=t=>typeof t=="string",Ge=()=>{};ft&&((In=window==null?void 0:window.navigator)!=null&&In.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function ln(t){return typeof t=="function"?t():u(t)}function xr(t,e){function n(...a){t(()=>e.apply(this,a),{fn:e,thisArg:this,args:a})}return n}function zr(t,e={}){let n,a;return i=>{const o=ln(t),s=ln(e.maxWait);if(n&&clearTimeout(n),o<=0||s!==void 0&&s<=0)return a&&(clearTimeout(a),a=null),i();s&&!a&&(a=setTimeout(()=>{n&&clearTimeout(n),a=null,i()},s)),n=setTimeout(()=>{a&&clearTimeout(a),a=null,i()},o)}}function $r(t){return t}function Tr(t){return lt()?(ct(t),!0):!1}function vt(t,e=200,n={}){return xr(zr(e,n),t)}function nn(t,e=200,n={}){if(e<=0)return t;const a=L(t.value),i=vt(()=>{a.value=t.value},e,n);return R(t,()=>i()),a}function _t(t,e,n){return R(t,(a,i,o)=>{a&&e(a,i,o)},n)}function Lr(t){var e;const n=ln(t);return(e=n==null?void 0:n.$el)!=null?e:n}const kt=ft?window:void 0;function De(...t){let e,n,a,i;if(Sr(t[0])?([n,a,i]=t,e=kt):[e,n,a,i]=t,!e)return Ge;let o=Ge;const s=R(()=>Lr(e),r=>{o(),r&&(r.addEventListener(n,a,i),o=()=>{r.removeEventListener(n,a,i),o=Ge})},{immediate:!0,flush:"post"}),l=()=>{s(),o()};return Tr(l),l}const An=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Vn="__vueuse_ssr_handlers__";An[Vn]=An[Vn]||{};const Cr={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function Nr(t={}){const{reactive:e=!1,target:n=kt,aliasMap:a=Cr,passive:i=!0,onEventFired:o=Ge}=t,s=Ce(new Set),l={toJSON(){return{}},current:s},r=e?Ce(l):l,p=new Set,h=new Set;function k(_,v){_ in r&&(e?r[_]=v:r[_].value=v)}function f(){for(const _ of h)k(_,!1)}function y(_,v){var P,O;const V=(P=_.key)==null?void 0:P.toLowerCase(),H=[(O=_.code)==null?void 0:O.toLowerCase(),V].filter(Boolean);V&&(v?s.add(V):s.delete(V));for(const J of H)h.add(J),k(J,v);V==="meta"&&!v?(p.forEach(J=>{s.delete(J),k(J,!1)}),p.clear()):typeof _.getModifierState=="function"&&_.getModifierState("Meta")&&v&&[...s,...H].forEach(J=>p.add(J))}De(n,"keydown",_=>(y(_,!0),o(_)),{passive:i}),De(n,"keyup",_=>(y(_,!1),o(_)),{passive:i}),De("blur",f,{passive:!0}),De("focus",f,{passive:!0});const M=new Proxy(r,{get(_,v,P){if(typeof v!="string")return Reflect.get(_,v,P);if(v=v.toLowerCase(),v in a&&(v=a[v]),!(v in r))if(/[+_-]/.test(v)){const V=v.split(/[+_-]/g).map(H=>H.trim());r[v]=T(()=>V.every(H=>u(M[H])))}else r[v]=L(!1);const O=Reflect.get(_,v,P);return e?u(O):O}});return M}var En;(function(t){t.UP="UP",t.RIGHT="RIGHT",t.DOWN="DOWN",t.LEFT="LEFT",t.NONE="NONE"})(En||(En={}));var Pr=Object.defineProperty,Dn=Object.getOwnPropertySymbols,Ir=Object.prototype.hasOwnProperty,Ar=Object.prototype.propertyIsEnumerable,qn=(t,e,n)=>e in t?Pr(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,Vr=(t,e)=>{for(var n in e||(e={}))Ir.call(e,n)&&qn(t,n,e[n]);if(Dn)for(var n of Dn(e))Ar.call(e,n)&&qn(t,n,e[n]);return t};const Er={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};Vr({linear:$r},Er);function ue(t){return Array.isArray?Array.isArray(t):jt(t)==="[object Array]"}const Dr=1/0;function qr(t){if(typeof t=="string")return t;let e=t+"";return e=="0"&&1/t==-Dr?"-0":e}function Or(t){return t==null?"":qr(t)}function re(t){return typeof t=="string"}function bt(t){return typeof t=="number"}function Fr(t){return t===!0||t===!1||Gr(t)&&jt(t)=="[object Boolean]"}function yt(t){return typeof t=="object"}function Gr(t){return yt(t)&&t!==null}function ae(t){return t!=null}function tn(t){return!t.trim().length}function jt(t){return t==null?t===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(t)}const Hr="Incorrect 'index' type",Br=t=>`Invalid value for key ${t}`,Rr=t=>`Pattern length exceeds max of ${t}.`,Wr=t=>`Missing ${t} property in key`,Jr=t=>`Property 'weight' in key '${t}' must be a positive integer`,On=Object.prototype.hasOwnProperty;class Kr{constructor(e){this._keys=[],this._keyMap={};let n=0;e.forEach(a=>{let i=wt(a);n+=i.weight,this._keys.push(i),this._keyMap[i.id]=i,n+=i.weight}),this._keys.forEach(a=>{a.weight/=n})}get(e){return this._keyMap[e]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function wt(t){let e=null,n=null,a=null,i=1,o=null;if(re(t)||ue(t))a=t,e=Fn(t),n=cn(t);else{if(!On.call(t,"name"))throw new Error(Wr("name"));const s=t.name;if(a=s,On.call(t,"weight")&&(i=t.weight,i<=0))throw new Error(Jr(s));e=Fn(s),n=cn(s),o=t.getFn}return{path:e,id:n,weight:i,src:a,getFn:o}}function Fn(t){return ue(t)?t:t.split(".")}function cn(t){return ue(t)?t.join("."):t}function Ur(t,e){let n=[],a=!1;const i=(o,s,l)=>{if(ae(o))if(!s[l])n.push(o);else{let r=s[l];const p=o[r];if(!ae(p))return;if(l===s.length-1&&(re(p)||bt(p)||Fr(p)))n.push(Or(p));else if(ue(p)){a=!0;for(let h=0,k=p.length;h<k;h+=1)i(p[h],s,l+1)}else s.length&&i(p,s,l+1)}};return i(t,re(e)?e.split("."):e,0),a?n:n[0]}const Qr={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},Xr={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(t,e)=>t.score===e.score?t.idx<e.idx?-1:1:t.score<e.score?-1:1},Zr={location:0,threshold:.6,distance:100},Yr={useExtendedSearch:!1,getFn:Ur,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var N={...Xr,...Qr,...Zr,...Yr};const el=/[^ ]+/g;function nl(t=1,e=3){const n=new Map,a=Math.pow(10,e);return{get(i){const o=i.match(el).length;if(n.has(o))return n.get(o);const s=1/Math.pow(o,.5*t),l=parseFloat(Math.round(s*a)/a);return n.set(o,l),l},clear(){n.clear()}}}class $n{constructor({getFn:e=N.getFn,fieldNormWeight:n=N.fieldNormWeight}={}){this.norm=nl(n,3),this.getFn=e,this.isCreated=!1,this.setIndexRecords()}setSources(e=[]){this.docs=e}setIndexRecords(e=[]){this.records=e}setKeys(e=[]){this.keys=e,this._keysMap={},e.forEach((n,a)=>{this._keysMap[n.id]=a})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,re(this.docs[0])?this.docs.forEach((e,n)=>{this._addString(e,n)}):this.docs.forEach((e,n)=>{this._addObject(e,n)}),this.norm.clear())}add(e){const n=this.size();re(e)?this._addString(e,n):this._addObject(e,n)}removeAt(e){this.records.splice(e,1);for(let n=e,a=this.size();n<a;n+=1)this.records[n].i-=1}getValueForItemAtKeyId(e,n){return e[this._keysMap[n]]}size(){return this.records.length}_addString(e,n){if(!ae(e)||tn(e))return;let a={v:e,i:n,n:this.norm.get(e)};this.records.push(a)}_addObject(e,n){let a={i:n,$:{}};this.keys.forEach((i,o)=>{let s=i.getFn?i.getFn(e):this.getFn(e,i.path);if(ae(s)){if(ue(s)){let l=[];const r=[{nestedArrIndex:-1,value:s}];for(;r.length;){const{nestedArrIndex:p,value:h}=r.pop();if(ae(h))if(re(h)&&!tn(h)){let k={v:h,i:p,n:this.norm.get(h)};l.push(k)}else ue(h)&&h.forEach((k,f)=>{r.push({nestedArrIndex:f,value:k})})}a.$[o]=l}else if(re(s)&&!tn(s)){let l={v:s,n:this.norm.get(s)};a.$[o]=l}}}),this.records.push(a)}toJSON(){return{keys:this.keys,records:this.records}}}function Mt(t,e,{getFn:n=N.getFn,fieldNormWeight:a=N.fieldNormWeight}={}){const i=new $n({getFn:n,fieldNormWeight:a});return i.setKeys(t.map(wt)),i.setSources(e),i.create(),i}function tl(t,{getFn:e=N.getFn,fieldNormWeight:n=N.fieldNormWeight}={}){const{keys:a,records:i}=t,o=new $n({getFn:e,fieldNormWeight:n});return o.setKeys(a),o.setIndexRecords(i),o}function qe(t,{errors:e=0,currentLocation:n=0,expectedLocation:a=0,distance:i=N.distance,ignoreLocation:o=N.ignoreLocation}={}){const s=e/t.length;if(o)return s;const l=Math.abs(a-n);return i?s+l/i:l?1:s}function al(t=[],e=N.minMatchCharLength){let n=[],a=-1,i=-1,o=0;for(let s=t.length;o<s;o+=1){let l=t[o];l&&a===-1?a=o:!l&&a!==-1&&(i=o-1,i-a+1>=e&&n.push([a,i]),a=-1)}return t[o-1]&&o-a>=e&&n.push([a,o-1]),n}const _e=32;function il(t,e,n,{location:a=N.location,distance:i=N.distance,threshold:o=N.threshold,findAllMatches:s=N.findAllMatches,minMatchCharLength:l=N.minMatchCharLength,includeMatches:r=N.includeMatches,ignoreLocation:p=N.ignoreLocation}={}){if(e.length>_e)throw new Error(Rr(_e));const h=e.length,k=t.length,f=Math.max(0,Math.min(a,k));let y=o,M=f;const _=l>1||r,v=_?Array(k):[];let P;for(;(P=t.indexOf(e,M))>-1;){let Q=qe(e,{currentLocation:P,expectedLocation:f,distance:i,ignoreLocation:p});if(y=Math.min(Q,y),M=P+h,_){let Y=0;for(;Y<h;)v[P+Y]=1,Y+=1}}M=-1;let O=[],V=1,H=h+k;const J=1<<h-1;for(let Q=0;Q<h;Q+=1){let Y=0,K=H;for(;Y<K;)qe(e,{errors:Q,currentLocation:f+K,expectedLocation:f,distance:i,ignoreLocation:p})<=y?Y=K:H=K,K=Math.floor((H-Y)/2+Y);H=K;let Me=Math.max(1,f-K+1),le=s?k:Math.min(f+K,k)+h,te=Array(le+2);te[le+1]=(1<<Q)-1;for(let z=le;z>=Me;z-=1){let D=z-1,U=n[t.charAt(D)];if(_&&(v[D]=+!!U),te[z]=(te[z+1]<<1|1)&U,Q&&(te[z]|=(O[z+1]|O[z])<<1|1|O[z+1]),te[z]&J&&(V=qe(e,{errors:Q,currentLocation:D,expectedLocation:f,distance:i,ignoreLocation:p}),V<=y)){if(y=V,M=D,M<=f)break;Me=Math.max(1,2*f-M)}}if(qe(e,{errors:Q+1,currentLocation:f,expectedLocation:f,distance:i,ignoreLocation:p})>y)break;O=te}const Z={isMatch:M>=0,score:Math.max(.001,V)};if(_){const Q=al(v,l);Q.length?r&&(Z.indices=Q):Z.isMatch=!1}return Z}function ol(t){let e={};for(let n=0,a=t.length;n<a;n+=1){const i=t.charAt(n);e[i]=(e[i]||0)|1<<a-n-1}return e}class St{constructor(e,{location:n=N.location,threshold:a=N.threshold,distance:i=N.distance,includeMatches:o=N.includeMatches,findAllMatches:s=N.findAllMatches,minMatchCharLength:l=N.minMatchCharLength,isCaseSensitive:r=N.isCaseSensitive,ignoreLocation:p=N.ignoreLocation}={}){if(this.options={location:n,threshold:a,distance:i,includeMatches:o,findAllMatches:s,minMatchCharLength:l,isCaseSensitive:r,ignoreLocation:p},this.pattern=r?e:e.toLowerCase(),this.chunks=[],!this.pattern.length)return;const h=(f,y)=>{this.chunks.push({pattern:f,alphabet:ol(f),startIndex:y})},k=this.pattern.length;if(k>_e){let f=0;const y=k%_e,M=k-y;for(;f<M;)h(this.pattern.substr(f,_e),f),f+=_e;if(y){const _=k-_e;h(this.pattern.substr(_),_)}}else h(this.pattern,0)}searchIn(e){const{isCaseSensitive:n,includeMatches:a}=this.options;if(n||(e=e.toLowerCase()),this.pattern===e){let M={isMatch:!0,score:0};return a&&(M.indices=[[0,e.length-1]]),M}const{location:i,distance:o,threshold:s,findAllMatches:l,minMatchCharLength:r,ignoreLocation:p}=this.options;let h=[],k=0,f=!1;this.chunks.forEach(({pattern:M,alphabet:_,startIndex:v})=>{const{isMatch:P,score:O,indices:V}=il(e,M,_,{location:i+v,distance:o,threshold:s,findAllMatches:l,minMatchCharLength:r,includeMatches:a,ignoreLocation:p});P&&(f=!0),k+=O,P&&V&&(h=[...h,...V])});let y={isMatch:f,score:f?k/this.chunks.length:1};return f&&a&&(y.indices=h),y}}class fe{constructor(e){this.pattern=e}static isMultiMatch(e){return Gn(e,this.multiRegex)}static isSingleMatch(e){return Gn(e,this.singleRegex)}search(){}}function Gn(t,e){const n=t.match(e);return n?n[1]:null}class sl extends fe{constructor(e){super(e)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(e){const n=e===this.pattern;return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class rl extends fe{constructor(e){super(e)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(e){const n=e.indexOf(this.pattern)===-1;return{isMatch:n,score:n?0:1,indices:[0,e.length-1]}}}class ll extends fe{constructor(e){super(e)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(e){const n=e.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class cl extends fe{constructor(e){super(e)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(e){const n=!e.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,e.length-1]}}}class ul extends fe{constructor(e){super(e)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(e){const n=e.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[e.length-this.pattern.length,e.length-1]}}}class dl extends fe{constructor(e){super(e)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(e){const n=!e.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,e.length-1]}}}class xt extends fe{constructor(e,{location:n=N.location,threshold:a=N.threshold,distance:i=N.distance,includeMatches:o=N.includeMatches,findAllMatches:s=N.findAllMatches,minMatchCharLength:l=N.minMatchCharLength,isCaseSensitive:r=N.isCaseSensitive,ignoreLocation:p=N.ignoreLocation}={}){super(e),this._bitapSearch=new St(e,{location:n,threshold:a,distance:i,includeMatches:o,findAllMatches:s,minMatchCharLength:l,isCaseSensitive:r,ignoreLocation:p})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(e){return this._bitapSearch.searchIn(e)}}class zt extends fe{constructor(e){super(e)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(e){let n=0,a;const i=[],o=this.pattern.length;for(;(a=e.indexOf(this.pattern,n))>-1;)n=a+o,i.push([a,n-1]);const s=!!i.length;return{isMatch:s,score:s?0:1,indices:i}}}const un=[sl,zt,ll,cl,dl,ul,rl,xt],Hn=un.length,ml=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,pl="|";function hl(t,e={}){return t.split(pl).map(n=>{let a=n.trim().split(ml).filter(o=>o&&!!o.trim()),i=[];for(let o=0,s=a.length;o<s;o+=1){const l=a[o];let r=!1,p=-1;for(;!r&&++p<Hn;){const h=un[p];let k=h.isMultiMatch(l);k&&(i.push(new h(k,e)),r=!0)}if(!r)for(p=-1;++p<Hn;){const h=un[p];let k=h.isSingleMatch(l);if(k){i.push(new h(k,e));break}}}return i})}const gl=new Set([xt.type,zt.type]);class fl{constructor(e,{isCaseSensitive:n=N.isCaseSensitive,includeMatches:a=N.includeMatches,minMatchCharLength:i=N.minMatchCharLength,ignoreLocation:o=N.ignoreLocation,findAllMatches:s=N.findAllMatches,location:l=N.location,threshold:r=N.threshold,distance:p=N.distance}={}){this.query=null,this.options={isCaseSensitive:n,includeMatches:a,minMatchCharLength:i,findAllMatches:s,ignoreLocation:o,location:l,threshold:r,distance:p},this.pattern=n?e:e.toLowerCase(),this.query=hl(this.pattern,this.options)}static condition(e,n){return n.useExtendedSearch}searchIn(e){const n=this.query;if(!n)return{isMatch:!1,score:1};const{includeMatches:a,isCaseSensitive:i}=this.options;e=i?e:e.toLowerCase();let o=0,s=[],l=0;for(let r=0,p=n.length;r<p;r+=1){const h=n[r];s.length=0,o=0;for(let k=0,f=h.length;k<f;k+=1){const y=h[k],{isMatch:M,indices:_,score:v}=y.search(e);if(M){if(o+=1,l+=v,a){const P=y.constructor.type;gl.has(P)?s=[...s,..._]:s.push(_)}}else{l=0,o=0,s.length=0;break}}if(o){let k={isMatch:!0,score:l/o};return a&&(k.indices=s),k}}return{isMatch:!1,score:1}}}const dn=[];function vl(...t){dn.push(...t)}function mn(t,e){for(let n=0,a=dn.length;n<a;n+=1){let i=dn[n];if(i.condition(t,e))return new i(t,e)}return new St(t,e)}const Re={AND:"$and",OR:"$or"},pn={PATH:"$path",PATTERN:"$val"},hn=t=>!!(t[Re.AND]||t[Re.OR]),_l=t=>!!t[pn.PATH],kl=t=>!ue(t)&&yt(t)&&!hn(t),Bn=t=>({[Re.AND]:Object.keys(t).map(e=>({[e]:t[e]}))});function $t(t,e,{auto:n=!0}={}){const a=i=>{let o=Object.keys(i);const s=_l(i);if(!s&&o.length>1&&!hn(i))return a(Bn(i));if(kl(i)){const r=s?i[pn.PATH]:o[0],p=s?i[pn.PATTERN]:i[r];if(!re(p))throw new Error(Br(r));const h={keyId:cn(r),pattern:p};return n&&(h.searcher=mn(p,e)),h}let l={children:[],operator:o[0]};return o.forEach(r=>{const p=i[r];ue(p)&&p.forEach(h=>{l.children.push(a(h))})}),l};return hn(t)||(t=Bn(t)),a(t)}function bl(t,{ignoreFieldNorm:e=N.ignoreFieldNorm}){t.forEach(n=>{let a=1;n.matches.forEach(({key:i,norm:o,score:s})=>{const l=i?i.weight:null;a*=Math.pow(s===0&&l?Number.EPSILON:s,(l||1)*(e?1:o))}),n.score=a})}function yl(t,e){const n=t.matches;e.matches=[],ae(n)&&n.forEach(a=>{if(!ae(a.indices)||!a.indices.length)return;const{indices:i,value:o}=a;let s={indices:i,value:o};a.key&&(s.key=a.key.src),a.idx>-1&&(s.refIndex=a.idx),e.matches.push(s)})}function jl(t,e){e.score=t.score}function wl(t,e,{includeMatches:n=N.includeMatches,includeScore:a=N.includeScore}={}){const i=[];return n&&i.push(yl),a&&i.push(jl),t.map(o=>{const{idx:s}=o,l={item:e[s],refIndex:s};return i.length&&i.forEach(r=>{r(o,l)}),l})}class ye{constructor(e,n={},a){this.options={...N,...n},this.options.useExtendedSearch,this._keyStore=new Kr(this.options.keys),this.setCollection(e,a)}setCollection(e,n){if(this._docs=e,n&&!(n instanceof $n))throw new Error(Hr);this._myIndex=n||Mt(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(e){!ae(e)||(this._docs.push(e),this._myIndex.add(e))}remove(e=()=>!1){const n=[];for(let a=0,i=this._docs.length;a<i;a+=1){const o=this._docs[a];e(o,a)&&(this.removeAt(a),a-=1,i-=1,n.push(o))}return n}removeAt(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}getIndex(){return this._myIndex}search(e,{limit:n=-1}={}){const{includeMatches:a,includeScore:i,shouldSort:o,sortFn:s,ignoreFieldNorm:l}=this.options;let r=re(e)?re(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e);return bl(r,{ignoreFieldNorm:l}),o&&r.sort(s),bt(n)&&n>-1&&(r=r.slice(0,n)),wl(r,this._docs,{includeMatches:a,includeScore:i})}_searchStringList(e){const n=mn(e,this.options),{records:a}=this._myIndex,i=[];return a.forEach(({v:o,i:s,n:l})=>{if(!ae(o))return;const{isMatch:r,score:p,indices:h}=n.searchIn(o);r&&i.push({item:o,idx:s,matches:[{score:p,value:o,norm:l,indices:h}]})}),i}_searchLogical(e){const n=$t(e,this.options),a=(l,r,p)=>{if(!l.children){const{keyId:k,searcher:f}=l,y=this._findMatches({key:this._keyStore.get(k),value:this._myIndex.getValueForItemAtKeyId(r,k),searcher:f});return y&&y.length?[{idx:p,item:r,matches:y}]:[]}const h=[];for(let k=0,f=l.children.length;k<f;k+=1){const y=l.children[k],M=a(y,r,p);if(M.length)h.push(...M);else if(l.operator===Re.AND)return[]}return h},i=this._myIndex.records,o={},s=[];return i.forEach(({$:l,i:r})=>{if(ae(l)){let p=a(n,l,r);p.length&&(o[r]||(o[r]={idx:r,item:l,matches:[]},s.push(o[r])),p.forEach(({matches:h})=>{o[r].matches.push(...h)}))}}),s}_searchObjectList(e){const n=mn(e,this.options),{keys:a,records:i}=this._myIndex,o=[];return i.forEach(({$:s,i:l})=>{if(!ae(s))return;let r=[];a.forEach((p,h)=>{r.push(...this._findMatches({key:p,value:s[h],searcher:n}))}),r.length&&o.push({idx:l,item:s,matches:r})}),o}_findMatches({key:e,value:n,searcher:a}){if(!ae(n))return[];let i=[];if(ue(n))n.forEach(({v:o,i:s,n:l})=>{if(!ae(o))return;const{isMatch:r,score:p,indices:h}=a.searchIn(o);r&&i.push({score:p,key:e,value:o,idx:s,norm:l,indices:h})});else{const{v:o,n:s}=n,{isMatch:l,score:r,indices:p}=a.searchIn(o);l&&i.push({score:r,key:e,value:o,norm:s,indices:p})}return i}}ye.version="6.6.2";ye.createIndex=Mt;ye.parseIndex=tl;ye.config=N;ye.parseQuery=$t;vl(fl);const Rn=Ce({selectedNode:"",selectedGroup:"",search:"",dataValue:"",filtered:{count:0,items:new Map,groups:new Set}}),$e=()=>({isSearching:T(()=>Rn.search!==""),...Ot(Rn)});function Ml(t){return{all:t=t||new Map,on:function(e,n){var a=t.get(e);a?a.push(n):t.set(e,[n])},off:function(e,n){var a=t.get(e);a&&(n?a.splice(a.indexOf(n)>>>0,1):t.set(e,[]))},emit:function(e,n){var a=t.get(e);a&&a.slice().map(function(i){i(n)}),(a=t.get("*"))&&a.slice().map(function(i){i(e,n)})}}}const Sl=Ml(),Qe=()=>({emitter:Sl});function xl(t,e){let n=t.nextElementSibling;for(;n;){if(n.matches(e))return n;n=n.nextElementSibling}}function zl(t,e){let n=t.previousElementSibling;for(;n;){if(n.matches(e))return n;n=n.previousElementSibling}}const $l=["command-theme"],Tl={"command-root":""},Ll=w({name:"Command"}),Cl=w({...Ll,props:{theme:{type:String,default:"default"},fuseOptions:{type:Object,default:()=>({threshold:.2,keys:["label"]})}},emits:["select-item"],setup(t,{emit:e}){const n=t,a='[command-item=""]',i="command-item-key",o='[command-group=""]',s="command-group-key",l='[command-group-heading=""]',r=`${a}:not([aria-disabled="true"])`,p=`${a}[aria-selected="true"]`,h="command-item-select",k="data-value";_n("theme",n.theme||"default");const{selectedNode:f,search:y,dataValue:M,filtered:_}=$e(),{emitter:v}=Qe(),P=L(),O=nn(L(new Map),333),V=nn(L(new Set),333),H=nn(L(new Map)),J=T(()=>{const $=[];for(const[F,E]of O.value.entries())$.push({key:F,label:E});return $}),Z=T(()=>{const $=ye.createIndex(n.fuseOptions.keys,J.value);return new ye(J.value,n.fuseOptions,$)}),Q=()=>{var $,F,E;const B=Y();B&&((($=B.parentElement)==null?void 0:$.firstElementChild)===B&&((E=(F=B.closest(o))==null?void 0:F.querySelector(l))==null||E.scrollIntoView({block:"nearest"})),B.scrollIntoView({block:"nearest"}))},Y=()=>{var $;return($=P.value)==null?void 0:$.querySelector(p)},K=($=P.value)=>{const F=$==null?void 0:$.querySelectorAll(r);return F?Array.from(F):[]},Me=()=>{var $;const F=($=P.value)==null?void 0:$.querySelectorAll(o);return F?Array.from(F):[]},le=()=>{const[$]=K();$&&$.getAttribute(i)&&(f.value=$.getAttribute(i)||"")},te=$=>{const F=K()[$];F&&(f.value=F.getAttribute(i)||"")},z=$=>{const F=Y(),E=K(),B=E.findIndex(Ee=>Ee===F),pe=E[B+$];pe?f.value=pe.getAttribute(i)||"":$>0?te(0):te(E.length-1)},D=$=>{const F=Y();let E=F==null?void 0:F.closest(o),B=null;for(;E&&!B;)E=$>0?xl(E,o):zl(E,o),B=E==null?void 0:E.querySelector(r);B?f.value=B.getAttribute(i)||"":z($)},U=()=>te(0),W=()=>te(K().length-1),Se=$=>{$.preventDefault(),$.metaKey?W():$.altKey?D(1):z(1)},Ze=$=>{$.preventDefault(),$.metaKey?U():$.altKey?D(-1):z(-1)},Ye=$=>{switch($.key){case"n":case"j":{$.ctrlKey&&Se($);break}case"ArrowDown":{Se($);break}case"p":case"k":{$.ctrlKey&&Ze($);break}case"ArrowUp":{Ze($);break}case"Home":{U();break}case"End":{W();break}case"Enter":{const F=Y();if(F){const E=new Event(h);F.dispatchEvent(E)}}}},ne=()=>{if(!y.value){_.value.count=V.value.size;return}_.value.groups=new Set("");const $=new Map,F=Z.value.search(y.value).map(E=>E.item);for(const{key:E,label:B}of F)$.set(E,B);for(const[E,B]of H.value)for(const pe of B)$.get(pe)&&_.value.groups.add(E);ce(()=>{_.value.count=$.size,_.value.items=$})},ve=()=>{const $=K(),F=Me();for(const E of $){const B=E.getAttribute(i)||"",pe=E.getAttribute(k)||"";V.value.add(B),O.value.set(B,pe),_.value.count=O.value.size}for(const E of F){const B=K(E),pe=E.getAttribute(s)||"",Ee=new Set("");for(const It of B){const At=It.getAttribute(i)||"";Ee.add(At)}H.value.set(pe,Ee)}};R(()=>f.value,$=>{$&&ce(Q)},{deep:!0}),R(()=>y.value,$=>{ne(),ce(le)}),v.on("selectItem",$=>{e("select-item",$)});const Pt=vt($=>{$&&(ve(),ce(le))},100);return v.on("rerenderList",Pt),de(()=>{ve(),le()}),($,F)=>(c(),m("div",{class:q(t.theme),onKeydown:Ye,ref_key:"commandRef",ref:P,"command-theme":t.theme},[d("div",Tl,[g($.$slots,"default")])],42,$l))}}),Te=(t,e)=>{const n=t.__vccOpts||t;for(const[a,i]of e)n[a]=i;return n},gn=Te(Cl,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/Command.vue"]]),Nl={"command-dialog":""},Pl={"command-dialog-mask":""},Il={"command-dialog-wrapper":""},Al={"command-dialog-header":""},Vl={"command-dialog-body":""},El={key:0,"command-dialog-footer":""},Dl=w({name:"Command.Dialog"}),ql=w({...Dl,props:{visible:{type:Boolean,required:!0},theme:{type:String,required:!0}},emits:["select-item"],setup(t,{emit:e}){const n=t,{search:a,filtered:i}=$e(),{emitter:o}=Qe(),s=L();o.on("selectItem",r=>{e("select-item",r)});const l=()=>{a.value="",i.value.count=0,i.value.items=new Map,i.value.groups=new Set};return _t(()=>n.visible,l),kn(l),(r,p)=>(c(),C(qt,{to:"body",ref_key:"dialogRef",ref:s},[j(We,{name:"command-dialog",appear:""},{default:b(()=>[t.visible?(c(),C(gn,{key:0,theme:t.theme},{default:b(()=>[d("div",Nl,[d("div",Pl,[d("div",Il,[d("div",Al,[g(r.$slots,"header")]),d("div",Vl,[g(r.$slots,"body")]),r.$slots.footer?(c(),m("div",El,[g(r.$slots,"footer")])):S("v-if",!0)])])])]),_:3},8,["theme"])):S("v-if",!0)]),_:3})],512))}}),Ol=Te(ql,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandDialog.vue"]]);let Tt=(t=21)=>crypto.getRandomValues(new Uint8Array(t)).reduce((e,n)=>(n&=63,n<36?e+=n.toString(36):n<62?e+=(n-26).toString(36).toUpperCase():n>62?e+="-":e+="_",e),"");const Fl=["command-group-key","data-value"],Gl={key:0,"command-group-heading":""},Hl={"command-group-items":"",role:"group"},Bl=w({name:"Command.Group"}),Rl=w({...Bl,props:{heading:{type:String,required:!0}},setup(t){const e=T(()=>`command-group-${Tt()}`),{filtered:n,isSearching:a}=$e(),i=T(()=>a.value?n.value.groups.has(e.value):!0);return(o,s)=>st((c(),m("div",{"command-group":"",role:"presentation",key:u(e),"command-group-key":u(e),"data-value":t.heading},[t.heading?(c(),m("div",Gl,I(t.heading),1)):S("v-if",!0),d("div",Hl,[g(o.$slots,"default")])],8,Fl)),[[rt,u(i)]])}}),Wl=Te(Rl,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandGroup.vue"]]),Jl=["placeholder","value"],Kl=w({name:"Command.Input"}),Ul=w({...Kl,props:{placeholder:{type:String,required:!0},value:{type:String,required:!1}},emits:["input","update:value"],setup(t,{emit:e}){const n=L(null),{search:a}=$e(),i=T(()=>a.value),o=s=>{const l=s,r=s.target;a.value=r==null?void 0:r.value,e("input",l),e("update:value",a.value)};return je(()=>{var s;(s=n.value)==null||s.focus()}),(s,l)=>(c(),m("input",{ref_key:"inputRef",ref:n,"command-input":"","auto-focus":"","auto-complete":"off","auto-correct":"off","spell-check":!1,"aria-autocomplete":"list",role:"combobox","aria-expanded":!0,placeholder:t.placeholder,value:u(i),onInput:o},null,40,Jl))}}),Ql=Te(Ul,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandInput.vue"]]),Xl=["aria-selected","aria-disabled","command-item-key"],Zl=w({name:"Command.Item"}),Yl=w({...Zl,props:{shortcut:{type:Array,required:!1},perform:{type:null,required:!1}},emits:["select"],setup(t,{emit:e}){const n=t,a="command-item-select",i="data-value",{current:o}=Nr(),{selectedNode:s,filtered:l,isSearching:r}=$e(),{emitter:p}=Qe(),h=L(),k=T(()=>`command-item-${Tt()}`),f=T(()=>{const _=l.value.items.get(k.value);return r.value?_!==void 0:!0}),y=T(()=>Array.from(o)),M=()=>{var _;const v={key:k.value,value:((_=h.value)==null?void 0:_.getAttribute(i))||""};e("select",v),p.emit("selectItem",v)};return _t(y,_=>{n.shortcut&&n.shortcut.length>0&&n.shortcut.every(v=>o.has(v.toLowerCase()))&&n.perform&&n.perform()}),je(()=>{var _;(_=h.value)==null||_.addEventListener(a,M)}),kn(()=>{var _;(_=h.value)==null||_.removeEventListener(a,M)}),(_,v)=>st((c(),m("div",{ref_key:"itemRef",ref:h,"command-item":"",role:"option","aria-selected":u(s)===u(k),"aria-disabled":!u(f),key:u(k),"command-item-key":u(k),onClick:M},[g(_.$slots,"default")],8,Xl)),[[rt,u(f)]])}}),ec=Te(Yl,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandItem.vue"]]),nc=w({name:"Command.List"}),tc=w({...nc,setup(t){const{emitter:e}=Qe(),n=L(),a=L();let i=null,o;return je(()=>{o=a.value;const s=n.value;o&&s&&(i=new ResizeObserver(l=>{ce(()=>{const r=o==null?void 0:o.offsetHeight;s==null||s.style.setProperty("--command-list-height",`${r==null?void 0:r.toFixed(1)}px`),e.emit("rerenderList",!0)})}),i.observe(o))}),kn(()=>{i!==null&&o&&i.unobserve(o)}),(s,l)=>(c(),m("div",{"command-list":"",role:"listbox","aria-label":"Suggestions",ref_key:"listRef",ref:n},[d("div",{"command-list-sizer":"",ref_key:"heightRef",ref:a},[g(s.$slots,"default")],512)],512))}}),ac=Te(tc,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandList.vue"]]),ic=w({name:"Command.Empty",setup(t,{attrs:e,slots:n}){const{filtered:a}=$e(),i=T(()=>a.value.count===0);return()=>i.value?He("div",{"command-empty":"",role:"presentation",...e},n):He("div",{"command-empty":"hidden",role:"presentation",style:{display:"none"},...e})}}),oc=w({name:"Command.Loading",setup(t,{attrs:e,slots:n}){return()=>He("div",{"command-loading":"",role:"progressbar",...e},n)}}),sc=w({name:"Command.Separator",setup(t,{attrs:e,slots:n}){return()=>He("div",{"command-separator":"",role:"separator",...e})}}),xe=Object.assign(gn,{Dialog:Ol,Empty:ic,Group:Wl,Input:Ql,Item:ec,List:ac,Loading:oc,Separator:sc,Root:gn});var Wn;const Tn=typeof window<"u",rc=t=>typeof t=="string",Pe=()=>{},lc=Tn&&((Wn=window==null?void 0:window.navigator)==null?void 0:Wn.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function Xe(t){return typeof t=="function"?t():u(t)}function cc(t,e){function n(...a){return new Promise((i,o)=>{Promise.resolve(t(()=>e.apply(this,a),{fn:e,thisArg:this,args:a})).then(i).catch(o)})}return n}function uc(t,e=!0,n=!0,a=!1){let i=0,o,s=!0,l=Pe,r;const p=()=>{o&&(clearTimeout(o),o=void 0,l(),l=Pe)};return k=>{const f=Xe(t),y=Date.now()-i,M=()=>r=k();return p(),f<=0?(i=Date.now(),M()):(y>f&&(n||!s)?(i=Date.now(),M()):e&&(r=new Promise((_,v)=>{l=a?v:_,o=setTimeout(()=>{i=Date.now(),s=!0,_(M()),p()},Math.max(0,f-y))})),!n&&!o&&(o=setTimeout(()=>s=!0,f)),s=!1,r)}}function dc(t){return t}function Ln(t){return lt()?(ct(t),!0):!1}function gd(t,e=200,n=!1,a=!0,i=!1){return cc(uc(e,n,a,i),t)}function Cn(t,e=!0){Ft()?de(t):e?t():ce(t)}function fd(t,e,n={}){const{immediate:a=!0}=n,i=L(!1);let o=null;function s(){o&&(clearTimeout(o),o=null)}function l(){i.value=!1,s()}function r(...p){s(),i.value=!0,o=setTimeout(()=>{i.value=!1,o=null,t(...p)},Xe(e))}return a&&(i.value=!0,Tn&&r()),Ln(l),{isPending:ot(i),start:r,stop:l}}function he(t){var e;const n=Xe(t);return(e=n==null?void 0:n.$el)!=null?e:n}const Ve=Tn?window:void 0;function ie(...t){let e,n,a,i;if(rc(t[0])||Array.isArray(t[0])?([n,a,i]=t,e=Ve):[e,n,a,i]=t,!e)return Pe;Array.isArray(n)||(n=[n]),Array.isArray(a)||(a=[a]);const o=[],s=()=>{o.forEach(h=>h()),o.length=0},l=(h,k,f,y)=>(h.addEventListener(k,f,y),()=>h.removeEventListener(k,f,y)),r=R(()=>[he(e),Xe(i)],([h,k])=>{s(),h&&o.push(...n.flatMap(f=>a.map(y=>l(h,f,y,k))))},{immediate:!0,flush:"post"}),p=()=>{r(),s()};return Ln(p),p}let Jn=!1;function vd(t,e,n={}){const{window:a=Ve,ignore:i=[],capture:o=!0,detectIframe:s=!1}=n;if(!a)return;lc&&!Jn&&(Jn=!0,Array.from(a.document.body.children).forEach(f=>f.addEventListener("click",Pe)));let l=!0;const r=f=>i.some(y=>{if(typeof y=="string")return Array.from(a.document.querySelectorAll(y)).some(M=>M===f.target||f.composedPath().includes(M));{const M=he(y);return M&&(f.target===M||f.composedPath().includes(M))}}),h=[ie(a,"click",f=>{const y=he(t);if(!(!y||y===f.target||f.composedPath().includes(y))){if(f.detail===0&&(l=!r(f)),!l){l=!0;return}e(f)}},{passive:!0,capture:o}),ie(a,"pointerdown",f=>{const y=he(t);y&&(l=!f.composedPath().includes(y)&&!r(f))},{passive:!0}),s&&ie(a,"blur",f=>{var y;const M=he(t);((y=a.document.activeElement)==null?void 0:y.tagName)==="IFRAME"&&!(M!=null&&M.contains(a.document.activeElement))&&e(f)})].filter(Boolean);return()=>h.forEach(f=>f())}function mc(t,e=!1){const n=L(),a=()=>n.value=!!t();return a(),Cn(a,e),n}const Kn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Un="__vueuse_ssr_handlers__";Kn[Un]=Kn[Un]||{};var Qn=Object.getOwnPropertySymbols,pc=Object.prototype.hasOwnProperty,hc=Object.prototype.propertyIsEnumerable,gc=(t,e)=>{var n={};for(var a in t)pc.call(t,a)&&e.indexOf(a)<0&&(n[a]=t[a]);if(t!=null&&Qn)for(var a of Qn(t))e.indexOf(a)<0&&hc.call(t,a)&&(n[a]=t[a]);return n};function fc(t,e,n={}){const a=n,{window:i=Ve}=a,o=gc(a,["window"]);let s;const l=mc(()=>i&&"ResizeObserver"in i),r=()=>{s&&(s.disconnect(),s=void 0)},p=R(()=>he(t),k=>{r(),l.value&&i&&k&&(s=new ResizeObserver(e),s.observe(k,o))},{immediate:!0,flush:"post"}),h=()=>{r(),p()};return Ln(h),{isSupported:l,stop:h}}function _d(t,e={}){const{reset:n=!0,windowResize:a=!0,windowScroll:i=!0,immediate:o=!0}=e,s=L(0),l=L(0),r=L(0),p=L(0),h=L(0),k=L(0),f=L(0),y=L(0);function M(){const _=he(t);if(!_){n&&(s.value=0,l.value=0,r.value=0,p.value=0,h.value=0,k.value=0,f.value=0,y.value=0);return}const v=_.getBoundingClientRect();s.value=v.height,l.value=v.bottom,r.value=v.left,p.value=v.right,h.value=v.top,k.value=v.width,f.value=v.x,y.value=v.y}return fc(t,M),R(()=>he(t),_=>!_&&M()),i&&ie("scroll",M,{capture:!0,passive:!0}),a&&ie("resize",M,{passive:!0}),Cn(()=>{o&&M()}),{height:s,bottom:l,left:r,right:p,top:h,width:k,x:f,y,update:M}}const vc={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function _c(t={}){const{reactive:e=!1,target:n=Ve,aliasMap:a=vc,passive:i=!0,onEventFired:o=Pe}=t,s=Ce(new Set),l={toJSON(){return{}},current:s},r=e?Ce(l):l,p=new Set,h=new Set;function k(_,v){_ in r&&(e?r[_]=v:r[_].value=v)}function f(){s.clear();for(const _ of h)k(_,!1)}function y(_,v){var P,O;const V=(P=_.key)==null?void 0:P.toLowerCase(),J=[(O=_.code)==null?void 0:O.toLowerCase(),V].filter(Boolean);V&&(v?s.add(V):s.delete(V));for(const Z of J)h.add(Z),k(Z,v);V==="meta"&&!v?(p.forEach(Z=>{s.delete(Z),k(Z,!1)}),p.clear()):typeof _.getModifierState=="function"&&_.getModifierState("Meta")&&v&&[...s,...J].forEach(Z=>p.add(Z))}ie(n,"keydown",_=>(y(_,!0),o(_)),{passive:i}),ie(n,"keyup",_=>(y(_,!1),o(_)),{passive:i}),ie("blur",f,{passive:!0}),ie("focus",f,{passive:!0});const M=new Proxy(r,{get(_,v,P){if(typeof v!="string")return Reflect.get(_,v,P);if(v=v.toLowerCase(),v in a&&(v=a[v]),!(v in r))if(/[+_-]/.test(v)){const V=v.split(/[+_-]/g).map(H=>H.trim());r[v]=T(()=>V.every(H=>u(M[H])))}else r[v]=L(!1);const O=Reflect.get(_,v,P);return e?u(O):O}});return M}var Xn;(function(t){t.UP="UP",t.RIGHT="RIGHT",t.DOWN="DOWN",t.LEFT="LEFT",t.NONE="NONE"})(Xn||(Xn={}));var kc=Object.defineProperty,Zn=Object.getOwnPropertySymbols,bc=Object.prototype.hasOwnProperty,yc=Object.prototype.propertyIsEnumerable,Yn=(t,e,n)=>e in t?kc(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,jc=(t,e)=>{for(var n in e||(e={}))bc.call(e,n)&&Yn(t,n,e[n]);if(Zn)for(var n of Zn(e))yc.call(e,n)&&Yn(t,n,e[n]);return t};const wc={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};jc({linear:dc},wc);function Mc(t={}){const{window:e=Ve,initialWidth:n=1/0,initialHeight:a=1/0,listenOrientation:i=!0,includeScrollbar:o=!0}=t,s=L(n),l=L(a),r=()=>{e&&(o?(s.value=e.innerWidth,l.value=e.innerHeight):(s.value=e.document.documentElement.clientWidth,l.value=e.document.documentElement.clientHeight))};return r(),Cn(r),ie("resize",r,{passive:!0}),i&&ie("orientationchange",r,{passive:!0}),{width:s,height:l}}const et=L([{route:"/zh/more/aboutme.html",meta:{description:"个人基本信息",title:"个人简介",cover:"/images/avatar.png",hiddenCover:!0,readingTime:!1,date:"2023-02-16 16:00:00",top:1}},{route:"/zh/more/resource-share.html",meta:{description:"个人认为比较实用的资源分享",title:"资源分享",cover:"/images/more/share-logo.png",hiddenCover:!0,readingTime:!1,date:"2023-02-15 16:00:00",sticky:1,top:2}},{route:"/zh/tools/docker.html",meta:{description:"",date:"2022-11-30 16:00:00",title:"Docker"}},{route:"/zh/tools/git.html",meta:{description:"",date:"2022-11-30 16:00:00",title:"Git工具"}},{route:"/zh/tools/harbor.html",meta:{description:`# Harbor仓库

Harbor仓库常用来作为Docker镜像的私有镜像仓库使用，本文使用容器的方式来进行本地搭建。

## 安装Harbor

### 安装环境

- 安装机器：Linux服务器，本文中使用服务器的IP为\`192.168.10.122\`；
- Docker环境：参考[安装Docker](/zh/tools/docker.md)；
- Docker Compose环境：参考如下脚本安装：
  \`\`\`bash
  sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

  sudo chmod +x /usr/local/bin/docker-compose
  \`\`\`
  ::: tip
  harbor安装过程中可能出现docker-compose未安装或者权限不足，需要创建个软连接
  \`\`\`bash
  sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
  \`\`\`
  :::

### 准备Harbor安装包

\`\`\`bash
# 下载Harbor包
wget https://storage.googleapis.com/harbor-releases/release-1.8.0/harbor-online-installer-v1.8.1.tgz

# 解压Harbor包
tar zxvf harbor-online-installer-v1.8.1.tgz

cd harbor
\`\`\`

### 准备配置文件

Harbor的配置文件为\`harbor.yml\`:

\`\`\`bash
# Configuration file of Harbor

# The IP address or hostname to access admin UI and registry service.
# DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname: 115.239.209.123

# http related config
http:
  # port for http, default is 80. If https enabled, this port will redirect to https port
  port: 80

# https related config
# https:
#   # https port for harbor, default is 443
#   port: 443
#   # The path of cert and key files for nginx
#   certificate: /your/certificate/path
#   private_key: /your/private/key/path

# Uncomment external_url if you want to enable external proxy
# And when it enabled the hostname will no longer used
# external_url: https://reg.mydomain.com:8433

# The initial password of Harbor admin
# It only works in first time to install harbor
# Remember Change the admin password from UI after launching Harbor.
harbor_admin_password: Harbor12345

# Harbor DB configuration
database:
  # The password for the root user of Harbor DB. Change this before any production use.
  password: root123

# The default data volume
data_volume: /home/zqxu/xzq/harbor_data

# Harbor Storage settings by default is using /data dir on local filesystem
# Uncomment storage_service setting If you want to using external storage
# storage_service:
#   # ca_bundle is the path to the custom root ca certificate, which will be injected into the truststore
#   # of registry's and chart repository's containers.  This is usually needed when the user hosts a internal storage with self signed certificate.
#   ca_bundle:

#   # storage backend, default is filesystem, options include filesystem, azure, gcs, s3, swift and oss
#   # for more info about this configuration please refer https://docs.docker.com/registry/configuration/
#   filesystem:
#     maxthreads: 100
#   # set disable to true when you want to disable registry redirect
#   redirect:
#     disabled: false

# Clair configuration
clair: 
  # The interval of clair updaters, the unit is hour, set to 0 to disable the updaters.
  updaters_interval: 12

  # Config http proxy for Clair, e.g. http://my.proxy.com:3128
  # Clair doesn't need to connect to harbor internal components via http proxy.
  http_proxy:
  https_proxy:
  no_proxy: 127.0.0.1,localhost,core,registry

jobservice:
  # Maximum number of job workers in job service  
  max_job_workers: 10

chart:
  # Change the value of absolute_url to enabled can enable absolute url in chart
  absolute_url: disabled

# Log configurations
log:
  # options are debug, info, warning, error, fatal
  level: info
  # Log files are rotated log_rotate_count times before being removed. If count is 0, old versions are removed rather than rotated.
  rotate_count: 50
  # Log files are rotated only if they grow bigger than log_rotate_size bytes. If size is followed by k, the size is assumed to be in kilobytes. 
  # If the M is used, the size is in megabytes, and if G is used, the size is in gigabytes. So size 100, size 100k, size 100M and size 100G 
  # are all valid.
  rotate_size: 200M
  # The directory on your host that store log
  location: /home/zqxu/xzq/harbor/log

#This attribute is for migrator to detect the version of the .cfg file, DO NOT MODIFY!
_version: 1.8.0

# Uncomment external_database if using external database.
# external_database:
#   harbor:
#     host: harbor_db_host
#     port: harbor_db_port
#     db_name: harbor_db_name
#     username: harbor_db_username
#     password: harbor_db_password
#     ssl_mode: disable
#   clair:
#     host: clair_db_host
#     port: clair_db_port
#     db_name: clair_db_name
#     username: clair_db_username
#     password: clair_db_password
#     ssl_mode: disable
#   notary_signer:
#     host: notary_signer_db_host
#     port: notary_signer_db_port
#     db_name: notary_signer_db_name
#     username: notary_signer_db_username
#     password: notary_signer_db_password
#     ssl_mode: disable
#   notary_server:
#     host: notary_server_db_host
#     port: notary_server_db_port
#     db_name: notary_server_db_name
#     username: notary_server_db_username
#     password: notary_server_db_password
#     ssl_mode: disable

# Uncomment external_redis if using external Redis server
# external_redis:
#   host: redis
#   port: 6379
#   password:
#   # db_index 0 is for core, it's unchangeable
#   registry_db_index: 1
#   jobservice_db_index: 2
#   chartmuseum_db_index: 3

# Uncomment uaa for trusting the certificate of uaa instance that is hosted via self-signed cert.
# uaa:
#   ca_file: /path/to/ca

\`\`\`


#### 修改hostname为本机ip地址
\`\`\`
hostname: 192.168.10.122
\`\`\`

#### 修改data路径
\`\`\`
# The default data volume
data_volume: /home/zqxu/xzq/harbor_data
\`\`\`

#### 修改log路径
\`\`\`
log:
  # The directory on your host that store log
  location: /home/zqxu/xzq/harbor/log
\`\`\`


### 执行安装脚本
\`\`\`bash
./install.sh

# 控制台打印信息
✔ `,date:"2022-11-29 16:00:00",title:"Harbor仓库"}},{route:"/zh/tools/helm-chartmuseum.html",meta:{description:"",date:"2022-11-25 16:00:00",title:"Helm仓库"}},{route:"/zh/tools/helm-push.html",meta:{description:"",date:"2022-11-24 16:00:00",title:"Helm-Push插件"}},{route:"/zh/tools/helm.html",meta:{description:"",date:"2022-11-26 16:00:00",title:"Helm工具"}},{route:"/zh/tools/",meta:{description:"常用工具安装及使用",cover:"/images/tools/tools-logo.png",hiddenCover:!0,title:"常用工具",readingTime:!1,date:"2023-01-01 16:00:00",tag:["常用工具"],categories:["常用工具"]}},{route:"/zh/tools/kubeadm.html",meta:{description:"",date:"2022-11-28 16:00:00",title:"Kubeadm工具"}},{route:"/zh/tools/kubectl.html",meta:{description:"",date:"2022-11-27 16:00:00",title:"Kubectl工具"}},{route:"/zh/tools/nfs-client.html",meta:{description:"",date:"2022-11-22 16:00:00",title:"NFSClient"}},{route:"/zh/tools/nfs-server.html",meta:{description:"",date:"2022-11-23 16:00:00",title:"NFSServer"}},{route:"/en/more/maltese/",meta:{description:"",title:"MalteseLearningIndex",date:"2026-10-22 17:09:43"}},{route:"/zh/cloud-native/kubernetes/configuration.html",meta:{description:"",date:"2022-12-28 16:00:00",recommend:4,title:"Kubernetes常用配置"}},{route:"/zh/cloud-native/kubernetes/crd-operator.html",meta:{description:"",recommend:6,title:"CRD&&Operator",date:"2023-04-03 02:27:44"}},{route:"/zh/cloud-native/kubernetes/",meta:{description:"Kubernetes学习、安装和实践",cover:"/images/cloud-native/kubernetes/kubernetes-stacked-all-blue-color.svg",hiddenCover:!0,title:"Kubernetes",readingTime:!1,date:"2023-01-30 16:00:00",tag:["Kubernetes"],tags:["容器编排"],categories:["云原生"],top:3,recommend:1}},{route:"/zh/cloud-native/kubernetes/installation.html",meta:{description:"",recommend:3,title:"Kubernetes安装",date:"2023-04-03 02:27:44"}},{route:"/zh/cloud-native/kubernetes/operation.html",meta:{description:"",recommend:5,title:"Kubernetes常用操作",date:"2023-04-03 02:27:44"}},{route:"/zh/cloud-native/kubernetes/overview.html",meta:{description:"",sticky:999,date:"2022-12-30 16:00:00",recommend:2,title:"Kubernetes基础"}},{route:"/zh/cloud-native/kubernetes/practice.html",meta:{description:"",recommend:7,title:"Kubernetes实践笔记",date:"2023-04-03 02:27:44"}},{route:"/zh/cloud-native/kubernetes/reference.html",meta:{description:"",recommend:8,title:"Kubernetes参考",date:"2023-04-03 02:27:44"}},{route:"/zh/coding/golang/design-patterns.html",meta:{description:"",sticky:998,tag:["Golang"],categories:["Golang"],recommend:4,title:"Golang设计模式",date:"2023-03-23 12:57:34"}},{route:"/zh/coding/golang/",meta:{description:"Golang编程代码规范、设计模式、开源项目和相关技术栈",cover:"/images/coding/golang/golang-logo.png",hiddenCover:!0,title:"Golang",readingTime:!1,tag:["Golang"],categories:["Golang"],top:4,recommend:1,date:"2023-05-22 07:57:28"}},{route:"/zh/coding/golang/practice.html",meta:{description:"",date:"2022-12-26 16:00:00",recommend:5,title:"Golang实践"}},{route:"/zh/coding/golang/reference.html",meta:{description:"",tag:["Golang"],categories:["Golang"],recommend:2,title:"Golang参考资源",date:"2023-10-13 09:53:25"}},{route:"/zh/coding/golang/standards.html",meta:{description:"",tag:["Golang"],categories:["Golang"],recommend:3,title:"Golang编码规范",date:"2023-03-23 12:57:34"}},{route:"/zh/coding/vue-vite/command.html",meta:{description:"",tags:["Vue","Vite"],categories:["Web"],recommend:5,title:"Vite/Vue常用指令",date:"2023-03-15 09:46:20"}},{route:"/zh/coding/vue-vite/docs-build.html",meta:{description:"",sticky:996,date:"2022-08-29 16:00:00",tag:["docs"],tags:["Vue","Vite"],categories:["Web"],recommend:3,title:"Web示例/文档/博客构建"}},{route:"/zh/coding/vue-vite/gh-pages.html",meta:{description:"",sticky:995,date:"2022-08-28 16:00:00",tag:["docs"],tags:["Vue","Vite"],categories:["Web"],recommend:4,title:"GithubPages部署"}},{route:"/zh/coding/vue-vite/",meta:{description:"Vue编程相关笔记",cover:"/images/coding/vue/vue-logo.svg",hiddenCover:!0,title:"Vue & Vite",readingTime:!1,date:"2023-01-28 16:00:00",tags:["docs","Vue","Vite"],categories:["Web"],top:5,recommend:1}},{route:"/zh/coding/vue-vite/reference.html",meta:{description:"",sticky:997,date:"2022-08-30 16:00:00",tags:["Vue","Vite"],categories:["Web"],recommend:2,title:"Vue&Vite参考资源"}},{route:"/zh/more/maltese/",meta:{description:"",title:"马耳他语学习目录",date:"2026-10-22 17:09:43"}},{route:"/zh/open-source/tekton/basic-usage.html",meta:{description:"",date:"2022-10-29 16:00:00",tag:["Tekton"],tags:["Kubernetes"],categories:["DevOps"],title:"Tekton基本使用"}},{route:"/zh/open-source/tekton/",meta:{description:"Kubernetes官方推荐的CI工具，适用于DevOps基础",cover:"/images/open-source/tekton/tekton-horizontal-color.png",hiddenCover:!0,date:"2023-01-14 16:00:00",readingTime:!1,tag:["Tekton"],tags:["Kubernetes","CNCF","DevOps"],categories:["Open Source"],title:"Tekton"}},{route:"/zh/open-source/tekton/installation.html",meta:{description:"",date:"2022-10-30 16:00:00",tag:["Tekton"],tags:["Kubernetes"],categories:["DevOps"],title:"Tekton安装"}},{route:"/zh/open-source/vitess/",meta:{description:"Vitess是一个用于部署，扩展和管理大型开源数据库实例集群的数据库解决方案。通俗点说，就是在云环境下对大型数据库及数据库集群进行分库分表并提供可靠性处理的方案。",cover:"/images/open-source/vitess/vitess-horizontal-color.svg",hiddenCover:!0,date:"2021-11-09 16:00:00",tag:["Vitess"],tags:["Kubernetes","CNCF"],categories:["Open Source"],title:"Vitess"}},{route:"/en/more/maltese/grammar/00-requirements.html",meta:{description:"",title:"00EditorialRequirements",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/grammar/01-vocabulary.html",meta:{description:`# Categorized Basic Maltese Vocabulary

This reference groups basic vocabulary into ten core categories. Relevant forms are included directly in the tables. Maltese has no infinitive exactly equivalent to English \`to + verb\`; verbs are shown in common citation forms, with person-specific forms in [Personal Pronouns and Verb Conjugation](03-person-conjugation.md).

## Pronouns

| English | Malti | Number/gender |
|`,title:"CategorizedBasicMalteseVocabulary",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/grammar/02-phrases.html",meta:{description:`# 200 Useful Maltese Phrases

The phrases are grouped into ten situations, with 20 examples per category. Numbering restarts in each section. Some expressions change according to the listener's gender, number, or context; ellipses can be replaced with specific information.

## Greetings and Farewells

| # | English | Malti |
|`,title:"200UsefulMaltesePhrases",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/grammar/03-person-conjugation.html",meta:{description:"# Personal Pronouns and Verb Conjugation\n\n## 1. Person Markers and Conjugation Patterns\n\nMaltese verbs change according to the person and number of the subject. Pronouns can usually be omitted because the verb form often identifies the person; use them for emphasis or contrast. `hu` (he) and `hi` (she) distinguish masculine and feminine third-person singular. `inti` (you, singular) is used for any gender.\n\nA common pattern is “person prefix + verb stem”: first person often uses `n-`, second person `t-`, and third-person masculine `j-`. Third-person feminine often has the same form as second-person singular. Plural forms commonly use a plural stem or the ending `-u`. For example, `kiteb` (write):\n\n| Person | Pronoun | Common marker | Form of `kiteb` |\n|",title:"PersonalPronounsandVerbConjugation",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/grammar/04-verbs-tenses.html",meta:{description:`# Verbs and Basic Tenses

This chapter is organized as “rules → tense-specific conjugation → comparison.” Maltese commonly uses the imperfect to express present, habitual, or ongoing actions; the perfect expresses completed actions; and the future is often formed with \`se + imperfect\`. These forms do not map one-to-one onto English tenses; context and time expressions also matter.

## 1. Three Common Constructions

| Learning label | Maltese form | Common use | Example |
|`,title:"VerbsandBasicTenses",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/grammar/05-numbers.html",meta:{description:`# Numbers and Numeral Grammar

## 1. Numbers from 0 to 20

| Number | English | Malti |
|`,title:"NumbersandNumeralGrammar",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/grammar/06-time-calendar.html",meta:{description:"# Telling the Time\n\nMaltese uses both traditional spoken clock expressions and numeric 24-hour time. Numeric notation is clearest when arranging a meeting. In spoken expressions, note the forms of `siegħa` (hour) and the clock numerals.\n\n## 1. Asking the Time and Saying O'Clock\n\n- `X'ħin hu?`: What time is it?\n- `Huwa s-sagħtejn.`: It is two o'clock.\n- `Hija s-siegħa.`: It is one o'clock.\n- `Huma t-tlieta.`: It is three o'clock.\n\nCommon o'clock forms are below. Noon and midnight are also commonly expressed as `nofsinhar` and `nofsillejl`; articles and colloquial forms may vary slightly by context.\n\n| Time | English | Common Malti |\n|",title:"TellingtheTime",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/grammar/07-dates.html",meta:{description:`# Dates, Weekdays, Months, and Seasons

## 1. Days of the Week

| English | Malti |
|`,title:"Dates,Weekdays,Months,andSeasons",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/grammar/08-prepositions.html",meta:{description:`# Common Prepositions and Their Uses

Prepositions are used with nouns and definite articles; some contract with the following article. Prepositions can also take person suffixes, creating forms such as “to me,” “with you,” or “at his place.” The list is ordered approximately by everyday frequency. Dictionaries may also list rare dialectal, archaic, conjunction-like, and inflected forms; this chapter focuses on useful prepositions and phrases in modern standard Maltese.

## 1. Common Prepositions

| Malti | English meaning | Use/collocation |
|`,title:"CommonPrepositionsandTheirUses",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/grammar/",meta:{description:"",title:"MalteseforBeginners",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/modules/",meta:{description:"",title:"MalteseModuleAnalysis",date:"2026-10-22 17:09:43"}},{route:"/en/more/maltese/modules/maltese-module3-analysis.html",meta:{description:`# Module 3: When Things Go Wrong

**Module title: Meta l-affarijiet ma jmorrux kif nixtiequ**  
**English title: When things go wrong**

## Module Title Breakdown

| Maltese | English | Word-by-word breakdown |
|`,title:"Module3:WhenThingsGoWrong",date:"2026-10-22 17:09:43"}},{route:"/en/more/maltese/modules/maltese-module4-analysis.html",meta:{description:`# Module 4: Shopping and Food

**Ix-xiri u l-ikel — Shopping and Food**

## Overall Outline

| PDF page | Textbook footer | Content |
|`,title:"Module4:ShoppingandFood",date:"2026-10-22 17:09:43"}},{route:"/en/more/maltese/practice/00-requirements.html",meta:{description:"",title:"MaltesePracticeDocumentRequirements",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/practice/",meta:{description:"",title:"MalteseReadingandWord-by-WordPractice",date:"2026-10-18 19:12:06"}},{route:"/zh/cloud-native/kubernetes/installation/cni-calico.html",meta:{description:"",date:"2022-12-24 16:00:00",title:"CalicoCNI安装"}},{route:"/zh/cloud-native/kubernetes/installation/cni-cilium-ebpf.html",meta:{description:"",date:"2022-12-23 16:00:00",title:"Cilium/EBPFCNI安装"}},{route:"/zh/cloud-native/kubernetes/installation/csi-ceph.html",meta:{description:"",date:"2022-12-26 16:00:00",title:"CephCSI安装"}},{route:"/zh/cloud-native/kubernetes/installation/csi-localpath.html",meta:{description:"",date:"2022-12-27 16:00:00",title:"LocalPathCSI安装"}},{route:"/zh/cloud-native/kubernetes/installation/csi-nfs.html",meta:{description:"",date:"2022-12-25 16:00:00",title:"NFSCSI安装"}},{route:"/zh/cloud-native/kubernetes/installation/faq.html",meta:{description:"",date:"2022-12-22 16:00:00",title:"FAQ"}},{route:"/zh/cloud-native/kubernetes/installation/kubernetes-cluster-ha.html",meta:{description:`
# Kubernetes高可用集群安装

高可用K8S集群是指K8S的Master节点个数不少于3个，K8S管理面每个组件副本数不少于3个的Kubernetes集群。


## 整体架构
![Kubernetes高可用集群整体架构](/images/cloud-native/kubernetes/architecture-ha-k8s-cluster.png)

## 环境信息
- Master节点：
    - 192.168.100.13 cnserver20
    - 192.168.100.14 cnserver21
    - 192.168.100.15 cnserver22

- Worker节点：
    - 192.168.100.10 cnserver17
    - 192.168.100.11 cnserver18
    - 192.168.100.12 cnserver19

- 虚拟ip:
    - kubernetes-vip：192.168.100.99

::: tip
\`kubernetes-vip\`用于Keepalived的虚拟vip配置，与机器在同一网段，使用同一网卡
:::


## 配置服务器

### 基础环境配置

参考[Kubernetes集群-配置服务器](./kubernetes-cluster.md#配置服务器)。

### 配置/etc/hosts

配置/etc/hosts非必要操作，该配置是为了便于后续直接通过主机名称/vip名称进行操作，如不配置，后续操作中的域主机名称/vip名称需要替换成相应ip.

配置方式为在所有节点的\`/etc/hosts\`文件中添加节点信息和vip信息：
\`\`\`
192.168.100.10 cnserver17
192.168.100.11 cnserver18
192.168.100.12 cnserver19

192.168.100.13 cnserver20
192.168.100.14 cnserver21
192.168.100.15 cnserver22

192.168.100.99 kubernetes-vip
\`\`\`

## 安装Keepalived
Keepalived是一种高可用方案，通过VIP(虚拟IP)和心跳检测来实现高可用。

Keepalived通常有Master和Backup两个角色，一般情况下有1个master和多个backup.

Master会绑定VIP到自己网卡上，对外提供服务。

Master和Backup会定时确定对方状态，当Master不可用的时候，Backup会通知网关，并把VIP绑定到自己的网卡上，实现服务不中断，即为高可用。

### 环境信息

搭建Keepalied的机器(Kubernetes高可用集群的Master节点)：
- 192.168.100.13 cnserver20
- 192.168.100.14 cnserver21
- 192.168.100.15 cnserver22


### Keepalived配置文件

在每个节点上配置相应的keepalived.conf，见附件[Keepalived配置](/downloads/cloud-native/kubernetes/installation/keepalived-config.zip)。

配置文件中需要修改的有如下部分：
\`\`\`
……
vrrp_instance VI_1 {
  interface em3 # 此处通过ip addr命令根据实际填写，本机ip所在网卡

  state BACKUP# 一台节点配置为MASTER，其他节点配置为BACKUP

  unicast_src_ip 192.168.100.15  #设置本机内网ip
  
  #其他两台master ip
  unicast_peer {
        192.168.100.13
        192.168.100.14
  }

  virtual_ipaddress {
    192.168.100.99  # vip 虚拟ip
  }
……
\`\`\`

### 容器启动Keepalived
\`\`\`bash
# $keepalivedConfPath: keepalived.conf文件路径
docker run \\
    --name=keepalived \\
    --cap-add=NET_ADMIN \\
    --cap-add=NET_BROADCAST \\
    --cap-add=NET_RAW \\
    --net=host \\
    --restart=always \\
    --volume $keepalivedConfPath:/container/service/keepalived/assets/keepalived.conf \\
    -d osixia/keepalived:2.0.20 \\
    --copy-service
\`\`\`

## 安装HAProxy

HAProxy 是一款提供高可用性、负载均衡以及基于TCP（第四层）和HTTP（第七层）应用的代理软件。

HAProxy作为负载均衡时，可以按照指定策略（比如轮询）将流量转发到相应服务中。

例如当前Server有三个副本由HAProxy进行负载均衡，HAProxy可将客户端对Server的访问请求路由到这三个副本中的一个。这样做有以下好处：

- 避免所有请求集中转发到某个server，有效降低单个服务组件的压力;
- 当某个server副本宕机，HAProxy可将流量转发到健康的server端，从而保证服务的高可用。


### 环境信息
搭建HAProxy的机器(Kubernetes高可用集群的Master节点)：
- 192.168.100.13 cnserver20
- 192.168.100.14 cnserver21
- 192.168.100.15 cnserver22


### HAProxy配置文件
在每个节点上配置\`haproxy.cfg\`，见附件[HAProxy配置](/downloads/cloud-native/kubernetes/installation/haproxy.cfg)。

其中，主要的负载相关配置如下：
\`\`\`
……
#`,date:"2022-12-28 16:00:00",title:"Kubernetes高可用集群安装"}},{route:"/zh/cloud-native/kubernetes/installation/kubernetes-cluster.html",meta:{description:"",date:"2022-12-29 16:00:00",title:"Kubernetes集群安装"}},{route:"/zh/cloud-native/kubernetes/installation/minikube.html",meta:{description:"",date:"2022-12-30 16:00:00",title:"Minikube集群安装"}},{route:"/zh/cloud-native/kubernetes/practice/dns-delay.html",meta:{description:"",date:"2022-10-30 16:00:00",title:"StatefulSet资源的Pod域名解析延迟问题验证"}},{route:"/zh/cloud-native/kubernetes/practice/endpoints-skip-healthcheck.html",meta:{description:"",date:"2022-10-29 16:00:00",title:"跳过健康检查为Pod分配Endpoints"}},{route:"/zh/coding/golang/practice/float.html",meta:{description:"",tag:["Golang"],categories:["Golang"],recommend:1,title:"Float类型处理",date:"2023-10-16 17:05:54"}},{route:"/zh/coding/golang/practice/jwt.html",meta:{description:"",tag:["Golang"],categories:["Golang"],recommend:3,title:"JWT鉴权",date:"2023-04-20 09:14:48"}},{route:"/zh/coding/golang/practice/time-json.html",meta:{description:"",tag:["Golang"],categories:["Golang"],recommend:4,title:"自定义时间类型的JSON字符",date:"2023-10-18 19:21:08"}},{route:"/zh/coding/golang/practice/tls.html",meta:{description:"",tag:["Golang"],categories:["Golang"],recommend:2,title:"TLS的Golang应用",date:"2023-04-13 06:03:30"}},{route:"/zh/more/maltese/grammar/00-requirements.html",meta:{description:"",title:"本套文档的编写要求",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/grammar/01-vocabulary.html",meta:{description:`# 分类基础马耳他语词汇
 
本表按主题整理基础词汇，代词、亲属、房屋、动物、植物、交通、时间、疑问词、常用动词和介词十个核心类别各不少于 20 条；亲属称谓另作细分。需要变化的词形直接列在对应主题表中。马耳他语动词没有和英语 \`to + verb\` 一一对应的不定式；动词栏列出常见引用形式，实际造句时要根据主语变位。
 
## 代词
 
| 中文 | English | Malti | 数/性说明 |
|`,title:"分类基础马耳他语词汇",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/grammar/02-phrases.html",meta:{description:`# 200 个常用马耳他语短语
 
以下按场景分为 10 类，每类 20 个例子，共 200 个。编号在每个分类中分别从 1 开始。部分表达会随对象的性别、人数和语境变化；带有省略号的部分可替换为具体内容。
 
## 问候与告别
 
| # | 中文 | English | Malti |
|`,title:"200个常用马耳他语短语",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/grammar/03-person-conjugation.html",meta:{description:"# 动词人称变位\n \n## 1. 人称标记与变位公式\n \n马耳他语动词根据主语的人称和单复数改变形式。代词通常可以省略，因为动词形式往往已经标出人称；需要强调或对比时再说出代词。`hu`（他）和 `hi`（她）区分第三人称单数的阳性/阴性，`inti`（你，单数）对男女都可使用。\n \n常见形式可概括为“人称前缀 + 动词词干”：第一人称常见 `n-`，第二人称常见 `t-`，第三人称阳性常见 `j-`；第三人称阴性常与第二人称单数同形。复数常用复数词干或 `-u` 词尾。以 `kiteb`（写）为例：\n \n| 人称 | 代词 | 常见标记 | `kiteb` 的形式 |\n|",title:"动词人称变位",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/grammar/04-verbs-tenses.html",meta:{description:`# 动词与基本时态
 
本章按“规则说明 → 分时态变位 → 对照练习”组织。马耳他语常用未完成式表达现在、习惯或尚未完成的动作，完成式表达已完成的动作；将来通常用 \`se + 未完成式\`。这些形式与英语时态并非一一对应，具体时间仍需结合语境和时间词判断。
 
学习顺序：先理解未完成式和完成式如何构成，再看将来标记 \`se\` 如何与未完成式组合；然后分别学习三个时态，并在各节查看目标动词的人称形式和三语例句。人称前缀与单复数规律见[动词人称变位与人称代词](03-person-conjugation.md)。
 
## 1. 三种常见时态的构式
 
| 学习名称 | 马耳他语形式 | 常见用途 | 示例 |
|`,title:"动词与基本时态",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/grammar/05-numbers.html",meta:{description:`# 数字与数词语法
 
## 1. 0 到 20
 
| 数字 | English | Malti | 中文 |
|`,title:"数字与数词语法",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/grammar/06-time-calendar.html",meta:{description:"# 时间表达\n \n马耳他语可以用传统口语钟点，也可以直接使用 24 小时数字时间。日常约时间时，数字写法最明确；口语表达则留意 `siegħa`（小时）及钟点数字的形式。\n \n## 1. 询问时间与整点\n \n- `X'ħin hu?`：现在几点？\n- `Huwa s-sagħtejn.`：现在两点。\n- `Hija s-siegħa.`：现在一点。\n- `Huma t-tlieta.`：现在三点。\n \n常见整点说法如下。中午和午夜也常直接用 `nofsinhar`、`nofsillejl`；具体冠词和口语形式可能因语境略有不同。\n \n| 时间 | English | 中文 | 常见 Malti |\n|",title:"时间表达",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/grammar/07-dates.html",meta:{description:`# 日期、星期、月份与季节
 
## 1. 星期几
 
| 中文 | English | Malti |
|`,title:"日期、星期、月份与季节",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/grammar/08-prepositions.html",meta:{description:`# 常用介词与用法
 
介词常和名词、定冠词连用；一部分会与后面的定冠词缩合。介词也可以带人称后缀，形成“对我/和你/在他那里”等形式。下表大致按日常使用频率排序；具体频率会随语境和搭配变化。
 
## 1. 常用介词表
 
下表先列日常高频介词，再列常见的方向、时间、例外和固定搭配形式。马耳他语词典还会把少见方言、古语、连词用法及屈折形式归入介词条目；本表以现代标准语中实用的介词和介词短语为主。
 
| Malti | 中文义 | English gloss | 用法/搭配 |
|`,title:"常用介词与用法",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/grammar/",meta:{description:"",title:"马耳他语入门目录",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/modules/",meta:{description:"",title:"马耳他语学习材料解析",date:"2026-10-22 17:09:43"}},{route:"/zh/more/maltese/modules/maltese-module3-analysis.html",meta:{description:`# Module 3: 当事情不如我们所愿时

**模块标题：Meta l-affarijiet ma jmorrux kif nixtiequ**  
**英文标题：When things go wrong**  
**中文译意：当事情不如我们所愿时**

## 模块标题解析

| 马耳他语 | 中文 | 逐词拆解 |
|`,title:"Module3:当事情不如我们所愿时",date:"2026-10-22 17:09:43"}},{route:"/zh/more/maltese/modules/maltese-module4-analysis.html",meta:{description:`# Module 4: 购物与食物

**Ix-xiri u l-ikel — Shopping and Food — 购物与食物**


## 主题理解

| 原文 | 中文与逐词／短语解析 |
|`,title:"Module4:购物与食物",date:"2026-10-22 17:09:43"}},{route:"/zh/more/maltese/practice/00-requirements.html",meta:{description:"",title:"马耳他语练习文档要求",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/practice/",meta:{description:"",title:"马耳他语情景阅读与逐词练习",date:"2026-10-18 19:12:06"}},{route:"/en/more/maltese/practice/dialogues/01-hospital-appointment.html",meta:{description:`# Making a Hospital Appointment

**Scenario:** David calls the health centre to book a doctor's appointment with receptionist Maria and confirm the time and required documents.

## Complete Dialogue

**Maria:** Bonġu, Ċentru tas-Saħħa. Kif nista' ngħinek?

**David:** Bonġu. Nixtieq nagħmel appuntament mat-tabib, jekk jogħġbok.

**Maria:** Għandek preferenza għal xi ġurnata?

**David:** Jekk jista' jkun, għada filgħodu.

**Maria:** Għandna ħin fl-għaxra u nofs. Tajjeb għalik?

**David:** Iva, tajjeb ħafna. Għandi bżonn inġib xi dokumenti?

**Maria:** Ġib il-karta tal-identità u l-karta tas-saħħa.

**David:** Grazzi. Narak għada.

## Sentence-by-Sentence Translation and Word Notes

### 1. Maria (Receptionist)

**Malti:** Bonġu, Ċentru tas-Saħħa. Kif nista' ngħinek?

**Translation:** Good morning, Health Centre. How can I help you?

| Maltese | English meaning | Notes |
|`,title:"MakingaHospitalAppointment",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/practice/dialogues/02-lost-property.html",meta:{description:`# Lost Property and Collection at the Police Station

**Scenario:** Mark answers Anna's call at the police station. They identify her wallet and arrange a collection time.

## Complete Dialogue

**Anna:** Bonġu. Sibtu kartiera mitlufa ħdejn il-waqfa tal-karozzi tal-linja?

**Mark:** Iva, il-kartiera tinsab hawn fl-għassa tal-pulizija.

**Anna:** X'nagħmel biex niġi niġborha?

**Mark:** Tista' tiġi l-għassa għada filgħodu.

**Anna:** Nista' niġi fid-disgħa?

**Mark:** Iva. Ġib miegħek dokument ta' identità.

**Anna:** Se jkolli bżonn inġib xi prova oħra?

**Mark:** Le, id-dokument tal-identità jkun biżżejjed.

## Sentence-by-Sentence Translation and Word Notes

### 1. Anna (Owner of the Lost Item)

**Malti:** Bonġu. Sibtu kartiera mitlufa ħdejn il-waqfa tal-karozzi tal-linja?

**Translation:** Hello. Did you find a lost wallet near the bus stop?

| Maltese | English meaning | Notes |
|`,title:"LostPropertyandCollectionatthePoliceStation",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/practice/dialogues/03-weekend-party.html",meta:{description:`# Going to a Weekend Party

**Scenario:** Two friends make plans for a weekend party.

## Complete Dialogue

**Anna:** Se tagħmel xi ħaġa fi tmiem il-ġimgħa?

**Mark:** Għadni ma ddeċidejtx. Għaliex?

**Anna:** Qed norganizza festa d-dar is-Sibt filgħaxija.

**Mark:** Ħsejjes sbieħ! F'liema ħin tibda?

**Anna:** Nibdew fit-tmienja, imma tista' tasal aktar tard.

**Mark:** X'għandi nġib miegħi?

**Anna:** Ġib xi ħaġa x'tixorbu u jien nagħmel l-ikel.

**Mark:** Perfett. Inkun hemm fit-tmienja.

## Sentence-by-Sentence Translation and Word Notes

### 1. Anna

**Malti:** Se tagħmel xi ħaġa fi tmiem il-ġimgħa?

**Translation:** Are you doing anything this weekend?

| Maltese | English meaning | Notes |
|`,title:"GoingtoaWeekendParty",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/practice/dialogues/04-asking-the-time.html",meta:{description:`# Asking the Time

**Scenario:** Two friends meet at an agreed place. One asks the time and checks whether there is still time before an appointment.

## Complete Dialogue

**Mark:** Skużani, x'ħin hu issa?

**Lina:** Huma t-tmienja u kwart.

**Mark:** Grazzi. Għandi appuntament fit-tmienja u nofs.

**Lina:** Għad għandek ħmistax-il minuta.

**Mark:** Tajjeb. Il-post jinsab ħdejn il-pjazza, hux?

**Lina:** Iva, eżattament. Jien qiegħda quddiem il-bieb.

**Mark:** Qed nitlaq issa. Nasal f'għaxar minuti.

**Lina:** Sewwa, narak dalwaqt.

## Sentence-by-Sentence Translation and Word Notes

### 1. Mark

**Malti:** Skużani, x'ħin hu issa?

**Translation:** Excuse me, what time is it now?

| Maltese | English meaning | Notes |
|`,title:"AskingtheTime",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/practice/dialogues/05-weekend-plans.html",meta:{description:`# Talking About Upcoming Plans

**Scenario:** Anna and Mark talk about plans for today, tomorrow, this weekend, next week, next month, and next year.

## Complete Dialogue

**Anna:** X'għandek tagħmel illum u għada?

**Mark:** Illum naħdem mid-dar u filgħaxija nistudja l-Malti. Għada se mmur l-isptar ma' ommi.

**Anna:** X'se tagħmel fi tmiem il-ġimgħa?

**Mark:** Se niltaqa' mal-ħbieb għal kafè.

**Anna:** Għandek pjanijiet għall-ġimgħa d-dieħla?

**Mark:** Iva. Nhar it-Tlieta se nżur lill-familja tiegħi.

**Anna:** U x-xahar id-dieħel?

**Mark:** Se nivvjaġġa lejn Għawdex għal ftit jiem.

**Anna:** X'tixtieq tagħmel is-sena d-dieħla?

**Mark:** Nixtieq nitgħallem aktar il-Malti u nsiefer.

## Sentence-by-Sentence Translation and Word Notes

### 1. Anna

**Malti:** X'għandek tagħmel illum u għada?

**Translation:** What are you doing today and tomorrow?

| Maltese | English meaning | Notes |
|`,title:"TalkingAboutUpcomingPlans",date:"2026-10-15 12:21:19"}},{route:"/en/more/maltese/practice/dialogues/06-jodie-doctor-appointment.html",meta:{description:`# Making an Appointment with Dr Farrugia

**Scenario:** Jodie calls the clinic to book an appointment with Dr Farrugia. They agree on Thursday at seven in the evening. (Speaker labels are inferred from the dialogue context, as the source is a listening exercise.)

## Complete Dialogue

**Jodie (Patient):** Nista' nagħmel appuntament għall-ġimgħa d-dieħla mat-tabib Farrugia?

**Receptionist:** Il-ġimgħa d-dieħla għandi vojt l-Erbgħa u l-Ħamis.

**Jodie (Patient):** L-Erbgħa ma nistax, imma l-Ħamis iva. Fi x'hin?

**Receptionist:** Filgħodu?

**Receptionist:** Jew filgħaxija?

**Jodie (Patient):** Filgħaxija aħjar, wara x-xogħol.

**Receptionist:** Fis-6, fis-6:30, jew fis-7pm?

**Jodie (Patient):** Fis-sebgħa tajjeb, grazzi!

**Receptionist:** Ibbukkajt il-Ħamis fis-sebgħa ta' filgħaxija.

**Receptionist:** Nikkonferma, saħħa.

## Sentence-by-Sentence Translation and Word Notes

### 1. Jodie (Patient)

**Malti:** Nista' nagħmel appuntament għall-ġimgħa d-dieħla mat-tabib Farrugia?

**Translation:** Can I make an appointment for next week with Dr Farrugia?

| Maltese | English meaning | Notes |
|`,title:"MakinganAppointmentwithDrFarrugia",date:"2026-10-18 19:12:06"}},{route:"/en/more/maltese/practice/dialogues/07-claire-restaurant-messages.html",meta:{description:`# Dinner at the Restaurant — Text Messages

**Scenario:** Claire and her friend exchange text messages to confirm tonight's dinner at a restaurant: the meeting time, what to wear, and childcare arrangements. (Speaker labels are inferred from the dialogue context.)

## Complete Dialogue

**Friend:** Waranofsinhar it-tajjeb, Claire. Għal illejla kollox sew?

**Claire:** Waranofsinhar it-tajjeb. Iva għal-lejla kollox sew. Fit-tmienja u nofs hux?

**Friend:** Eżatt, niltaqgħu fit-tmienja u nofs u nidħlu ġewwa l-ħanut.

**Friend:** X'ser tilbes?

**Friend:** Ħa tilbes ġakketta?

**Claire:** Qed ikun ftit bard u għalhekk naħseb nilbes ġakketta u flokk tas-suf.

**Friend:** Tajjeb, nilbes bħalek mela. It-tifel se iġġibuh magħkom?

**Claire:** Jien u r-raġel, it-tifel ser inħalluh m'ommi.

**Friend:** Tajjeb, niltaqgħu mela. Saħħiet.

**Claire:** Iva, niltaqgħu. Saħħiet.

## Sentence-by-Sentence Translation and Word Notes

### 1. Friend

**Malti:** Waranofsinhar it-tajjeb, Claire. Għal illejla kollox sew?

**Translation:** Good afternoon, Claire. Is everything all right for tonight?

| Maltese | English meaning | Notes |
|`,title:"DinnerattheRestaurant—TextMessages",date:"2026-10-18 19:12:06"}},{route:"/en/more/maltese/practice/dialogues/08-rented-car.html",meta:{description:`# The Rented Car (Il-karozza mikrija)

**Scenario:** Carmen Micallef calls the car-hire company to speak to Mr Martin Deguara. He is not there, so she explains to the employee that she rented a car fifteen days ago and is flying back to her country on Friday; they arrange to return the car at their office in the airport car park before her flight.

**Source:** Djalogu addattat minn Speaking Maltese 2 ta' Charles Daniel Saliba (Dialogue adapted from *Speaking Maltese 2* by Charles Daniel Saliba)

## Complete Dialogue

**Carmen (Customer):** Bonġu, jien Carmen Micallef. Nista' nkellem lis-Sur Martin Deguara, jekk jogħġbok?

**Tal-karozzi (Car-Hire Agent):** Skużani, illum Martin mhux hawn. Nista' naqdik jien?

**Carmen (Customer):** Ma jimpurtax, mela ħa nispjega kollox lilek. Ħmistax ilu kont krejt karozza mingħandkom u issa se nsiefer lura pajjiżi nhar il-Ġimgħa. Nixtieq inkun naf kif se ngħaddilkom il-karozza lura.

**Tal-karozzi (Car-Hire Agent):** Inti x'ħin se ssiefer il-Ġimgħa?

**Carmen (Customer):** It-titjira hija fid-disgħa ta' billejl.

**Tal-karozzi (Car-Hire Agent):** Tajjeb ħafna, mela l-Ġimgħa stess qabel tidħol l-ajruport ejja hawn l-uffiċċju tagħna li jinsab fil-parkeġġ tal-ajruport stess. Ikollna bżonn nispezzjonaw il-karozza u malli jkun kollox sew, nirrilaxxaw il-VISA tiegħek.

**Carmen (Customer):** Ok, naħseb ikunu xi s-sitta ta' flgħaxija kif nasal.

**Tal-karozzi (Car-Hire Agent):** Tajjeb, ikun hawn jien dak il-ħin.

**Carmen (Customer):** Sewwa wisq, mela narak il-Ġimgħa fis-sitta ta' flgħaxija. Grazzi!

**Tal-karozzi (Car-Hire Agent):** Grazzi lilek, saħħa!

## Sentence-by-Sentence Translation and Word Notes

### 1. Carmen (Customer)

**Malti:** Bonġu, jien Carmen Micallef. Nista' nkellem lis-Sur Martin Deguara, jekk jogħġbok?

**Translation:** Good morning, I am Carmen Micallef. Can I speak to Mr Martin Deguara, please?

| Maltese | English meaning | Notes |
|`,title:"TheRentedCar(Il-karozzamikrija)",date:"2026-10-18 19:12:06"}},{route:"/en/more/maltese/practice/dialogues/",meta:{description:"",title:"DialogueIndex",date:"2026-10-18 19:12:06"}},{route:"/en/more/maltese/practice/emails/01-birthday-invitation.html",meta:{description:`# Birthday Party Invitation

**Scenario:** Anna invites her friend Mark to her birthday party.

## Email Header

**Lil (To):** mark.b@gmail.com
**Mingħand (From):** anna.c@gmail.com
**Data (Date):** 10 ta' Ottubru 2026
**Suġġett (Subject):** Stedina għall-festa ta' għeluq snini

## Full Email

> **Lil:** mark.b@gmail.com
> **Mingħand:** anna.c@gmail.com
> **Data:** 10 ta' Ottubru 2026
> **Suġġett:** Stedina għall-festa ta' għeluq snini
>
> Għażiż Mark,
>
> Nispera li inti tajjeb.
>
> Nixtieq nistedinkom għall-festa ta' għeluq snini nhar is-Sibt.
>
> Il-festa se tibda fis-sebgħa ta' filgħaxija.
>
> Se niltaqgħu d-dar tiegħi f'Valletta.
>
> Ikun hemm ikel, mużika u kejk.
>
> Tista' ġġib lil xi ħadd miegħek jekk trid.
>
> Jekk jogħġbok, għidli jekk ġej.
>
> Nistenna bil-ħerqa li niċċelebraw flimkien.
>
> Tislijiet,
> Anna

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: mark.b@gmail.com

**Translation:** To: mark.b@gmail.com

| Maltese | English meaning | Notes |
|`,title:"BirthdayPartyInvitation",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/02-birthday-reply.html",meta:{description:`# Reply to a Birthday Party Invitation

**Scenario:** Mark replies to Anna, accepting the birthday party invitation and asking whether help is needed.

## Email Header

**Lil (To):** anna.c@gmail.com
**Mingħand (From):** mark.b@gmail.com
**Data (Date):** 12 ta' Ottubru 2026
**Suġġett (Subject):** Risposta għall-istedina

## Full Email

> **Lil:** anna.c@gmail.com
> **Mingħand:** mark.b@gmail.com
> **Data:** 12 ta' Ottubru 2026
> **Suġġett:** Risposta għall-istedina
>
> Għażiża Anna,
>
> Grazzi ħafna tal-istedina.
>
> Iva, nixtieq niġi għall-festa nhar is-Sibt.
>
> Se nkun hemm fis-sebgħa.
>
> Nista' nġib xi ħaġa miegħi?
>
> Nista' nġib kejk żgħir.
>
> Għidli jekk għandek bżonn l-għajnuna.
>
> Nistenna bil-ħerqa li narak.
>
> Tislijiet,
> Mark

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: anna.c@gmail.com

**Translation:** To: anna.c@gmail.com

| Maltese | English meaning | Notes |
|`,title:"ReplytoaBirthdayPartyInvitation",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/03-wedding-invitation.html",meta:{description:`# Wedding Invitation

**Scenario:** A couple invites friends and family to their wedding ceremony and reception.

## Email Header

**Lil (To):** hbieb@gmail.com
**Mingħand (From):** anna.c@gmail.com
**Data (Date):** 20 ta' Ġunju 2026
**Suġġett (Subject):** Stedina għat-tieġ

## Full Email

> **Lil:** hbieb@gmail.com
> **Mingħand:** anna.c@gmail.com
> **Data:** 20 ta' Ġunju 2026
> **Suġġett:** Stedina għat-tieġ
>
> Għeżież ħbieb,
>
> Għandna pjaċir nistednukom għat-tieġ tagħna.
>
> Iċ-ċerimonja se ssir nhar is-Sibt, 18 ta' Lulju.
>
> Tibda fil-ħamsa ta' wara nofsinhar fil-knisja ta' San Pawl.
>
> Wara ċ-ċerimonja, se jkun hemm riċeviment fil-lukanda Marina.
>
> Jekk jogħġobkom, ikkonfermaw jekk tistgħux tattendu sal-1 ta' Lulju.
>
> Nistennew bil-ħerqa li niċċelebraw dan il-jum speċjali magħkom.
>
> Tislijiet,
> Anna u Mark

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: hbieb@gmail.com

**Translation:** To: hbieb@gmail.com

| Maltese | English meaning | Notes |
|`,title:"WeddingInvitation",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/04-wedding-reply.html",meta:{description:`# Reply to a Wedding Invitation

**Scenario:** A guest replies to the couple and confirms that he and his wife will attend the wedding.

## Email Header

**Lil (To):** anna.c@gmail.com
**Mingħand (From):** david.b@gmail.com
**Data (Date):** 25 ta' Ġunju 2026
**Suġġett (Subject):** Risposta għall-istedina tat-tieġ

## Full Email

> **Lil:** anna.c@gmail.com
> **Mingħand:** david.b@gmail.com
> **Data:** 25 ta' Ġunju 2026
> **Suġġett:** Risposta għall-istedina tat-tieġ
>
> Għeżież Anna u Mark,
>
> Grazzi tal-istedina għat-tieġ tagħkom.
>
> Ninsabu kuntenti li nikkonfermaw li se nattendu.
>
> Jien u marti se niġu għaċ-ċerimonja u għar-riċeviment.
>
> Naslu fil-ħin.
>
> Għandna nġibu xi ħaġa għalikom?
>
> Nawguralkom ħafna hena u mħabba fil-ħajja miżżewġa tagħkom.
>
> Nistennew bil-ħerqa li niċċelebraw magħkom.
>
> Grazzi mill-ġdid. Tislijiet,
> David

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: anna.c@gmail.com

**Translation:** To: anna.c@gmail.com

| Maltese | English meaning | Notes |
|`,title:"ReplytoaWeddingInvitation",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/05-dinner-invitation.html",meta:{description:`# Dinner Invitation

**Scenario:** Anna invites her friend Mark to dinner at her home.

## Email Header

**Lil (To):** mark.b@gmail.com
**Mingħand (From):** anna.c@gmail.com
**Data (Date):** 12 ta' Ottubru 2026
**Suġġett (Subject):** Stedina għall-ikla ta' filgħaxija

## Full Email

> **Lil:** mark.b@gmail.com
> **Mingħand:** anna.c@gmail.com
> **Data:** 12 ta' Ottubru 2026
> **Suġġett:** Stedina għall-ikla ta' filgħaxija
>
> Għażiż Mark,
>
> Nispera li inti tajjeb.
>
> Nixtieq nistednek għall-ikla ta' filgħaxija d-dar tiegħi nhar il-Ġimgħa.
>
> Se nibdew fis-sebgħa ta' filgħaxija.
>
> Se nkunu ftit ħbieb u nieklu flimkien.
>
> Se nipprepara platt Malti u deżerta.
>
> Jekk jogħġbok, għidli jekk għandek xi preferenzi għall-ikel.
>
> Nispera li tkun tista' tiġi.
>
> Tislijiet,
> Anna

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: mark.b@gmail.com

**Translation:** To: mark.b@gmail.com

| Maltese | English meaning | Notes |
|`,title:"DinnerInvitation",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/06-dinner-reply.html",meta:{description:`# Reply to a Dinner Invitation

**Scenario:** Mark accepts Anna's dinner invitation and offers to bring dessert.

## Email Header

**Lil (To):** anna.c@gmail.com
**Mingħand (From):** mark.b@gmail.com
**Data (Date):** 14 ta' Ottubru 2026
**Suġġett (Subject):** Risposta għall-ikla ta' filgħaxija

## Full Email

> **Lil:** anna.c@gmail.com
> **Mingħand:** mark.b@gmail.com
> **Data:** 14 ta' Ottubru 2026
> **Suġġett:** Risposta għall-ikla ta' filgħaxija
>
> Għażiża Anna,
>
> Grazzi tal-istedina għall-ikla ta' filgħaxija.
>
> Iva, se niġi nhar il-Ġimgħa.
>
> Se nasal fis-sebgħa.
>
> M'għandi l-ebda preferenza għall-ikel.
>
> Nista' nġib xi ħaġa għad-deżerta?
>
> Se nġib kejk żgħir.
>
> Nistenna bil-ħerqa li niltaqa' mal-ħbieb tiegħek.
>
> Tislijiet,
> Mark

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: anna.c@gmail.com

**Translation:** To: anna.c@gmail.com

| Maltese | English meaning | Notes |
|`,title:"ReplytoaDinnerInvitation",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/07-chef-job-application.html",meta:{description:`# Chef Job Application

**Scenario:** The applicant writes to the restaurant manager to apply for the position of chef.

## Email Header

**Lil (To):** info@restorant.com
**Mingħand (From):** [isem]@email.com
**Data (Date):** 15 ta' Ottubru 2026
**Suġġett (Subject):** Applikazzjoni ta' xogħol ta' kok

## Full Email

> **Lil:** info@restorant.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' kok
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' kok fir-ristorant tagħkom.
>
> Għandi ħames snin esperjenza fil-kċina.
>
> Naf insajjar platti tradizzjonali Maltin u Mediterranji.
>
> Jien bniedem li jaħdem iebes u jimpurtani mill-kwalità tal-ikel.
>
> Naħdem ukoll tajjeb ma' tim.
>
> Nixtieq niltaqgħa miegħkom għal intervista meta jkun konvenjenti.
>
> Grazzi ħafna talli qiesu l-applikazzjoni tiegħi.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Tislijiet,
> [Ismek]

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: info@restorant.com

**Translation:** To: info@restorant.com

| Maltese | English meaning | Notes |
|`,title:"ChefJobApplication",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/08-cafe-waiter-job-application.html",meta:{description:`# Cafe Waiter Job Application

**Scenario:** The applicant writes to the cafe manager to apply for the position of waiter.

## Email Header

**Lil (To):** info@kafetterija.com
**Mingħand (From):** [isem]@email.com
**Data (Date):** 15 ta' Ottubru 2026
**Suġġett (Subject):** Applikazzjoni ta' xogħol ta' wejter

## Full Email

> **Lil:** info@kafetterija.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' wejter
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' wejter fil-kafetterija tagħkom.
>
> Għandi esperjenza ta' sentejn fis-servizz tal-klijenti.
>
> Nista' naqdi lill-klijenti b'mod edukat u bil-ħeffa.
>
> Nitgħallem malajr u nifhem il-bżonnijiet tal-klijenti.
>
> Jien persuna ta' ħbiberija u nħobb naħdem man-nies.
>
> Nista' naħdem filgħodu u filgħaxija.
>
> Nispera li ningħaqad mat-tim tagħkom.
>
> Grazzi talli ħadtu ħsieb l-applikazzjoni tiegħi.
>
> Nistenna bil-ħerqa li nisma' mingħandkom.
>
> Tislijiet,
> [Ismek]

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: info@kafetterija.com

**Translation:** To: info@kafetterija.com

| Maltese | English meaning | Notes |
|`,title:"CafeWaiterJobApplication",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/09-bus-driver-job-application.html",meta:{description:`# Bus Driver Job Application

**Scenario:** The applicant writes to the bus company to apply for the position of bus driver.

## Email Header

**Lil (To):** info@transport.com
**Mingħand (From):** [isem]@email.com
**Data (Date):** 15 ta' Ottubru 2026
**Suġġett (Subject):** Applikazzjoni ta' xogħol ta' sewwieq tal-karozza tal-linja

## Full Email

> **Lil:** info@transport.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' sewwieq tal-karozza tal-linja
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' sewwieq tal-karozza tal-linja.
>
> Għandi liċenzja tas-sewqan tal-kategorija D.
>
> Għandi esperjenza ta' tliet snin bħala sewwieq tal-karozza tal-linja.
>
> Naf it-toroq ta' Malta tajjeb ħafna.
>
> Jien responsabbli u jimpurtani mis-sigurtà tal-passiġġieri.
>
> Ninsab kalm u paċenzjuż mat-traffiku.
>
> Nirrispetta r-regoli tat-triq u nżomm il-ħin.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: info@transport.com

**Translation:** To: info@transport.com

| Maltese | English meaning | Notes |
|`,title:"BusDriverJobApplication",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/10-taxi-driver-job-application.html",meta:{description:`# Taxi Driver Job Application

**Scenario:** The applicant writes to the taxi company to apply for the position of taxi driver.

## Email Header

**Lil (To):** info@taksis.com
**Mingħand (From):** [isem]@email.com
**Data (Date):** 15 ta' Ottubru 2026
**Suġġett (Subject):** Applikazzjoni ta' xogħol ta' sewwieq tat-taksi

## Full Email

> **Lil:** info@taksis.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' sewwieq tat-taksi
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' sewwieq tat-taksi.
>
> Għandi liċenzja tas-sewqan u liċenzja speċjali tat-taksi.
>
> Naf it-toroq ta' Malta u ta' Għawdex tajjeb ħafna.
>
> Jiena sewwieq sigur, onest u responsabbli.
>
> Nittratta lill-klijenti b'rispett u bil-ħlewwa.
>
> Nista' naħdem billejl u fi tmiem il-ġimgħa.
>
> Nżomm il-karozza nadifa u komda għall-klijenti.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: info@taksis.com

**Translation:** To: info@taksis.com

| Maltese | English meaning | Notes |
|`,title:"TaxiDriverJobApplication",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/11-software-engineer-job-application.html",meta:{description:`# Software Engineer Job Application

**Scenario:** The applicant writes to the tech company to apply for the position of software engineer.

## Email Header

**Lil (To):** info@tech.com
**Mingħand (From):** [isem]@email.com
**Data (Date):** 15 ta' Ottubru 2026
**Suġġett (Subject):** Applikazzjoni ta' xogħol ta' inġinier tas-softwer

## Full Email

> **Lil:** info@tech.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' inġinier tas-softwer
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-pożizzjoni ta' inġinier tas-softwer.
>
> Għandi lawrja fil-kompjuter u esperjenza ta' ħames snin fl-iżvilupp tas-softwer.
>
> Naf il-lingwi tal-programmar bħal Java, Python u JavaScript.
>
> Naħdem fuq proġetti bħal apps u websajts.
>
> Jien kreattiv u nsolvi l-problemi b'mod effiċjenti.
>
> Naħdem tajjeb f'tim u wkoll waħdi.
>
> Jimpurtani mill-kwalità u mid-dettalji.
>
> Nixtieq inkun parti mit-tim tagħkom.
>
> Nispera li niltaqgħu għal intervista dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: info@tech.com

**Translation:** To: info@tech.com

| Maltese | English meaning | Notes |
|`,title:"SoftwareEngineerJobApplication",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/12-psychologist-job-application.html",meta:{description:`# Psychologist Job Application

**Scenario:** The applicant writes to the counselling clinic to apply for the position of psychologist.

## Email Header

**Lil (To):** info@clinika.com
**Mingħand (From):** [isem]@email.com
**Data (Date):** 15 ta' Ottubru 2026
**Suġġett (Subject):** Applikazzjoni ta' xogħol ta' psikologu

## Full Email

> **Lil:** info@clinika.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' psikologu
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' psikologu.
>
> Għandi lawrja fil-psikoloġija u esperjenza ta' erba' snin.
>
> Jiena nisma' lin-nies bil-paċenzja u bil-qalb.
>
> Ngħin lill-klijenti biex jifhmu s-sentimenti tagħhom.
>
> Nirrispetta l-privatezza ta' kull persuna.
>
> Nista' naħdem ma' tfal u adulti.
>
> Noffri appoġġ b'mod professjonali u ħanin.
>
> Nixtieq noffri l-għajnuna tiegħi lit-tim tagħkom.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Tislijiet,
> [Ismek]

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: info@clinika.com

**Translation:** To: info@clinika.com

| Maltese | English meaning | Notes |
|`,title:"PsychologistJobApplication",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/13-cleaner-job-application.html",meta:{description:`# Cleaner Job Application

**Scenario:** The applicant writes to the cleaning/property company to apply for the position of cleaner.

## Email Header

**Lil (To):** info@tindif.com
**Mingħand (From):** [isem]@email.com
**Data (Date):** 15 ta' Ottubru 2026
**Suġġett (Subject):** Applikazzjoni ta' xogħol ta' haddiem tat-tindif

## Full Email

> **Lil:** info@tindif.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' haddiem tat-tindif
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' haddiem tat-tindif.
>
> Għandi esperjenza ta' sentejn fix-xogħol tat-tindif.
>
> Naf naddaf djar, uffiċini u bini ieħor.
>
> Jien bniedem li jaħdem iebes, onest u puntwali.
>
> Nista' naħdem filgħodu u filgħaxija, ukoll fi tmiem il-ġimgħa.
>
> Jimpurtani li nżomm kollox nadif u ordnat.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: info@tindif.com

**Translation:** To: info@tindif.com

| Maltese | English meaning | Notes |
|`,title:"CleanerJobApplication",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/14-receptionist-job-application.html",meta:{description:`# Receptionist Job Application

**Scenario:** The applicant writes to a hotel (also usable for a bank) to apply for the position of receptionist.

## Email Header

**Lil (To):** info@lukanda.com
**Mingħand (From):** [isem]@email.com
**Data (Date):** 15 ta' Ottubru 2026
**Suġġett (Subject):** Applikazzjoni ta' xogħol ta' receptionist

## Full Email

> **Lil:** info@lukanda.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' receptionist
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' receptionist.
>
> Għandi esperjenza ta' tliet snin fis-servizz tal-klijenti.
>
> Naf nitkellem Malti, Ingliż u ftit Taljan.
>
> Nista' nwieġeb it-telefon u nilqa' lill-klijenti b'mod edukat.
>
> Jien nadif, puntwali u responsabbli.
>
> Nista' naħdem billejl u fi tmiem il-ġimgħa.
>
> Naf nuża l-kompjuter u nittratta mal-flus b'attenzjoni.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: info@lukanda.com

**Translation:** To: info@lukanda.com

| Maltese | English meaning | Notes |
|`,title:"ReceptionistJobApplication",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/15-teacher-job-application.html",meta:{description:`# Teacher Job Application

**Scenario:** The applicant writes to a school to apply for the position of teacher.

## Email Header

**Lil (To):** info@skola.com
**Mingħand (From):** [isem]@email.com
**Data (Date):** 15 ta' Ottubru 2026
**Suġġett (Subject):** Applikazzjoni ta' xogħol ta' għalliem

## Full Email

> **Lil:** info@skola.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' għalliem
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' għalliem.
>
> Għandi lawrja fl-edukazzjoni u esperjenza ta' sentejn fit-tagħlim.
>
> Naf ngħallem il-Malti, l-Ingliż u l-matematika.
>
> Jien paċenzjuż u nħobb naħdem mat-tfal.
>
> Nipprepara l-lezzjonijiet b'mod kreattiv u ċar.
>
> Jimpurtani mill-progress ta' kull student.
>
> Nista' naħdem ukoll ma' adulti fi klassijiet ta' filgħaxija.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: info@skola.com

**Translation:** To: info@skola.com

| Maltese | English meaning | Notes |
|`,title:"TeacherJobApplication",date:"2026-10-17 19:22:54"}},{route:"/en/more/maltese/practice/emails/16-anna-birthday-party-invitation.html",meta:{description:`# Birthday Party Invitation (Textbook Listening Exercise)

**Scenario:** Anna writes an email to Maria to invite her to her 15th birthday party at Għadira Bay. This is the original textbook email from the PDF, including the listening gap-fill options in brackets.

## Email Header

**Lil (To):** maria.b@gmail.com
**Mingħand (From):** anna.c@gmail.com
**Data (Date):** 30 ta' Ġunju, 2023
**Suġġett (Subject):** Festin ta' għeluq snini

## Full Email

> **Lil:** maria.b@gmail.com
> **Mingħand:** anna.c@gmail.com
> **Data:** 30 ta' Ġunju, 2023
> **Suġġett:** Festin ta' għeluq snini
>
> Ħelow Maria!
>
> Nispera li tinsab tajba. Bħalma taf, (ilbieraħ / dalwaqt / sena oħra) se nagħlaq 15-il sena u qed nibgħatek din l-ittra elettronika sabiex nistednek għall-festin ta' għeluq snini.
>
> Il-festin se jkun nhar (il-ġimgħa l-oħra / ix-xahar id-dieħel / il-Ġimgħa 14 ta' Lulju).
>
> Fis- (tmienja ta' flgħaxija / sitta ta' flgħodu / sitta ta' flgħaxija) se niltaqgħu (quddiem / fuq / taħt) il-knisja biex minn hemm niġru bil-van kollha f'daqqa li se joħodna l-bajja tal-Għadira.
>
> Fil-festin se jkun hemm ħafna ikel, xorb, logħob u mużika! Tinsiex tiġi bil-malja u ġġib xugaman għax xi qabża l-baħar ma tonqosx!
>
> Jekk jogħġbok agħtini risposta sa (bħal-lum ġimgħa / xahar ieħor).
>
> Nispera li narak ħalli nieħdu gost flimkien!
>
> Ċaw!
> Anna

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: maria.b@gmail.com

**Translation:** To: maria.b@gmail.com

| Maltese | English meaning | Notes |
|`,title:"BirthdayPartyInvitation(TextbookListeningExercise)",date:"2026-10-18 19:12:06"}},{route:"/en/more/maltese/practice/emails/17-chef-job-application-template.html",meta:{description:`# Chef Job Application (Textbook Writing Template)

**Scenario:** An applicant writes to a restaurant to apply for the position of chef. This is the original textbook template from the PDF, including the gap-fill options in brackets. Note: the closing is printed \`Tisjiet\` in the source; the standard formal spelling is \`Tislijiet\`.

## Email Header

**Lil (To):** info@restorant.com
**Mingħand (From):** gorg.com.mt
**Data (Date):** 16 ta' Ottubru 2026
**Suġġett (Subject):** Applikazzjoni ta' xogħol ta' kok

## Full Email

> **Lil:** info@restorant.com
> **Mingħand:** gorg.com.mt
> **Data:** 16 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' kok
>
> Għażiż Sinjur / Sinjura
>
> Jien qiegħed nibgħatlek din l-ittra biex (napplika / tapplika) għal xogħol.
>
> Nispera li tinsab tajjeb. Qed nibgħatlek din l-ittra elettronika sabiex napplika għal xogħol ta' kok fir-restorant tiegħek.
>
> Jien nixtieq naħdem bħala kok għax inħobb insajjar, inħobb naħdem ma' ħaddieħor u nħobb niltaqa' man-nies.
>
> Kont immur l-iskola tal-ITS (institute of tourism studies) u minn hemm ġibt iċ-ċertifikati li kelli bżonn. Għandi esperjenza ta' ħames snin naħdem f'restorant ta' lukanda lussuża.
>
> u għalhekk naħseb li kapaċi għal dan ix-xogħol. Naf nitkellem Ingliż, Malti, u ftit Taljan.
>
> Grazzi talli qrajt din l-ittra. Napprezza jekk tikkunsidrani għal dan ix-xogħol.
>
> Nista' niltaqa' miegħek biex nikkellmu iktar fid-dettall kuljum mit-8 ta' filgħodu sas-7 ta' filgħaxija. / meta tkun komdu inti.
>
> Tisjiet,
> John Mallia

## Sentence-by-Sentence Translation and Word Notes

**Malti:** Lil: info@restorant.com

**Translation:** To: info@restorant.com

| Maltese | English meaning | Notes |
|`,title:"ChefJobApplication(TextbookWritingTemplate)",date:"2026-10-18 19:12:06"}},{route:"/en/more/maltese/practice/emails/",meta:{description:"",title:"EmailIndex",date:"2026-10-18 19:12:06"}},{route:"/zh/more/maltese/practice/dialogues/01-hospital-appointment.html",meta:{description:`# 预约医院就诊时间

**场景：** David 打电话到健康中心，向接待员 Maria 预约医生并确认时间和证件。

## 完整对话

**Maria：** Bonġu, Ċentru tas-Saħħa. Kif nista' ngħinek?

**David：** Bonġu. Nixtieq nagħmel appuntament mat-tabib, jekk jogħġbok.

**Maria：** Għandek preferenza għal xi ġurnata?

**David：** Jekk jista' jkun, għada filgħodu.

**Maria：** Għandna ħin fl-għaxra u nofs. Tajjeb għalik?

**David：** Iva, tajjeb ħafna. Għandi bżonn inġib xi dokumenti?

**Maria：** Ġib il-karta tal-identità u l-karta tas-saħħa.

**David：** Grazzi. Narak għada.

## 逐句翻译与逐词拆解

### 1. Maria（接待员）

**Malti:** Bonġu, Ċentru tas-Saħħa. Kif nista' ngħinek?

**整句：** 早上好，这里是健康中心。我可以怎样帮您？

| 词语 | 中文含义 | 说明 |
|`,title:"预约医院就诊时间",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/practice/dialogues/02-lost-property.html",meta:{description:`# 失物招领与警局领取

**场景：** Mark 在警局接听失主 Anna 的电话，两人确认钱包并约定领取时间。

## 完整对话

**Anna：** Bonġu. Sibtu kartiera mitlufa ħdejn il-waqfa tal-karozzi tal-linja?

**Mark：** Iva, il-kartiera tinsab hawn fl-għassa tal-pulizija.

**Anna：** X'nagħmel biex niġi niġborha?

**Mark：** Tista' tiġi l-għassa għada filgħodu.

**Anna：** Nista' niġi fid-disgħa?

**Mark：** Iva. Ġib miegħek dokument ta' identità.

**Anna：** Se jkolli bżonn inġib xi prova oħra?

**Mark：** Le, id-dokument tal-identità jkun biżżejjed.

## 逐句翻译与逐词拆解

### 1. Anna（失主）

**Malti:** Bonġu. Sibtu kartiera mitlufa ħdejn il-waqfa tal-karozzi tal-linja?

**整句：** 你好。您是否在公交车站附近捡到一个丢失的钱包？

| 词语 | 中文含义 | 说明 |
|`,title:"失物招领与警局领取",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/practice/dialogues/03-weekend-party.html",meta:{description:`# 参加周末派对

**场景：** 两位朋友商量参加周末派对的安排。

## 完整对话

**Anna：** Se tagħmel xi ħaġa fi tmiem il-ġimgħa?

**Mark：** Għadni ma ddeċidejtx. Għaliex?

**Anna：** Qed norganizza festa d-dar is-Sibt filgħaxija.

**Mark：** Ħsejjes sbieħ! F'liema ħin tibda?

**Anna：** Nibdew fit-tmienja, imma tista' tasal aktar tard.

**Mark：** X'għandi nġib miegħi?

**Anna：** Ġib xi ħaġa x'tixorbu u jien nagħmel l-ikel.

**Mark：** Perfett. Inkun hemm fit-tmienja.

## 逐句翻译与逐词拆解

### 1. Anna

**Malti:** Se tagħmel xi ħaġa fi tmiem il-ġimgħa?

**整句：** 你周末有什么安排吗？

| 词语 | 中文含义 | 说明 |
|`,title:"参加周末派对",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/practice/dialogues/04-asking-the-time.html",meta:{description:`# 询问当前时间

**场景：** 两位朋友在约好的地点碰面，一人询问时间并确认是否迟到。

## 完整对话

**Mark：** Skużani, x'ħin hu issa?

**Lina：** Huma t-tmienja u kwart.

**Mark：** Grazzi. Għandi appuntament fit-tmienja u nofs.

**Lina：** Għad għandek ħmistax-il minuta.

**Mark：** Tajjeb. Il-post jinsab ħdejn il-pjazza, hux?

**Lina：** Iva, eżattament. Jien qiegħda quddiem il-bieb.

**Mark：** Qed nitlaq issa. Nasal f'għaxar minuti.

**Lina：** Sewwa, narak dalwaqt.

## 逐句翻译与逐词拆解

### 1. Mark

**Malti:** Skużani, x'ħin hu issa?

**整句：** 不好意思，现在几点了？

| 词语 | 中文含义 | 说明 |
|`,title:"询问当前时间",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/practice/dialogues/05-weekend-plans.html",meta:{description:`# 闲聊近期计划

**场景：** Anna 和 Mark 聊今天、明天、本周末、下周、下个月及明年的安排。

## 完整对话

**Anna：** X'għandek tagħmel illum u għada?

**Mark：** Illum naħdem mid-dar u filgħaxija nistudja l-Malti. Għada se mmur l-isptar ma' ommi.

**Anna：** X'se tagħmel fi tmiem il-ġimgħa?

**Mark：** Se niltaqa' mal-ħbieb għal kafè.

**Anna：** Għandek pjanijiet għall-ġimgħa d-dieħla?

**Mark：** Iva. Nhar it-Tlieta se nżur lill-familja tiegħi.

**Anna：** U x-xahar id-dieħel?

**Mark：** Se nivvjaġġa lejn Għawdex għal ftit jiem.

**Anna：** X'tixtieq tagħmel is-sena d-dieħla?

**Mark：** Nixtieq nitgħallem aktar il-Malti u nsiefer.

## 逐句翻译与逐词拆解

### 1. Anna

**Malti:** X'għandek tagħmel illum u għada?

**整句：** 你今天和明天要做什么？

| 词语 | 中文含义 | 说明 |
|`,title:"闲聊近期计划",date:"2026-10-15 12:08:06"}},{route:"/zh/more/maltese/practice/dialogues/06-jodie-doctor-appointment.html",meta:{description:`# 预约 Farrugia 医生

**场景：** Jodie 打电话到诊所，预约 Farrugia 医生下周就诊，双方商定周四晚上七点。（说话人标签根据对话语境推断，原文为听力练习。）

## 完整对话

**Jodie（患者）：** Nista' nagħmel appuntament għall-ġimgħa d-dieħla mat-tabib Farrugia?

**接待员：** Il-ġimgħa d-dieħla għandi vojt l-Erbgħa u l-Ħamis.

**Jodie（患者）：** L-Erbgħa ma nistax, imma l-Ħamis iva. Fi x'hin?

**接待员：** Filgħodu?

**接待员：** Jew filgħaxija?

**Jodie（患者）：** Filgħaxija aħjar, wara x-xogħol.

**接待员：** Fis-6, fis-6:30, jew fis-7pm?

**Jodie（患者）：** Fis-sebgħa tajjeb, grazzi!

**接待员：** Ibbukkajt il-Ħamis fis-sebgħa ta' filgħaxija.

**接待员：** Nikkonferma, saħħa.

## 逐句翻译与逐词拆解

### 1. Jodie（患者）

**Malti:** Nista' nagħmel appuntament għall-ġimgħa d-dieħla mat-tabib Farrugia?

**整句：** 我能不能约下周和 Farrugia 医生见面？

| 词语 | 中文含义 | 说明 |
|`,title:"预约Farrugia医生",date:"2026-10-18 19:12:06"}},{route:"/zh/more/maltese/practice/dialogues/07-claire-restaurant-messages.html",meta:{description:`# 餐厅晚餐——短信对话

**场景：** Claire 和朋友互发短信，确认今晚在餐厅晚餐的安排：见面时间、着装和孩子照看。（说话人标签根据对话语境推断。）

## 完整对话

**朋友：** Waranofsinhar it-tajjeb, Claire. Għal illejla kollox sew?

**Claire：** Waranofsinhar it-tajjeb. Iva għal-lejla kollox sew. Fit-tmienja u nofs hux?

**朋友：** Eżatt, niltaqgħu fit-tmienja u nofs u nidħlu ġewwa l-ħanut.

**朋友：** X'ser tilbes?

**朋友：** Ħa tilbes ġakketta?

**Claire：** Qed ikun ftit bard u għalhekk naħseb nilbes ġakketta u flokk tas-suf.

**朋友：** Tajjeb, nilbes bħalek mela. It-tifel se iġġibuh magħkom?

**Claire：** Jien u r-raġel, it-tifel ser inħalluh m'ommi.

**朋友：** Tajjeb, niltaqgħu mela. Saħħiet.

**Claire：** Iva, niltaqgħu. Saħħiet.

## 逐句翻译与逐词拆解

### 1. 朋友

**Malti:** Waranofsinhar it-tajjeb, Claire. Għal illejla kollox sew?

**整句：** 下午好，Claire。今晚一切都好吗？

| 词语 | 中文含义 | 说明 |
|`,title:"餐厅晚餐——短信对话",date:"2026-10-18 19:12:06"}},{route:"/zh/more/maltese/practice/dialogues/08-rented-car.html",meta:{description:`# 租来的车

**场景：** Carmen Micallef 打电话给租车公司，要找 Martin Deguara 先生。对方不在，她向职员说明她十五天前租了车、现在周五要飞回自己的国家；双方商定她周五进机场前到位于机场停车场的办公室还车、检查车辆并退还 VISA 押金。

**来源：** 对话改编自 Charles Daniel Saliba 的《Speaking Maltese 2》（Djalogu addattat minn Speaking Maltese 2 ta' Charles Daniel Saliba）

## 完整对话

**Carmen（客户）：** Bonġu, jien Carmen Micallef. Nista' nkellem lis-Sur Martin Deguara, jekk jogħġbok?

**Tal-karozzi（租车公司职员）：** Skużani, illum Martin mhux hawn. Nista' naqdik jien?

**Carmen（客户）：** Ma jimpurtax, mela ħa nispjega kollox lilek. Ħmistax ilu kont krejt karozza mingħandkom u issa se nsiefer lura pajjiżi nhar il-Ġimgħa. Nixtieq inkun naf kif se ngħaddilkom il-karozza lura.

**Tal-karozzi（租车公司职员）：** Inti x'ħin se ssiefer il-Ġimgħa?

**Carmen（客户）：** It-titjira hija fid-disgħa ta' billejl.

**Tal-karozzi（租车公司职员）：** Tajjeb ħafna, mela l-Ġimgħa stess qabel tidħol l-ajruport ejja hawn l-uffiċċju tagħna li jinsab fil-parkeġġ tal-ajruport stess. Ikollna bżonn nispezzjonaw il-karozza u malli jkun kollox sew, nirrilaxxaw il-VISA tiegħek.

**Carmen（客户）：** Ok, naħseb ikunu xi s-sitta ta' flgħaxija kif nasal.

**Tal-karozzi（租车公司职员）：** Tajjeb, ikun hawn jien dak il-ħin.

**Carmen（客户）：** Sewwa wisq, mela narak il-Ġimgħa fis-sitta ta' flgħaxija. Grazzi!

**Tal-karozzi（租车公司职员）：** Grazzi lilek, saħħa!

## 逐句翻译与逐词拆解

### 1. Carmen（客户）

**Malti:** Bonġu, jien Carmen Micallef. Nista' nkellem lis-Sur Martin Deguara, jekk jogħġbok?

**整句：** 早上好，我是 Carmen Micallef。请问我能和 Martin Deguara 先生说话吗？

| 词语 | 中文含义 | 说明 |
|`,title:"租来的车",date:"2026-10-18 19:12:06"}},{route:"/zh/more/maltese/practice/dialogues/",meta:{description:"",title:"情景对话目录",date:"2026-10-18 19:12:06"}},{route:"/zh/more/maltese/practice/emails/01-birthday-invitation.html",meta:{description:`# 生日派对邀请邮件

**场景：** Anna 邀请朋友 Mark 参加自己的生日派对。

## 邮件头部

**Lil（收件人 To）：** mark.b@gmail.com
**Mingħand（发件人 From）：** anna.c@gmail.com
**Data（日期）：** 10 ta' Ottubru 2026
**Suġġett（主题）：** Stedina għall-festa ta' għeluq snini

## 邮件全文

> **Lil:** mark.b@gmail.com
> **Mingħand:** anna.c@gmail.com
> **Data:** 10 ta' Ottubru 2026
> **Suġġett:** Stedina għall-festa ta' għeluq snini
>
> Għażiż Mark,
>
> Nispera li inti tajjeb.
>
> Nixtieq nistedinkom għall-festa ta' għeluq snini nhar is-Sibt.
>
> Il-festa se tibda fis-sebgħa ta' filgħaxija.
>
> Se niltaqgħu d-dar tiegħi f'Valletta.
>
> Ikun hemm ikel, mużika u kejk.
>
> Tista' ġġib lil xi ħadd miegħek jekk trid.
>
> Jekk jogħġbok, għidli jekk ġej.
>
> Nistenna bil-ħerqa li niċċelebraw flimkien.
>
> Tislijiet,
> Anna

## 逐句翻译与逐词拆解

**Malti:** Lil: mark.b@gmail.com

**整句：** 收件人（To）：mark.b@gmail.com

| 词语 | 中文含义 | 说明 |
|`,title:"生日派对邀请邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/02-birthday-reply.html",meta:{description:`# 回复生日派对邀请

**场景：** Mark 回复 Anna，接受生日派对邀请并询问是否需要帮忙。

## 邮件头部

**Lil（收件人 To）：** anna.c@gmail.com
**Mingħand（发件人 From）：** mark.b@gmail.com
**Data（日期）：** 12 ta' Ottubru 2026
**Suġġett（主题）：** Risposta għall-istedina

## 邮件全文

> **Lil:** anna.c@gmail.com
> **Mingħand:** mark.b@gmail.com
> **Data:** 12 ta' Ottubru 2026
> **Suġġett:** Risposta għall-istedina
>
> Għażiża Anna,
>
> Grazzi ħafna tal-istedina.
>
> Iva, nixtieq niġi għall-festa nhar is-Sibt.
>
> Se nkun hemm fis-sebgħa.
>
> Nista' nġib xi ħaġa miegħi?
>
> Nista' nġib kejk żgħir.
>
> Għidli jekk għandek bżonn l-għajnuna.
>
> Nistenna bil-ħerqa li narak.
>
> Tislijiet,
> Mark

## 逐句翻译与逐词拆解

**Malti:** Lil: anna.c@gmail.com

**整句：** 收件人（To）：anna.c@gmail.com

| 词语 | 中文含义 | 说明 |
|`,title:"回复生日派对邀请",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/03-wedding-invitation.html",meta:{description:`# 婚礼邀请邮件

**场景：** 一对新人邀请亲友参加婚礼仪式和宴会。

## 邮件头部

**Lil（收件人 To）：** hbieb@gmail.com
**Mingħand（发件人 From）：** anna.c@gmail.com
**Data（日期）：** 20 ta' Ġunju 2026
**Suġġett（主题）：** Stedina għat-tieġ

## 邮件全文

> **Lil:** hbieb@gmail.com
> **Mingħand:** anna.c@gmail.com
> **Data:** 20 ta' Ġunju 2026
> **Suġġett:** Stedina għat-tieġ
>
> Għeżież ħbieb,
>
> Għandna pjaċir nistednukom għat-tieġ tagħna.
>
> Iċ-ċerimonja se ssir nhar is-Sibt, 18 ta' Lulju.
>
> Tibda fil-ħamsa ta' wara nofsinhar fil-knisja ta' San Pawl.
>
> Wara ċ-ċerimonja, se jkun hemm riċeviment fil-lukanda Marina.
>
> Jekk jogħġobkom, ikkonfermaw jekk tistgħux tattendu sal-1 ta' Lulju.
>
> Nistennew bil-ħerqa li niċċelebraw dan il-jum speċjali magħkom.
>
> Tislijiet,
> Anna u Mark

## 逐句翻译与逐词拆解

**Malti:** Lil: hbieb@gmail.com

**整句：** 收件人（To）：hbieb@gmail.com

| 词语 | 中文含义 | 说明 |
|`,title:"婚礼邀请邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/04-wedding-reply.html",meta:{description:`# 回复婚礼邀请邮件

**场景：** 一位受邀者回复新人，确认自己和配偶会出席婚礼。

## 邮件头部

**Lil（收件人 To）：** anna.c@gmail.com
**Mingħand（发件人 From）：** david.b@gmail.com
**Data（日期）：** 25 ta' Ġunju 2026
**Suġġett（主题）：** Risposta għall-istedina tat-tieġ

## 邮件全文

> **Lil:** anna.c@gmail.com
> **Mingħand:** david.b@gmail.com
> **Data:** 25 ta' Ġunju 2026
> **Suġġett:** Risposta għall-istedina tat-tieġ
>
> Għeżież Anna u Mark,
>
> Grazzi tal-istedina għat-tieġ tagħkom.
>
> Ninsabu kuntenti li nikkonfermaw li se nattendu.
>
> Jien u marti se niġu għaċ-ċerimonja u għar-riċeviment.
>
> Naslu fil-ħin.
>
> Għandna nġibu xi ħaġa għalikom?
>
> Nawguralkom ħafna hena u mħabba fil-ħajja miżżewġa tagħkom.
>
> Nistennew bil-ħerqa li niċċelebraw magħkom.
>
> Grazzi mill-ġdid. Tislijiet,
> David

## 逐句翻译与逐词拆解

**Malti:** Lil: anna.c@gmail.com

**整句：** 收件人（To）：anna.c@gmail.com

| 词语 | 中文含义 | 说明 |
|`,title:"回复婚礼邀请邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/05-dinner-invitation.html",meta:{description:`# 晚餐邀请邮件

**场景：** Anna 邀请朋友 Mark 到家里吃晚餐。

## 邮件头部

**Lil（收件人 To）：** mark.b@gmail.com
**Mingħand（发件人 From）：** anna.c@gmail.com
**Data（日期）：** 12 ta' Ottubru 2026
**Suġġett（主题）：** Stedina għall-ikla ta' filgħaxija

## 邮件全文

> **Lil:** mark.b@gmail.com
> **Mingħand:** anna.c@gmail.com
> **Data:** 12 ta' Ottubru 2026
> **Suġġett:** Stedina għall-ikla ta' filgħaxija
>
> Għażiż Mark,
>
> Nispera li inti tajjeb.
>
> Nixtieq nistednek għall-ikla ta' filgħaxija d-dar tiegħi nhar il-Ġimgħa.
>
> Se nibdew fis-sebgħa ta' filgħaxija.
>
> Se nkunu ftit ħbieb u nieklu flimkien.
>
> Se nipprepara platt Malti u deżerta.
>
> Jekk jogħġbok, għidli jekk għandek xi preferenzi għall-ikel.
>
> Nispera li tkun tista' tiġi.
>
> Tislijiet,
> Anna

## 逐句翻译与逐词拆解

**Malti:** Lil: mark.b@gmail.com

**整句：** 收件人（To）：mark.b@gmail.com

| 词语 | 中文含义 | 说明 |
|`,title:"晚餐邀请邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/06-dinner-reply.html",meta:{description:`# 回复晚餐邀请邮件

**场景：** Mark 接受 Anna 的晚餐邀请，并主动提出带甜点。

## 邮件头部

**Lil（收件人 To）：** anna.c@gmail.com
**Mingħand（发件人 From）：** mark.b@gmail.com
**Data（日期）：** 14 ta' Ottubru 2026
**Suġġett（主题）：** Risposta għall-ikla ta' filgħaxija

## 邮件全文

> **Lil:** anna.c@gmail.com
> **Mingħand:** mark.b@gmail.com
> **Data:** 14 ta' Ottubru 2026
> **Suġġett:** Risposta għall-ikla ta' filgħaxija
>
> Għażiża Anna,
>
> Grazzi tal-istedina għall-ikla ta' filgħaxija.
>
> Iva, se niġi nhar il-Ġimgħa.
>
> Se nasal fis-sebgħa.
>
> M'għandi l-ebda preferenza għall-ikel.
>
> Nista' nġib xi ħaġa għad-deżerta?
>
> Se nġib kejk żgħir.
>
> Nistenna bil-ħerqa li niltaqa' mal-ħbieb tiegħek.
>
> Tislijiet,
> Mark

## 逐句翻译与逐词拆解

**Malti:** Lil: anna.c@gmail.com

**整句：** 收件人（To）：anna.c@gmail.com

| 词语 | 中文含义 | 说明 |
|`,title:"回复晚餐邀请邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/07-chef-job-application.html",meta:{description:`# 餐厅厨师求职邮件

**场景：** 申请人写信给餐厅经理，申请餐厅的厨师职位。

## 邮件头部

**Lil（收件人 To）：** info@restorant.com
**Mingħand（发件人 From）：** [isem]@email.com
**Data（日期）：** 15 ta' Ottubru 2026
**Suġġett（主题）：** Applikazzjoni ta' xogħol ta' kok

## 邮件全文

> **Lil:** info@restorant.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' kok
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' kok fir-ristorant tagħkom.
>
> Għandi ħames snin esperjenza fil-kċina.
>
> Naf insajjar platti tradizzjonali Maltin u Mediterranji.
>
> Jien bniedem li jaħdem iebes u jimpurtani mill-kwalità tal-ikel.
>
> Naħdem ukoll tajjeb ma' tim.
>
> Nixtieq niltaqgħa miegħkom għal intervista meta jkun konvenjenti.
>
> Grazzi ħafna talli qiesu l-applikazzjoni tiegħi.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Tislijiet,
> [Ismek]

## 逐句翻译与逐词拆解

**Malti:** Lil: info@restorant.com

**整句：** 收件人（To）：info@restorant.com

| 词语 | 中文含义 | 说明 |
|`,title:"餐厅厨师求职邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/08-cafe-waiter-job-application.html",meta:{description:`# 咖啡厅服务员求职邮件

**场景：** 申请人写信给咖啡厅经理，申请咖啡厅的服务员职位。

## 邮件头部

**Lil（收件人 To）：** info@kafetterija.com
**Mingħand（发件人 From）：** [isem]@email.com
**Data（日期）：** 15 ta' Ottubru 2026
**Suġġett（主题）：** Applikazzjoni ta' xogħol ta' wejter

## 邮件全文

> **Lil:** info@kafetterija.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' wejter
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' wejter fil-kafetterija tagħkom.
>
> Għandi esperjenza ta' sentejn fis-servizz tal-klijenti.
>
> Nista' naqdi lill-klijenti b'mod edukat u bil-ħeffa.
>
> Nitgħallem malajr u nifhem il-bżonnijiet tal-klijenti.
>
> Jien persuna ta' ħbiberija u nħobb naħdem man-nies.
>
> Nista' naħdem filgħodu u filgħaxija.
>
> Nispera li ningħaqad mat-tim tagħkom.
>
> Grazzi talli ħadtu ħsieb l-applikazzjoni tiegħi.
>
> Nistenna bil-ħerqa li nisma' mingħandkom.
>
> Tislijiet,
> [Ismek]

## 逐句翻译与逐词拆解

**Malti:** Lil: info@kafetterija.com

**整句：** 收件人（To）：info@kafetterija.com

| 词语 | 中文含义 | 说明 |
|`,title:"咖啡厅服务员求职邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/09-bus-driver-job-application.html",meta:{description:`# 公交车司机求职邮件

**场景：** 申请人写信给公交公司，申请公交车司机职位。

## 邮件头部

**Lil（收件人 To）：** info@transport.com
**Mingħand（发件人 From）：** [isem]@email.com
**Data（日期）：** 15 ta' Ottubru 2026
**Suġġett（主题）：** Applikazzjoni ta' xogħol ta' sewwieq tal-karozza tal-linja

## 邮件全文

> **Lil:** info@transport.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' sewwieq tal-karozza tal-linja
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' sewwieq tal-karozza tal-linja.
>
> Għandi liċenzja tas-sewqan tal-kategorija D.
>
> Għandi esperjenza ta' tliet snin bħala sewwieq tal-karozza tal-linja.
>
> Naf it-toroq ta' Malta tajjeb ħafna.
>
> Jien responsabbli u jimpurtani mis-sigurtà tal-passiġġieri.
>
> Ninsab kalm u paċenzjuż mat-traffiku.
>
> Nirrispetta r-regoli tat-triq u nżomm il-ħin.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## 逐句翻译与逐词拆解

**Malti:** Lil: info@transport.com

**整句：** 收件人（To）：info@transport.com

| 词语 | 中文含义 | 说明 |
|`,title:"公交车司机求职邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/10-taxi-driver-job-application.html",meta:{description:`# 出租车司机求职邮件

**场景：** 申请人写信给出租车公司，申请出租车司机职位。

## 邮件头部

**Lil（收件人 To）：** info@taksis.com
**Mingħand（发件人 From）：** [isem]@email.com
**Data（日期）：** 15 ta' Ottubru 2026
**Suġġett（主题）：** Applikazzjoni ta' xogħol ta' sewwieq tat-taksi

## 邮件全文

> **Lil:** info@taksis.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' sewwieq tat-taksi
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' sewwieq tat-taksi.
>
> Għandi liċenzja tas-sewqan u liċenzja speċjali tat-taksi.
>
> Naf it-toroq ta' Malta u ta' Għawdex tajjeb ħafna.
>
> Jiena sewwieq sigur, onest u responsabbli.
>
> Nittratta lill-klijenti b'rispett u bil-ħlewwa.
>
> Nista' naħdem billejl u fi tmiem il-ġimgħa.
>
> Nżomm il-karozza nadifa u komda għall-klijenti.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## 逐句翻译与逐词拆解

**Malti:** Lil: info@taksis.com

**整句：** 收件人（To）：info@taksis.com

| 词语 | 中文含义 | 说明 |
|`,title:"出租车司机求职邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/11-software-engineer-job-application.html",meta:{description:`# 软件工程师求职邮件

**场景：** 申请人写信给科技公司，申请软件工程师职位。

## 邮件头部

**Lil（收件人 To）：** info@tech.com
**Mingħand（发件人 From）：** [isem]@email.com
**Data（日期）：** 15 ta' Ottubru 2026
**Suġġett（主题）：** Applikazzjoni ta' xogħol ta' inġinier tas-softwer

## 邮件全文

> **Lil:** info@tech.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' inġinier tas-softwer
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-pożizzjoni ta' inġinier tas-softwer.
>
> Għandi lawrja fil-kompjuter u esperjenza ta' ħames snin fl-iżvilupp tas-softwer.
>
> Naf il-lingwi tal-programmar bħal Java, Python u JavaScript.
>
> Naħdem fuq proġetti bħal apps u websajts.
>
> Jien kreattiv u nsolvi l-problemi b'mod effiċjenti.
>
> Naħdem tajjeb f'tim u wkoll waħdi.
>
> Jimpurtani mill-kwalità u mid-dettalji.
>
> Nixtieq inkun parti mit-tim tagħkom.
>
> Nispera li niltaqgħu għal intervista dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## 逐句翻译与逐词拆解

**Malti:** Lil: info@tech.com

**整句：** 收件人（To）：info@tech.com

| 词语 | 中文含义 | 说明 |
|`,title:"软件工程师求职邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/12-psychologist-job-application.html",meta:{description:`# 心理咨询师求职邮件

**场景：** 申请人写信给心理咨询机构，申请心理咨询师职位。

## 邮件头部

**Lil（收件人 To）：** info@clinika.com
**Mingħand（发件人 From）：** [isem]@email.com
**Data（日期）：** 15 ta' Ottubru 2026
**Suġġett（主题）：** Applikazzjoni ta' xogħol ta' psikologu

## 邮件全文

> **Lil:** info@clinika.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' psikologu
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' psikologu.
>
> Għandi lawrja fil-psikoloġija u esperjenza ta' erba' snin.
>
> Jiena nisma' lin-nies bil-paċenzja u bil-qalb.
>
> Ngħin lill-klijenti biex jifhmu s-sentimenti tagħhom.
>
> Nirrispetta l-privatezza ta' kull persuna.
>
> Nista' naħdem ma' tfal u adulti.
>
> Noffri appoġġ b'mod professjonali u ħanin.
>
> Nixtieq noffri l-għajnuna tiegħi lit-tim tagħkom.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Tislijiet,
> [Ismek]

## 逐句翻译与逐词拆解

**Malti:** Lil: info@clinika.com

**整句：** 收件人（To）：info@clinika.com

| 词语 | 中文含义 | 说明 |
|`,title:"心理咨询师求职邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/13-cleaner-job-application.html",meta:{description:`# 清洁工求职邮件

**场景：** 申请人写信给清洁/物业公司，申请清洁工职位。

## 邮件头部

**Lil（收件人 To）：** info@tindif.com
**Mingħand（发件人 From）：** [isem]@email.com
**Data（日期）：** 15 ta' Ottubru 2026
**Suġġett（主题）：** Applikazzjoni ta' xogħol ta' haddiem tat-tindif

## 邮件全文

> **Lil:** info@tindif.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' haddiem tat-tindif
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' haddiem tat-tindif.
>
> Għandi esperjenza ta' sentejn fix-xogħol tat-tindif.
>
> Naf naddaf djar, uffiċini u bini ieħor.
>
> Jien bniedem li jaħdem iebes, onest u puntwali.
>
> Nista' naħdem filgħodu u filgħaxija, ukoll fi tmiem il-ġimgħa.
>
> Jimpurtani li nżomm kollox nadif u ordnat.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## 逐句翻译与逐词拆解

**Malti:** Lil: info@tindif.com

**整句：** 收件人（To）：info@tindif.com

| 词语 | 中文含义 | 说明 |
|`,title:"清洁工求职邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/14-receptionist-job-application.html",meta:{description:`# 酒店前台求职邮件

**场景：** 申请人写信给酒店（也可用于银行），申请前台接待职位。

## 邮件头部

**Lil（收件人 To）：** info@lukanda.com
**Mingħand（发件人 From）：** [isem]@email.com
**Data（日期）：** 15 ta' Ottubru 2026
**Suġġett（主题）：** Applikazzjoni ta' xogħol ta' receptionist

## 邮件全文

> **Lil:** info@lukanda.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' receptionist
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' receptionist.
>
> Għandi esperjenza ta' tliet snin fis-servizz tal-klijenti.
>
> Naf nitkellem Malti, Ingliż u ftit Taljan.
>
> Nista' nwieġeb it-telefon u nilqa' lill-klijenti b'mod edukat.
>
> Jien nadif, puntwali u responsabbli.
>
> Nista' naħdem billejl u fi tmiem il-ġimgħa.
>
> Naf nuża l-kompjuter u nittratta mal-flus b'attenzjoni.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## 逐句翻译与逐词拆解

**Malti:** Lil: info@lukanda.com

**整句：** 收件人（To）：info@lukanda.com

| 词语 | 中文含义 | 说明 |
|`,title:"酒店前台求职邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/15-teacher-job-application.html",meta:{description:`# 教师求职邮件

**场景：** 申请人写信给学校，申请教师职位。

## 邮件头部

**Lil（收件人 To）：** info@skola.com
**Mingħand（发件人 From）：** [isem]@email.com
**Data（日期）：** 15 ta' Ottubru 2026
**Suġġett（主题）：** Applikazzjoni ta' xogħol ta' għalliem

## 邮件全文

> **Lil:** info@skola.com
> **Mingħand:** [isem]@email.com
> **Data:** 15 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' għalliem
>
> Għażiż Sinjur / Sinjura,
>
> Qed nikteb biex napplika għall-impjieg ta' għalliem.
>
> Għandi lawrja fl-edukazzjoni u esperjenza ta' sentejn fit-tagħlim.
>
> Naf ngħallem il-Malti, l-Ingliż u l-matematika.
>
> Jien paċenzjuż u nħobb naħdem mat-tfal.
>
> Nipprepara l-lezzjonijiet b'mod kreattiv u ċar.
>
> Jimpurtani mill-progress ta' kull student.
>
> Nista' naħdem ukoll ma' adulti fi klassijiet ta' filgħaxija.
>
> Nispera li nisma' mingħandkom dalwaqt.
>
> Grazzi talli qiesu l-applikazzjoni tiegħi.
>
> Tislijiet,
> [Ismek]

## 逐句翻译与逐词拆解

**Malti:** Lil: info@skola.com

**整句：** 收件人（To）：info@skola.com

| 词语 | 中文含义 | 说明 |
|`,title:"教师求职邮件",date:"2026-10-17 19:22:54"}},{route:"/zh/more/maltese/practice/emails/16-anna-birthday-party-invitation.html",meta:{description:`# 生日聚会邀请（教材听力练习）

**场景：** Anna 给 Maria 写邮件，邀请她来参加自己在 Għadira 湾举行的 15 岁生日聚会。这是 PDF 中的教材原文邮件，括号内为听力填空选项。

## 邮件头部

**Lil（收件人 To）：** maria.b@gmail.com
**Mingħand（发件人 From）：** anna.c@gmail.com
**Data（日期）：** 30 ta' Ġunju, 2023
**Suġġett（主题）：** Festin ta' għeluq snini

## 邮件全文

> **Lil:** maria.b@gmail.com
> **Mingħand:** anna.c@gmail.com
> **Data:** 30 ta' Ġunju, 2023
> **Suġġett:** Festin ta' għeluq snini
>
> Ħelow Maria!
>
> Nispera li tinsab tajba. Bħalma taf, (ilbieraħ / dalwaqt / sena oħra) se nagħlaq 15-il sena u qed nibgħatek din l-ittra elettronika sabiex nistednek għall-festin ta' għeluq snini.
>
> Il-festin se jkun nhar (il-ġimgħa l-oħra / ix-xahar id-dieħel / il-Ġimgħa 14 ta' Lulju).
>
> Fis- (tmienja ta' flgħaxija / sitta ta' flgħodu / sitta ta' flgħaxija) se niltaqgħu (quddiem / fuq / taħt) il-knisja biex minn hemm niġru bil-van kollha f'daqqa li se joħodna l-bajja tal-Għadira.
>
> Fil-festin se jkun hemm ħafna ikel, xorb, logħob u mużika! Tinsiex tiġi bil-malja u ġġib xugaman għax xi qabża l-baħar ma tonqosx!
>
> Jekk jogħġbok agħtini risposta sa (bħal-lum ġimgħa / xahar ieħor).
>
> Nispera li narak ħalli nieħdu gost flimkien!
>
> Ċaw!
> Anna

## 逐句翻译与逐词拆解

**Malti:** Lil: maria.b@gmail.com

**整句：** 收件人（To）：maria.b@gmail.com

| 词语 | 中文含义 | 说明 |
|`,title:"生日聚会邀请（教材听力练习）",date:"2026-10-18 19:12:06"}},{route:"/zh/more/maltese/practice/emails/17-chef-job-application-template.html",meta:{description:`# 厨师求职信（教材写作模板）

**场景：** 申请人给餐厅写信申请厨师职位。这是 PDF 中的教材原文模板，括号内为填空选项。注意：原文落款印刷为 \`Tisjiet\`，规范正式拼写为 \`Tislijiet\`。

## 邮件头部

**Lil（收件人 To）：** info@restorant.com
**Mingħand（发件人 From）：** gorg.com.mt
**Data（日期）：** 16 ta' Ottubru 2026
**Suġġett（主题）：** Applikazzjoni ta' xogħol ta' kok

## 邮件全文

> **Lil:** info@restorant.com
> **Mingħand:** gorg.com.mt
> **Data:** 16 ta' Ottubru 2026
> **Suġġett:** Applikazzjoni ta' xogħol ta' kok
>
> Għażiż Sinjur / Sinjura
>
> Jien qiegħed nibgħatlek din l-ittra biex (napplika / tapplika) għal xogħol.
>
> Nispera li tinsab tajjeb. Qed nibgħatlek din l-ittra elettronika sabiex napplika għal xogħol ta' kok fir-restorant tiegħek.
>
> Jien nixtieq naħdem bħala kok għax inħobb insajjar, inħobb naħdem ma' ħaddieħor u nħobb niltaqa' man-nies.
>
> Kont immur l-iskola tal-ITS (institute of tourism studies) u minn hemm ġibt iċ-ċertifikati li kelli bżonn. Għandi esperjenza ta' ħames snin naħdem f'restorant ta' lukanda lussuża.
>
> u għalhekk naħseb li kapaċi għal dan ix-xogħol. Naf nitkellem Ingliż, Malti, u ftit Taljan.
>
> Grazzi talli qrajt din l-ittra. Napprezza jekk tikkunsidrani għal dan ix-xogħol.
>
> Nista' niltaqa' miegħek biex nikkellmu iktar fid-dettall kuljum mit-8 ta' filgħodu sas-7 ta' filgħaxija. / meta tkun komdu inti.
>
> Tisjiet,
> John Mallia

## 逐句翻译与逐词拆解

**Malti:** Lil: info@restorant.com

**整句：** 收件人（To）：info@restorant.com

| 词语 | 中文含义 | 说明 |
|`,title:"厨师求职信（教材写作模板）",date:"2026-10-18 19:12:06"}},{route:"/zh/more/maltese/practice/emails/",meta:{description:"",title:"邮件目录",date:"2026-10-18 19:12:06"}}]),Sc={customSearchQuery:function(e){return e.replace(/[\u4e00-\u9fa5]/g," $& ").replace(/\s+/g," ").trim()}};function xc(t,e="yyyy-MM-dd hh:mm:ss"){t instanceof Date||(t=new Date(t));const n={"M+":t.getMonth()+1,"d+":t.getDate(),"h+":t.getHours(),"m+":t.getMinutes(),"s+":t.getSeconds(),"q+":Math.floor((t.getMonth()+3)/3),S:t.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,`${t.getFullYear()}`.substr(4-RegExp.$1.length)));for(const a in n)new RegExp(`(${a})`).test(e)&&(e=e.replace(RegExp.$1,RegExp.$1.length===1?n[a]:`00${n[a]}`.substr(`${n[a]}`.length)));return e}const zc={},$c={width:"594",height:"112",viewBox:"0 0 594 112",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Tc=it('<path d="M147.8 111.2H164V77.5998H164.6C164.6 77.5998 170.6 87.1998 183.2 87.1998C197 87.1998 209.6 74.5998 209.6 56.5998C209.6 38.5998 197 25.9998 183.2 25.9998C170.6 25.9998 164.6 35.5998 164.6 35.5998H164V27.1998H147.8V111.2ZM178.4 72.1998C170 72.1998 163.4 65.5998 163.4 56.5998C163.4 47.5998 170 40.9998 178.4 40.9998C186.8 40.9998 193.4 47.5998 193.4 56.5998C193.4 65.5998 186.8 72.1998 178.4 72.1998Z" fill="black"></path><path d="M230.628 87.1998C242.028 87.1998 248.028 78.7998 248.028 78.7998H248.628V85.9998C252.228 85.9998 264.828 85.9998 264.828 85.9998V49.3998C264.828 36.1998 254.628 25.9998 239.628 25.9998C224.028 25.9998 215.628 37.3998 215.628 37.3998L225.228 46.9998C225.228 46.9998 230.028 40.3998 238.428 40.3998C244.428 40.3998 248.028 43.9998 248.628 48.1998L230.028 51.5598C219.228 53.4798 212.628 60.7998 212.628 70.3998C212.628 79.9998 219.828 87.1998 230.628 87.1998ZM236.028 73.9998C231.228 73.9998 228.828 71.5998 228.828 67.9998C228.828 64.9998 231.228 62.7198 235.428 61.9998L248.628 59.5998V60.7998C248.628 68.5998 243.228 73.9998 236.028 73.9998Z" fill="black"></path><path d="M299.033 111.2C317.633 111.2 330.833 97.9998 330.833 79.9998V27.1998H314.633V35.5998H314.033C314.033 35.5998 308.633 25.9998 296.033 25.9998C282.833 25.9998 270.833 37.9998 270.833 55.3998C270.833 72.7998 282.833 84.7998 296.033 84.7998C308.633 84.7998 314.033 75.1998 314.033 75.1998H314.633V79.9998C314.633 89.5998 308.033 96.1998 299.033 96.1998C289.433 96.1998 283.433 88.9998 283.433 88.9998L273.233 99.1998C273.233 99.1998 281.633 111.2 299.033 111.2ZM300.833 69.7998C293.033 69.7998 287.033 63.7998 287.033 55.3998C287.033 46.9998 293.033 40.9998 300.833 40.9998C308.633 40.9998 314.633 46.9998 314.633 55.3998C314.633 63.7998 308.633 69.7998 300.833 69.7998Z" fill="black"></path><path d="M367.986 87.1998C384.186 87.1998 393.186 77.5998 393.186 77.5998L384.786 66.1998C384.786 66.1998 379.386 72.7998 369.186 72.7998C360.186 72.7998 355.386 67.9998 353.586 62.5998H396.186C396.186 62.5998 396.786 59.5998 396.786 55.3998C396.786 39.1998 383.586 25.9998 367.386 25.9998C350.586 25.9998 336.786 39.7998 336.786 56.5998C336.786 73.3998 350.586 87.1998 367.986 87.1998ZM353.586 50.5998C355.386 45.1998 360.186 40.3998 366.786 40.3998C373.386 40.3998 378.186 45.1998 379.986 50.5998H353.586Z" fill="black"></path><path d="M406.423 85.9998H422.624V43.3998H444.224V85.9998H460.423V28.3998H422.624V24.7998C422.624 19.3998 425.624 16.3998 430.423 16.3998C433.423 16.3998 435.823 17.5998 435.823 17.5998V2.5998C435.823 2.5998 431.624 0.799805 426.224 0.799805C414.224 0.799805 406.423 8.59981 406.423 22.3998V28.3998H397.423V43.3998H406.423V85.9998ZM452.263 19.3998C457.423 19.3998 461.624 15.1998 461.624 10.3998C461.624 5.59981 457.424 1.3998 452.384 1.3998C447.224 1.3998 443.023 5.59981 443.023 10.3998C443.023 15.1998 447.223 19.3998 452.263 19.3998Z" fill="black"></path><path d="M470.652 85.9998H486.852V54.7998C486.852 46.9998 492.252 41.5998 499.452 41.5998C506.052 41.5998 510.252 45.7998 510.252 52.9998V85.9998H526.452V50.5998C526.452 35.5998 516.852 25.9998 504.852 25.9998C493.452 25.9998 487.452 35.5998 487.452 35.5998H486.852V27.1998H470.652V85.9998Z" fill="black"></path><path d="M557.819 87.1998C570.419 87.1998 576.419 77.5998 576.419 77.5998H577.019V85.9998H593.219V1.9998H577.019V35.5998H576.419C576.419 35.5998 570.419 25.9998 557.819 25.9998C544.019 25.9998 531.419 38.5998 531.419 56.5998C531.419 74.5998 544.019 87.1998 557.819 87.1998ZM562.619 72.1998C554.219 72.1998 547.619 65.5998 547.619 56.5998C547.619 47.5998 554.219 40.9998 562.619 40.9998C571.019 40.9998 577.619 47.5998 577.619 56.5998C577.619 65.5998 571.019 72.1998 562.619 72.1998Z" fill="black"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M60 96.9999C93.1371 96.9999 120 81.8416 120 63.1428V50.8311H115.91C107.182 38.2198 85.4398 29.2856 60 29.2856C34.5602 29.2856 12.8183 38.2198 4.09026 50.8311H0V63.1428C0 81.8416 26.8629 96.9999 60 96.9999Z" fill="black"></path><path d="M116 52C116 59.317 110.727 66.7404 100.454 72.5615C90.3014 78.3149 76.0069 82 60 82C43.9931 82 29.6986 78.3149 19.5456 72.5615C9.2731 66.7404 4 59.317 4 52C4 44.6831 9.2731 37.2596 19.5456 31.4385C29.6986 25.6851 43.9931 22 60 22C76.0069 22 90.3014 25.6851 100.454 31.4385C110.727 37.2596 116 44.6831 116 52Z" fill="white" stroke="black" stroke-width="8"></path><path d="M57.8864 72.0605L87.2817 41.837C88.6253 40.4556 87.43 38.1599 85.5278 38.4684L26.0819 48.1083C23.9864 48.4481 23.794 51.3882 25.8273 51.9982L46.7151 58.2645C47.2181 58.4154 47.6415 58.7581 47.894 59.2185L54.6991 71.6277C55.3457 72.8069 56.9487 73.0246 57.8864 72.0605Z" fill="black"></path><ellipse cx="58" cy="53.5" rx="7" ry="4.5" fill="white"></ellipse>',11),Lc=[Tc];function Cc(t,e){return c(),m("svg",$c,Lc)}const Nc=x(zc,[["render",Cc]]),Nn=t=>(oe("data-v-324b3e0c"),t=t(),se(),t),Pc={class:"blog-search","data-pagefind-ignore":"all"},Ic=Nn(()=>d("svg",{width:"14",height:"14",viewBox:"0 0 20 20"},[d("path",{d:"M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z",stroke:"currentColor",fill:"none","fill-rule":"evenodd","stroke-linecap":"round","stroke-linejoin":"round"})],-1)),Ac={key:0,class:"search-tip"},Vc={key:1,class:"metaKey"},Ec={class:"search-dialog"},Dc={class:"link"},qc={class:"title"},Oc={key:0,class:"date"},Fc=["innerHTML"],Gc={class:"command-palette-logo"},Hc={href:"https://github.com/cloudcannon/pagefind",target:"_blank",rel:"noopener noreferrer"},Bc=Nn(()=>d("span",{class:"command-palette-Label"},"Search by",-1)),Rc=Nn(()=>d("ul",{class:"command-palette-commands"},[d("li",null,[d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Enter key",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3"})])])]),d("span",{class:"command-palette-Label"},"to select")]),d("li",null,[d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Arrow down",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M7.5 3.5v8M10.5 8.5l-3 3-3-3"})])])]),d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Arrow up",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M7.5 11.5v-8M10.5 6.5l-3-3-3 3"})])])]),d("span",{class:"command-palette-Label"},"to navigate")]),d("li",null,[d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Escape key",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"})])])]),d("span",{class:"command-palette-Label"},"to close")])],-1)),Wc=w({__name:"Search",setup(t){Gt(z=>({"83c41620":r.value}));const e=Sc,{localeIndex:n,site:a}=an(),i=T(()=>{var z;return{...e,...((z=e==null?void 0:e.locales)==null?void 0:z[n.value])||{}}}),o=T(()=>{var z;return((z=i.value)==null?void 0:z.showDate)??!0}),s=Mc(),l=T(()=>s.width.value<760),r=T(()=>l.value?0:1),p=T(()=>{var z;return(z=i.value)!=null&&z.heading?i.value.heading.replace(/\{\{searchResult\}\}/,P.value.length):`Total: ${P.value.length} search results.`}),h=L("");de(()=>{h.value=/(Mac|iPhone|iPod|iPad)/i.test(navigator==null?void 0:navigator.platform)?"⌘":"Ctrl"});const k=L(!1),f=L(""),y=_c({passive:!1,onEventFired(z){z.ctrlKey&&z.key==="k"&&z.type==="keydown"&&z.preventDefault()}}),M=y["Meta+K"],_=y["Ctrl+K"],v=y.Escape;R(M,z=>{z&&(k.value=!0)}),R(_,z=>{z&&(k.value=!0)}),R(v,z=>{z&&(k.value=!1)});const P=L([]),O=()=>{if(!f.value){P.value=[];return}P.value=et.value.filter(z=>`${z.meta.description}${z.meta.title}`.includes(f.value)).map(z=>{var D,U;return{...z,meta:{...z.meta,description:((U=(D=z.meta)==null?void 0:D.description)==null?void 0:U.replace(new RegExp(`(${f.value})`,"g"),"<mark>$1</mark>"))||""}}}),P.value.sort((z,D)=>+new Date(D.meta.date)-+new Date(z.meta.date))},V=T(()=>{var z;return((z=i.value)==null?void 0:z.resultOptimization)??!0});R(()=>f.value,async()=>{var z,D,U;if(!((z=window==null?void 0:window.__pagefind__)!=null&&z.search))O();else{const W=typeof i.value.customSearchQuery=="function"?i.value.customSearchQuery(f.value):f.value;await((U=(D=window==null?void 0:window.__pagefind__)==null?void 0:D.search)==null?void 0:U.call(D,W).then(async Se=>{const Ye=(await Promise.all(Se.results.map(ne=>ne.data()))).map(ne=>{var ve;return{route:ne.url.startsWith(a.value.base)?ne.url:Je(ne.url),meta:{title:ne.meta.title,description:ne.excerpt,date:(ve=ne==null?void 0:ne.meta)==null?void 0:ve.date}}}).filter(ne=>!V.value||et.value.some(ve=>ve.route===ne.route));P.value=Ye.filter(i.value.filter??(()=>!0))}))}ce(()=>{document.querySelectorAll('div[aria-disabled="true"]').forEach(W=>{W.setAttribute("aria-disabled","false")})})});const H=z=>{z.target===z.currentTarget&&(k.value=!1)};R(()=>k.value,z=>{var D;z?ce(()=>{var U;(U=document.querySelector("div[command-dialog-mask]"))==null||U.addEventListener("click",H)}):(D=document.querySelector("div[command-dialog-mask]"))==null||D.removeEventListener("click",H)});const J=L(999),Z=L(0),Q=T(()=>{const D=Z.value%Math.ceil(P.value.length/J.value)*J.value;return P.value.slice(D,D+J.value)}),Y=Ht(),K=Ie(),Me=z=>{k.value=!1,K.path!==z.value&&Y.go(z.value)},{lang:le}=an(),te=T(()=>i.value.langReload??!0);return R(()=>le.value,()=>{te.value&&window.location.reload()}),(z,D)=>{var U;return c(),m("div",Pc,[d("div",{class:"nav-search-btn-wait",onClick:D[0]||(D[0]=W=>k.value=!0)},[Ic,l.value?S("",!0):(c(),m("span",Ac,I(((U=i.value)==null?void 0:U.btnPlaceholder)||"Search"),1)),l.value?S("",!0):(c(),m("span",Vc,I(h.value)+" K ",1))]),j(u(xe).Dialog,{visible:k.value,theme:"algolia"},Bt({header:b(()=>{var W;return[j(u(xe).Input,{value:f.value,"onUpdate:value":D[1]||(D[1]=Se=>f.value=Se),placeholder:((W=i.value)==null?void 0:W.placeholder)||"Search Docs"},null,8,["value","placeholder"])]}),body:b(()=>[d("div",Ec,[j(u(xe).List,null,{default:b(()=>[P.value.length?(c(),C(u(xe).Group,{key:1,heading:p.value},{default:b(()=>[(c(!0),m(G,null,X(Q.value,W=>(c(),C(u(xe).Item,{"data-value":W.route,key:W.route,onSelect:Me},{default:b(()=>[d("div",Dc,[d("div",qc,[d("span",null,I(W.meta.title),1),o.value&&W.meta.date?(c(),m("span",Oc,I(u(xc)(W.meta.date,"yyyy-MM-dd")),1)):S("",!0)]),d("div",{class:"des",innerHTML:W.meta.description},null,8,Fc)])]),_:2},1032,["data-value"]))),128))]),_:1},8,["heading"])):(c(),C(u(xe).Empty,{key:0},{default:b(()=>{var W;return[ee(I(((W=i.value)==null?void 0:W.emptyText)||"No results found."),1)]}),_:1}))]),_:1})])]),_:2},[P.value.length?{name:"footer",fn:b(()=>[d("div",Gc,[d("a",Hc,[Bc,j(Nc,{style:{width:"77px"}})])]),Rc]),key:"0"}:void 0]),1032,["visible"])])}}});const Jc=x(Wc,[["__scopeId","data-v-324b3e0c"]]),Kc=w({__name:"VPNavBarSocialLinks",setup(t){const{theme:e}=A();return(n,a)=>u(e).socialLinks?(c(),C(zn,{key:0,class:"VPNavBarSocialLinks",links:u(e).socialLinks},null,8,["links"])):S("",!0)}});const Uc=x(Kc,[["__scopeId","data-v-3f5b75fa"]]),Qc=["href"],Xc=w({__name:"VPNavBarTitle",setup(t){const{site:e,theme:n}=A(),{hasSidebar:a}=me(),{currentLang:i}=Ae();return(o,s)=>(c(),m("div",{class:q(["VPNavBarTitle",{"has-sidebar":u(a)}])},[d("a",{class:"title",href:u(n).logoLink??u(Ne)(u(i).link)},[g(o.$slots,"nav-bar-title-before",{},void 0,!0),u(n).logo?(c(),C(Be,{key:0,class:"logo",image:u(n).logo},null,8,["image"])):S("",!0),u(n).siteTitle?(c(),m(G,{key:1},[ee(I(u(n).siteTitle),1)],64)):u(n).siteTitle===void 0?(c(),m(G,{key:2},[ee(I(u(e).title),1)],64)):S("",!0),g(o.$slots,"nav-bar-title-after",{},void 0,!0)],8,Qc)],2))}});const Zc=x(Xc,[["__scopeId","data-v-afd1f3db"]]),Yc={},eu={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},nu=d("path",{d:"M0 0h24v24H0z",fill:"none"},null,-1),tu=d("path",{d:" M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z ",class:"css-c4d79v"},null,-1),au=[nu,tu];function iu(t,e){return c(),m("svg",eu,au)}const Lt=x(Yc,[["render",iu]]),ou={class:"items"},su={class:"title"},ru=w({__name:"VPNavBarTranslations",setup(t){const{theme:e}=A(),{localeLinks:n,currentLang:a}=Ae({correspondingLink:!0});return(i,o)=>u(n).length&&u(a).label?(c(),C(xn,{key:0,class:"VPNavBarTranslations",icon:Lt,label:u(e).langMenuLabel||"Change language"},{default:b(()=>[d("div",ou,[d("p",su,I(u(a).label),1),(c(!0),m(G,null,X(u(n),s=>(c(),C(Ue,{key:s.link,item:s},null,8,["item"]))),128))])]),_:1},8,["label"])):S("",!0)}});const lu=x(ru,[["__scopeId","data-v-7e47298b"]]),cu=t=>(oe("data-v-ecad55b2"),t=t(),se(),t),uu={class:"container"},du={class:"title"},mu={class:"content"},pu=cu(()=>d("div",{class:"curtain"},null,-1)),hu={class:"content-body"},gu=w({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(t){const{y:e}=at(),{hasSidebar:n}=me(),{frontmatter:a}=A(),i=L({});return nt(()=>{i.value={"has-sidebar":n.value,top:a.value.layout==="home"&&e.value===0}}),(o,s)=>(c(),m("div",{class:q(["VPNavBar",i.value])},[d("div",uu,[d("div",du,[j(Zc,null,{"nav-bar-title-before":b(()=>[g(o.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":b(()=>[g(o.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),d("div",mu,[pu,d("div",hu,[g(o.$slots,"nav-bar-content-before",{},void 0,!0),j(Jc,{class:"search"}),j(Mr,{class:"menu"}),j(lu,{class:"translations"}),j(fs,{class:"appearance"}),j(Uc,{class:"social-links"}),j(cr,{class:"extra"}),g(o.$slots,"nav-bar-content-after",{},void 0,!0),j(gr,{class:"hamburger",active:o.isScreenOpen,onClick:s[0]||(s[0]=l=>o.$emit("toggle-screen"))},null,8,["active"])])])])],2))}});const fu=x(gu,[["__scopeId","data-v-ecad55b2"]]),vu={key:0,class:"VPNavScreenAppearance"},_u={class:"text"},ku=w({__name:"VPNavScreenAppearance",setup(t){const{site:e,theme:n}=A();return(a,i)=>u(e).appearance?(c(),m("div",vu,[d("p",_u,I(u(n).darkModeSwitchLabel||"Appearance"),1),j(Mn)])):S("",!0)}});const bu=x(ku,[["__scopeId","data-v-7486d2cf"]]),yu=w({__name:"VPNavScreenMenuLink",props:{item:{}},setup(t){const e=Ke("close-screen");return(n,a)=>(c(),C(ge,{class:"VPNavScreenMenuLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:u(e)},{default:b(()=>[ee(I(n.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}});const ju=x(yu,[["__scopeId","data-v-62f271ff"]]),wu={},Mu={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},Su=d("path",{d:"M18.9,10.9h-6v-6c0-0.6-0.4-1-1-1s-1,0.4-1,1v6h-6c-0.6,0-1,0.4-1,1s0.4,1,1,1h6v6c0,0.6,0.4,1,1,1s1-0.4,1-1v-6h6c0.6,0,1-0.4,1-1S19.5,10.9,18.9,10.9z"},null,-1),xu=[Su];function zu(t,e){return c(),m("svg",Mu,xu)}const $u=x(wu,[["render",zu]]),Tu=w({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(t){const e=Ke("close-screen");return(n,a)=>(c(),C(ge,{class:"VPNavScreenMenuGroupLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:u(e)},{default:b(()=>[ee(I(n.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}});const Ct=x(Tu,[["__scopeId","data-v-6908848a"]]),Lu={class:"VPNavScreenMenuGroupSection"},Cu={key:0,class:"title"},Nu=w({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(t){return(e,n)=>(c(),m("div",Lu,[e.text?(c(),m("p",Cu,I(e.text),1)):S("",!0),(c(!0),m(G,null,X(e.items,a=>(c(),C(Ct,{key:a.text,item:a},null,8,["item"]))),128))]))}});const Pu=x(Nu,[["__scopeId","data-v-d8c888e8"]]),Iu=["aria-controls","aria-expanded"],Au={class:"button-text"},Vu=["id"],Eu={key:1,class:"group"},Du=w({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(t){const e=t,n=L(!1),a=T(()=>`NavScreenGroup-${e.text.replace(" ","-").toLowerCase()}`);function i(){n.value=!n.value}return(o,s)=>(c(),m("div",{class:q(["VPNavScreenMenuGroup",{open:n.value}])},[d("button",{class:"button","aria-controls":a.value,"aria-expanded":n.value,onClick:i},[d("span",Au,I(o.text),1),j($u,{class:"button-icon"})],8,Iu),d("div",{id:a.value,class:"items"},[(c(!0),m(G,null,X(o.items,l=>(c(),m(G,{key:l.text},["link"in l?(c(),m("div",{key:l.text,class:"item"},[j(Ct,{item:l},null,8,["item"])])):(c(),m("div",Eu,[j(Pu,{text:l.text,items:l.items},null,8,["text","items"])]))],64))),128))],8,Vu)],2))}});const qu=x(Du,[["__scopeId","data-v-89ab5c8f"]]),Ou={key:0,class:"VPNavScreenMenu"},Fu=w({__name:"VPNavScreenMenu",setup(t){const{theme:e}=A();return(n,a)=>u(e).nav?(c(),m("nav",Ou,[(c(!0),m(G,null,X(u(e).nav,i=>(c(),m(G,{key:i.text},["link"in i?(c(),C(ju,{key:0,item:i},null,8,["item"])):(c(),C(qu,{key:1,text:i.text||"",items:i.items},null,8,["text","items"]))],64))),128))])):S("",!0)}}),Gu=w({__name:"VPNavScreenSocialLinks",setup(t){const{theme:e}=A();return(n,a)=>u(e).socialLinks?(c(),C(zn,{key:0,class:"VPNavScreenSocialLinks",links:u(e).socialLinks},null,8,["links"])):S("",!0)}}),Hu={class:"list"},Bu=w({__name:"VPNavScreenTranslations",setup(t){const{localeLinks:e,currentLang:n}=Ae({correspondingLink:!0}),a=L(!1);function i(){a.value=!a.value}return(o,s)=>u(e).length&&u(n).label?(c(),m("div",{key:0,class:q(["VPNavScreenTranslations",{open:a.value}])},[d("button",{class:"title",onClick:i},[j(Lt,{class:"icon lang"}),ee(" "+I(u(n).label)+" ",1),j(gt,{class:"icon chevron"})]),d("ul",Hu,[(c(!0),m(G,null,X(u(e),l=>(c(),m("li",{key:l.link,class:"item"},[j(ge,{class:"link",href:l.link},{default:b(()=>[ee(I(l.text),1)]),_:2},1032,["href"])]))),128))])],2)):S("",!0)}});const Ru=x(Bu,[["__scopeId","data-v-d924952f"]]),Wu={class:"container"},Ju=w({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(t){const e=L(null),n=ut(ze?document.body:null);return(a,i)=>(c(),C(We,{name:"fade",onEnter:i[0]||(i[0]=o=>n.value=!0),onAfterLeave:i[1]||(i[1]=o=>n.value=!1)},{default:b(()=>[a.open?(c(),m("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:e,id:"VPNavScreen"},[d("div",Wu,[g(a.$slots,"nav-screen-content-before",{},void 0,!0),j(Fu,{class:"menu"}),j(Ru,{class:"translations"}),j(bu,{class:"appearance"}),j(Gu,{class:"social-links"}),g(a.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):S("",!0)]),_:3}))}});const Ku=x(Ju,[["__scopeId","data-v-56130dc1"]]),Uu={key:0,class:"VPNav"},Qu=w({__name:"VPNav",setup(t){const{isScreenOpen:e,closeScreen:n,toggleScreen:a}=Ko(),{frontmatter:i}=A(),o=T(()=>i.value.navbar!==!1);return _n("close-screen",n),je(()=>{ze&&document.documentElement.classList.toggle("hide-nav",!o.value)}),(s,l)=>o.value?(c(),m("header",Uu,[j(fu,{"is-screen-open":u(e),onToggleScreen:u(a)},{"nav-bar-title-before":b(()=>[g(s.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":b(()=>[g(s.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":b(()=>[g(s.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":b(()=>[g(s.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),j(Ku,{open:u(e)},{"nav-screen-content-before":b(()=>[g(s.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":b(()=>[g(s.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):S("",!0)}});const Xu=x(Qu,[["__scopeId","data-v-b2c29f56"]]),Zu=t=>(oe("data-v-78885c4f"),t=t(),se(),t),Yu=["role","tabindex"],ed=Zu(()=>d("div",{class:"indicator"},null,-1)),nd=["onKeydown"],td={key:1,class:"items"},ad=w({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(t){const e=t,{collapsed:n,collapsible:a,isLink:i,isActiveLink:o,hasActiveLink:s,hasChildren:l,toggle:r}=ga(T(()=>e.item)),p=T(()=>l.value?"section":"div"),h=T(()=>i.value?"a":"div"),k=T(()=>l.value?e.depth+2===7?"p":`h${e.depth+2}`:"p"),f=T(()=>i.value?void 0:"button"),y=T(()=>[[`level-${e.depth}`],{collapsible:a.value},{collapsed:n.value},{"is-link":i.value},{"is-active":o.value},{"has-active":s.value}]);function M(v){"key"in v&&v.key!=="Enter"||!e.item.link&&r()}function _(){e.item.link&&r()}return(v,P)=>{const O=we("VPSidebarItem",!0);return c(),C(ke(p.value),{class:q(["VPSidebarItem",y.value])},{default:b(()=>[v.item.text?(c(),m("div",Oe({key:0,class:"item",role:f.value},Rt(v.item.items?{click:M,keydown:M}:{},!0),{tabindex:v.item.items&&0}),[ed,v.item.link?(c(),C(ge,{key:0,tag:h.value,class:"link",href:v.item.link,rel:v.item.rel,target:v.item.target},{default:b(()=>[(c(),C(ke(k.value),{class:"text",innerHTML:v.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(c(),C(ke(k.value),{key:1,class:"text",innerHTML:v.item.text},null,8,["innerHTML"])),v.item.collapsed!=null?(c(),m("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:_,onKeydown:Wt(_,["enter"]),tabindex:"0"},[j(wn,{class:"caret-icon"})],40,nd)):S("",!0)],16,Yu)):S("",!0),v.item.items&&v.item.items.length?(c(),m("div",td,[v.depth<5?(c(!0),m(G,{key:0},X(v.item.items,V=>(c(),C(O,{key:V.text,item:V,depth:v.depth+1},null,8,["item","depth"]))),128)):S("",!0)])):S("",!0)]),_:1},8,["class"])}}});const id=x(ad,[["__scopeId","data-v-78885c4f"]]),Nt=t=>(oe("data-v-7f19105b"),t=t(),se(),t),od=Nt(()=>d("div",{class:"curtain"},null,-1)),sd={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},rd=Nt(()=>d("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),ld=w({__name:"VPSidebar",props:{open:{type:Boolean}},setup(t){const e=t,{sidebarGroups:n,hasSidebar:a}=me(),i=L(null),o=ut(ze?document.body:null);return R([e,i],()=>{var s;e.open?(o.value=!0,(s=i.value)==null||s.focus()):o.value=!1},{immediate:!0,flush:"post"}),(s,l)=>u(a)?(c(),m("aside",{key:0,class:q(["VPSidebar",{open:s.open}]),ref_key:"navEl",ref:i,onClick:l[0]||(l[0]=Jt(()=>{},["stop"]))},[od,d("nav",sd,[rd,g(s.$slots,"sidebar-nav-before",{},void 0,!0),(c(!0),m(G,null,X(u(n),r=>(c(),m("div",{key:r.text,class:"group"},[j(id,{item:r,depth:0},null,8,["item"])]))),128)),g(s.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):S("",!0)}});const cd=x(ld,[["__scopeId","data-v-7f19105b"]]),ud=w({__name:"VPSkipLink",setup(t){const e=Ie(),n=L();R(()=>e.path,()=>n.value.focus());function a({target:i}){const o=document.getElementById(decodeURIComponent(i.hash).slice(1));if(o){const s=()=>{o.removeAttribute("tabindex"),o.removeEventListener("blur",s)};o.setAttribute("tabindex","-1"),o.addEventListener("blur",s),o.focus(),window.scrollTo(0,0)}}return(i,o)=>(c(),m(G,null,[d("span",{ref_key:"backToTop",ref:n,tabindex:"-1"},null,512),d("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:a}," Skip to content ")],64))}});const dd=x(ud,[["__scopeId","data-v-72a98cf4"]]),md=w({__name:"Layout",setup(t){const{isOpen:e,open:n,close:a}=me(),i=Ie();R(()=>i.path,a),ha(e,a);const{frontmatter:o}=A(),s=Kt(),l=T(()=>!!s["home-hero-image"]);return _n("hero-image-slot-exists",l),(r,p)=>{const h=we("Content");return u(o).layout!==!1?(c(),m("div",{key:0,class:q(["Layout",u(o).pageClass])},[g(r.$slots,"layout-top",{},void 0,!0),j(dd),j(Yt,{class:"backdrop",show:u(e),onClick:u(a)},null,8,["show","onClick"]),j(Xu,null,{"nav-bar-title-before":b(()=>[g(r.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":b(()=>[g(r.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":b(()=>[g(r.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":b(()=>[g(r.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":b(()=>[g(r.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":b(()=>[g(r.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),j(Jo,{open:u(e),onOpenMenu:u(n)},null,8,["open","onOpenMenu"]),j(cd,{open:u(e)},{"sidebar-nav-before":b(()=>[g(r.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":b(()=>[g(r.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),j(So,{"data-pagefind-body":""},{"page-top":b(()=>[g(r.$slots,"page-top",{},void 0,!0)]),"page-bottom":b(()=>[g(r.$slots,"page-bottom",{},void 0,!0)]),"not-found":b(()=>[g(r.$slots,"not-found",{},void 0,!0)]),"home-hero-before":b(()=>[g(r.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info":b(()=>[g(r.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-image":b(()=>[g(r.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":b(()=>[g(r.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":b(()=>[g(r.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":b(()=>[g(r.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":b(()=>[g(r.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":b(()=>[g(r.$slots,"doc-before",{},void 0,!0)]),"doc-after":b(()=>[g(r.$slots,"doc-after",{},void 0,!0)]),"doc-top":b(()=>[g(r.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":b(()=>[g(r.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":b(()=>[g(r.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":b(()=>[g(r.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":b(()=>[g(r.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":b(()=>[g(r.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":b(()=>[g(r.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":b(()=>[g(r.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),j(Lo),g(r.$slots,"layout-bottom",{},void 0,!0)],2)):(c(),C(h,{key:1}))}}});const pd=x(md,[["__scopeId","data-v-329f128b"]]);const kd={Layout:pd,enhanceApp:({app:t})=>{t.component("Badge",Qt)}};export{La as V,Mc as a,_d as b,fc as c,he as d,gd as e,lc as f,fd as g,kd as h,Tn as i,vd as o,Ln as t,ie as u};
