import { isSameNode } from "."

function createElm(vnode) {
    let { tag, data, children, text } = vnode
    if (typeof tag === 'string') {
        // 第一次在 vnode 上添加 el 属性
        vnode.el = document.createElement(tag)
        patchProps(vnode.el, {}, data)
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

function patchProps(el, oldProps, props) {
    const oldStyles = oldProps.style || {}
    const newStyles = props.style || {}
    for (let style in oldStyles) {
        if (!newStyles[style]) {
            oldStyles[style] = ''
        }
    }

    for (let key in oldProps) {
        if (!props[key]) {
            el.removeAttribute(key)
        }
    }

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
        return newElm
    } else {
        return patchVnode(oldVnode, vnode)
    }
}

function patchVnode(oldVnode, vnode) {
    if (!isSameNode(oldVnode, vnode)) {
        const el = createElm(vnode)
        oldVnode.el.parentNode.replaceChild(el, oldVnode.el)
        return el
    }

    const el = vnode.el = oldVnode.el

    if (!oldVnode.tag) {
        if (oldVnode.text !== vnode.text) {
            el.textContent = vnode.text
        }
    }
    patchProps(el, oldVnode.data, vnode.data)

    const oldChildren = oldVnode.children || []
    const newChildren = vnode.children || []

    if (oldChildren.length && newChildren.length) {
        updateChildren(el, oldChildren, newChildren)
    } else if (newChildren) {
        mountChildren(el, newChildren)
    } else if (oldChildren) {
        el.innerHTML = ''
    }

    return el
}

function mountChildren(el, newChildren) {
    for (let i = 0; i < newChildren.length; i++) {
        const child = createElm(newChildren[i])
        el.appendChild(child)
    }
}

function makeIndexByKey(children) {
    const map = {}
    children.forEach(child => {
        map[child.key] = index
    })
    return map
}

function updateChildren(el, oldChildren, newChildren) {
    let oldStartIndex = 0
    let newStartIndex = 0
    let oldEndIndex = oldChildren.length - 1
    let newEndIndex = newChildren.length - 1

    let oldStartVNode = oldChildren[oldStartIndex]
    let newStartVNode = newChildren[newStartIndex]
    let oldEndVNode = oldChildren[oldEndIndex]
    let newEndVNode = newChildren[newEndIndex]

    const map = makeIndexByKey(oldChildren)

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartVNode) {
            oldStartVNode = [++oldStartIndex]
        } 
        else if (!oldEndVNode) {
            oldEndVNode = [--oldEndIndex]
        }
        else if (isSameNode(oldStartVNode, newStartVNode)) {
            patchVnode(oldStartVNode, newStartVNode)
            oldStartVNode = oldChildren[++oldStartIndex]
            newStartVNode = newChildren[++newStartIndex]
        }
        else if (isSameNode(oldEndVNode, newEndVNode)) {
            patchVnode(oldEndVNode, newEndVNode)
            oldEndVNode = oldChildren[--oldEndIndex]
            newEndVNode = newChildren[--newEndIndex]
        }
        else if (isSameNode(oldEndVNode, newStartVNode)) {
            patchVnode(oldEndVNode, newStartVNode)
            el.insertBefore(oldEndVNode.el, oldStartVNode.el)
            oldEndVNode = oldChildren[--oldEndIndex]
            newStartVNode = newChildren[++newStartIndex]
        }
        else if (isSameNode(oldStartVNode, newEndVNode)) {
            patchVnode(oldStartVNode, newEndVNode)
            el.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibing)
            oldStartVNode = oldChildren[++oldStartIndex]
            newEndVNode = newChildren[--newEndIndex]
        } else {
            let moveIndex = map[newStartVNode.key]
            if (moveIndex != null) {
                const moveVNode = oldChildren[moveIndex]
                el.insertBefore(moveVNode.el, oldStartVNode.el)
                oldChildren[moveIndex] = undefined
                patchVnode(moveVNode, newStartVNode)
            } else {
                el.insertBefore(createElm(newStartVNode), oldStartVNode.el)
            }
            newStartVNode = newChildren[++newStartIndex]
        }


    }

    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            let childEl = createElm(newChildren[i])
            el.appendChild(childEl)
        }
    }
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            // 这个 if 用来过滤乱序比对时设置的 oldChildren[i] 为 undefined 的错误
            if (oldChildren[i]) {
                let childEl = oldChildren[i].el
                el.removeChild(childEl)
            }
        }
    }
}