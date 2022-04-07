import Dep from './observe/dep'
import { observe } from './observe/index'
import Watcher from './observe/watcher'
import { nextTick } from './util'

export function initState(vm) {
    const options = vm.$options
    if (options.data) {
        initData(vm)
    }
    if (options.computed) {
        initComputed(vm)
    }
    if (options.watch) {
        initWatch(vm)
    }
}

function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key]
        },
        set(newValue) {
            vm[target][key] = newValue
        }
    })
}

function initData(vm) {
    let data = vm.$options.data
    data = typeof data === 'function' ? data.call(vm) : data

    vm._data = data

    observe(data)

    for (let key in data) {
        proxy(vm, '_data', key)
    }
    console.log(vm)
}

function initComputed(vm) {
    let computed = vm.$options.computed
    const watchers = vm._computedWatchers = Object.create(null)
    for (let key in computed) {
        const userDef = computed[key]
        const getter = typeof userDef === 'function' ? userDef : userDef.get
        watchers[key] = new Watcher(vm, getter, { lazy: true })
        defineComputed(vm, key, userDef)
    }
}

function defineComputed(target, key, userDef) {
    const setter = userDef.set || (() => {})

    Object.defineProperty(target, key, {
        get: createComputedGetter(key),
        set: setter
    })
}

function createComputedGetter(key) {
    return function () {
        const watcher = this._computedWatchers[key]
        
        if (watcher.dirty) {
            watcher.evaluate()
        }

        if (Dep.target) {
            watcher.depend()
        }

        return watcher.value
    }
}

function initWatch(vm) {
    let watch = vm.$options.watch
    for (let key in watch) {
        const handler = watch[key]
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}
function createWatcher(vm, key, handler) {
    // 没有处理 deep、 immediate 的情况.
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    return vm.$watch(key, handler)
}

export function initStateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick
    Vue.prototype.$watch = function (exprOrFn, cb) {
        new Watcher(this, exprOrFn, { user: true }, cb)
    }
    
}