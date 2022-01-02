<template>
  <div class="midiv" v-show="state.ishow">
    <div class="top">
      <p class="title">实时系统操作日志</p>
      <img @click="close" src="../assets/images/close_new.png" class="close" />
      <div style="float:left;">
        <div style="float:left;color:white;margin-left:1vw;line-height:2.6vh;">
          记录方式:&nbsp;
        </div>
        <el-select v-model="state.countortime_sscz" placeholder="请选择" size="mini" style="width:160px;float:left;" @change="countortime_ssczChange">
          <el-option v-for="item in state.countortime_sscz_data" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <div style="float:left;color:white;line-height:2.6vh;">
          =>
          <el-input-number v-model.lazy="countortime_sscz_val" :min="0" :max='9999' @change="countortime_sscz_value_Change" size='mini' />
        </div>
        <div style="float:left;color:white;margin-left:1vw;line-height:2.6vh;">
          日志来源:&nbsp;
          <el-input v-model="state.Sender" placeholder="请输入" size="mini" style="float:right; width:150px;" />
        </div>
      </div>
    </div>
    <div class="eltable">
      <el-table :data="state.tableData.filter(x=>x.Lvl.indexOf(state.Lvl)>=0&&x.Sender.indexOf(state.Sender)>=0).slice((state.PageNum - 1) * state.PageSize, (state.PageNum * state.PageSize) - 1)"
        :row-style="GetRowStyle" :cell-style="GetCellStyle" style="width: 100%" :default-sort="{prop: 'Time', order: 'descending'}" height="500">
        <el-table-column prop="Time" label="产生时间" sortable width="220">
        </el-table-column>
        <el-table-column prop="Type" label="类别" sortable :formatter="formatter_logtype" width="150">
        </el-table-column>
        <el-table-column prop="Sender" label="发送方" sortable width="150">
        </el-table-column>
        <el-table-column prop="Receiver" label="接收方" sortable width="150">
        </el-table-column>
        <el-table-column prop="Lvl" label="级别" sortable :formatter="formatter_lvl" width="100">
        </el-table-column>
        <el-table-column prop="Content" label="内容" sortable width="800">
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="state.totalCount" :current-page="state.PageNum" :page-size="state.PageSize">
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { computed, onBeforeMount, onMounted } from '@vue/runtime-core';
import { useRouter } from 'vue-router'
import { setCookie, getCookie } from '../utils/utils';
import { useStore } from 'vuex';
const router = useRouter()
const store = useStore();
const formatter_lvl = (val) => {
  return val == 'Debug' ? '调试' : '正常';
}
const formatter_logtype = (val) => {
  return '用户操作'
}
const countortime_sscz_val = ref(1000);
const state = reactive({
  tableData: computed(() => {
    return store.state.runtime_log_ssczzdata;
  }),
  Sender: '',
  Type: "",
  Lvl: "",
  Lvl_opts: [
    {
      label: '调试',
      value: 'Debug'
    },
    {
      label: '正常',
      value: 'Info'
    }
  ],

  ishow: true,
  countortime_sscz: 'count',
  countortime_sscz_val: 10,
  countortime_sscz_data: [
    {
      label: '最大记录时长(分钟)',
      value: 'time'
    },
    {
      label: '最大记录条数',
      value: 'count'
    },
  ],
  totalCount: computed(() => {
    return store.state.runtime_log_ssczzdata.length;
  }),
  PageNum: 1,
  PageSize: 10,
});
const countortime_ssczChange = (val) => {
  setCookie('countortime_sscz', val);
  setCookie('countortime_sscz_val', 0);
  countortime_sscz_val.value = 0;
}
const handleCurrentChange = (val) => {
  state.PageNum = val;
}
const countortime_sscz_value_Change = (val) => {
  setCookie('countortime_sscz_val', val);
}

const formatJson = (filterVal, jsonData) => {
  return jsonData.map(v => filterVal.map(j => v[j]));
}
const GetRowStyle = ({ row, rowIndex }) => {
  return 'background-color:transparent'
}
const GetCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex % 2 != 0) {
    return 'background-color:rgba(0,0,0,.5);color:white;'
  }
}
const close = () => {
  state.ishow = false;
  router.push('AgvDispatch');
}
onBeforeMount(() => {
  if (getCookie('countortime_sscz') == null) {
    setCookie('countortime_sscz', 'count')
  }
  if (getCookie('countortime_sscz_val') == null) {
    setCookie('countortime_sscz_val', 1000)
  }
  state.countortime_sscz = getCookie('countortime_sscz');
  countortime_sscz_val.value = parseInt(getCookie('countortime_sscz_val'));
})
</script>


<style scoped>
.eltable
  :deep(.el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td.el-table__cell) {
  background-color: #1f76f9  !important;
}
.midiv {
  position: absolute;
  top: 15vh;
  left: 7vw;
  width: 84.4vw;
  height: 71.4vh;
  z-index: 99;
  background-image: url("../assets/images/max.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: rgb(0, 11, 35, 0.8);
}
.top {
  height: 10vh;
}
.title {
  font-size: 24px;
  font-weight: 600;
  font-family: 微软雅黑;
  margin-left: 20px;
  margin-top: 20px;
  color: white;
}
.titleAgv {
  font-size: 16px;
  line-height: 0px;
  font-family: 微软雅黑;
  color: white;
  margin-top: 14px;
}
.eltable {
  margin: auto;
}
.eltable :deep(.el-table--fit) {
  padding-right: 20px;
  padding-left: 20px;
}
.eltable :deep(.el-table, .el-table__expanded-cell) {
  background-color: transparent;
}
.eltable :deep(.el-table th) {
  background-color: transparent !important;
  color: white;
}
.eltable :deep(.el-table tr) {
  background-color: transparent !important;
  color: white;
}
.eltable :deep(.el-table td, .el-table th.is-leaf) {
  border: none;
}
.eltable
  :deep(.el-table--enable-row-transition .el-table__body td, .el-table .cell) {
  background-color: transparent;
}
.el-table::before {
  left: 0;
  bottom: 0;
  width: 40vw;
  height: 0px;
}
.bottom {
  width: 40%;
  margin-left: 30%;
}
.close {
  float: right;
  margin-top: -6.5vh;
  margin-right: 1vw;
  cursor: pointer;
}
</style>

