<template>
  <div style="height:100vh;width:100vw;background:#2f3b48;text-align:center;">
    <div class="loginForm">
      <div>RCS监控系统</div>
      <el-form ref="loginFormDom" label-position="center" label-width="100px" :model="loginForm" style="margin-top:4vh;">
        <el-form-item label="登录账号：" prop="username" :rules="[{ required: true, message: '登录账号不能为空',trigger: 'blur'}]" style="width:20vw;">
          <el-input v-model=" loginForm.username" @keyup.enter="Login"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password" :rules="[{ required: true, message: '密码不能为空',trigger: 'blur'}]" style="width:20vw;margin-top:4vh;">
          <el-input ref="pass_ipt" v-model="loginForm.password" show-password @keyup.enter="Login"></el-input>
        </el-form-item>
        <el-form-item style="width:25vw;">
          <el-button type="primary" @click="Login">登录</el-button>
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { LoginIn } from '../service/getData'
import { setCookie, setStore } from '../utils/utils';
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'
import emitter from 'tiny-emitter/instance'
const loginForm = reactive({
  username: '',
  password: ''
});
const loginFormDom = ref(null);
const store = useStore();
const router = useRouter();
const Login = () => {
  loginFormDom.value.validate((valid) => {
    if (valid) {
      LoginIn(loginForm).then(res => {
        let meThods = res.data.code == 0 ? () => {
          setCookie("AuthCode", res.data.data.AuthCode)
          setStore('userInfo', res.data.data);
          store.dispatch("SetCurrentUserInfo", loginForm).then(res => {
            emitter.emit("change_IsLogin_Event", true);
          })
        } : () => {
          ElMessage.error('帐号或密码错误，请重新输入');
          loginForm.password = '';
          // const pass_ipt = ref(null);
          // pass_ipt.focus();
        };
        meThods();
      })
    } else {
      ElMessage.error('请按规则填写用户名和密码之后再进行登录操作');
      return false;
    }
  })
}
const resetForm = () => {
  loginFormDom.value.resetFields();
}
</script>

<style scoped>
.loginForm :deep(.el-form-item__label) {
  color: white !important;
}
.loginForm > div {
  height: 6vh;
  line-height: 6vh;
  font-size: 2vw;
  color: white;
}
</style>