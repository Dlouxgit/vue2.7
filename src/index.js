import { initMixin } from './init'

function Vue(options) {
    this._init(options)
    if (options.el) {
        this.$mount(options.el)
    }
}

initMixin(Vue)

export default Vue