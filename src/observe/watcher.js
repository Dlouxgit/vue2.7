import Dep from "./dep"
import { queueWatcher } from "./schedule"

let id = 0

export default class Watcher {
    constructor(vm, fn, options, isRenderWatcher) {
        this.id = id++
        this.vm = vm
        this.getter = fn
        this.depIds = new Set()
        this.deps = []
        this.lazy = options.lazy
        this.dirty = this.lazy

        this.lazy ? undefined : this.get()
    }
    depend() {
        let i = this.deps.length
        while(i--) {
            this.deps[i].depend()
        }
    }
    evaluate() {
        this.value = this.get()
        this.dirty = false
    }
    get() {
        pushTarget(this)
        const value = this.getter.call(this.vm)
        popTarget()
        return value
    }
    update() {
        if (this.lazy) {
            this.dirty = true
        } else {
            queueWatcher(this)
        }
        console.log('update')
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

let stack = []

function pushTarget(watcher) {
    stack.push(watcher)
    Dep.target = watcher
}

function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}