// TODO (you): an in-memory cache where each entry expires after a set time.
// It needs a way to get a value (counting a hit or a miss), store a value,
// and report { entries, hits, misses, ttlSeconds }. The exact counting rules
// are on the assignment page. A Map with { value, expiresAt } entries works well.
export function makeCache(ttlSeconds){
    const cache = new Map()
    let hits = 0
    let misses = 0
    function get(key){
        const entry = cache.get(key)
        if (!entry) {
            misses++
            return undefined
        }
        if (Date.now() >= entry.expiresAt) {
            cache.delete(key)
            misses++
            return undefined
        }
        hits++
        return entry.value
    }
    function set(key, value){
        cache.set(key, {value, expiresAt: Date.now()+ttlSeconds*1000})
    }
    function stats() {
        current = Date.now()
        for (const [key, entry] of cache) {
            if (current >= entry.expiresAt) {
                cache.delete(key)
            }
        }
        return{
            entries: cache.size,
            hits,
            miss,
            ttlSeconds
        }
    }
    return {get,set,stats}
}