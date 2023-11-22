/* eslint-disable */
var cacheName = '1.0.1'

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(['index.html']))
  )
})
