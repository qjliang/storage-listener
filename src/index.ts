type storageListenerHandler = (data: any) => void

const storageNamespace = 'storage-listener'

class AccrossStorageListener {
    // 在当前tab页，和不在当前tab页，消息不同。
    private messages: any = {}

    constructor() {
        window.addEventListener('storage', (event: any) => {
            const eventScheme = event.key.split(':')
            const namespace = eventScheme[0]
            if (namespace === storageNamespace) {
                const data = JSON.parse(JSON.parse(event.newValue).data)
                const msgName = eventScheme[1]
                this.emitHandlers(msgName, data)
            }
        })
    }

    /**
     * 监听 页面消息消息
     * @param msgName 消息名 不能包含 冒号(:)
     * @param handler 消息回调
     */
    on(msgName: string, handler: storageListenerHandler) {
        const handlers = this.messages[msgName]
        this.messages[msgName] = Array.isArray(handlers) ? [...handlers, handler] : [handler]
    }

    /**
     * 发送 跨tab消息
     * @param msgName 消息名 不能包含 冒号(:)
     * @param data 携带的数据
     */
    emit(msgName: string, data: any = '', self: boolean = false) {
        this.send(msgName, JSON.stringify(data), self)
    }

    remove(msgName: string, handler?: storageListenerHandler) {
        if (handler === undefined) {
            // 删除所有
            delete this.messages[msgName]
        } else {
            const handlers = this.messages[msgName]
            if (Array.isArray(handlers)) {
                const index = handlers.indexOf(handler)
                if (index === -1) {
                    console.warn(`没有监听 localStorage: [${msgName}], handler: [${handler}]`)
                } else {
                    handlers.splice(index, 1)
                    if (handlers.length === 0) {
                        delete this.messages[msgName]
                    }
                }
            } else {
                console.warn(`没有监听 localStorage: [${msgName}]`)
            }
        }
    }

    private emitHandlers(msgName: string, data: any) {
        // 如果在当前 tab 监听了事件 则 this.messages 中会有相应的 handler
        // 不在当前 tab 监听事件 则 this.messages 中不会有相应的 handler，但在其他 tab 页会有。
        const handlers = this.messages[msgName]
        if (Array.isArray(handlers)) {
            for (const handler of handlers) {
                handler(data)
            }
        }
    }

    /**
     * 发送 页面消息消息
     * @param msgName 消息名 不能包含 冒号(:)
     * @param data json格式字符串，为了 让跨 tab 和 不跨 tab 的数据格式一致。
     */
    private send(msgName: string, data: string, self: boolean = false) {
        // 在当前 tab 页 不会触发 onstorage 事件
        window.localStorage.setItem(`${storageNamespace}:${msgName}`, JSON.stringify({
            id: `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
            data
        }))
        // 如果在当前 tab 监听了事件 则 this.messages 中会有相应的 handler
        // 在当前页面触发 事件。
        if (self) {
            this.emitHandlers(msgName, data)
        }
    }
}

const messager = new AccrossStorageListener()

export default messager
