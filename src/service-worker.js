/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

const CURRENT_CACHE_VERSION = 'v1.1.2'; // Increment this version for every update
const PRECACHE_CACHE_NAME = `precache-${CURRENT_CACHE_VERSION}`;
const IMAGES_CACHE_NAME = `images-${CURRENT_CACHE_VERSION}`;

// Precache and route asserts generated by build process, with our custom cache name
precacheAndRoute(self.__WB_MANIFEST, { cacheName: PRECACHE_CACHE_NAME });

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Delete the caches that are not the current ones.
                    if (![PRECACHE_CACHE_NAME, IMAGES_CACHE_NAME].includes(cacheName)) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Claiming clients for version', CURRENT_CACHE_VERSION);
            return self.clients.claim();
        })
    );
});

// App Shell-style routing for navigation requests
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
    ({ request, url }) => {
        if (request.mode !== 'navigate') {
            return false;
        }
        if (url.pathname.startsWith('/_')) {
            return false;
        }
        if (url.pathname.match(fileExtensionRegexp)) {
            return false;
        }
        return true;
    },
    createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
    );

// Runtime caching for images
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: IMAGES_CACHE_NAME,
    plugins: [
      new ExpirationPlugin({ maxEntries: 50 }),
      ],
  })
  );

// Skip waiting and claim clients on new service worker installation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Other custom service worker logic can go here.
