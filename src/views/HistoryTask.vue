<template>
  <div class="midiv" v-show="state.ishow">
    <div class="top">
      <p class="title">历史任务</p>
      <img @click="close" src="../assets/images/close_new.png" class="close" />
      <el-row>
        <el-col :span="1" style="margin-left:2%">
          <p class="titleAgv">AGV</p>
        </el-col>
        <el-col :span="2">
          <el-select v-model="state.queryform.AgvId" filterable placeholder="请选择" size="mini" style="width:6vw;float:left;">
            <el-option v-for="item in state.AgvListOptions" :key="item.AgvId" :label="item.AgvName" :value="item.AgvId"> </el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <p class="titleAgv">任务状态</p>
        </el-col>
        <el-col :span="8">
          <el-select v-model="state.TaskStateValue" multiple placeholder="请选择" style="width:500px;" size="mini">
            <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <p class="titleAgv">任务时间</p>
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
      <el-table :data="state.tableData" :row-style="GetRowStyle" :cell-style="GetCellStyle" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" height="500">
        <!-- <el-table-column prop="RecordId" label="记录编码" sortable width="120">
        </el-table-column> -->
        <el-table-column prop="TaskId" label="任务编码" sortable width="220">
        </el-table-column>

        <!-- <el-table-column prop="ItemCode" label="物品编号">
        </el-table-column> -->
        <el-table-column prop="TaskState" label="任务状态" sortable :formatter="formatterstatus">
        </el-table-column>
        <el-table-column prop="AgvId" label="AGV编码" sortable>
        </el-table-column>
        
        <el-table-column prop="CreateTime" label="创建时间" sortable>
        </el-table-column>
        <el-table-column prop="StartTime" label="开始时间" sortable>
        </el-table-column>
        <el-table-column prop="EndTime" label="结束时间" sortable>
        </el-table-column>
        <el-table-column prop="Priority" label="优先级" sortable>
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
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { GetHistoryTaskSearch, GetHistoryTaskExport } from '../service/getData';
const router = useRouter()
const state = reactive({
  ishow: true,
  pageCount: 0,
  totalCount: 0,
  queryform: {
    PageNum: 1,
    PageSize: 10,
    AgvId: "",
    TaskState: '',
    EndTime: new Date(),
    StartTime: new Date(),
  },
  tableData: [],
  options: [{
    value: 'Running',
    label: '运行中'
  }, {
    value: 'Finished',
    label: '完成'
  }, {
    value: 'Waitting',
    label: '等待中'
  }, {
    value: 'Canceled',
    label: '取消'
  }, {
    value: 'Sending',
    label: '发送中'
  }, {
    value: 'AppendFinished',
    label: '回泊位完成'
  }],
  TaskStateValue: [],
  queryTime: '',
  AgvListOptions: agvlist,
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
  state.queryform.TaskState = "";
  if (state.TaskStateValue.length > 0) {
    state.TaskStateValue.forEach((el, key) => {
      state.queryform.TaskState += el;
      if (key < state.TaskStateValue.length - 1) {
        state.queryform.TaskState += ",";
      }
    })
  }
  GetHistoryTaskSearch(state.queryform).then(res => {
    state.tableData = [];
    state.totalCount = res.data.data ? res.data.data.DataCount : 0;
    state.tableData = res.data.data ? res.data.data.DataList : [];
    if (state.totalCount % state.queryform.PageSize == 0) {
      state.pageCount = parseInt(state.totalCount / state.queryform.PageSize);
    } else {
      state.pageCount = parseInt(state.totalCount / state.queryform.PageSize + 1);
    }
    // state.$forceUpdate();
  })
}
const exportExcel = () => {
  if (state.queryTime.length > 0) {
    state.queryform.StartTime = state.queryTime[0];
    state.queryform.EndTime = state.queryTime[1];
  }
  state.queryform.TaskState = "";
  if (state.TaskStateValue.length > 0) {
    state.TaskStateValue.forEach((el, key) => {
      state.queryform.TaskState += el;
      if (key < state.TaskStateValue.length - 1) {
        state.queryform.TaskState += ",";
      }
    })
  }
  GetHistoryTaskExport(state.queryform).then(res => {
    let sourceData = res.data.data.DataList;
    if (sourceData.length > 0) {
      let tableData = [['记录编码', '任务编码', '优先级', '物品编号', '任务状态', '任务节点', 'AGV编码', '创建时间', '开始时间', '结束时间', '时长']];//表格表头
      sourceData.forEach(item => {
        //370827194706201337
        let rowData = [
          item.RecordId,
          item.TaskId,
          item.Priority,
          item.ItemCode,
          formatterstatus(item),
          JSON.stringify(item.TaskNodes),
          item.AgvId,
          item.CreateTime,
          item.StartTime,
          item.EndTime,
          item.TimeLen
        ];
        tableData.push(rowData);
      });
      let ws = XLSX.utils.aoa_to_sheet(tableData)
      let wb = XLSX.utils.book_new()
      let xlsxname = 'AGV历史任务' + moment(state.queryform.StartTime).format('YYYY-MM-DD') + '_' + moment(state.queryform.EndTime).format('YYYY-MM-DD');
      XLSX.utils.book_append_sheet(wb, ws, '数据') // 工作簿名称
      XLSX.writeFile(wb, xlsxname + ".xlsx");
      // const tHeader = ['记录编码', '任务编码', '优先级', '物品编号', '任务状态', '任务节点', 'AGV编码', '创建时间', '开始时间', '结束时间', '时长']; // 导出excel 的标题
      // const filterVal = ['RecordId', 'TaskId', 'Priority', 'ItemCode', 'TaskState', 'TaskNodes', 'AgvId', 'CreateTime', 'StartTime', 'EndTime', 'TimeLen']; // 每个标题对应的字段
      // const list = (sourceData || []).map((item, key) => { // 通过 map 方法遍历，组装数据成上面的格式
      //   return {
      //     RecordId: item.RecordId,
      //     TaskId: item.TaskId,
      //     Priority: item.Priority,
      //     ItemCode: item.ItemCode,
      //     TaskState: formatterstatus(item),
      //     TaskNodes: JSON.stringify(item.TaskNodes),
      //     AgvId: item.AgvId,
      //     CreateTime: item.CreateTime,
      //     StartTime: item.StartTime,
      //     EndTime: item.EndTime,
      //     TimeLen: item.TimeLen
      //   };
      // });
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
const formatterstatus = (val) => {
  let reval = val.TaskState;
  if (reval.indexOf("AppendFinished") != -1) {
    reval = reval.replace("AppendFinished", "回泊位完成");
  }
  if (reval.indexOf("Sending") != -1) {
    reval = reval.replace("Sending", "发送中");
  }
  if (reval.indexOf("Canceled") != -1) {
    reval = reval.replace("Canceled", "取消");
  }
  if (reval.indexOf("Waitting") != -1) {
    reval = reval.replace("Waitting", "等待中");
  }
  if (reval.indexOf("Finished") != -1) {
    reval = reval.replace("Finished", "完成");
  }
  if (reval.indexOf("Running") != -1) {
    reval = reval.replace("Running", "运行中");
  }
  return reval;
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

