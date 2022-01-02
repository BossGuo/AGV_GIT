<template>
  <div>
    <div class="header">
      <div style="float:left;color:#00FFFC;height:6vh;line-height:6vh;margin-top:2vh;">
        <img src="../assets/images/date.png" style="float:left;margin-top:2vh;height:2vh;margin-left:1vw;">
        <div style="margin-left:.5vw;margin-top:.15vh;float:left;"> {{state.day}}&nbsp;{{state.time}}</div>
        <div style="width:.1vw;height:2.5vh;background:#00FDFF;float:left;margin-left:.5vw;margin-top:2vh;"></div>
        <div style="margin-left:.5vw;margin-top:.15vh;float:left;width:3.2vw;"> {{state.weekDay}}</div>
      </div>
      <div class="menu_left" @click="menu_click('AgvDispatch')" @mouseleave="msOut_Event" @mouseover="menu_msIn_Event('AgvDispatch')"
        :class="state.active_menu_key=='AgvDispatch'?'left_menu_active':'left_menu_default'">
        主界面
      </div>
      <div class="menu_left" @mouseleave="msOut_Event" @mouseover="menu_msIn_Event('xxwh')" :class="state.active_menu_key=='xxwh'?'left_menu_active':'left_menu_default'">
        信息维护
      </div>
      <div style="width:7vw;float:right;color:#00FFFC;height:6vh;line-height:6vh;margin-top:2.8vh;">
        <!--  <el-col :span="8">
          <i class="el-icon-message-solid imgbaojing" @click="menu_click('AlarmList')"></i>
            <span class="alarms">{{alarms_Data.length}}</span>  
        </el-col>
        <el-col :span="8" class="eluser">
          <i class="el-icon-s-custom icustom"></i>
          <p class="zhangsan">{{state.UserName}}</p>
        </el-col> -->
        <el-col :span="8">
          <img src="../assets/images/exit_sys.png" @click="exit_sys_Event" style="float:right;margin-right:-6vw;margin-top:0.7vh;height:3.2vh;cursor:pointer;">
        </el-col>
      </div>
      <div class="menu_right right" @mouseleave="msOut_Event" @mouseover="menu_msIn_Event('gongju')" :class="state.active_menu_key=='gongju'?'right_menu_active':'right_menu_default'">
        工具箱
      </div>
      <div class="menu_right" @click="menu_click('Analysis')" @mouseleave="msOut_Event" @mouseover="menu_msIn_Event('Analysis')"
        :class="state.active_menu_key=='Analysis'?'right_menu_active':'right_menu_default'">
        统计分析
      </div>
      <div class="menu_right" @mouseleave="msOut_Event" @mouseover="menu_msIn_Event('xxcx')" :class="state.active_menu_key=='xxcx'?'right_menu_active':'right_menu_default'">
        信息查询
      </div>
    </div>
    <div style="height:8vh;background:#01032c;"></div>
    <mapview></mapview>
    <router-view />
    <div @mouseleave="menuItem_mse_out_Event" @mouseover="menu_msIn_Event('xxcx')" class="xxcx_menu_conotainer" v-if="state.active_Menu_Container_Key=='xxcx'">
      <div class="ment_item" @click="menu_click('HistoryAlarm')">历史报警</div>
      <div class="ment_item" @click="menu_click('HistoryTask')">历史任务</div>
      <div class="ment_item" @click="menu_click('Runtime_sstx')">实时通信日志</div>
      <div class="ment_item" @click="menu_click('Runtime_sscz')">实时操作日志</div>
      <div class="ment_item" @click="menu_click('Runtime_ssyx')">实时运行日志</div>
      <div class="ment_item" @click="menu_click('HistoryLogSel')">历史日志查看</div>
    </div>
    <div @mouseleave="menuItem_mse_out_Event" @mouseover="menu_msIn_Event('xxwh')" class="xxwh_menu_conotainer" v-if="state.active_Menu_Container_Key=='xxwh'">
      <div class="ment_item" @click="menu_click('AgvList')">AGV信息</div>
      <div class="ment_item" @click="menu_click('ChargingPile')">充电桩信息</div>
      <div class="ment_item" @click="menu_click('Parameter')">参数配置</div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { reactive, toRefs } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { getStore, delCookie, removeStore } from '../utils/utils';
