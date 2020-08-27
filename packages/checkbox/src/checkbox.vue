<template>
  <label
    class="el-checkbox"
    :class="[
      border && checkboxSize ? 'el-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked }
    ]"
    :id="id"
  >
    <span class="el-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
      :tabindex="indeterminate ? 0 : false"
      :role="indeterminate ? 'checkbox' : false"
      :aria-checked="indeterminate ? 'mixed' : false"
    >
      <span class="el-checkbox__inner"></span>
      <!-- 只有一个checkbox的情况 -->
      <input
        v-if="trueLabel || falseLabel"
        class="el-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
      <input
        v-else
        class="el-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
    </span>
    <span class="el-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElCheckbox',

    mixins: [Emitter],

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    componentName: 'ElCheckbox',

    data() {
      return {
        selfModel: false, // 默认checkbox的值
        focus: false,
        isLimitExceeded: false
      };
    },

    computed: {
      model: {   
        get() {
          return this.isGroup
            ? this.store : this.value !== undefined
              ? this.value : this.selfModel;
        },

        set(val) {
          if (this.isGroup) {
            // 有checkboxgroup的话，val为数组（被选中的值）
            this.isLimitExceeded = false;
            (this._checkboxGroup.min !== undefined &&
              val.length < this._checkboxGroup.min &&
              (this.isLimitExceeded = true));

            (this._checkboxGroup.max !== undefined &&
              val.length > this._checkboxGroup.max &&
              (this.isLimitExceeded = true));

            // 此处的两个input触发事件应该是为了完成v-model在组件里的使用（v-model默认监听value和input）
            this.isLimitExceeded === false &&
            this.dispatch('ElCheckboxGroup', 'input', [val]);
          } else {
            this.$emit('input', val);
            this.selfModel = val;
          }
        }
      },
      isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          // checkbox 只有一个
          // 比较特殊的一点，如果checkbox的值为true（boolean）， 会直接被当作选中状态
          return this.model;
        } else if (Array.isArray(this.model)) {
          // checkbox >= 2
          return this.model.indexOf(this.label) > -1;
        } else if (this.model !== null && this.model !== undefined) {
          // checkbox只有一个
          return this.model === this.trueLabel;
        }
      },

      // 查找上层是否有checkboxgroup， 如果有就用_checkBoxGroup属性保存checkboxgroup元素
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElCheckboxGroup') {
            parent = parent.$parent;
          } else {
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },

      store() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      },

      /* used to make the isDisabled judgment under max/min props */
      // checkbox 触发 min max， 变成disabled状态
      isLimitDisabled() {
        const { max, min } = this._checkboxGroup;
        // 设置了max min的前提下， 当达到max，但当前这个checkbox没被选中或者达到min，当前这个checkbox被选中了，此时这个checkbox的isLimitDisabled 返回true
        return !!(max || min) &&
          (this.model.length >= max && !this.isChecked) ||
          (this.model.length <= min && this.isChecked);
      },

      isDisabled() {
        return this.isGroup
          ? this._checkboxGroup.disabled || this.disabled || (this.elForm || {}).disabled || this.isLimitDisabled
          : this.disabled || (this.elForm || {}).disabled;
      },

      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },

      checkboxSize() {
        const temCheckboxSize = this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
        return this.isGroup
          ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize
          : temCheckboxSize;
      }
    },

    props: {
      value: {},
      label: {},
      indeterminate: Boolean,
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number],
      id: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
      controls: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
      border: Boolean,
      size: String
    },

    methods: {
      // 当设置checked后， 给model(input的value值）初始化
      addToStore() {
        if (
          Array.isArray(this.model) &&
          this.model.indexOf(this.label) === -1
        ) {
          this.model.push(this.label);
        } else {
          this.model = this.trueLabel || true;
        }
      },
      handleChange(ev) {
        if (this.isLimitExceeded) return;
        let value;
        if (ev.target.checked) {
          value = this.trueLabel === undefined ? true : this.trueLabel;
        } else {
          value = this.falseLabel === undefined ? false : this.falseLabel;
        }
        // 此处的change事件是为了暴露给用户，获取值
        // 只有一个值时， 该checkbox的值能够在boolean+true-label/false-label里选择
        this.$emit('change', value, ev);
        this.$nextTick(() => {
          if (this.isGroup) {
            this.dispatch('ElCheckboxGroup', 'change', [this._checkboxGroup.value]);
          }
        });
      }
    },

    created() {
      // 当组件传了 checked 后， 对model值进行初始化
      // checked 属性的唯一作用是如果设置的话触发 addToStore方法
      this.checked && this.addToStore();
    },
    mounted() { // 为indeterminate元素 添加aria-controls 属性
      if (this.indeterminate) {
        this.$el.setAttribute('aria-controls', this.controls);
      }
    },

    watch: {
      value(value) {
        this.dispatch('ElFormItem', 'el.form.change', value);
      }
    }
  };
</script>
