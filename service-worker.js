"use strict";var precacheConfig=[["/FaircoinRPS/index.html","b1bd6d3778c5661dcee5aee42b6fa50d"],["/FaircoinRPS/static/css/main.0fb4de81.css","8d327856e6379f3f1111bf2f5d33703d"],["/FaircoinRPS/static/js/main.44db5e76.js","21c313445fbe99bff346c4bdb2584bf3"],["/FaircoinRPS/static/media/Draw.e7fbf66d.png","e7fbf66df74e877644676068f30e14f4"],["/FaircoinRPS/static/media/Lose.c2d7ccf3.png","c2d7ccf37aac12edbb93059b931e9101"],["/FaircoinRPS/static/media/Mano 1.eece518e.png","eece518e4190cef1f35b862aa346d0ac"],["/FaircoinRPS/static/media/Mano 2.ff456c77.png","ff456c777f6c218293b55b4615ff9b85"],["/FaircoinRPS/static/media/Mano 3.e0aa7e54.png","e0aa7e54577dacdec4314f250f96e5f5"],["/FaircoinRPS/static/media/Mano 4.9fc189a1.png","9fc189a13ac124142de05e95fa74aa3e"],["/FaircoinRPS/static/media/Mano 5.271d0d90.png","271d0d904f3fe546de0f93c6e3267b29"],["/FaircoinRPS/static/media/Mano 6.a5414fa7.png","a5414fa77afedbdffe419cb1c504c4ee"],["/FaircoinRPS/static/media/Manos1R.842ee15c.png","842ee15cd623cbc2a471bce389ec4774"],["/FaircoinRPS/static/media/Manos2R.a81a1bb1.png","a81a1bb12e5d100df88efefc7f21c49a"],["/FaircoinRPS/static/media/Manos3R.82684479.png","826844799b04277099e53aef3b2fc2b7"],["/FaircoinRPS/static/media/Online-Peers.14a3b4f4.png","14a3b4f4ada8283f526bf919d20e75ca"],["/FaircoinRPS/static/media/Papel.818f6df0.png","818f6df0665ec2b252cbd3038c7c2764"],["/FaircoinRPS/static/media/Piedra.b3ab5002.png","b3ab5002b49e7a7855c36dc1bd8a5494"],["/FaircoinRPS/static/media/Tijera.612d0680.png","612d068017bab1062c2b18b97f9984de"],["/FaircoinRPS/static/media/Win.ec405864.png","ec4058647a72eeedad3b4dd9c8d71251"],["/FaircoinRPS/static/media/loading.5c9604b9.gif","5c9604b9221ec1d4f2923c606612b79d"],["/FaircoinRPS/static/media/match.f20e03e2.png","f20e03e277a0ae1f959a0cc6ceb8a7af"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=a),n.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,n,t){var c=new URL(e);return t&&c.pathname.match(t)||(c.search+=(c.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(n)),c.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var n=new URL(a).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,n){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return n.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],n=e[1],t=new URL(a,self.location),c=createCacheKey(t,hashParamName,n,/\.\w{8}\./);return[t.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(t){return setOfCachedUrls(t).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!n.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return t.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!n.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,n=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),t="index.html";(e=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,t),e=urlsToCacheKeys.has(n));var c="/FaircoinRPS/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(n=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(n)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});