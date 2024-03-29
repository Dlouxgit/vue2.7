const strats = {}
const LIFE_CYCLE = [
  'beforeCreate',
  'created'
]
LIFE_CYCLE.forEach(hook => {
  strats[hook] = function (p, c) {
    if (c) {
      if (!p) {
        return [c]
      } else {
        return p.concat(c)
      }
    } else {
      return p
    }
  }
})
export function mergeOptions(parent, child) {
  const options = {}

  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else {
      options[key] = child[key] || parent[key]
    }
  }

  return options
}