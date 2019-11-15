self.addEventListener('install', function(e) {
    console.log('EHRE!!!')
    caches.keys().then(keys => {
        console.log('all keys ', keys)
    })
    e.waitUntil(
        caches.open('dhis2-form-viewer').then(function(cache) {
            return cache.addAll(['/index.html'])
        })
    )
})

self.addEventListener('fetch', function(event) {
    console.log(event.request.url)
    event.respondWith(
        caches.open('dhis2-form-overview').then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return (
                    response ||
                    fetch(event.request).then(function(response) {
                        cache.put(event.request, response.clone())
                        return response
                    })
                )
            })
        })
    )
})
