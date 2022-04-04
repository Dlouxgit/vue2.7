
let callbacks = []
let waiting = false

function flushCallback() {
    let cbs = callbacks.slice()
    waiting = false
    callbacks = []
    cbs.forEach(cb => cb())
}

let timerFunc
if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallback)
    }
} else if (MutationObserver) {
    const observer = new MutationObserver(flushCallback)
    let count = 0
    const textNode = document.createTextNode(count)
    observer.observe(textNode, {
        characterData: true
    })
    timerFunc = () => {
        textNode.textContent = count++
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallback)
    }
} else if (setTimeout) {
    timerFunc = () => {
        setTimeout(flushCallback)
    }
}

export function nextTick(cb) {
    callbacks.push(cb)
    if (!waiting) {
        timerFunc()
        waiting = true
    }
}