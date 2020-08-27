<template>
  <label
    class="el-radio"
    :class="[
      border && radioSize ? 'el-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span class="el-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="el-radio__inner"></span>
      <input
        ref="radio"
        class="el-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      >
    </span>
    <span class="el-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElRadio',

    mixins: [Emitter],

    // 父及组件可能是 form 或者 formitem, 其某些属性会影响到radio
    inject: {
      elForm: {
        default: ''
      },

      elFormItem: {
        default: ''
      }
    },

    componentName: 'ElRadio',

    props: {
      value: {}, // 单选框的值    v-model和value 都有的情况下，优先取v-model的值  v-model 默认绑定value的prop和input的event
      label: {}, // radio自己的值
      disabled: Boolean,
      name: String,
      border: Boolean,
      size: String
    },

    data() {
      return {
        focus: false
      };
    },
    computed: {
      // 判断外层是否有el-radio-group
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElRadioGroup') {
            parent = parent.$parent;
          } else {
            this._radioGroup = parent;
            return true;
          }
        }
        return false;
      },
      // v-model绑定的值可以是计算属性
      model: {
        // 本来这里应该是prop 传递的value, 但由于“单向数据流”的概念，prop的值不鼓励在子组件中改变值，因此才有了model值
        get() {
          return this.isGroup ? this._radioGroup.value : this.value;
        },
        set(val) {
          if (this.isGroup) {
            this.dispatch('ElRadioGroup', 'input', [val]);
          } else {
            // 配合el-radio的v-model, v-model的值
            this.$emit('input', val);
          }
          this.$refs.radio && (this.$refs.radio.checked = this.model === this.label);
        }
      },
      // 外层formitem的size 影响radio的size
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      // radio size
      // ? this.$ELEMENT   answer: index.js定义： Vue.prototype.$ELEMENT = { size: opts.size || '', zIndex: opts.zIndex || 2000};
      radioSize() {
        const temRadioSize = this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
        return this.isGroup
          ? this._radioGroup.radioGroupSize || temRadioSize
          : temRadioSize;
      },
      // 禁用
      isDisabled() {
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled || (this.elForm || {}).disabled
          : this.disabled || (this.elForm || {}).disabled;
      },
      tabIndex() {
        return (this.isDisabled || (this.isGroup && this.model !== this.label)) ? -1 : 0;
      }
    },

    methods: {
      handleChange() {
        this.$nextTick(() => {
          this.$emit('change', this.model);
          // 找到el-radio-group组件也触发change事件
          this.isGroup && this.dispatch('ElRadioGroup', 'handleChange', this.model);
        });
      }
    }
  };
</script>
