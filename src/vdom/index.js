export function createEleVNode(vm, tag, attrs, ...children) {
    if (!attrs)
        attrs = {}
    const { key, ...data } = attrs
    return vnode(vm, tag, key, data, children)
}

export function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}

function vnode(vm, tag, key, data, children, text) {
    return {
        vm,
        tag,
        key,
        data,
        children,
        text
    }
}