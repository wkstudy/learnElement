/**
 * 
 * 作用： 让特定组件触发emit事件
 * dispatch 指定名为componentName的组件触发emit
 * broadcast 让调用该函数的所有名为componentName的子孙组件触发emit
 */


// 递归的查找当前组件的children组件及孙辈组件，使得每一个componentName组件触发emit事件
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    // 向上递归直到根组件，找到第一个组件名为componentName的祖辈组件emit， 若没找到则不触发
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
