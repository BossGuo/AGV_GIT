<template>
  <div class="midiv" v-show="state.ishow">
    <div class="top">
      <p class="title">历史日志</p>
      <img @click="close" src="../assets/images/close_new.png" class="close" />
      <el-row>
        <el-col :span="1" style="margin-left:2%">
          <p class="titleAgv">AGV</p>
        </el-col>
        <el-col :span="5">
          <el-select v-model="state.queryform.AgvId" placeholder="请选择" style="width:320px;" size="mini">
            <el-option v-for="item in state.agvlist" :key="item.AgvId" :label="item.AgvName" :value="item.AgvId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <p class="titleAgv">日志类别</p>
        </el-col>
        <el-col :span="5">
          <!-- <el-input placeholder="请输入" v-model="state.queryform.Type" clearable style="width:100px;" size="mini">
          </el-input> -->
          <el-select v-model="state.logstypevalue" multiple placeholder="请选择" style="width:320px;" size="mini">
            <el-option v-for="item in state.typeoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="1" style="margin-left:2%">
          <p class="titleAgv">日志级别</p>
        </el-col>
        <el-col :span="5">
          <!-- <el-input placeholder="请输入" v-model="state.queryform.Lvl" clearable style="width:100px;" size="mini">
          </el-input> -->
          <el-select v-model="state.logslevelvalue" multiple placeholder="请选择" style="width:320px;" size="mini">
            <el-option v-for="item in state.leveloptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="1">
          <p class="titleAgv">日志时间</p>
        </el-col>
        <el-col :span="6">
          <el-date-picker v-model="state.queryTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
          </el-date-picker>
        </el-col>
        <el-col :span="1">
          <el-button size="mini" type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-col>
        <!-- <el-col :span="1">
          <el-button size="mini" type="primary" icon="el-icon-search" @click="exportExcel" style="margin-left:10px;">导出</el-button>
        </el-col> -->
      </el-row>
    </div>
    <div class="eltable">
      <el-table :data="state.tableData" :row-style="GetRowStyle" :cell-style="GetCellStyle" style="width: 100%" :default-sort="{prop: 'Time', order: 'descending'}" height="500">
        <el-table-column prop="Time" label="日志产生时间" sortable width="180">
        </el-table-column>
        <el-table-column prop="Type" label="日志类别" sortable width="170" :formatter="formatterType">
        </el-table-column>
        <el-table-column prop="Sender" label="发送方" sortable width="150">
        </el-table-column>
        <el-table-column prop="Receiver" label="接收方" sortable width="150">
        </el-table-column>
        <el-table-column prop="Lvl" label="级别" sortable width="180" :formatter="formatterLevel">
        </el-table-column>
        <el-table-column prop="Content" label="日志内容" sortable width="720">
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="state.totalCount" :current-page="state.queryform.PageNum"
        :page-size="state.queryform.PageSize">
      </el-pagination>

    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Historylogsearch } from '../service/getData';
const router = useRouter()
const state = reactive({
  ishow: true,
  pageCount: 0,
  totalCount: 0,
  queryform: {
    AgvId: "",
    PageNum: 1,
    PageSize: 10,
    Type: '',
    Lvl: '',
    Sender: '',
    Receiver: 'RCS',
    EndTime: new Date(),
    StartTime: new Date(),
  },
  tableData: [],
  queryTime: '',
  logstypevalue: [],
  logslevelvalue: [],
  agvlist: [],
  typeoptions: logs_config.typeoptions,
  leveloptions: logs_config.leveloption,
})
const search = () => {
  if (state.queryTime.length > 0) {
    state.queryform.StartTime = state.queryTime[0];
    state.queryform.EndTime = state.queryTime[1];
  }
  state.queryform.Type = "";
  if (state.logstypevalue.length > 0) {
    state.logstypevalue.forEach((el, key) => {
      state.queryform.Type += el;
      if (key < state.logstypevalue.length - 1) {
        state.queryform.Type += ",";
      }
    })
  }
  state.queryform.Lvl = "";
  if (state.logslevelvalue.length > 0) {
    state.logslevelvalue.forEach((el, key) => {
      state.queryform.Lvl += el;
      if (key < state.logslevelvalue.length - 1) {
        state.queryform.Lvl += ",";
      }
    })
  }
  state.queryform.PageNum = 1;
  state.queryform.PageSize = 10;
  initTable();
}
const initTable = () => {
  Historylogsearch(state.queryform).then(res => {
    state.tableData = [];
    state.totalCount = res.data.data ? res.data.data.DataCount : 0;
    state.tableData = res.data.data ? res.data.data.DataList : [];
    if (state.totalCount % state.queryform.PageSize == 0) {
      state.pageCount = parseInt(state.totalCount / state.queryform.PageSize);
    } else {
      state.pageCount = parseInt(state.totalCount / state.queryform.PageSize + 1);
    }
  })
}
const formatJson = (filterVal, jsonData) => {
  return jsonData.map(v => filterVal.map(j => v[j]));
}
const handleCurrentChange = (val) => {
  state.queryform.PageNum = val;
  initTable();
}
const formatterType = (val) => {
  let reval = val.Type;
  state.typeoptions.forEach(el => {
    if (reval.indexOf(el.value) != -1) {
      reval = reval.replace(el.value, el.label);
    }
  })
  return reval;
}
const formatterLevel = (val) => {
  let reval = val.Lvl;
  state.leveloptions.forEach(el => {
    if (reval.indexOf(el.value) != -1) {
      reval = reval.replace(el.value, el.label);
    }
  })
  return reval;
}
const GetRowStyle = ({ row, rowIndex }) => {
  let color = 'background-color:transparent';
  if (row.Lvl == "Debug") {
    color = 'background-color:blue !important';
  }
  if (row.Lvl == "Info") {
    color = 'background-color:green !important';
  }
  if (row.Lvl == "Error") {
    color = 'background-color:red !important';
  }
  return color;
}
const GetCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex % 2 != 0) {
    // return 'background-color:rgba(0,0,0,.5);color:white;'
  }
}
const close = () => {
  state.ishow = false;
  router.push('AgvDispatch');
}
onMounted(() => {
  state.agvlist = agvlist;
  search();
})
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
  height: 12.5vh;
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

