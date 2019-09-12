"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var storageNamespace = 'storage-listener';
var AccrossStorageListener = /** @class */ (function () {
    function AccrossStorageListener() {
        var _this = this;
        // 在当前tab页，和不在当前tab页，消息不同。
        this.messages = {};
        window.addEventListener('storage', function (event) {
            var eventScheme = event.key.split(':');
            var namespace = eventScheme[0];
            if (namespace === storageNamespace) {
                var data = JSON.parse(JSON.parse(event.newValue).data);
                var msgName = eventScheme[1];
                _this.emitHandlers(msgName, data);
            }
        });
    }
    /**
     * 监听 页面消息消息
     * @param msgName 消息名 不能包含 冒号(:)
     * @param handler 消息回调
     */
    AccrossStorageListener.prototype.on = function (msgName, handler) {
        var handlers = this.messages[msgName];
        this.messages[msgName] = Array.isArray(handlers) ? handlers.concat([handler]) : [handler];
    };
    /**
     * 发送 跨tab消息
     * @param msgName 消息名 不能包含 冒号(:)
     * @param data 携带的数据
     */
    AccrossStorageListener.prototype.emit = function (msgName, data, self) {
        if (data === void 0) { data = ''; }
        if (self === void 0) { self = false; }
        this.send(msgName, JSON.stringify(data), self);
    };
    AccrossStorageListener.prototype.remove = function (msgName, handler) {
        if (handler === undefined) {
            // 删除所有
            delete this.messages[msgName];
        }
        else {
            var handlers = this.messages[msgName];
            if (Array.isArray(handlers)) {
                var index = handlers.indexOf(handler);
                if (index === -1) {
                    console.warn("\u6CA1\u6709\u76D1\u542C localStorage: [" + msgName + "], handler: [" + handler + "]");
                }
                else {
                    handlers.splice(index, 1);
                    if (handlers.length === 0) {
                        delete this.messages[msgName];
                    }
                }
            }
            else {
                console.warn("\u6CA1\u6709\u76D1\u542C localStorage: [" + msgName + "]");
            }
        }
    };
    AccrossStorageListener.prototype.emitHandlers = function (msgName, data) {
        // 如果在当前 tab 监听了事件 则 this.messages 中会有相应的 handler
        // 不在当前 tab 监听事件 则 this.messages 中不会有相应的 handler，但在其他 tab 页会有。
        var handlers = this.messages[msgName];
        if (Array.isArray(handlers)) {
            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                var handler = handlers_1[_i];
                handler(data);
            }
        }
    };
    /**
     * 发送 页面消息消息
     * @param msgName 消息名 不能包含 冒号(:)
     * @param data json格式字符串，为了 让跨 tab 和 不跨 tab 的数据格式一致。
     */
    AccrossStorageListener.prototype.send = function (msgName, data, self) {
        if (self === void 0) { self = false; }
        // 在当前 tab 页 不会触发 onstorage 事件
        window.localStorage.setItem(storageNamespace + ":" + msgName, JSON.stringify({
            id: new Date().getTime() + "-" + Math.floor(Math.random() * 1000),
            data: data
        }));
        // 如果在当前 tab 监听了事件 则 this.messages 中会有相应的 handler
        // 在当前页面触发 事件。
        if (self) {
            this.emitHandlers(msgName, data);
        }
    };
    return AccrossStorageListener;
}());
var messager = new AccrossStorageListener();
exports.default = messager;
