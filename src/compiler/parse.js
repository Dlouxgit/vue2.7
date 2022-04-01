const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

export function parseHTML(html) {
    const TYPE_MAP = {
        ELEMENT_TYPE: 1,
        TEXT_TYPE: 3
    }
    const stack = []
    let currentParent
    let root

    function createASTElement(tag, attrs) {
        return {
            tag,
            type: TYPE_MAP.ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }

    function handleStartTag(tagName, attrs) {
        const node = createASTElement(tagName, attrs)
        if (!root) {
            root = node
        }
        if (currentParent) {
            node.parent = currentParent
            currentParent.children.push(node)
        }
        stack.push(node)
        currentParent = node
    }

    function chars(text) {
        text = text.replace(/\s/g, '')
        text && currentParent.children.push({
            type: TYPE_MAP.TEXT_TYPE,
            text,
            parent: currentParent
        })
    }

    function handleEndTag(tagName) {
        const node = stack.pop()
        if (node.tag !== tagName) {
            return new Error('tag Error')
        }
        currentParent = stack[stack.length - 1]
    }

    function advance(step) {
        html = html.substring(step)
    }

    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            let end, attr
                // for '/>'
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] || true
                })

            }
            if (end) {

                advance(end[0].length)
            }
            return match
        }

        return false
    }
    while (html) {
        let textEnd = html.indexOf('<')

        if (textEnd === 0) {

            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                handleStartTag(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            // for '</xxx>'
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                handleEndTag(endTagMatch[1])
                advance(endTagMatch[0].length)
                continue
            }

        } else if (textEnd > 0) {
            let text = html.substring(0, textEnd)
            chars(text)
            advance(text.length)
        }
    }
    return root
}