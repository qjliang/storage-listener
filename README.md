# 浏览器端消息通知

> 目前测试了 chrome、firefox、safari。

## 安装

```shell
yarn add storage-listener
# or
npm install --save storage-listener
```

## 用法

```javascript
import AcrossStorageListener from 'storage-listener'

// 发送跨 storage 通知, 默认不会通知本tab页。
AcrossStorageListener.emit('event-name', {
    data: 'message data'
})

// 发送跨 storage 通知, 包含本页。
AcrossStorageListener.emit('event-name', {
    data: 'message data'
}, true)


const cb = payload => {
  console.log(payload.data)  // 'message data'
}
// 在任意位置监听通知
AcrossStorageListener.on('event-name', cb)

// 删除监听
AcrossStorageListener.delete('event-name', cb)
// or 全部删除
AcrossStorageListener.delete('event-name')
```

```shell
yarn build && yarn publish
```
