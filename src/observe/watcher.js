import Dep from "./dep"
import { queueWatcher } from "./schedule"

let id = 0

export default class Watcher {
    constructor(vm, exprOrFn, options, cb, isRenderWatcher) {
        this.id = id++
        this.vm = vm
        if (typeof exprOrFn === 'string') {
            this.getter = function () {
                return vm[exprOrFn]
            }
        } else {
            this.getter = exprOrFn
        }
        this.depIds = new Set()
        this.deps = []
        this.cb = cb
        this.lazy = options.lazy
        this.dirty = this.lazy
        this.user = options.user

        this.value = this.lazy ? undefined : this.get()
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
        const oldValue = this.value
        const newValue = this.get()

        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue)
        }
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