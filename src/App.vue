<template>
  <div>
    <Home v-if="isLogin"></Home>
    <Login v-else></Login>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { GetCurrentUserInfo } from './service/getData'
import emitter from 'tiny-emitter/instance'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

const isLogin = ref(false);
onBeforeMount(() => {
  GetCurrentUserInfo().then(res => {
    isLogin.value = !(res == null);
  })
});
onMounted(() => {
  emitter.on('change_IsLogin_Event', val => {
    isLogin.value = val;
  });
});
onUnmounted(() => {
  emitter.off('change_IsLogin_Event');
})
</script>

<style>
@import "./assets/css/app.css";
</style>
