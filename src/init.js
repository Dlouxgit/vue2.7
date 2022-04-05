import { initState } from './state'
import { compileToFunction } from './compiler'
import { callHook, mountComponent } from './lifecycle'
import { mergeOptions } from './util'

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this
        vm.$options = mergeOptions(this.constructor.options, options)
        callHook(vm, 'beforeCreate')
        initState(vm)
        callHook(vm, 'created')
    }
    Vue.prototype.$mount = function(el) {
        const vm = this
        el = document.querySelector(el)
        let opt = vm.$options
        let template
        if (!opt.render) {
            if (!opt.template && el) {
                template = el.outerHTML
            } else if (el) {
                template = el.template
            }

            if (template) {
                const render = compileToFunction(template)
                opt.render = render
            }
        }

        mountComponent(vm, el)
    }

}