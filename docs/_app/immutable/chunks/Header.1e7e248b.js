import{S as O,i as U,s as tt,k as b,q as N,a as X,J as Y,l as A,m as x,r as q,h as k,c as H,K as j,n as M,b as nt,G as m,H as C}from"./index.e2c57ab8.js";const I=Math.PI,z=2*I,w=1e-6,et=z-w;function R(t){this._+=t[0];for(let n=1,s=t.length;n<s;++n)this._+=arguments[n]+t[n]}function it(t){let n=Math.floor(t);if(!(n>=0))throw new Error(`invalid digits: ${t}`);if(n>15)return R;const s=10**n;return function(e){this._+=e[0];for(let u=1,o=e.length;u<o;++u)this._+=Math.round(arguments[u]*s)/s+e[u]}}class st{constructor(n){this._x0=this._y0=this._x1=this._y1=null,this._="",this._append=n==null?R:it(n)}moveTo(n,s){this._append`M${this._x0=this._x1=+n},${this._y0=this._y1=+s}`}closePath(){this._x1!==null&&(this._x1=this._x0,this._y1=this._y0,this._append`Z`)}lineTo(n,s){this._append`L${this._x1=+n},${this._y1=+s}`}quadraticCurveTo(n,s,e,u){this._append`Q${+n},${+s},${this._x1=+e},${this._y1=+u}`}bezierCurveTo(n,s,e,u,o,c){this._append`C${+n},${+s},${+e},${+u},${this._x1=+o},${this._y1=+c}`}arcTo(n,s,e,u,o){if(n=+n,s=+s,e=+e,u=+u,o=+o,o<0)throw new Error(`negative radius: ${o}`);let c=this._x1,a=this._y1,l=e-n,r=u-s,f=c-n,i=a-s,h=f*f+i*i;if(this._x1===null)this._append`M${this._x1=n},${this._y1=s}`;else if(h>w)if(!(Math.abs(i*l-r*f)>w)||!o)this._append`L${this._x1=n},${this._y1=s}`;else{let p=e-c,_=u-a,v=l*l+r*r,$=p*p+_*_,y=Math.sqrt(v),S=Math.sqrt(h),g=o*Math.tan((I-Math.acos((v+h-$)/(2*y*S)))/2),E=g/S,T=g/y;Math.abs(E-1)>w&&this._append`L${n+E*f},${s+E*i}`,this._append`A${o},${o},0,0,${+(i*p>f*_)},${this._x1=n+T*l},${this._y1=s+T*r}`}}arc(n,s,e,u,o,c){if(n=+n,s=+s,e=+e,c=!!c,e<0)throw new Error(`negative radius: ${e}`);let a=e*Math.cos(u),l=e*Math.sin(u),r=n+a,f=s+l,i=1^c,h=c?u-o:o-u;this._x1===null?this._append`M${r},${f}`:(Math.abs(this._x1-r)>w||Math.abs(this._y1-f)>w)&&this._append`L${r},${f}`,e&&(h<0&&(h=h%z+z),h>et?this._append`A${e},${e},0,1,${i},${n-a},${s-l}A${e},${e},0,1,${i},${this._x1=r},${this._y1=f}`:h>w&&this._append`A${e},${e},0,${+(h>=I)},${i},${this._x1=n+e*Math.cos(o)},${this._y1=s+e*Math.sin(o)}`)}rect(n,s,e,u){this._append`M${this._x0=this._x1=+n},${this._y0=this._y1=+s}h${e=+e}v${+u}h${-e}Z`}toString(){return this._}}function d(t){return function(){return t}}function V(t){let n=3;return t.digits=function(s){if(!arguments.length)return n;if(s==null)n=null;else{const e=Math.floor(s);if(!(e>=0))throw new RangeError(`invalid digits: ${s}`);n=e}return t},()=>new st(n)}function Z(t){return typeof t=="object"&&"length"in t?t:Array.from(t)}function F(t){this._context=t}F.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){(this._line||this._line!==0&&this._point===1)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;default:this._context.lineTo(t,n);break}}};function J(t){return new F(t)}function K(t){return t[0]}function Q(t){return t[1]}function rt(t,n){var s=d(!0),e=null,u=J,o=null,c=V(a);t=typeof t=="function"?t:t===void 0?K:d(t),n=typeof n=="function"?n:n===void 0?Q:d(n);function a(l){var r,f=(l=Z(l)).length,i,h=!1,p;for(e==null&&(o=u(p=c())),r=0;r<=f;++r)!(r<f&&s(i=l[r],r,l))===h&&((h=!h)?o.lineStart():o.lineEnd()),h&&o.point(+t(i,r,l),+n(i,r,l));if(p)return o=null,p+""||null}return a.x=function(l){return arguments.length?(t=typeof l=="function"?l:d(+l),a):t},a.y=function(l){return arguments.length?(n=typeof l=="function"?l:d(+l),a):n},a.defined=function(l){return arguments.length?(s=typeof l=="function"?l:d(!!l),a):s},a.curve=function(l){return arguments.length?(u=l,e!=null&&(o=u(e)),a):u},a.context=function(l){return arguments.length?(l==null?e=o=null:o=u(e=l),a):e},a}function at(t,n,s){var e=null,u=d(!0),o=null,c=J,a=null,l=V(r);t=typeof t=="function"?t:t===void 0?K:d(+t),n=typeof n=="function"?n:d(n===void 0?0:+n),s=typeof s=="function"?s:s===void 0?Q:d(+s);function r(i){var h,p,_,v=(i=Z(i)).length,$,y=!1,S,g=new Array(v),E=new Array(v);for(o==null&&(a=c(S=l())),h=0;h<=v;++h){if(!(h<v&&u($=i[h],h,i))===y)if(y=!y)p=h,a.areaStart(),a.lineStart();else{for(a.lineEnd(),a.lineStart(),_=h-1;_>=p;--_)a.point(g[_],E[_]);a.lineEnd(),a.areaEnd()}y&&(g[h]=+t($,h,i),E[h]=+n($,h,i),a.point(e?+e($,h,i):g[h],s?+s($,h,i):E[h]))}if(S)return a=null,S+""||null}function f(){return rt().defined(u).curve(c).context(o)}return r.x=function(i){return arguments.length?(t=typeof i=="function"?i:d(+i),e=null,r):t},r.x0=function(i){return arguments.length?(t=typeof i=="function"?i:d(+i),r):t},r.x1=function(i){return arguments.length?(e=i==null?null:typeof i=="function"?i:d(+i),r):e},r.y=function(i){return arguments.length?(n=typeof i=="function"?i:d(+i),s=null,r):n},r.y0=function(i){return arguments.length?(n=typeof i=="function"?i:d(+i),r):n},r.y1=function(i){return arguments.length?(s=i==null?null:typeof i=="function"?i:d(+i),r):s},r.lineX0=r.lineY0=function(){return f().x(t).y(n)},r.lineY1=function(){return f().x(t).y(s)},r.lineX1=function(){return f().x(e).y(n)},r.defined=function(i){return arguments.length?(u=typeof i=="function"?i:d(!!i),r):u},r.curve=function(i){return arguments.length?(c=i,o!=null&&(a=c(o)),r):c},r.context=function(i){return arguments.length?(i==null?o=a=null:a=c(o=i),r):o},r}function L(t,n,s){this.k=t,this.x=n,this.y=s}L.prototype={constructor:L,scale:function(t){return t===1?this:new L(this.k*t,this.x,this.y)},translate:function(t,n){return t===0&n===0?this:new L(this.k,this.x+this.k*t,this.y+this.k*n)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};L.prototype;function ut(t){let n,s,e,u,o,c,a,l,r,f,i,h,p,_,v;return{c(){n=b("main"),s=b("div"),e=b("div"),u=b("span"),o=N("W"),c=X(),a=b("span"),l=N("S"),r=X(),f=b("span"),i=N("B"),h=X(),p=Y("svg"),_=Y("g"),v=Y("path"),this.h()},l($){n=A($,"MAIN",{class:!0});var y=x(n);s=A(y,"DIV",{class:!0});var S=x(s);e=A(S,"DIV",{class:!0});var g=x(e);u=A(g,"SPAN",{class:!0});var E=x(u);o=q(E,"W"),E.forEach(k),c=H(g),a=A(g,"SPAN",{class:!0});var T=x(a);l=q(T,"S"),T.forEach(k),r=H(g),f=A(g,"SPAN",{class:!0});var W=x(f);i=q(W,"B"),W.forEach(k),h=H(g),p=j(g,"svg",{class:!0,width:!0,height:!0});var D=x(p);_=j(D,"g",{transform:!0});var G=x(_);v=j(G,"path",{d:!0,class:!0}),x(v).forEach(k),G.forEach(k),D.forEach(k),g.forEach(k),S.forEach(k),y.forEach(k),this.h()},h(){M(u,"class","acronym-W"),M(a,"class","acronym-S"),M(f,"class","acronym-B"),M(v,"d",t[0](t[1])),M(v,"class","svelte-43ryjo"),M(_,"transform","translate(15, 5)"),M(p,"class","logo-blue-screen"),M(p,"width",B*P+15),M(p,"height",P),M(e,"class","header__logo"),M(s,"class","header"),M(n,"class","svelte-43ryjo")},m($,y){nt($,n,y),m(n,s),m(s,e),m(e,u),m(u,o),m(e,c),m(e,a),m(a,l),m(e,r),m(e,f),m(f,i),m(e,h),m(e,p),m(p,_),m(_,v)},p:C,i:C,o:C,d($){$&&k(n)}}}var P=58,B=.6;function ot(t){var n=at(),s=[[0,P],[B*P,P],[B*P,0],[0,0]];return[n,s]}class ht extends O{constructor(n){super(),U(this,n,ot,ut,tt,{})}}export{ht as H,at as a};