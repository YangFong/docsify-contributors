# docsify-contributors

<p align="center">
  <img src="https://docsify.js.org/_media/icon.svg" />
</p>

## 使用

添加 JS：

```html
<script src="//cdn.jsdelivr.net/npm/docsify-contributors@latest/dist/index.min.js"></script>
```

参数：

```js
window.$docsify = {
  contributors: {
    repo: "YangFong/docsify-contributors",
    ignores: [],
    style: {
      color: "#ffffff",
      bgColor: "#404040",
    },
    image: {
      size: 30,
      isRound: true,
      margin: "0.5em",
    },
  },
};
```

## 配置

| 属性            | 类型     | 说明                     | 默认值 | 示例                              |
| --------------- | -------- | ------------------------ | ------ | --------------------------------- |
| repo            | string   | 当前站点仓库信息（必填） | ——     | `"YangFong/docsify-contributors"` |
| ignores         | string[] | 需要忽略展示的文件       | []     | `['/README.md']`                  |
| [style](#style) | {}       | 见下文                   |        |                                   |
| [image](#image) | {}       | 见下文                   |        |                                   |

### style

| 属性    | 类型    | 说明                   | 默认值    |
| ------- | ------- | ---------------------- | --------- |
| color   | string  | 贡献者名称颜色         | `#ffffff` |
| bgColor | string  | 伪元素背景色           | `#404040` |

### image

| 属性    | 类型    | 说明                      | 默认值  | 示例    |
| ------- | ------- | ------------------------- | ------- | ------- |
| size    | number  | 头像大小尺寸              | `30`    |         |
| isRound | boolean | 是否使用圆形头像    | `true`  |         |
| margin  | string  | 头像外边距，使用 CSS 格式 | `0.5em` | `0 1em` |
