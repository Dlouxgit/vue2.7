import { initGlobalAPI } from './global-api'
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
initGlobalAPI(Vue)

export default Vue