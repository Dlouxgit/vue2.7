import { nextTick } from "../util"

let queue = []
let has = {}
let pending = false

function flushSchedulerQueue() {
    const flushQueue = queue.slice()
    queue = []
    pending = false
    has = {}
    flushQueue.forEach(q => q.run())
}

export function queueWatcher(watcher) {
    const id = watcher.id
    if (!has[id]) {
        has[id] = id
        queue.push(watcher)
        if (!pending) {
            nextTick(flushSchedulerQueue)
            pending = true
        }
    }
}
