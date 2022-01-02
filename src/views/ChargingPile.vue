<template>
  <div class="midiv" v-show="state.ishow">
    <div class="top">
      <p class="title">充电桩信息</p>
      <img @click="close" src="../assets/images/close_new.png" class="close" />
      <el-row>
        <el-col :span="2" style="margin-left:51.5%;text-align: center;">
          <p class="titleAgv">充电桩编码</p>
        </el-col>
        <el-col :span="2">
          <el-input placeholder="请输入内容" v-model="state.queryform.Id" clearable style="width:120px;" size="mini">
          </el-input>
        </el-col>
        <el-col :span="2" style="text-align: center;">
          <p class="titleAgv">充电桩名称</p>
        </el-col>
        <el-col :span="2">
          <el-input placeholder="请输入内容" v-model="state.queryform.Name" clearable style="width:120px;" size="mini">
          </el-input>
        </el-col>
        <!-- <el-col :span="2" style="text-align: center;">
          <p class="titleAgv">充电桩状态</p>
        </el-col>
        <el-col :span="2">
          <el-select v-model="state.queryform.TaskState" placeholder="请选择" style="width:120px;" size="mini">
            <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker v-model="state.queryTime" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="mini">
          </el-date-picker>
        </el-col> -->
        <el-col :span="1">
          <el-button size="mini" type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-col>
        <el-col :span="1">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="add" style="margin-left:10px;">新增</el-button>
        </el-col>
        <!-- <el-col :span="1">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="exportExcel" style="margin-left:10px;">导出</el-button>
        </el-col> -->
      </el-row>
    </div>
    <div class="eltable">
      <el-table :data="state.tableData" :row-style="GetRowStyle" :cell-style="GetCellStyle" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" height="500">
        <el-table-column prop="Id" sortable label="序号">
        </el-table-column>
        <el-table-column prop="Name" sortable label="名称">
        </el-table-column>
        <el-table-column prop="Ip" sortable label="Ip">
        </el-table-column>
        <el-table-column prop="Port" sortable label="端口">
        </el-table-column>
        <el-table-column prop="Type" sortable label="类型" :formatter="formatterType">
        </el-table-column>
        <el-table-column prop="MaxVoltage" sortable label="最大充电电压">
        </el-table-column>
        <el-table-column prop="MaxElectricity" sortable label="最大充电流程">
        </el-table-column>
        <el-table-column prop="Disable" sortable label="是否禁用" :formatter="formatterDisable">
        </el-table-column>
        <!-- <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-s-order" @click="show(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button size="mini" icon="el-icon-s-order" @click="UnLock(scope.$index, scope.row)">解锁</el-button>
            <el-button size="mini" icon="el-icon-s-order" @click="edit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" icon="el-icon-s-release" @click="remove(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" @prev-click="prevPage" @next-click="nextPage" :total="state.totalCount"
        :page-count="state.pageCount" :current-page="state.queryform.PageNum" :page-size="state.queryform.pageSize">
      </el-pagination>
    </div>
    <div v-dialogdrag class="my_dialog">
      <el-dialog :title="state.form_type=='add'?'新增充电桩信息':'修改充电桩信息'" v-model="state.isShowDialog" width="25%" top="7%" :modal="false" :close-on-click-modal="false">
        <el-form :inline="true" ref="addOrEdit_Form" :rules="state.formRules" :model="state.formdata" label-position="left" label-width="130px">
          <el-form-item label="Id" label-width="120px" prop="Id">
            <el-input v-model="state.formdata.Id" placeholder="Id" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="名称" label-width="120px" prop="Name">
            <el-input v-model="state.formdata.Name" placeholder="Name" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="Ip" label-width="120px" prop="Ip">
            <!-- <el-input v-model="state.formdata.Ip" placeholder="Ip" size="mini"></el-input> -->
            <IP></IP>
          </el-form-item>
          <el-form-item label="端口" label-width="120px">
            <el-input v-model="state.formdata.Port" placeholder="端口" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="最大充电电流" label-width="120px">
            <el-input v-model="state.formdata.MaxElectricity" placeholder="最大充电电流" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="最大充电电压" label-width="120px">
            <el-input v-model="state.formdata.MaxVoltage" placeholder="最大充电电压" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="类型" label-width="120px">
            <el-select v-model="state.formdata.Type" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="item in state.chargType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否禁用" label-width="120px">
            <el-radio v-model="state.formdata.Disable" :label="true" size="mini">禁用</el-radio>
            <el-radio v-model="state.formdata.Disable" :label="false" size="mini">启用</el-radio>
          </el-form-item>
        </el-form>
        <el-form-item class="my_dialog_div_bottom">
          <el-button type="primary" @click="submit" size="medium">确定</el-button>
          <el-button type="danger" @click="exit" size="medium">取消</el-button>
        </el-form-item>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import IP from '../components/ip.vue'
import { onBeforeMount, onMounted, onUnmounted, ref, provide } from 'vue'
import { reactive, toRefs } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { GetChargingPileSetting, ChargingPileSetting, ChargingPileOperation } from '../service/getData'
import { ElMessage } from 'element-plus'
import emitter from 'tiny-emitter/instance'

const router = useRouter()
const state = reactive({
  ishow: true,
  pageCount: 0,
  totalCount: 0,
  form_type: 'add',
  queryform: {
    PageNum: 1,
    PageSize: 10,
    Id: "",
    Name: "",
    TaskState: 'Wait',
    EndTime: "2021-07-12 11:28:00",
    StartTime: "2021-03-01 01:22:00"
  },
  tableData: [],
  tableData_old: [],
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
  chargType: global_config.charg_Type,
  pickerOptions: {
    shortcuts: [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
      }
    }]
  },
  queryTime: '',
  isShowDialog: false,
  formdata: {
    Id: '',
    Name: '',
    Ip: '192.168.1.1',
    Port: '8080',
    MaxElectricity: '50',
    MaxVoltage: '220',
    Type: global_config.charg_Type[0].value,
    Disable: true,
  },
  formRules: {
    Id: [
      {
        required: true,
        message: 'ID不能为空',
        trigger: 'blur',
      }
    ],
    Name: [
      {
        required: true,
        message: '名称不能为空',
        trigger: 'blur',
      }
    ],
    Ip: [
      {
        required: true,
        message: 'IP不能为空',
        trigger: 'blur',
      }
    ]
  }
})

