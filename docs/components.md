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