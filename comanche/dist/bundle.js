(()=>{"use strict";var t={767:function(t,e){var n=this&&this.__awaiter||function(t,e,n,a){return new(n||(n=Promise))((function(i,o){function r(t){try{h(a.next(t))}catch(t){o(t)}}function l(t){try{h(a.throw(t))}catch(t){o(t)}}function h(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(r,l)}h((a=a.apply(t,e||[])).next())}))};function a(t){return n(this,void 0,void 0,(function*(){return new Promise(((e,n)=>{var a=new Image;a.setAttribute("crossOrigin","anonymous"),a.onload=function(){let t=o(a.width,a.height),i=t.getContext("2d");null!=i?(i.drawImage(a,0,0),e(i.getImageData(0,0,t.width,t.height))):n("Failed to load image")},a.src=t}))}))}function i(t,e,n){let a={width:t,height:e,data:new Uint8ClampedArray(t*e)},i=o(n.width,n.height);i.getContext("2d").putImageData(n,0,0);let r=o(t,e).getContext("2d");r.drawImage(i,0,0,t,e);let l=r.getImageData(0,0,t,e);for(let t=0;t<a.data.length;++t)a.data[t]=l.data[4*t];return a}function o(t,e){var n=document.createElement("canvas");return n.width=t,n.height=e,n}Object.defineProperty(e,"__esModule",{value:!0}),e.loadImages=void 0,e.loadImages=function(t){return n(this,void 0,void 0,(function*(){const e=yield a("./"+t);return[e,i(e.width,e.height,yield a("./"+t.replace(/C/,"D").replace(/W/,"")))]}))}},519:function(t,e,n){var a=this&&this.__awaiter||function(t,e,n,a){return new(n||(n=Promise))((function(i,o){function r(t){try{h(a.next(t))}catch(t){o(t)}}function l(t){try{h(a.throw(t))}catch(t){o(t)}}function h(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(r,l)}h((a=a.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0});const i=n(996),o=n(767),r=n(424),l=n(699),h=Math.PI/180,s=Math.sin,u=Math.cos,c=Math.tan;let d,g,f=["C1W.png","C2W.png","C3.png","C4.png","C5W.png","C6.png","C6W.png","C7W.png","C9W.png","C10W.png","C11.png","C11W.png","C13.png","C14.png","C15.png","C15W.png","C16.png","C16W.png","C17W.png","C18.png","C18W.png","C19W.png","C20W.png","C21.png","C21W.png","C22W.png","C24W.png","C25.png","C25W.png"],p=6,v=!1;function m(){let t=(0,i.fullscreenCanvas)(!1,!0),e={heading:new l.Inertial(10,2,.1,5),velocity:new l.Inertial(100,10,.1,1e5),altitude:new l.Inertial(10,1,.1,30)},n={throttle:0,steer:0,alt:0,nextMap:0,debug:0};return function(t,e){let n={};for(let[t,e,a]of[["throttle","KeyS","KeyW"],["steer","KeyA","KeyD"],["alt","ShiftLeft","Space"],["nextMap","KeyN","KeyM"],["debug","F3","F3"]])n[a]=[t,1],n[e]=[t,-1];addEventListener("keydown",(e=>{let a=n[e.code];void 0!==a&&(t[a[0]]=a[1],e.preventDefault())})),addEventListener("keyup",(e=>{let a=n[e.code];void 0!==a&&(t[a[0]]=0,e.preventDefault())}))}(n),{ctx:t,color:d,height:g,player:{x:.11,y:.133,azimuth:-192.84802576606054,alt:55.93534841801423},camera:{fov:90,range:.5},inputs:n,movement:e}}function x(t,e){let{movement:n,player:a,inputs:i}=e;v=0!=i.debug,i.debug=0,i.nextMap&&(p=(p+f.length+i.nextMap)%f.length,(0,o.loadImages)(f[p]).then((t=>[e.color,e.height]=t)),i.nextMap=0);let r=n.velocity.update(i.throttle),l=n.heading.update(i.steer),s=n.altitude.update(i.alt);return a.azimuth+=l,a.alt+=s,s>0&&(a.alt=Math.max(a.alt,M(g,a.x,a.y)+10)),a.alt<0?a.alt=0:a.alt>300&&(a.alt=300),a.x=C(a.x+r*Math.cos(a.azimuth*h)),a.y=C(a.y+r*Math.sin(a.azimuth*h)),v&&console.log(a),e}function C(t){for(;t<0;)t+=1;for(;t>=1;)t-=1;return t}function w(t,e){let{ctx:n,player:{x:a,y:i,azimuth:o,alt:r},color:l,height:d,camera:{fov:g,range:f}}=e,p={ox:0,oy:0,width:n.canvas.width,height:n.canvas.height},v=new ImageData(p.width,p.height),m=p.width/4,x=p.width/m|0,C=[167,237,243];C=[220,225,255];const w=p.width,I=p.height,P=v.data;function W(t,e,n,a){let i=(1-n)*I|0;for(let n=(1-a)*I|0;n<i;++n){let a=n*w;for(let n=0;n<x;++n){let i=a+e*x+n;P[4*i]=t[0],P[4*i+1]=t[1],P[4*i+2]=t[2],P[4*i+3]=255}}}r=Math.max(r,M(d,a,i)+10);for(let t=0;t<m;++t){let e=0,n=(o-g/2+(t+.5)*g/m)*h,p=1,v=1,x=f*u(n),w=f*s(n);for(;p<600;){let n=p/600,o=a+x*n,s=i+w*n,u=M(d,o,s),g=n*f*2e3*c(35*h)*2,m=r-g/2,I=u<m?0:u>m+g?1:(u-m)/g;if(I>e){let a=b(l,o,s);I>0&&W(y(a,C,u/255,n),t,e,I),e=I}p+=v,v*=1.001}W(C,t,e,1)}n.putImageData(v,p.ox,p.oy),n.save(),n.translate(a*l.width,i*l.height),n.strokeCircle(0,0,10),n.rotate(o*h),n.strokeRect(0,0,100,0),n.restore()}function y(t,e,n,a){let i=Math.min(1,1-(o=10*(n-.05),1/(1+Math.exp(-o)))+a*a);var o;return[t[0]*(1-i)+i*e[0],t[1]*(1-i)+i*e[1],t[2]*(1-i)+i*e[2]]}function M(t,e,n){let a=t.height*C(n)|0,i=t.width*C(e)|0,o=a*t.width+i;return t.data[o]}function b(t,e,n){let a=t.height*C(n)|0,i=t.width*C(e)|0,o=4*(a*t.width+i);return[t.data[o],t.data[o+1],t.data[o+2]]}!function(){a(this,void 0,void 0,(function*(){[d,g]=yield(0,o.loadImages)(f[p]),new r.Loop(1e3/60,m,x,w).start()}))}()},699:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Inertial=void 0,e.Inertial=class{constructor(t,e,n,a=1){this.max=t,this.acceleration=e,this.drag=n,this.scale=a,this.value=0}update(t){let e=this.value+this.acceleration*t;return t<.01&&(e*=1-this.drag,Math.abs(e)<.1&&(e=0)),this.value=Math.max(-this.max,Math.min(e,this.max)),this.value/this.scale}}},996:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.fullscreenCanvas=e.fullscreenCanvas3d=e.getCanvas=void 0,e.getCanvas=(t=!1)=>{const e=document.createElement("canvas");return e.width=window.innerWidth,e.height=window.innerHeight,t||(e.style.position="absolute",e.style.top="0",e.style.left="0"),e},e.fullscreenCanvas3d=(t=!1)=>{const n=(0,e.getCanvas)(t),a=n.getContext("webgl");if(null==a)throw new Error("failed to get 'webgl' context");return document.body.appendChild(n),a},e.fullscreenCanvas=function(t=!1,a=!1){const i=(0,e.getCanvas)(t),o=i.getContext("2d",{alpha:!a});if(null==o)throw new Error("failed to get '2d' context");return o.clear=function(){return o.clearRect(0,0,o.canvas.width,o.canvas.height),o},o.makePath=function(t){o.beginPath(),o.moveTo(t[0],t[1]);for(var e=2;e<t.length;e+=2)o.lineTo(t[e],t[e+1]);return o.closePath(),o},o.strokeCircle=function(t,e,n){return o.beginPath(),o.arc(t,e,n,0,2*Math.PI,!0),o.closePath(),o.stroke(),o},o.fillCircle=function(t,e,n){return o.beginPath(),o.arc(t,e,n,0,2*Math.PI,!0),o.closePath(),o.fill(),o},o.fillHex=function(t,e,a){o.beginPath(),o.save(),o.translate(t,e),o.moveTo(a/n,0);for(let t=0;t<5;++t)o.rotate(Math.PI/3),o.lineTo(a/n,0);return o.restore(),o.closePath(),o.fill(),o},document.body.style.overflow="hidden",document.body.appendChild(i),o};const n=Math.sqrt(3)/2},424:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Loop=void 0,e.Loop=class{constructor(t,e,n,a){this.fixedDelta=t,this.init=e,this.fixed=n,this.variable=a,this.isRunning=!1,this.fixedAccum=0}start(){if(this.isRunning)return;let t=this.init();this.isRunning=!0;let e=0;const n=a=>{const i=0==e,o=i?0:a-e;e=a,t=this.update(o,t,i),this.isRunning&&requestAnimationFrame(n)};requestAnimationFrame(n)}stop(){this.isRunning=!1}update(t,e,n=!1){let a=e;this.fixedAccum+=t;let i=!1;if(n)a=this.fixed(this.fixedDelta,a),i=!0;else for(;this.fixedAccum>this.fixedDelta;)this.fixedAccum-=this.fixedDelta,a=this.fixed(this.fixedDelta,a),i=!0;return i&&this.variable(t,a),a}}}},e={};!function n(a){var i=e[a];if(void 0!==i)return i.exports;var o=e[a]={exports:{}};return t[a].call(o.exports,o,o.exports,n),o.exports}(519)})();