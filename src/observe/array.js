const oldArrayProto = Array.prototype
export let newArrayProto = Object.create(oldArrayProto)

const methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'splice',
    'sort',
]

methods.forEach(method => {
    newArrayProto[method] = function (...args) {
        const result = oldArrayProto[method].call(this, ...args)
        const ob = this.__ob__
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
            default:
                break
        }
        inserted && ob.observeArray(inserted)
        debugger
        ob.dep.notify()
        return result
    }
})