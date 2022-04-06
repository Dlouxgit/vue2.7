import { newArrayProto } from './array'
import Dep from './dep'
class Observer {
    constructor(data) {
        this.dep = new Dep()
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

function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
        const current = value[i]
        // 可能不是对象因此没有 __ob__
        current.__ob__ && current.__ob__.dep.depend()
        if (Array.isArray(current)) {
            dependArray(current)
        }
    }
}

export function defineReactive(data, target, value) {
    // 如果是对象，递归
    const childOb = observe(value)
    let dep = new Dep()

    Object.defineProperty(data, target, {
        get() {
            dep.depend()
            if (childOb) {
                childOb.dep.depend()

                if (Array.isArray(value)) {
                    dependArray(value)
                }
            }
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