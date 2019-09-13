interface storageListenerHandler {
    (data: any): void
} 

declare module Reflect {
}

const storageNamespace = 'storage-listener'

class AccrossStorageListener {
    // 在当前页，和不在当前页，消息不同。
    private notifyMsg: any = {}

    constructor() {
        window.addEventListener('storage', (event: any) => {
            const eventScheme = event.key.split(':')
            const namespace = eventScheme[0]
            if (namespace === storageNamespace) {
                const data = JSON.parse(JSON.parse(event.newValue).data)
                const msgName = eventScheme[1]
                this.emitCallback(msgName, data)
            }
        })
    }
    private emitCallback(infoName: string, data: any) {
        // 如果在当前 页 监听了事件 则 this.notifyMsg 中会有相应的 cb
        // 不在当前 页 监听事件 则 this.notifyMsg 中不会有相应的 cb，但在其他 tab 页会有。
        const cbs = this.notifyMsg[infoName]
        if (Array.isArray(cbs)) {
            for (const cb of cbs) {
                cb(data)
            }
        }
    }

    /**
     * 发送 页面消息消息
     * @param infoName 消息名 不能包含 冒号(:)
     * @param data json格式字符串，为了让跨页 和 不跨页 的数据格式一致。
     */
    private action(infoName: string, data: string, self: boolean = false) {
        // 在当前页不会触发 onstorage 事件
        window.localStorage.setItem(`${storageNamespace}:${infoName}`, JSON.stringify({
            id: `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
            data
        }))
        // 如果在当前页监听了事件 则 this.notifyMsg 中会有相应的 cb
        // 在当前页面触发 事件。
        if (self) {
            this.emitCallback(infoName, data)
        }
    }
    /**
     * 监听 页面消息消息
     * @param infoName 消息名 不能包含 冒号(:)
     * @param cb 消息回调
     */
    on(infoName: string, cb: storageListenerHandler) {
        const info = this.notifyMsg[infoName]
        this.notifyMsg[infoName] = Array.isArray(info) ? [...info, cb] : [cb]
    }

    /**
     * 发送 跨页消息
     * @param infoName 消息名 不能包含 冒号(:)
     * @param data 携带的数据
     */
    emit(infoName: string, data: any = '', self: boolean = false) {
        this.action(infoName, JSON.stringify(data), self)
    }

    delete(infoName: string, cb?: storageListenerHandler) {
        if (cb === undefined) {
            // 删除所有
            Reflect.deleteProperty(this.notifyMsg, infoName)
        } else {
            const callbacks = this.notifyMsg[infoName]
            if (Array.isArray(callbacks)) {
                const index = callbacks.indexOf(cb)
                if (index === -1) {
                    console.warn(`没有监听 localStorage: [${infoName}], handler: [${cb}]`)
                } else {
                    callbacks.splice(index, 1)
                    if (callbacks.length === 0) {
                        delete this.notifyMsg[infoName]
                    }
                }
            } else {
                console.warn(`没有监听 localStorage: [${infoName}]`)
            }
        }
    }
}

const notifyMessage = new AccrossStorageListener()

export default notifyMessage
