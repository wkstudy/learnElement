# radio-button
> 和radio组件内容大体相同，此处不再详述

## 页面结构（html）

```
<label>
    <input>
    <span></span>
</label>
```
* 此处文字和按钮是在一起的，因此只需要一个span就可以
* input 通过position、opacity 、z-index 隐藏起来
---
# radio-group
## 逻辑设计（js）
1. __[vue api 动态组件]__ `api <compoment :is='xx'></component>` 动态组件 这里是决定<el-radio-group>元素的tag是什么（默认div),这里的组件设计涉及到了$vnode的结构
2. __[vue api \$el]__  `this.$el` 指当前这个this实例


