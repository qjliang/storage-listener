"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var storageNamespace = 'storage-listener';
var AccrossStorageListener = /** @class */ (function () {
    function AccrossStorageListener() {
        var _this = this;
        // 在当前页，和不在当前页，消息不同。
        this.notifyMsg = {};
        window.addEventListener('storage', function (event) {
            var eventScheme = event.key.split(':');
            var namespace = eventScheme[0];
            if (namespace === storageNamespace) {
                var data = JSON.parse(JSON.parse(event.newValue).data);
                var msgName = eventScheme[1];
                _this.emitCallback(msgName, data);
            }
        });
    }
    AccrossStorageListener.prototype.emitCallback = function (infoName, data) {
        // 如果在当前 页 监听了事件 则 this.notifyMsg 中会有相应的 cb
        // 不在当前 页 监听事件 则 this.notifyMsg 中不会有相应的 cb，但在其他 tab 页会有。
        var cbs = this.notifyMsg[infoName];
        if (Array.isArray(cbs)) {
            for (var _i = 0, cbs_1 = cbs; _i < cbs_1.length; _i++) {
                var cb = cbs_1[_i];
                cb(data);
            }
        }
    };
    /**
     * 发送 页面消息消息
     * @param infoName 消息名
     * @param data json格式字符串，为了让跨页 和 不跨页 的数据格式一致。
     */
    AccrossStorageListener.prototype.action = function (infoName, data, self) {
        if (self === void 0) { self = false; }
        // 在当前页不会触发 onstorage 事件
        window.localStorage.setItem(storageNamespace + ":" + infoName, JSON.stringify({
            id: new Date().getTime() + "-" + Math.floor(Math.random() * 1000),
            data: data
        }));
        // 如果在当前页监听了事件 则 this.notifyMsg 中会有相应的 cb
        // 在当前页面触发 事件。
        if (self) {
            this.emitCallback(infoName, data);
        }
    };
    /**
     * 监听 页面消息消息
     * @param infoName 消息名
     * @param cb 消息回调
     */
    AccrossStorageListener.prototype.on = function (infoName, cb) {
        var info = this.notifyMsg[infoName];
        this.notifyMsg[infoName] = Array.isArray(info) ? __spreadArrays(info, [cb]) : [cb];
    };
    /**
     * 发送 跨页消息
     * @param infoName 消息名
     * @param data 携带的数据
     */
    AccrossStorageListener.prototype.emit = function (infoName, data, self) {
        if (data === void 0) { data = ''; }
        if (self === void 0) { self = false; }
        this.action(infoName, JSON.stringify(data), self);
    };
    AccrossStorageListener.prototype.delete = function (infoName, cb) {
        if (cb === undefined) {
            // 删除所有
            // Reflect.deleteProperty(this.notifyMsg, infoName)
            delete this.notifyMsg[infoName];
        }
        else {
            var callbacks = this.notifyMsg[infoName];
            if (Array.isArray(callbacks)) {
                var index = callbacks.indexOf(cb);
                if (index === -1) {
                    console.warn("\u6CA1\u6709\u76D1\u542C localStorage: [" + infoName + "], handler: [" + cb + "]");
                }
                else {
                    callbacks.splice(index, 1);
                    if (callbacks.length === 0) {
                        delete this.notifyMsg[infoName];
                    }
                }
            }
            else {
                console.warn("\u6CA1\u6709\u76D1\u542C localStorage: [" + infoName + "]");
            }
        }
    };
    return AccrossStorageListener;
}());
var notifyMessage = new AccrossStorageListener();
exports.default = notifyMessage;
