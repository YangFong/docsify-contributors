# docsify-contributors

[![npm version](https://img.shields.io/npm/v/docsify-contributors)](https://www.npmjs.com/package/docsify-contributors)
[![npm `downloads`](https://img.shields.io/npm/dm/docsify-contributors)](https://www.npmjs.com/package/docsify-contributors)

<p align="center">
  <img src="https://docsify.js.org/_media/icon.svg" />
</p>

## 触发

在 `afterEach()`（文档解析完成）完毕后，在末尾插入容器元素；

在 `doneEach()` 中读取当前文件 commits，过滤出其中的贡献者，再加入容器当中。

## 效果

> 已使用该插件仓库站点：[doocs/leetcode](https://doocs.github.io/leetcode/#/)

![demo](./images/demo.gif)

## 使用

添加 JS：

```html
<script src="//cdn.jsdelivr.net/npm/docsify-contributors@latest/dist/index.min.js"></script>
```

参数：

```js
window.$docsify = {
    contributors: {
        repo: 'YangFong/docsify-contributors',
        ignores: [],
        style: {
            color: '#ffffff',
            bgColor: '#404040'
        },
        image: {
            size: 30,
            isRound: true,
            margin: '0.5em'
        },
        load: {
            isOpen: true,
            color: "#009999"
        }
    }
};
```

## 配置

| 属性            | 类型     | 说明                     | 默认值 | 示例                              |
| --------------- | -------- | ------------------------ | ------ | --------------------------------- |
| repo            | string   | 当前站点仓库信息（必填） | ——     | `"YangFong/docsify-contributors"` |
| ignores         | string[] | 需要忽略展示的文件       | []     | `['/README.md']`                  |
| [style](#style) | {}       | 见下文                   |        |                                   |
| [image](#image) | {}       | 见下文                   |        |                                   |
| [load](#load)   | {}       | 见下文                   |        |                                   |

### style

| 属性    | 类型   | 说明           | 默认值    |
| ------- | ------ | -------------- | --------- |
| color   | string | 贡献者名称颜色 | `#ffffff` |
| bgColor | string | 伪元素背景色   | `#404040` |

### image

| 属性    | 类型    | 说明                      | 默认值  | 示例    |
| ------- | ------- | ------------------------- | ------- | ------- |
| size    | number  | 头像大小尺寸              | `30`    |         |
| isRound | boolean | 是否使用圆形头像          | `true`  |         |
| margin  | string  | 头像外边距，使用 CSS 格式 | `0.5em` | `0 1em` |

### load

> `1.7.0` 新增，源自 [react-loadingg](https://github.com/Summer-andy/react-loading)

| 属性   | 类型    | 说明             | 默认值    | 示例 |
| ------ | ------- | ---------------- | --------- | ---- |
| isOpen | boolean | 是否开启加载动画 | `false`   |      |
| color  | string  | 加载动画物块颜色 | `#009999` |      |
