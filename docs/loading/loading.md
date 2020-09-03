# loading

## 前言
loading的实现方法有两种：使用v-loading(Vue.directive实现）、使用this.$loading（Vue.extend实现）

大体完成，以后有时间还要在看一遍，提升总结内容的深度+ 解决阅读代码过程的疑问+完成todo

---
## 页面结构（html）

```
<transition>
    <div 1>
        <div 2>
            <svg v-if>
                <circle></circle>
            </svg>
            <i v-else></i>
            <p><p>
        </div>
    <div>
</transition>
```
* div 1 是loading的外层包裹
* div 2 存放loading的内容
  * 默认是显示一个svg 图片， 用户也可传入一个`.element-loading-spinner`（放到i元素中）来代替svg
  * 用户也可上传一段文字放到p元素中
---
## 布局设计（css)
* 实现loading
  * loading 加载的时候会给他的parentnode 添加一个`position: relative`的属性
  * div 1 是`position: absolute; left/right/top/bottom: 0`，当有fullscreen属性时，会赋予div 1 一个is-fullscreen 类，把div 改为`position: fixed`

---
## 逻辑设计（js）
1. __[vue api  extend]__  
    * extend的参数是包含组件选项的对象
    * 返回一个构造器函数，new Vue.extend() 后返回一个组件实例
    * Vue.component()注册组件其实也调用的extend方法
    * .vue组件也是通过调用Vue.component注册组件的
    * [refer](https://juejin.im/post/6844903798549250055)
    * 使用场景： ？
2. __[设计模式  单例模式]__
    * loading/src/index.js  返回一个fullscreenloading
3. __[vue api $destory]__
    * 用于触发 beforeDestroy 和 destroyed 的钩子
    * 这里使用的场景为`this.loading.close()`，触发close方法时，loading关闭，同时loading(一个vue实例）去除，需要触发$destory方法，
    
4. __[js 原生 方法]__  获得一个元素的位置（top、left、width、height)
```
['top', 'left'].forEach(property => {
    let scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
    // getBoundingClientRect() 获得的是相对于视口的
    // document.body.scrollTop 网页被卷去的高
    // document.documentElement.scrollTop  兼容性考虑 （这两个属性需要再深入了解一下）
    maskStyle[property] = options.target.getBoundingClientRect()[property] +
    document.body[scroll] +
    document.documentElement[scroll] +
    'px';
});
['height', 'width'].forEach(property => {
    maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px';
});
```
5. __[js API  兼容性]__ 
```
document.body.scrollTop
document.documentElement.scrollTop
```
6. __[vue 动画]__ 
7. __[vue api directive]__ 自定义指令
    * 使用场景： 弹窗类组件（点击某个按钮产生的一块页面）
8. __[elementui file]__ 'src/popup' 用来管理所有弹窗类组件，需要结合这些弹窗类组件的特性才能理解，loading 里只用到了这里的z-index值，其他内容等看到其他组件再进一步阅读
---
## 使用规范
```
// 一共两种调用方式：指令、服务
// 指令
<div
    v-loading='loading'
>
</div>

// 服务
// 服务1 elementUI 全部引入（使用this.$loading)
<div
    @click='fn'
>
</div>

fn () {
    this.$loading({
        ...
    })
}

// 服务2 只引入loading
import { Loading } from 'element-ui'
...
<div
    @click='fn'
>
</div>

fn () {
    // 需要时调用
    let loadingInstance = Loading.service(options);
    
    // 关闭时必须是异步的
    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
    loadingInstance.close();
    });
}

```
## 注意事项
* 想要全屏loading，推荐使用v-loading.fullscreen而非v-loading.body， 后者只是把loading元素插入到body上，而body可能不能沾满整个屏幕
---

## 源码注释
* [method-1-directive](../../packages/loading/src/directive.js)
* [method-2-index.js](../../packages/loading/src/index.js)
## 问题
Q: index.js 与directive.js两种方式实现的loading的大小位置计算不一致
```
// directive.js
if (binding.modifiers.body) {
    // 此处计算el的大小和位置考虑的很周全, 可以借鉴一下
    el.originalPosition = getStyle(document.body, 'position');

    ['top', 'left'].forEach(property => {
        const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
        el.maskStyle[property] = el.getBoundingClientRect()[property] +
        document.body[scroll] +
        document.documentElement[scroll] -
        parseInt(getStyle(document.body, `margin-${ property }`), 10) +
        'px';
    });
    ['height', 'width'].forEach(property => {
        el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
    });

    insertDom(document.body, el, binding);
} 
// index.js
if (options.body) {
instance.originalPosition = getStyle(document.body, 'position');
['top', 'left'].forEach(property => {
    let scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
    // getBoundingClientRect() 获得的是相对于视口的
    // document.body.scrollTop 网页被卷去的高
    // document.documentElement.scrollTop  兼容性考虑 （这两个属性需要再深入了解一下）
    maskStyle[property] = options.target.getBoundingClientRect()[property] +
    document.body[scroll] +
    document.documentElement[scroll] +
    'px';
});
['height', 'width'].forEach(property => {
    maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px';
});
}
```
A: 

## todo
* [vue] 动画了解
* [js API 兼容性] document.body.scrollTop document.documentElement.scrollTop
## refer
---
## loading组件设计总结
1. 弹窗类组件实现思路有两种
   1. 使用directive，每次loading的parentnode update时，动态的更新
   2. 使用extend()，生成一个loading实例，暴露loading、close两个方法，用户自己调用
2. 主要使用的dircetive指令和extend() 完成功能
3. 主要思路做一个loading组件，给parentnode改变`position: relative/fixed`,loading 组件大小、是否显示依赖于传递的参数和parentnode的大小
