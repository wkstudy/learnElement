# 组件设计总结

## 锦上添花
1. aria-*  、role属性的使用，为视觉障碍人士提供（role的一种更为实用的使用场景为作为document.queryselector()的参数，找到某些元素）
2. 键盘快捷键的设置（如tab 、enter、上下左右、etc）

## radio
1. 主要依赖v-model完成整体功能
2. 涉及到v-model 、provide/inject等vue api的使用
3. 隐藏input, 使用span完成单选按钮功能，会在样式上可控性更好
4. 使用场景通常为一组radio, 因此拆分了radio、radio-group组件

## checkbox
1. 主要依赖v-model完成整体功能
2. 涉及到v-model 、provide/inject等vue api的使用
3. 隐藏input, 使用span完成单选按钮功能，会在样式上可控性更好
4. 使用场景通常为一组checkbox, 因此拆分了radio、radio-group组件

## switch
1. switch和一个单独使用的checkbox的作用是一样的，因此这里也使用了<input type='checkbox'>
2. 主要依赖v-model完成整体功能
3. 逻辑并不复杂，但重点在页面结构、布局的设计（after伪元素的使用、transiton动画)

## loading
1. 弹窗类组件实现思路有两种
   1. 使用directive，每次loading的parentnode update时，动态的更新
   2. 使用extend()，生成一个loading实例，暴露loading、close两个方法，用户自己调用
2. 主要使用的dircetive指令和extend() 完成功能
3. 主要思路做一个loading组件，给parentnode改变`position: relative/fixed`,loading 组件大小、是否显示依赖于传递的参数和parentnode的大小
