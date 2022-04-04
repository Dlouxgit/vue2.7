import Dep from "./dep"

let id = 0

export default class Watcher {
    constructor(vm, fn, isRenderWatcher) {
        this.id = id++

        this.vm = vm
        this.getter = fn
        this.depIds = new Set()
        this.deps = []
        this.get()
    }
    get() {
        Dep.target = this
        this.getter()
        Dep.target = null
    }
    update() {
        console.log('update')
        queueWatcher(this)
    }
    run() {
        this.get()
    }
    addDep(dep) {
        if (!this.depIds.has(dep.id)) {
            this.depIds.add(dep.id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
}

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

function queueWatcher(watcher) {
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

let callbacks = []
let waiting = false

function flushCallback() {
    let cbs = callbacks.slice()
    waiting = false
    callbacks = []
    cbs.forEach(cb => cb())
}

let timerFunc
if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallback)
    }
} else if (MutationObserver) {
    const observer = new MutationObserver(flushCallback)
    let count = 0
    const textNode = document.createTextNode(count)
    observer.observe(textNode, {
        characterData: true
    })
    timerFunc = () => {
        textNode.textContent = count++
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallback)
    }
} else if (setTimeout) {
    timerFunc = () => {
        setTimeout(flushCallback)
    }
}

export function nextTick(cb) {
    callbacks.push(cb)
    if (!waiting) {
        timerFunc()
        waiting = true
    }
}