import moment from 'moment'
import emitter from 'tiny-emitter/instance'
import mapview from '../components/map.vue'
const router = useRouter()
const state = reactive({
  active_menu_key: "",
  active_Menu_Container_Key: "",
  currentView: 'AgvDispatch',
  day: moment().format("YYYY-MM-DD"),
  time: moment().format("HH:mm:ss"),
  weekDay: "星期",
  UserName: "",
  alarms_Data: []
})
const menu_click = (name) => {
  router.push(name);
  if (name == "HistoryAlarm") {
    state.active_menu_key = "baojing";
    menu_msIn_Event("baojing");
  }
  menuItem_mse_out_Event();
}
const msOut_Event = () => {
  state.active_menu_key = "";
}
const menu_msIn_Event = (name) => {
  state.active_menu_key = name;
  state.active_Menu_Container_Key = name;
  emitter.emit("show_map_gongju", name);
}
const menuItem_mse_out_Event = () => {
  state.active_Menu_key = "";
  state.active_Menu_Container_Key = "";
}
const exit_sys_Event = () => {
  delCookie("AuthCode");
  removeStore("userInfo");
  window.location.reload();
}
const getweek = () => {
  let week = moment().day()
  switch (week) {
    case 0:
      state.weekDay = '星期日'; return
    case 1:
      state.weekDay = '星期一'; return
    case 2:
      state.weekDay = '星期二'; return
    case 3:
      state.weekDay = '星期三'; return
    case 4:
      state.weekDay = '星期四'; return
    case 5:
      state.weekDay = '星期五'; return
    case 6:
      state.weekDay = '星期六'; return
  }
}
const momenttime = () => {
  setInterval(() => {
    state.time = moment().format("HH:mm:ss");
  }, 1000)
}
onMounted(() => {
  let user = getStore('userInfo');
  state.UserName = JSON.parse(user).UserName;
  router.push('/AgvDispatch');
  // emitter.on('route_Change_Event', val => {
  //   _self.currentView = val;
  // })
  emitter.on("notshow_map_gongju", val => {
    menuItem_mse_out_Event();
  });
  // emitter.on("Alarms_Info_Change_Event", data => {
  //   _self.alarms_Data = data;
  // });
  getweek();
  momenttime();
});
onUnmounted(() => {
  emitter.off('route_Change_Event');
  emitter.off('Alarms_Info_Change_Event');
})
</script>


<style scoped>
.header {
  height: 7.5vh;
  position: absolute;
  width: 100vw;
  background-image: url("../assets/images/title.png");
  background-size: 100% 180%;
  background-repeat: no-repeat;
}
.menu_left {
  width: 7.3vw;
  float: left;
  height: 6vh;
  line-height: 5vh;
  margin-top: 2.5vh;
  text-align: center;
}
.menu_right {
  width: 7.3vw;
  float: right;
  height: 6vh;
  line-height: 5vh;
  margin-top: 2.5vh;
  text-align: center;
}
.right {
  margin-right: 0.5vw;
}
.right_menu_default {
  background-image: url("../assets/images/right_menu_default.png");
  background-size: 100% 80%;
  background-repeat: no-repeat;
  color: white;
  cursor: pointer;
  line-height: 44px;
}
.right_menu_active {
  background-image: url("../assets/images/right_menu_active.png");
  background-size: 100% 80%;
  background-repeat: no-repeat;
  color: white;
  cursor: pointer;
  line-height: 44px;
}

.left_menu_default {
  background-image: url("../assets/images/left_menu_default.png");
  background-size: 100% 80%;
  background-repeat: no-repeat;
  color: white;
  cursor: pointer;
  line-height: 44px;
}
.left_menu_active {
  background-image: url("../assets/images/left_menu_active.png");
  background-size: 100% 80%;
  background-repeat: no-repeat;
  color: white;
  cursor: pointer;
  line-height: 44px;
}
.ment_item {
  height: 4vh;
  line-height: 4vh;
  background: #00a7c7;
  cursor: pointer;
  text-align: center;
}

.ment_item:hover {
  background: #06d4fb;
}

.xxcx_menu_conotainer {
  height: 15vh;
  width: 6vw;
  position: absolute;
  right: 23.3vw;
  top: 7.3vh;
  z-index: 200;
  color: white;
}

.xxwh_menu_conotainer {
  height: 15vh;
  width: 6vw;
  position: absolute;
  left: 23.4vw;
  top: 7.3vh;
  z-index: 200;
  color: white;
}
span.alarms {
  position: absolute;
  top: 24px;
  right: 94px;
  background: tomato;
  border-radius: 80%;
  font-size: 12px;
  padding: 2px 4px;
  line-height: 1.2em;
}
.imgbaojing {
  font-size: 32px;
  cursor: pointer;
}
.radius {
  width: 35px;
  margin-top: 2px;
  margin-left: 5px;
  text-align: center;
}
.eluser {
  margin-top: -5px;
  margin-right: 5px;
}
.icustom {
  font-size: 26px;
  margin-left: 10px;
  cursor: pointer;
}
.zhangsan {
  position: absolute;
  margin-top: -20px;
  margin-left: 5px;
  font-size: 12px;
  line-height: 1.2em;
}
</style>