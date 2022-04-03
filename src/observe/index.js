import { newArrayProto } from './array'
import Dep from './dep'
class Observer {
    constructor(data) {
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })

        if (Array.isArray(data)) {
            data.__proto__ = newArrayProto
            this.observeArray(data)
        } else {
            this.walk(data)
        }
    }

    walk(data) {
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }

    observeArray(data) {
        data.forEach(item => observe(item))
    }
}

export function defineReactive(data, target, value) {
    // 如果是对象，递归
    observe(value)
    let dep = new Dep()

    Object.defineProperty(data, target, {
        get() {
            dep.depend()
            return value
        },
        set(newValue) {
            if (value === newValue)
                return
            observe(newValue)
            value = newValue
            dep.notify()
        }
    })
}

export function observe(data) {
    if (typeof data !== 'object' || data == null)
        return

    if (data.__ob__ instanceof Observer)
        return

    return new Observer(data)
}