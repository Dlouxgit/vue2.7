import { mergeOptions } from "../util"

export function initGlobalAPI(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
  }
}