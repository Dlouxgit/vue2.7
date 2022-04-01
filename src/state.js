import { observe } from './observe/index'

export function initState(vm) {
    const options = vm.$options
    if (options.data) {
        initData(vm)
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