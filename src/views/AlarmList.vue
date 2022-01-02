<template>
  <div class="midiv" v-show="state.ishow">
    <div class="top">
      <p class="title">实时报警</p>
      <img @click="close" src="../assets/images/close_new.png" class="close" />
      <!-- <el-row>
        <el-col :span="1" style="margin-left:52%">
          <p class="titleAgv">报警类型</p>
        </el-col>
        <el-col :span="2">
          <el-select v-model="queryform.AlarmType" placeholder="请选择" style="width:120px;" size="mini">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button size="mini" type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-col>
      </el-row> -->
    </div>
    <div class="eltable">
      <el-table :data="state.tableData" :row-style="GetRowStyle" :cell-style="GetCellStyle" style="width:100%" :default-sort="{prop: 'date', order: 'descending'}" height="500">
        <el-table-column prop="AlarmId" label="报警Id" sortable>
        </el-table-column>
        <el-table-column prop="AlarmCode" label="报警编码" sortable>
        </el-table-column>
        <el-table-column prop="AlarmInfo" label="报警信息" sortable>
        </el-table-column>
        <el-table-column prop="AlarmTime" label="报警时间" sortable>
        </el-table-column>
        <el-table-column prop="AlarmType" label="报警类型" sortable>
        </el-table-column>
        <el-table-column prop="DeviceId" label="订单编号" sortable>
        </el-table-column>
        <el-table-column prop="MapId" label="地图编号" sortable>
        </el-table-column>
        <el-table-column prop="TimeLen" label="时长" sortable>
        </el-table-column>
        <el-table-column prop="ProcessingMethod" label="处理方法">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="scope">
            <el-button size="mini" icon="el-icon-s-order" @click="operation(scope.$index, scope.row)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { reactive, toRefs } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import emitter from 'tiny-emitter/instance'
const router = useRouter()
const state = reactive({
  ishow: true,
  tableData: [],
  totalCount: 0,
})
const operation = (index, item) => {
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
onMounted(() => {
  emitter.on("Alarms_Info_Change_Event", data => {
    state.tableData = data;
  });
});
</script>


<style scoped>
.eltable
  :deep(.el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td.el-table__cell) {
  background-color: #1f76f9 !important;
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

