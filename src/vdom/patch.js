function createElm(vnode) {
    let { tag, data, children, text } = vnode
    if (typeof tag === 'string') {
        // 第一次在 vnode 上添加 el 属性
        vnode.el = document.createElement(tag)
        patchProps(vnode.el, data)
        if (children) {
            children.forEach(child => {
                vnode.el.appendChild(createElm(child))
            })
        }
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function patchProps(el, props) {
    for (let key in props) {
        if (key === 'style') {
            for (let styleName in props.style) {
                el.style[styleName] = props.style[styleName]
            }
            continue
        }
        el.setAttribute(key, props[key])
    }
}

export function patch(oldVnode, vnode) {
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
        const elm = oldVnode
        const parentElm = elm.parentNode
        const newElm = createElm(vnode)
        parentElm.insertBefore(newElm, elm.nextSibing)
        parentElm.removeChild(elm)
    }
}