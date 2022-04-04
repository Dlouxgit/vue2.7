let id = 0

export default class Dep {
    constructor() {
        this.id = id++

        this.subs = []
    }
    depend() {
        Dep.target && Dep.target.addDep(this)
    }
    notify() {
        this.subs.forEach(sub => sub.update())
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
}

Dep.target = null