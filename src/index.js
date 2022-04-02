import { initMixin } from './init'
import { initLifeCycle } from './lifecycle'

function Vue(options) {
    this._init(options)
    if (options.el) {
        this.$mount(options.el)
    }
}

initMixin(Vue)
initLifeCycle(Vue)
export default Vue