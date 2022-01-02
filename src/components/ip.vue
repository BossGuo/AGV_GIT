<template>
  <div class="ip-box">
    <el-input v-model="state.ip1" name="ip" maxlength="4" size="mini" onkeyup="value=value.replace(/[^\d]/g,'')" @keyup="keyupEvent(1,$event)" @blur="submitIp" @input="(val) => checkVal(val,'1')"
      ref="ipinput1">
    </el-input>
    <div class="ip-dot"></div>
    <el-input v-model="state.ip2" name="ip" maxlength="4" size="mini" onkeyup="value=value.replace(/[^\d]/g,'')" @keyup="keyupEvent(2,$event)" @blur="submitIp" @input="(val) => checkVal(val,'2')"
      ref="ipinput2">
    </el-input>
    <div class="ip-dot"></div>
    <el-input v-model="state.ip3" name="ip" maxlength="4" size="mini" onkeyup="value=value.replace(/[^\d]/g,'')" @keyup="keyupEvent(3,$event)" @blur="submitIp" @input="(val) => checkVal(val,'3')"
      ref="ipinput3">
    </el-input>
    <div class="ip-dot"></div>
    <el-input v-model="state.ip4" name="ip" maxlength="4" size="mini" onkeyup="value=value.replace(/[^\d]/g,'')" @keyup="keyupEvent(4,$event)" @blur="submitIp" @input="(val) => checkVal(val,'4')"
      ref="ipinput4">
    </el-input>
    <!-- <i class="el-icon-circle-close" @click="clearValue"></i> -->
  </div>
</template>
<script setup>
import { onMounted, ref, inject, nextTick, watch } from 'vue'
import { reactive, toRefs } from '@vue/reactivity'
import emitter from 'tiny-emitter/instance'
const state = reactive({
  Ip: '',
  ip1: null,
  ip2: null,
  ip3: null,
  ip4: null
})
const ipinput1 = ref(null);
const ipinput2 = ref(null);
const ipinput3 = ref(null);
const ipinput4 = ref(null);
// const clearValue = () => {
//   state.ip1 = null;
//   state.ip2 = null;
//   state.ip3 = null;
//   state.ip4 = null;
// }
const submitIp = () => {
  //失去焦点判断值是否输入完整，并向父组件传整个ip值
  if (state.ip1 && state.ip2 && state.ip3 && state.ip4) {
    let ipVal = state.ip1 + '.' + state.ip2 + '.' + state.ip3 + '.' + state.ip4;
    emitter.emit('getIpVal', ipVal);
    // this.$parent.$emit("el.form.change"); //这是防止elementui的form表单验证必填项时显示文字的也就是required,用不到可不写
  }
}
const checkVal = (val, key) => {
  if (parseInt(val) > 255) {
    switch (key) {
      case "1":
        state.ip1 = 255;
        ipinput2.value.focus();
        break;
      case "2":
        state.ip2 = 255;
        ipinput3.value.focus();
        break;
      case "3":
        state.ip3 = 255;
        ipinput4.value.focus();
        break;
      case "4":
        state.ip4 = 255;
        break;
      default:
        break;
    }
  } else if (parseInt(val) <= 255 && parseInt(val) >= 100) {
    switch (key) {
      case "1":
        ipinput2.value.focus();
        break;
      case "2":
        ipinput3.value.focus();
        break;
      case "3":
        ipinput4.value.focus();
        break;
      default:
        break;
    }
  }
}
const keyupEvent = (index, e) => {
  if (e.keyCode === 37 || e.keyCode === 38) {
    if (index == 2) {
      ipinput1.value.focus();
    } else if (index == 3) {
      ipinput2.value.focus();
    } else if (index == 4) {
      ipinput3.value.focus();
    }
  }
  if (e.keyCode === 39 || e.keyCode === 40) {
    if (index == 1) {
      ipinput2.value.focus();
    } else if (index == 2) {
      ipinput3.value.focus();
    } else if (index == 3) {
      ipinput4.value.focus();
    }
  }
}
const splitIp = () => {
  if (state.Ip) {
    let ipList = state.Ip.split('.');
    state.ip1 = ipList[0];
    state.ip2 = ipList[1];
    state.ip3 = ipList[2];
    state.ip4 = ipList[3];
  }
}
watch(() => state.Ip, () => {
  console.log(state.Ip);
  splitIp();
})
onMounted(() => {
  state.Ip = inject('IpAddress');
  splitIp();
});
</script>
<style scoped>
.ip-box {
  width:200px;
  display: flex;
  align-items: cneter;
  position: relative;
  margin-top: 5px;
}
.ip-box :deep(.el-input__inner) {
  border: 0 !important;
}
.ip-box :deep(.el-input) {
  text-align: flex-start;
  width: 50px;
}
.ip-dot {
  width: 1px;
  height: 3px;
}
/* .el-icon-circle-close {
  color: #fff;
  display: none;
  font-size: 12px;
  cursor: pointer;
  position: absolute;
  right: 2px;
}
.el-icon-circle-close {
  display: inline-block;
} */
</style>

