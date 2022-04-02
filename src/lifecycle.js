export function initLifeCycle(Vue) {
    Vue.prototype._render = function() {}
    Vue.prototype._update = function() {
        const vm = this
        vm.$options.render() // 通过 ast 生成的方法
    }
}

export function mountComponent() {
    vm._update(vm._render())
}