var dataCacheName = 'MyPwa-data';
var cacheName = 'MyPwa';

var filesToCache = [
  '',
  '/',
  'manifest.json',
  'index.html',
  'scripts/app.js',
  'styles/style.css',
  'images/ic_add_white_24px.svg',
  'images/ic_refresh_white_24px.svg'
];

//'offline-0.7.13/offline.min.js',
//'offline-0.7.13/themes/offline-theme-chrome-indicator.css',
//'offline-0.7.13/themes/offline-language-english-indicator.css'

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});



self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
		if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});


self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  
  //var data_url="/mypwa_ws/services/";
  //var data_url="http://localhost/mypwa/data/stores.json";
  var data_url="https://pumaprojects.github.io/mypwa/data/stores.json";
  
  if (e.request.url.indexOf(data_url) > -1) {
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
	  
	  if (e.request.url.indexOf('favicon.ico') <= -1) {
		/*
		 * The app is asking for app shell files. In this scenario the app uses the
		 * "Cache, falling back to the network" offline strategy:
		 * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
		 */
		e.respondWith(
		  caches.match(e.request).then(function(response) {
			return response || fetch(e.request);
		  })
		);
	  }
  }
});
