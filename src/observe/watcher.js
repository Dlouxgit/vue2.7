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