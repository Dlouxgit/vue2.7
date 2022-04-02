import { parseHTML, TYPE_MAP } from './parse'

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
    let str = ''

    attrs.forEach(attr => {
        if (attr.name == 'style') {
            attr.value = attr.value.split(';').reduce((prev, item) => {
                const [key, value] = item.split(':')
                prev[key] = value
                return prev
            }, {})
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    })
    return `{${str.slice(0, -1)}}`
}

function gen(node) {
    if (node.type === TYPE_MAP.ELEMENT_TYPE) {
        return codegen(node)
    } else {
        let text = node.text
        if (defaultTagRE.test(text)) {
            let tokens = []
            let match
            let lastIndex = 0
                // 每次 exec 后就不再是从第 0 位开始匹配，需要重置
            defaultTagRE.lastIndex = 0
            while (match = defaultTagRE.exec(text)) {
                let index = match.index
                if (index > lastIndex) {
                    tokens.push(`${JSON.stringify(text.slice(lastIndex, index))}`)
                }
                // 如果 mustache 语法中的属性在 data 中未定义， with 会报错，因此加上 this
                tokens.push(`_s(this.${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if (lastIndex < text.length) {
                tokens.push(`${JSON.stringify(text.slice(lastIndex))}`)
            }
            return `_v(${tokens.join('+')})`
        } else {
            return `_v(${JSON.stringify(text)})`
        }
    }
}

function genChildren(children) {
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
    return []
}

function codegen(ast) {
    let children = genChildren(ast.children)
    let code = `_c(
        '${ast.tag}', 
        ${ast.attrs.length ? genProps(ast.attrs) : null}${
            ast.children.length ? `,${children}` : ''
        })`
    return code
}

export function compileToFunction(template) {
    let ast = parseHTML(template)
    let code = codegen(ast)
    code = `with(this) {return ${code}}`
    let render = new Function(code)
    return render
}