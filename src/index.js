import { initGlobalAPI } from './global-api'
import { initMixin } from './init'
import { initLifeCycle } from './lifecycle'
import Watcher from './observe/watcher'

function Vue(options) {
    this._init(options)
    if (options.el) {
        this.$mount(options.el)
    }
}

initMixin(Vue)
initLifeCycle(Vue)
initGlobalAPI(Vue)

Vue.prototype.$watch = function (exprOrFn, cb) {
    new Watcher(this, exprOrFn, { user: true }, cb)
}

export default Vue