const IpAddress = ref(null);
provide("IpAddress", IpAddress);
const add = () => {
  exit();
  state.form_type = 'add';
  state.isShowDialog = true;
  IpAddress.value = '192.168.1.1';
  state.formdata.Operation = 'Add';
}
const UnLock = (index, row) => {
  let data = {
    id: row.Id,
    Operation: "Unlock",
  }
  ChargingPileOperation(data).then(res => {
    if (res.data.code == 0) {
      ElMessage.success('已解锁');
    } else {
      ElMessage.error(res.data.message);
    }
  })
};
const edit = (index, row) => {
  state.form_type = 'edit';
  state.isShowDialog = true;
  state.formdata = row;
  IpAddress.value = state.formdata.Ip;
  state.formdata.Operation = 'Update';
}
const remove = (index, row) => {
  state.form_type = 'delete';
  state.formdata = row;
  state.formdata.Operation = 'Remove';
  ChargingPileSetting(state.formdata).then(res => {
    if (res.data.code == 0) {
      ElMessage.success('已删除');
      initTable();
    } else {
      ElMessage.error(res.data.message);
    }
  })
}
const addOrEdit_Form = ref(null);
const submit = () => {
  addOrEdit_Form.value.validate((valid) => {
    if (valid) {
      ChargingPileSetting(state.formdata).then(res => {
        if (res.data.code == 0) {
          let msg = state.form_type == 'add' ? '新增充电桩信息成功' : state.form_type == 'edit' ? '修改充电桩信息成功' : '已删除';
          ElMessage.success(msg);
          exit();
          initTable();
        } else {
          ElMessage.error(res.data.message);
        }
      })
    } else {
      ElMessage.error('请按照规则填写表单后再进行保存');
    }
  })
}
const exit = (index, row) => {
  // state.formdata = {};
  state.isShowDialog = false;
}
const search = () => {
  state.tableData = state.tableData_old.filter(x => x.Id.indexOf(state.queryform.Id) != -1 && x.Name.indexOf(state.queryform.Name) != -1)
  if (state.tableData.length == 0) {
    ElMessage('无符合查询条件的数据！');
    state.tableData = state.tableData_old;
  }
  state.totalCount = state.tableData.length;
  if (state.totalCount % state.queryform.PageSize == 0) {
    state.pageCount = parseInt(state.totalCount / state.queryform.PageSize);
  } else {
    state.pageCount = parseInt(state.totalCount / state.queryform.PageSize + 1);
  }
}
const initTable = () => {
  GetChargingPileSetting().then(res => {
    state.tableData = [];
    state.tableData_old = [];
    state.totalCount = res.data.data.length;
    state.tableData = res.data.data;
    state.tableData_old = res.data.data;
    if (state.totalCount % state.queryform.PageSize == 0) {
      state.pageCount = parseInt(state.totalCount / state.queryform.PageSize);
    } else {
      state.pageCount = parseInt(state.totalCount / state.queryform.PageSize + 1);
    }
  })
}
const exportExcel = () => {

}
const handleCurrentChange = (val) => {
  state.queryform.PageNum = val;
  initTable();
}
const formatterType = (val) => {
  let reval = val.Type;
  if (reval == "Normal") {
    reval = "普通充电桩";
  }
  return reval;
}
const formatterDisable = (val) => {
  let reval = val.Disable;
  if (reval) {
    reval = "禁用";
  } else {
    reval = "启用";
  }
  return reval;
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
  emitter.on('getIpVal', val => {
    IpAddress.value = val;
    state.formdata.Ip = val;
  });
});
</script>


<style scoped>
.eltable
  :deep(.el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td.el-table__cell) {
  background-color: #1f76f9  !important;
}
.my_dialog :deep(.el-dialog) {
  background: #349ea9e6;
  color: white;
}
.my_dialog :deep(.el-icon-close:before) {
  color: white;
}
.my_dialog :deep(.el-dialog__title) {
  color: white;
}
.my_dialog :deep(.input__inner) {
  color: black !important;
}
.my_dialog_div {
  color: white;
  height: 25vh;
  width: 100%;
  margin-top: -2vh;
}
.my_dialog_div_bottom {
  width: 15vw;
  height: 2vh;
  margin-top: 2vh;
  text-align: right;
}
:deep(.el-form-item__label) {
  color: white;
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


