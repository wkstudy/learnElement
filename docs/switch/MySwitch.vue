<template>
  <div
    @click="handleClick"
    :class="[
      'el-switch',
      isDisabled ? 'disabled': 'normal'
    ]"
    @mouseenter='handleMouseEnter'
    @mouseleave='handleMouseLeave'
  >
    <div
      :class="[
        'el-switch__icon',
      ]"
      :style="isChecked ? 'background-color:' + activeColor : 'background-color:' + inactiveColor"
    >
      <div
        class="el-switch__icon__inner"
        :style="styleIcon"
      >
        <div
          class="el-switch__icon__round"
          ref="round"
          :style="styleRound"
        ></div>
      </div>
      <transition name="fade">
        <div v-show="showPrompt && activeValue" class="el-switch__icon__prompt">{{promptValue}}</div>
      </transition>
    </div>
    <span
      v-if="isChecked"
      :class="[
        'el-switch__text',
        'el-switch__text--active'
      ]"
    >{{acitveText}}</span>
    <span
      v-else
      :class="[
        'el-switch__text'
      ]"
    >{{inactiveText}}</span>
  </div>
</template>
<script>
// :style="isChecked ? 'left: 0' : 'left: calc(100% - 15px)'"
export default {
  name: 'MySwitch.vue',
  props: {
    value: [Boolean, String, Number],
    acitveText: String,
    inactiveText: String,
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    activeColor: String,
    inactiveColor: String,
    width: {
      type: Number,
      default: 40
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      styleIcon: {
        width: this.width + 'px'
      },
      styleRound: {
        left: ''
      },
      showPrompt: false
    }
  },
  created () {
    // 初始化圆的位置
    if (this.isChecked) {
      this.styleRound.left = this.width - 1 - 15 + 'px';
    } else {
      this.styleRound.left = '1px';
    }
  },
  computed: {
    isChecked () {
      if (typeof(this.value) === 'boolean') {
        return this.value
      } else if (this.value === this.activeValue) {
        return true;
      } else {
        //  this.value === this.inactiveValue
        return false;
      }
    },
    isDisabled () {
      return (this.formItem || {}).disabled || this.disabled;
    },
    // 弹出文字
    promptValue () {
      return this.isChecked ? this.activeValue : this.inactiveValue;
    }
  },
  methods: {
    handleClick () {
      // 如果是disable状态下 禁止触发
      if (this.isDisabled) {
        return false;
      }

      let v;
      if (typeof(this.value) === 'boolean') {
        v = !this.value;

        if (v) {
          // 圆 距离左右两边 2px, 直径为15px
          this.move(this.$refs.round, 2, this.width - 2 - 15, 20);
        } else {
          this.move(this.$refs.round, this.width - 2 - 15, 2, 20);
        }
      } else if (this.value === this.activeValue) {
        v = this.inactiveValue;
        this.move(this.$refs.round, this.width - 2 - 15, 2, 20);
      } else {
        v = this.activeValue;
        this.move(this.$refs.round, 2, this.width - 2 - 15, 20);
      }
  
      this.$emit('input', v);
      this.$emit('change', v);
      // 抛出给 formitem


    },
    // 移动动画
    move (dom, start, end, steps,) {
      let pos = start;
      if (start < end) {
        let id = setInterval(() => {
          if (pos < end) {
            dom.style.left = pos + 'px';
            pos += steps;
          } else {
            dom.style.left = end + 'px';
            clearInterval(id);
          }
        }, 60);
      } else {
        let id = setInterval(() => {
          if (pos > end) {
            dom.style.left = pos + 'px';
            pos -= steps;
          } else {
            dom.style.left = end + 'px';
            clearInterval(id);
          }
        }, 60);
      }
    },
    handleMouseEnter () {
      // 如果是disable状态下 禁止触发
      if (this.isDisabled) {
        return false;
      }
      this.showPrompt = true
    },
    handleMouseLeave () {
      // 如果是disable状态下 禁止触发
      if (this.isDisabled) {
        return false;
      }
      this.showPrompt = false
    },
  },
}
</script>
<style lang="less" scoped>
.el-switch {
  height: 20px;
  border-radius: 10px;

  .el-switch__icon {
    height: 20px;
    display: inline-block;
    border-radius: 10px;
    margin-right: 10px;
    text-align: center;   
    vertical-align: middle;
    position: relative;

    .el-switch__icon__inner {
      top: calc(50% - 7.5px);
      width: 100%;
      position: relative;
      height: 15px;

      .el-switch__icon__round {
        box-sizing: border-box;
        background-color: #fff;
        width: 15px;
        height: 15px;
        border-radius: 7.5px;
        position: absolute;
      }
    }

    .el-switch__icon__prompt {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -150%;
      background-color: black;
      color: white;
      padding: 3px 5px;
    }
    
  }

  .el-switch__text {
    width: 30px;
  }

  .el-switch__text--active {
    color: #409EFF;
  }
}
.disabled {
  cursor: not-allowed;
  opacity: .5;
}
.normal {
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>