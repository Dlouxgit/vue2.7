import Watcher from "./observe/watcher"
import { createEleVNode, createTextVNode } from "./vdom"
import { patch } from "./vdom/patch"

export function initLifeCycle(Vue) {
    Vue.prototype._update = function(vnode) {
        const vm = this
        const el = vm.$el
        vm.$el = patch(el, vnode)
        console.log(vnode)
    }
    Vue.prototype._render = function() {
        const vm = this
            // render 是通过 ast 生成的方法，call this 后 with 会取到 vm 上的响应式数据，每次调用都会重新取一次
        return vm.$options.render.call(vm)
    }
    Vue.prototype._c = function(...args) {
        return createEleVNode(this, ...args)
    }
    Vue.prototype._v = function(...args) {
        return createTextVNode(this, ...args)
    }
    Vue.prototype._s = function(value) {
        if (value == null)
            return ''
        if (typeof value === 'object')
            return value
        return JSON.stringify(value)
    }
}

export function mountComponent(vm, el) {
    vm.$el = el
    new Watcher(vm, () => {
        vm._update(vm._render())
    }, true)
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        handlers.forEach(handle => handle.call(vm))
    }
}