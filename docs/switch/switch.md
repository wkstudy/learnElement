# switch

## 前言

与之前学习方法不同的是，本次自己尝试实现了一个switch组件，通过将两种方式进行对比来进行学习，加深自己的认识

---
## 页面结构（html）

```
<div>
  <input type='checkbox'>
  <span 1>
    <i></i>
    <span></span>
  </span>
  <span 2></span>
  <span 3>
    <i></i>
    <span></span>
  </span>
</div>
```
* switch很像单独使用的checkbox，这里的input应该是和radio、checkbox里的input作用一样。
* span1 是inactive的文字或者icon展示，span3 是active的文字或者icon展示
* span2 是switch的图形部分，其中的圆形按钮是:after伪元素实现的
---
## 布局设计（css)
1. 动画的实现（after伪元素 + transition）
```
// 左边
element:after {
  left: 1px
}
// 右边
.checked element:after {
  left: 100%;
  margin-left: - radius.size(圆的直径) - 1px
}
```
---
## 逻辑设计（js）
1. __[js 使用技巧]__ `!~[a, b].indexOf(c)`
   1. ! 实现将结果转化为boolean类型
   2. ～ 运算符的使用， 此处需要将-1和其他数值区分，~-1正好为0， 写法更为简洁
---
## 使用规范
```
// 最简单的方式，只使用v-model, 其值为boolean类型
<el-switch v-model="checked"</el-switch>

// 需要进行值的绑定时，使用v-moel配合active-value/inactive-value实现
<el-switch
  v-model="test"
  active-value="111"
  inactive-value="222"
></el-switch>
```
## 注意事项
---

## 源码注释
* [switch](../../packages/switch/src/component.vue)
* [自己实现switch](./MySwitch.vue)
---
## 问题
Q: 为什么执行两次replace，我理解执行一次就可以
```
// src/utils/util.js
export const kebabCase = function(str) {
  const hyphenateRE = /([^-])([A-Z])/g;
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase();
};
```

A: 此函数目的是将驼峰命名改为 kebab-case 命名。第二次replace的目的是解决连续两个大写字母的问题。
```
 const once = function(str) {
   const hyphenateRE = /([^-])([A-Z])/g;
    return str
      .replace(hyphenateRE, '$1-$2')
 }
 const twice = function(str) {
   const hyphenateRE = /([^-])([A-Z])/g;
    return str
      .replace(hyphenateRE, '$1-$2')
      .replace(hyphenateRE, '$1-$2')
 }
 // 对于有连着的两个大写字母
 once('aBBc') // "a-BBc"
 twice('aBBc') // "a-B-Bc"

 Q: 能连着的三个/四个（大于两个）大写字母呢？
 A: 第三个大写字母在第一次replace的时候就被识别了，第四个大写字母在第二次replace的时候被识别，以此类推
once('aBBBc') // "a-BB-Bc"
twice('aBBBc') // "a-B-B-Bc"
once('aBBBBc') // "a-BB-BBc"
twice('aBBBBc') // "a-B-B-B-Bc"
 ```

Q: radio、checkbox、switch我一直以为是点击到了里面的input，触发了change事件才改变值的，但突然发现这里的input经过css处理，是点击不到的，那么每次点击后，value是怎么改变的

A: switch是通过最外层div的click事件触发的，
  radio,checkbox最外层是label，点击label就可以直接触发内层的input。到这里才明白为什么radio/checkbox的外层为啥是个label, 而不是别的元素。

---
## todo
---
## refer
---
## 对比
1. 页面结构（html）
  * 使用input ，焦点事件（整个主要是在放到form中才会使用到的）
  * 使用after伪元素实现圆形按钮
2. 布局设计（css)
  * elementUI使用transiton完成动画效果
3. 逻辑设计（js）
  * 点击改变状态事件
  ```
  // element实现
  @click=fn

  fn () {
    return !this.switchDisabled && this.handleClick()
  }

  // 我
  @click=handleClick
  handleClick () {
    if (this.switchDisabled) {
      ...
    }
  }
  // elementui 的处理更为合适一点， 判断条件本应该是和click事件独立的
  ```
  * 判断switch的状态
  ```
  // 
  created: {
    // element
    checked() {
      return this.value === this.activeValue;
    },
    // 自己
    isChecked () {
      if (typeof(this.value) === 'boolean') {
        return this.value
      } else if (this.value === this.activeValue) {
        return true;
      } else {
        //  this.value === this.inactiveValue
        return false;
    }
    // 自己当时没有想清楚switch的使用规范，导致对于value 和 activeValue/inactiveValue 的数值关系的理解不是很到位，最后写法显得有点麻烦
  }
  ```

## switch组件总结
1. 主要依赖v-model完成整体功能
2. 逻辑并不复杂，但重点在页面结构、布局的设计（after伪元素的使用、transiton动画)