function x(){}const at=t=>t;function ut(t,e){for(const n in e)t[n]=e[n];return t}function U(t){return t()}function J(){return Object.create(null)}function N(t){t.forEach(U)}function W(t){return typeof t=="function"}function It(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function ft(t){return Object.keys(t).length===0}function dt(t,...e){if(t==null)return x;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Ht(t,e,n){t.$$.on_destroy.push(dt(e,n))}function Gt(t,e,n,i){if(t){const s=V(t,e,n,i);return t[0](s)}}function V(t,e,n,i){return t[1]&&i?ut(n.ctx.slice(),t[1](i(e))):n.ctx}function Jt(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const c=[],r=Math.max(e.dirty.length,s.length);for(let a=0;a<r;a+=1)c[a]=e.dirty[a]|s[a];return c}return e.dirty|s}return e.dirty}function Kt(t,e,n,i,s,c){if(s){const r=V(e,n,i,c);t.p(r,s)}}function Qt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function Ut(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function Vt(t){return t??""}function Xt(t){return t&&W(t.destroy)?t.destroy:x}const X=typeof window<"u";let _t=X?()=>window.performance.now():()=>Date.now(),F=X?t=>requestAnimationFrame(t):x;const E=new Set;function Y(t){E.forEach(e=>{e.c(t)||(E.delete(e),e.f())}),E.size!==0&&F(Y)}function ht(t){let e;return E.size===0&&F(Y),{promise:new Promise(n=>{E.add(e={c:t,f:n})}),abort(){E.delete(e)}}}const mt=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;"WeakMap"in mt;let T=!1;function pt(){T=!0}function yt(){T=!1}function gt(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function wt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const o=[];for(let l=0;l<e.length;l++){const f=e[l];f.claim_order!==void 0&&o.push(f)}e=o}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let o=0;o<e.length;o++){const l=e[o].claim_order,f=(s>0&&e[n[s]].claim_order<=l?s+1:gt(1,s,d=>e[n[d]].claim_order,l))-1;i[o]=n[f]+1;const u=f+1;n[u]=o,s=Math.max(u,s)}const c=[],r=[];let a=e.length-1;for(let o=n[s]+1;o!=0;o=i[o-1]){for(c.push(e[o-1]);a>=o;a--)r.push(e[a]);a--}for(;a>=0;a--)r.push(e[a]);c.reverse(),r.sort((o,l)=>o.claim_order-l.claim_order);for(let o=0,l=0;o<r.length;o++){for(;l<c.length&&r[o].claim_order>=c[l].claim_order;)l++;const f=l<c.length?c[l]:null;t.insertBefore(r[o],f)}}function xt(t,e){t.appendChild(e)}function Z(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function bt(t){const e=et("style");return $t(Z(t),e),e.sheet}function $t(t,e){return xt(t.head||t,e),e.sheet}function vt(t,e){if(T){for(wt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Yt(t,e,n){T&&!n?vt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function tt(t){t.parentNode&&t.parentNode.removeChild(t)}function Zt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function et(t){return document.createElement(t)}function kt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function I(t){return document.createTextNode(t)}function te(){return I(" ")}function ee(){return I("")}function ne(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function ie(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Et(t){return Array.from(t.childNodes)}function St(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function nt(t,e,n,i,s=!1){St(t);const c=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const a=t[r];if(e(a)){const o=n(a);return o===void 0?t.splice(r,1):t[r]=o,s||(t.claim_info.last_index=r),a}}for(let r=t.claim_info.last_index-1;r>=0;r--){const a=t[r];if(e(a)){const o=n(a);return o===void 0?t.splice(r,1):t[r]=o,s?o===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,a}}return i()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function it(t,e,n,i){return nt(t,s=>s.nodeName===e,s=>{const c=[];for(let r=0;r<s.attributes.length;r++){const a=s.attributes[r];n[a.name]||c.push(a.name)}c.forEach(r=>s.removeAttribute(r))},()=>i(e))}function se(t,e,n){return it(t,e,n,et)}function re(t,e,n){return it(t,e,n,kt)}function Nt(t,e){return nt(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>I(e),!0)}function oe(t){return Nt(t," ")}function le(t,e){e=""+e,t.data!==e&&(t.data=e)}function ce(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function ae(t,e,n){for(let i=0;i<t.options.length;i+=1){const s=t.options[i];if(s.__value===e){s.selected=!0;return}}(!n||e!==void 0)&&(t.selectedIndex=-1)}function ue(t){const e=t.querySelector(":checked");return e&&e.__value}function fe(t,e,n){t.classList[n?"add":"remove"](e)}function de(t,e){return new t(e)}const O=new Map;let q=0;function Ct(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function Mt(t,e){const n={stylesheet:bt(e),rules:{}};return O.set(t,n),n}function At(t,e,n,i,s,c,r,a=0){const o=16.666/i;let l=`{
`;for(let p=0;p<=1;p+=o){const y=e+(n-e)*c(p);l+=p*100+`%{${r(y,1-y)}}
`}const f=l+`100% {${r(n,1-n)}}
}`,u=`__svelte_${Ct(f)}_${a}`,d=Z(t),{stylesheet:_,rules:m}=O.get(d)||Mt(d,t);m[u]||(m[u]=!0,_.insertRule(`@keyframes ${u} ${f}`,_.cssRules.length));const b=t.style.animation||"";return t.style.animation=`${b?`${b}, `:""}${u} ${i}ms linear ${s}ms 1 both`,q+=1,u}function jt(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?c=>c.indexOf(e)<0:c=>c.indexOf("__svelte")===-1),s=n.length-i.length;s&&(t.style.animation=i.join(", "),q-=s,q||Rt())}function Rt(){F(()=>{q||(O.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&tt(e)}),O.clear())})}function _e(t,e,n,i){if(!e)return x;const s=t.getBoundingClientRect();if(e.left===s.left&&e.right===s.right&&e.top===s.top&&e.bottom===s.bottom)return x;const{delay:c=0,duration:r=300,easing:a=at,start:o=_t()+c,end:l=o+r,tick:f=x,css:u}=n(t,{from:e,to:s},i);let d=!0,_=!1,m;function b(){u&&(m=At(t,0,1,r,c,a,u)),c||(_=!0)}function p(){u&&jt(t,m),d=!1}return ht(y=>{if(!_&&y>=o&&(_=!0),_&&y>=l&&(f(1,0),p()),!d)return!1;if(_){const C=y-o,M=0+1*a(C/r);f(M,1-M)}return!0}),b(),f(0,1),p}function he(t){const e=getComputedStyle(t);if(e.position!=="absolute"&&e.position!=="fixed"){const{width:n,height:i}=e,s=t.getBoundingClientRect();t.style.position="absolute",t.style.width=n,t.style.height=i,Bt(t,s)}}function Bt(t,e){const n=t.getBoundingClientRect();if(e.left!==n.left||e.top!==n.top){const i=getComputedStyle(t),s=i.transform==="none"?"":i.transform;t.style.transform=`${s} translate(${e.left-n.left}px, ${e.top-n.top}px)`}}let j;function A(t){j=t}function st(){if(!j)throw new Error("Function called outside component initialization");return j}function me(t){st().$$.on_mount.push(t)}function pe(t){st().$$.after_update.push(t)}const k=[],K=[];let S=[];const Q=[],rt=Promise.resolve();let P=!1;function ot(){P||(P=!0,rt.then(lt))}function ye(){return ot(),rt}function z(t){S.push(t)}const L=new Set;let v=0;function lt(){if(v!==0)return;const t=j;do{try{for(;v<k.length;){const e=k[v];v++,A(e),Ot(e.$$)}}catch(e){throw k.length=0,v=0,e}for(A(null),k.length=0,v=0;K.length;)K.pop()();for(let e=0;e<S.length;e+=1){const n=S[e];L.has(n)||(L.add(n),n())}S.length=0}while(k.length);for(;Q.length;)Q.pop()();P=!1,L.clear(),A(t)}function Ot(t){if(t.fragment!==null){t.update(),N(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(z)}}function qt(t){const e=[],n=[];S.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),S=e}const B=new Set;let $;function ge(){$={r:0,c:[],p:$}}function we(){$.r||N($.c),$=$.p}function ct(t,e){t&&t.i&&(B.delete(t),t.i(e))}function Tt(t,e,n,i){if(t&&t.o){if(B.has(t))return;B.add(t),$.c.push(()=>{B.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}function Dt(t,e){t.d(1),e.delete(t.key)}function Lt(t,e){Tt(t,1,1,()=>{e.delete(t.key)})}function xe(t,e){t.f(),Dt(t,e)}function be(t,e){t.f(),Lt(t,e)}function $e(t,e,n,i,s,c,r,a,o,l,f,u){let d=t.length,_=c.length,m=d;const b={};for(;m--;)b[t[m].key]=m;const p=[],y=new Map,C=new Map,M=[];for(m=_;m--;){const h=u(s,c,m),g=n(h);let w=r.get(g);w?i&&M.push(()=>w.p(h,e)):(w=l(g,h),w.c()),y.set(g,p[m]=w),g in b&&C.set(g,Math.abs(m-b[g]))}const H=new Set,G=new Set;function D(h){ct(h,1),h.m(a,f),r.set(h.key,h),f=h.first,_--}for(;d&&_;){const h=p[_-1],g=t[d-1],w=h.key,R=g.key;h===g?(f=h.first,d--,_--):y.has(R)?!r.has(w)||H.has(w)?D(h):G.has(R)?d--:C.get(w)>C.get(R)?(G.add(w),D(h)):(H.add(R),d--):(o(g,r),d--)}for(;d--;){const h=t[d];y.has(h.key)||o(h,r)}for(;_;)D(p[_-1]);return N(M),p}const Pt=["allowfullscreen","allowpaymentrequest","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","hidden","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"];[...Pt];function ve(t){t&&t.c()}function ke(t,e){t&&t.l(e)}function zt(t,e,n,i){const{fragment:s,after_update:c}=t.$$;s&&s.m(e,n),i||z(()=>{const r=t.$$.on_mount.map(U).filter(W);t.$$.on_destroy?t.$$.on_destroy.push(...r):N(r),t.$$.on_mount=[]}),c.forEach(z)}function Wt(t,e){const n=t.$$;n.fragment!==null&&(qt(n.after_update),N(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Ft(t,e){t.$$.dirty[0]===-1&&(k.push(t),ot(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Ee(t,e,n,i,s,c,r,a=[-1]){const o=j;A(t);const l=t.$$={fragment:null,ctx:[],props:c,update:x,not_equal:s,bound:J(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(o?o.$$.context:[])),callbacks:J(),dirty:a,skip_bound:!1,root:e.target||o.$$.root};r&&r(l.root);let f=!1;if(l.ctx=n?n(t,e.props||{},(u,d,..._)=>{const m=_.length?_[0]:d;return l.ctx&&s(l.ctx[u],l.ctx[u]=m)&&(!l.skip_bound&&l.bound[u]&&l.bound[u](m),f&&Ft(t,u)),d}):[],l.update(),f=!0,N(l.before_update),l.fragment=i?i(l.ctx):!1,e.target){if(e.hydrate){pt();const u=Et(e.target);l.fragment&&l.fragment.l(u),u.forEach(tt)}else l.fragment&&l.fragment.c();e.intro&&ct(t.$$.fragment),zt(t,e.target,e.anchor,e.customElement),yt(),lt()}A(o)}class Se{$destroy(){Wt(this,1),this.$destroy=x}$on(e,n){if(!W(n))return x;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!ft(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{ut as $,zt as A,Wt as B,vt as C,x as D,Gt as E,Kt as F,Qt as G,Jt as H,Ht as I,Zt as J,fe as K,ne as L,W as M,Xt as N,$e as O,xe as P,N as Q,z as R,Se as S,ae as T,he as U,_e as V,ue as W,be as X,kt as Y,re as Z,Vt as _,te as a,Ut as a0,Yt as b,oe as c,Tt as d,ee as e,we as f,ct as g,tt as h,Ee as i,pe as j,et as k,se as l,Et as m,ie as n,me as o,ce as p,I as q,Nt as r,It as s,ye as t,le as u,ge as v,K as w,de as x,ve as y,ke as z};
