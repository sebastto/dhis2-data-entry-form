self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open('dhis2-form-overview').then(function(cache) {
            return cache.match(event.request).then(function(response) {
                /* Tries to fetch a new version. If the fetch fails we serve the cache */
                return fetch(event.request)
                    .then(function(response) {
                        /* Add does not add responses with codes other thatn 200-299. */
                        cache.add(event.request, response.clone())
                        return response
                    })
                    .catch(err => {
                        console.warn('Fetch failed. Serving from cache!', err)
                        return response
                    })
            })
        })
    )
})
