<template>
  <div class="midiv" v-show="state.ishow">
    <div class="top">
      <p class="title">参数配置</p>
      <img @click="close" src="../assets/images/close_new.png" class="close" />
      <el-row>
        <el-col :span="2" style="margin-left:30.5%">
          <p class="titleAgv">是否加载地图</p>
        </el-col>
        <el-col :span="2">
          <el-input placeholder="请输入内容" v-model="state.queryform.AgvId" clearable style="width:120px;" size="mini">
          </el-input>
        </el-col>
        <el-col :span="2">
          <p class="titleAgv">清除数据状态</p>
        </el-col>
        <el-col :span="2">
          <el-select v-model="state.queryform.TaskState" placeholder="请选择" style="width:120px;" size="mini">
            <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker v-model="state.queryTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="mini">
          </el-date-picker>
        </el-col>
        <el-col :span="1">
          <el-button size="mini" type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-col>
        <el-col :span="1">
          <el-button size="mini" type="primary" icon="el-icon-search" @click="exportExcel" style="margin-left:10px;">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="eltable">
      <el-table :data="state.tableData" :row-style="GetRowStyle" :cell-style="GetCellStyle" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" height="500">
        <el-table-column prop="IsMap" label="是否加载地图" sortable>
        </el-table-column>
        <el-table-column prop="MapName" label="地图文件名" sortable>
        </el-table-column>
        <el-table-column prop="Clear" label="清除数据库" sortable>
        </el-table-column>
        <el-table-column prop="ProjectName" label="测试工程名" sortable>
        </el-table-column>
        <el-table-column prop="IsRun" label="是否启动模拟器" sortable>
        </el-table-column>
        <el-table-column prop="Tcp" label="Tcp服务端端口" sortable>
        </el-table-column>
        <el-table-column prop="Udp" label="Udp监听端口" sortable>
        </el-table-column>
        <el-table-column prop="Rundiaodu" label="启动调度模块" sortable>
        </el-table-column>
        <el-table-column prop="Runcontrol" label="启动控制模块" sortable>
        </el-table-column>
        <el-table-column prop="RepeatMes" label="重复消息处理" sortable>
        </el-table-column>
        <el-table-column prop="Socket" label="socket通讯消息校验" sortable>
        </el-table-column>
        <el-table-column prop="Ack" label="ack重发时间间隔" sortable>
        </el-table-column>
        <el-table-column prop="AckCount" label="ack重发次数" sortable>
        </el-table-column>
        <el-table-column prop="Goods" label="货物校验" sortable>
        </el-table-column>
        <el-table-column prop="AdhesionPonits" label="粘连节点生成" sortable>
        </el-table-column>
        <el-table-column prop="TurnPoints" label="转向节点生成" sortable>
        </el-table-column>
        <el-table-column prop="PointsTurn" label="节点转向属性" sortable>
        </el-table-column>
        <el-table-column prop="MapCount" label="地图层数" sortable>
        </el-table-column>
        <!-- <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-s-order" @click="show(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <div class="bottom">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" @prev-click="prevPage" @next-click="nextPage" :total="state.totalCount"
        :page-count="state.pageCount" :current-page="state.queryform.PageNum" :page-size="state.queryform.pageSize">
      </el-pagination>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { reactive, toRefs } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { GetParameter } from '../service/getData'
const router = useRouter()
const state = reactive({
  ishow: true,
  pageCount: 0,
  totalCount: 0,
  queryform: {
    PageNum: 1,
    PageSize: 10,
    AgvId: "",
    TaskState: 'Wait',
    EndTime: "2021-07-12 11:28:00",
    StartTime: "2021-03-01 01:22:00"
  },
  tableData: [],
  options: [{
    value: 'Running',
    label: '运行'
  }, {
    value: 'Stop',
    label: '停止'
  }, {
    value: 'Wait',
    label: '等待'
  }],
  queryTime: [new Date(new Date().toLocaleDateString()).getTime(),
  new Date(new Date().toLocaleDateString()).getTime() + ((24 * 60 * 60 * 1000) - 1)],
})

const search = () => {
  initTable();
}
const initTable = () => {
  GetParameter(state.queryform).then(res => {
    state.tableData = [];
    state.totalCount = res.DataCount;//res.data.data[0].DataCount;
    state.tableData = res.DataList;//res.data.data[0].DataList;
    if (state.totalCount % state.queryform.PageSize == 0) {
      state.pageCount = parseInt(state.totalCount / state.queryform.PageSize);
    } else {
      state.pageCount = parseInt(state.totalCount / state.queryform.PageSize + 1);
    }
    //state.$forceUpdate();
  })
}
const exportExcel = () => {

}
const handleCurrentChange = (val) => {
  state.queryform.PageNum = val;
  initTable();
}
const prevPage = (val) => {
  state.queryform.PageNum = val;
  initTable();
}
const nextPage = (val) => {
  state.queryform.PageNum = val;
  initTable();
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
  initTable();
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
