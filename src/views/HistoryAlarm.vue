<template>
  <div class="midiv" v-show="state.ishow">
    <div class="top">
      <p class="title">历史报警</p>
      <img @click="close" src="../assets/images/close_new.png" class="close" />
      <el-row>
        <el-col :span="1" style="margin-left:2%">
          <p class="titleAgv">报警类型</p>
        </el-col>
        <el-col :span="3">
          <el-select v-model="state.alarmstypevalue" multiple placeholder="请选择" style="width:180px;" size="mini">
            <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <p class="titleAgv">报警时间</p>
        </el-col>
        <el-col :span="6">
          <el-date-picker v-model="state.queryTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
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
      <el-table :data="state.tableData" :row-style="GetRowStyle" :cell-style="GetCellStyle" style="width:100%" :default-sort="{prop: 'date', order: 'descending'}" height="500">
        <el-table-column prop="AlarmId" sortable label="报警编码" width="240">
        </el-table-column>
        <el-table-column prop="AlarmInfo" sortable label="报警信息" width="550">
        </el-table-column>
        <el-table-column prop="AlarmState" sortable label="报警状态" :formatter="formatteralarm" width="150">
        </el-table-column>
        <el-table-column prop="AlarmTime" sortable label="报警时间" :formatter="formatterATime" width="180">
        </el-table-column>
        <el-table-column prop="AlarmType" sortable label="报警类型" width="150">
        </el-table-column>
        <!-- <el-table-column prop="DeviceNo" label="订单编号">
        </el-table-column> -->
        <el-table-column prop="EndTime" sortable label="结束时间" :formatter="formatterETime" width="180">
        </el-table-column>
        <el-table-column prop="TimeLen" sortable label="报警持续时间" :formatter="formatterTimeLen" width="150">
        </el-table-column>
        <!-- <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-s-order" @click="show(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column> -->
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
import XLSX from "xlsx";
import moment from 'moment'
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { GetHistoryAlarmSearch, GetHistoryAlarmExport } from '../service/getData'
const router = useRouter()
const state = reactive({
  ishow: true,
  pageCount: 0,
  totalCount: 0,
  queryform: {
    PageNum: 1,
    PageSize: 10,
    AlarmType: 'System',
    EndTime: new Date(),
    StartTime: new Date(),
  },
  tableData: [],
  options: [{
    value: 'System',
    label: '系统'
  }, {
    value: 'Device',
    label: '设备'
  }],
  alarmstypevalue: [],
  queryTime: ''
})
const search = () => {
  if (state.queryTime.length > 0) {
    state.queryform.StartTime = state.queryTime[0];
    state.queryform.EndTime = state.queryTime[1];
  }
  state.queryform.PageNum = 1;
  state.queryform.PageSize = 10;
  initTable();
}
const initTable = () => {
  state.queryform.AlarmType = "";
  if (state.alarmstypevalue.length > 0) {
    state.alarmstypevalue.forEach((el, key) => {
      state.queryform.AlarmType += el;
      if (key < state.alarmstypevalue.length - 1) {
        state.queryform.AlarmType += ",";
      }
    })
  }
  GetHistoryAlarmSearch(state.queryform).then(res => {
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
const exportExcel = () => {
  if (state.queryTime.length > 0) {
    state.queryform.StartTime = state.queryTime[0];
    state.queryform.EndTime = state.queryTime[1];
  }
  state.queryform.AlarmType = "";
  if (state.alarmstypevalue.length > 0) {
    state.alarmstypevalue.forEach((el, key) => {
      state.queryform.AlarmType += el;
      if (key < state.alarmstypevalue.length - 1) {
        state.queryform.AlarmType += ",";
      }
    })
  }
  GetHistoryAlarmExport(state.queryform).then(res => {
    let sourceData = res.data.data.DataList;
    if (sourceData.length > 0) {
      let tableData = [['报警编码', '报警信息', '报警状态', '报警时间', '报警类型', '订单编号', '结束时间', '时长', '地图ID', '记录ID']];//表格表头
      sourceData.forEach(item => {
        //370827194706201337
        let rowData = [
          item.AlarmId,
          item.AlarmInfo,
          formatteralarm(item),
          item.AlarmTime,
          item.AlarmType,
          item.DeviceNo,
          item.EndTime,
          item.TimeLen,
          item.MapId,
          item.RecordId,
        ];
        tableData.push(rowData);
      });
      let ws = XLSX.utils.aoa_to_sheet(tableData)
      let wb = XLSX.utils.book_new()
      let xlsxname = 'AGV历史报警' + moment(state.queryform.StartTime).format('YYYY-MM-DD') + '_' + moment(state.queryform.EndTime).format('YYYY-MM-DD');
      XLSX.utils.book_append_sheet(wb, ws, '数据') // 工作簿名称
      XLSX.writeFile(wb, xlsxname + ".xlsx");
    }
  });
}
const formatJson = (filterVal, jsonData) => {
  return jsonData.map(v => filterVal.map(j => v[j]));
}
const handleCurrentChange = (val) => {
  state.queryform.PageNum = val;
  initTable();
}
const formatteralarm = (val) => {
  let reval = val.AlarmState;
  if (reval == 'T') {
    reval = "已处理";
  } else {
    reval = "未处理";
  }
  return reval;
}
const formatterATime = (val) => {
  let reval = moment(val.AlarmTime).format("YYYY年MM月DD日 HH时mm分ss秒");
  return reval;
}
const formatterETime = (val) => {
  let reval = moment(val.EndTime).format("YYYY年MM月DD日 HH时mm分ss秒");
  return reval;
}
const formatterTimeLen = (val) => {
  let reval = Math.round(val.TimeLen / 60);
  let s = val.TimeLen % 60
  return reval + "分" + s + "秒";
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


