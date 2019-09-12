declare type storageListenerHandler = (data: any) => void;
declare class AccrossStorageListener {
    private messages;
    constructor();
    /**
     * 监听 页面消息消息
     * @param msgName 消息名 不能包含 冒号(:)
     * @param handler 消息回调
     */
    on(msgName: string, handler: storageListenerHandler): void;
    /**
     * 发送 跨tab消息
     * @param msgName 消息名 不能包含 冒号(:)
     * @param data 携带的数据
     */
    emit(msgName: string, data?: any, self?: boolean): void;
    remove(msgName: string, handler?: storageListenerHandler): void;
    private emitHandlers;
    /**
     * 发送 页面消息消息
     * @param msgName 消息名 不能包含 冒号(:)
     * @param data json格式字符串，为了 让跨 tab 和 不跨 tab 的数据格式一致。
     */
    private send;
}
declare const messager: AccrossStorageListener;
export default messager;
