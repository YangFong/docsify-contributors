# docsify-contributors

<p align="center">
  <img src="https://docsify.js.org/_media/icon.svg" />
</p>

## 使用

添加 JS

```html
<script src="https://cdn.jsdelivr.net/npm/docsify-contributors@latest/dist/contributors.min.js"></script>
```

## 配置

| 属性    | 类型     | 说明                                 | 默认值         |
| ------- | -------- | ------------------------------------ | -------------- |
| owner   | string   | 用户或组织名称                       | doocs          |
| repo    | string   | 仓库名称                             | leetcode       |
| ignores | string[] | 需要忽略展示的文件，开头需要加上 `/` | ["/README.md"] |
| style   | {}       | 样式控制，见下文                     |                |

## style

| 属性    | 类型    | 说明             | 默认值  |
| ------- | ------- | ---------------- | ------- |
| color   | string  | 贡献者名称颜色   | #ffffff |
| bgColor | string  | 伪元素背景色     | #404040 |
| isRound | boolean | 是否使用圆形头像 | true    |
