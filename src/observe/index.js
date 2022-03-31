class Observer {
    constructor(data) {
        this.walk(data)
    }

    walk(data) {
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }
}

export function defineReactive(data, target, value) {
    // 如果是对象，递归
    observe(value)

    Object.defineProperty(data, target, {
        get() {
            return value
        },
        set(newValue) {
            if (value === newValue)
                return
            observe(newValue)
            value = newValue
        }
    })
}

export function observe(data) {
    if (typeof data !== 'object' || data == null)
        return

    return new Observer(data)
}