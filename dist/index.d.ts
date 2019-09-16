interface storageListenerHandler {
    (data: any): void;
}
declare class AccrossStorageListener {
    private notifyMsg;
    constructor();
    private emitCallback;
    /**
     * 发送 页面消息消息
     * @param infoName 消息名
     * @param data json格式字符串，为了让跨页 和 不跨页 的数据格式一致。
     */
    private action;
    /**
     * 监听 页面消息消息
     * @param infoName 消息名
     * @param cb 消息回调
     */
    on(infoName: string, cb: storageListenerHandler): void;
    /**
     * 发送 跨页消息
     * @param infoName 消息名
     * @param data 携带的数据
     */
    emit(infoName: string, data?: any, self?: boolean): void;
    delete(infoName: string, cb?: storageListenerHandler): void;
}
declare const notifyMessage: AccrossStorageListener;
export default notifyMessage;
