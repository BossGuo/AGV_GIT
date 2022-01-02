
<template>
  <div class="midiv" v-show="state.ishow">
    <div class="top">
      <p class="title">AGV信息</p>
      <img @click="close" src="../assets/images/close_new.png" class="close" />
      <el-row>
        <el-col :span="1" style="margin-left:60%">
          <p class="titleAgv">AGV编码</p>
        </el-col>
        <el-col :span="2">
          <el-input placeholder="请输入内容" v-model="state.queryform.AgvId" clearable style="width:120px;" size="mini">
          </el-input>
        </el-col>
        <el-col :span="1">
          <p class="titleAgv">AGV名称</p>
        </el-col>
        <el-col :span="2">
          <el-select v-model="state.queryform.AgvName" filterable placeholder="请选择" size="mini" style="width:6vw;float:left;">
            <el-option v-for="item in state.AgvListOptions" :key="item.AgvId" :label="item.AgvName" :value="item.AgvName"> </el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="1">
          <p class="titleAgv">AGV状态</p>
        </el-col>
        <el-col :span="2">
          <el-select v-model="state.queryform.TaskState" placeholder="请选择" style="width:120px;" size="mini">
            <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col> -->
        <!-- <el-col :span="6">
          <el-date-picker v-model="queryTime" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="mini">
          </el-date-picker>
        </el-col> -->
        <el-col :span="1">
          <el-button size="mini" type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-col>
        <el-col :span="1">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="add" style="margin-left:10px;">新增</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="eltable">
      <el-table :data="state.tableData" :row-style="GetRowStyle" :cell-style="GetCellStyle" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" height="500">
        <el-table-column prop="AgvId" sortable label="序号">
        </el-table-column>
        <el-table-column prop="AgvName" sortable label="名称">
        </el-table-column>
        <el-table-column prop="AgvType" sortable label="类型" :formatter="formaterAgvType">
        </el-table-column>
        <el-table-column prop="AgvIp"  label="IP" sortable>
        </el-table-column>
        <el-table-column prop="AgvPort"  label="端口" sortable>
        </el-table-column>
        <el-table-column prop="AgvLength"  label="长度" sortable>
        </el-table-column>
        <el-table-column prop="AgvWidth"  label="宽度" sortable>
        </el-table-column>
        <el-table-column prop="AgvHeight" sortable label="高度">
        </el-table-column>
        <el-table-column prop="AlarmMusic" sortable label="报警音乐">
        </el-table-column>
        <el-table-column prop="AvoidMusic" sortable label="避障音乐">
        </el-table-column>
        <el-table-column prop="ChargeMusic" sortable label="充电音乐">
        </el-table-column>
        <el-table-column prop="ChargingPileType" sortable label="充电桩类型" width="120" :formatter="formatterChargingPileType">
        </el-table-column>
        <el-table-column prop="IdleMusic" sortable label="空闲音乐">
        </el-table-column>
        <el-table-column prop="RemoteControlIP" sortable label="远程开关机IP">
        </el-table-column>
        <el-table-column prop="RemoteControlPort" sortable label="远程开关机端口">
        </el-table-column>
        <el-table-column prop="RunningMusic" sortable label="运行音乐">
        </el-table-column>
        <el-table-column prop="Volume" sortable label="音量">
        </el-table-column>

        <el-table-column prop="RunningLed" sortable label="运行灯光颜色" :formatter="formatterColors1">
        </el-table-column>
        <el-table-column prop="AlarmLed" sortable label="报警灯光颜色" :formatter="formatterColors2">
        </el-table-column>
        <el-table-column prop="AvoidLed" sortable label="避障灯光颜色" :formatter="formatterColors3">
        </el-table-column>
        <el-table-column prop="ChargeLed" sortable label="充电灯光颜色" :formatter="formatterColors4">
        </el-table-column>
        <el-table-column prop="IdleLed" sortable label="空闲灯光颜色" :formatter="formatterColors5">
        </el-table-column>

        <el-table-column label="操作" width="220">
          <template v-slot="scope">
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
      <el-dialog :title="state.form_type=='add'?'新增AGV配置信息':'修改AGV配置信息'" v-model="state.isShowDialog" width="56%" top="7%" :modal="false" :close-on-click-modal="false">
        <el-form :inline="true" ref="addOrEdit_Form" :rules="state.formRules" :model="state.formdata" label-position="left" label-width="130px">
          <el-form-item label="AgvId" label-width="130px" prop="AgvId">
            <el-input v-model="state.formdata.AgvId" placeholder="AgvId" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="AGV名称" label-width="130px" prop="AgvName">
            <el-input v-model="state.formdata.AgvName" placeholder="名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="AGV类型" label-width="130px" prop="AgvType">
            <!-- <el-input v-model="state.formdata.AgvType" placeholder="类型" size="mini"></el-input> -->
            <el-select v-model="state.formdata.AgvType" filterable placeholder="请选择" size="mini" style="width:9.5vw;">
              <el-option v-for="item in state.left_agv_type" :key="item.id" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="IP地址" label-width="130px">
            <IP></IP>
          </el-form-item>
          <el-form-item label="端口" label-width="130px" prop="AgvPort">
            <el-input v-model="state.formdata.AgvPort" placeholder="端口" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="AGV长度" label-width="130px" prop="AgvLength">
            <el-input v-model="state.formdata.AgvLength" placeholder="长度" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="AGV宽度" label-width="130px" prop="AgvWidth">
            <el-input v-model="state.formdata.AgvWidth" placeholder="宽度" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="AGV高度" label-width="130px" prop="AgvHeight">
            <el-input v-model="state.formdata.AgvHeight" placeholder="高度" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="报警音乐" label-width="130px" prop="AlarmMusic">
            <el-select v-model="state.formdata.AlarmMusic" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="(item,key) in state.musicOptions" :key="key" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="避障音乐" label-width="130px" prop="AvoidMusic">
            <el-select v-model="state.formdata.AvoidMusic" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="(item,key) in state.musicOptions" :key="key" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="充电音乐" label-width="130px" prop="ChargeMusic">
            <el-select v-model="state.formdata.ChargeMusic" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="(item,key) in state.musicOptions" :key="key" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="充电桩类型" label-width="130px" prop="ChargingPileType">
            <el-select v-model="state.formdata.ChargingPileType" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="item in state.chargType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="空闲音乐" label-width="130px" prop="IdleMusic">
            <el-select v-model="state.formdata.IdleMusic" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="(item,key) in state.musicOptions" :key="key" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运行灯光颜色" label-width="130px" prop="RunningLed">
            <el-select v-model="state.formdata.RunningLed" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="(item,key) in state.colorOptions" :key="key" :label="item.title" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报警灯光颜色" label-width="130px" prop="AlarmLed">
            <el-select v-model="state.formdata.AlarmLed" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="(item,key) in state.colorOptions" :key="key" :label="item.title" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="避障灯光颜色" label-width="130px" prop="AvoidLed">
            <el-select v-model="state.formdata.AvoidLed" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="(item,key) in state.colorOptions" :key="key" :label="item.title" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="充电灯光颜色" label-width="130px" prop="ChargeLed">
            <el-select v-model="state.formdata.ChargeLed" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="(item,key) in state.colorOptions" :key="key" :label="item.title" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="空闲灯光颜色" label-width="130px" prop="IdleLed">
            <el-select v-model="state.formdata.IdleLed" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="(item,key) in state.colorOptions" :key="key" :label="item.title" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="远程开关机IP" label-width="130px">
            <!-- <el-input v-model="state.formdata.RemoteControlIP" placeholder="远程开关机IP" size="mini"></el-input> -->
            <div class="ip-box">
              <el-input v-model="state.ip1" name="ip" maxlength="4" size="mini" onkeyup="value=value.replace(/[^\d]/g,'')" @keyup="keyupEvent(1,$event)" @blur="submitIp"
                @input="(val) => checkVal(val,'1')" ref="ipinput1">
              </el-input>
              <div class="ip-dot"></div>
              <el-input v-model="state.ip2" name="ip" maxlength="4" size="mini" onkeyup="value=value.replace(/[^\d]/g,'')" @keyup="keyupEvent(2,$event)" @blur="submitIp"
                @input="(val) => checkVal(val,'2')" ref="ipinput2">
              </el-input>
              <div class="ip-dot"></div>
              <el-input v-model="state.ip3" name="ip" maxlength="4" size="mini" onkeyup="value=value.replace(/[^\d]/g,'')" @keyup="keyupEvent(3,$event)" @blur="submitIp"
                @input="(val) => checkVal(val,'3')" ref="ipinput3">
              </el-input>
              <div class="ip-dot"></div>
              <el-input v-model="state.ip4" name="ip" maxlength="4" size="mini" onkeyup="value=value.replace(/[^\d]/g,'')" @keyup="keyupEvent(4,$event)" @blur="submitIp"
                @input="(val) => checkVal(val,'4')" ref="ipinput4">
              </el-input>
            </div>

          </el-form-item>
          <el-form-item label="远程开关机端口" label-width="130px" prop="RemoteControlPort">
            <el-input v-model="state.formdata.RemoteControlPort" placeholder="远程开关机端口" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="运行音乐" label-width="130px" prop="RunningMusic">
            <el-select v-model="state.formdata.RunningMusic" placeholder="请选择" style="width:180px;" size="mini">
              <el-option v-for="(item,key) in state.musicOptions" :key="key" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="音量" label-width="130px" prop="Volume">
            <el-input-number v-model="state.formdata.Volume" :min="1" :max="100" label="音量" size="mini"></el-input-number>
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
import { onMounted, ref, reactive, provide } from 'vue'
import { useRouter } from 'vue-router'
import { GetAgvSettingList, AgvSetting, GetMusic } from '../service/getData'
import { ElMessage } from 'element-plus'
import emitter from 'tiny-emitter/instance'
const router = useRouter()
const state = reactive({
  ip1: null,
  ip2: null,
  ip3: null,
  ip4: null,
  ishow: true,
  pageCount: 0,
  form_type: 'add',
  totalCount: 0,
  queryform: {
    PageNum: 1,
    PageSize: 10,
    MapId: "1",
    AgvId: '',
    AgvName: '',
  },
  musicOptions: global_config.musicOptions,
  colorOptions: global_config.colorOptions,
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
  left_agv_type: agvtypeoption,
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
    AgvId: '',
    AgvName: '',
    AgvType: agvtypeoption[0].value,
    AgvIp: '',
    AgvPort: '8080',
    AgvLength: '1000',
    AgvWidth: '1000',
    AgvHeight: '1000',
    AlarmMusic: global_config.musicOptions[0],
    AvoidMusic: global_config.musicOptions[0],
    ChargeMusic: global_config.musicOptions[0],
    ChargingPileType: global_config.charg_Type[0].value,
    IdleMusic: global_config.musicOptions[0],
    RemoteControlIP: '192.168.1.1',
    RemoteControlPort: '8081',
    RunningMusic: global_config.musicOptions[0],
    Volume: '100',
    RunningLed: 'Green',
    AlarmLed: 'Red',
    AvoidLed: 'Bule',
    ChargeLed: 'White',
    IdleLed: 'Yellow',
  },
  formRules: {
    AgvId: [
      {
        required: true,
        message: 'AGVID不能为空',
        trigger: 'blur',
      }
    ],
    AgvName: [
      {
        required: true,
        message: 'AGV名称不能为空',
        trigger: 'blur',
      }
    ],
    AgvType: [
      {
        required: true,
        message: 'AGV类型不能为空',
        trigger: 'blur',
      }
    ],
    AgvPort: [
      {
        required: true,
        message: 'AGV端口不能为空',
        trigger: 'blur',
      }
    ],
    AgvLength: [
      {
        required: true,
        message: 'AGV长度不能为空',
        trigger: 'blur',
      }
    ],
    AgvWidth: [
      {
        required: true,
        message: 'AGV宽度不能为空',
        trigger: 'blur',
      }
    ],
    AgvHeight: [
      {
        required: true,
        message: 'AGV高度不能为空',
        trigger: 'blur',
      }
    ],
    AlarmMusic: [
      {
        required: true,
        message: '报警音乐不能为空',
        trigger: 'blur',
      }
    ],
    AvoidMusic: [
      {
        required: true,
        message: '避障音乐不能为空',
        trigger: 'blur',
      }
    ],
    ChargeMusic: [
      {
        required: true,
        message: '充电音乐不能为空',
        trigger: 'blur',
      }
    ],
    ChargingPileType: [
      {
        required: true,
        message: '充电桩不能为空',
        trigger: 'blur',
      }
    ],
    IdleMusic: [
      {
        required: true,
        message: '空闲音乐不能为空',
        trigger: 'blur',
      }
    ],
    RemoteControlIP: [
      {
        required: true,
        message: '远程开关机IP不能为空',
        trigger: 'blur',
      }
    ],
    RemoteControlPort: [
      {
        required: true,
        message: '远程开关机端口不能为空',
        trigger: 'blur',
      }
    ],
    RunningMusic: [
      {
        required: true,
        message: '运行音乐不能为空',
        trigger: 'blur',
      }
    ],
    Volume: [
      {
        required: true,
        message: '音量不能为空',
        trigger: 'blur',
      }
    ],
    RunningLed: [
      {
        required: true,
        message: '运行指示灯颜色不能为空',
        trigger: 'blur',
      }
    ],
    AlarmLed: [
      {
        required: true,
        message: '报警指示灯颜色不能为空',
        trigger: 'blur',
      }
    ],
    AvoidLed: [
      {
        required: true,
        message: '避障指示灯颜色不能为空',
        trigger: 'blur',
      }
    ],
    ChargeLed: [
      {
        required: true,
        message: '充电指示灯颜色不能为空',
        trigger: 'blur',
      }
    ],
    IdleLed: [
      {
        required: true,
        message: '空闲指示灯颜色不能为空',
        trigger: 'blur',
      }
    ],
  },
  AgvListOptions: agvlist,
})
const IpAddress = ref(null);
provide("IpAddress", IpAddress);
const ipinput1 = ref(null);
const ipinput2 = ref(null);
const ipinput3 = ref(null);
const ipinput4 = ref(null);
const add = () => {
  exit();
  state.form_type = 'add';
  state.isShowDialog = true;
  state.formdata.AgvIp = '192.168.1.1';
  state.formdata.RemoteControlIP = '192.168.1.1';
  IpAddress.value = '192.168.1.1';
  state.formdata.Operation = 'Add';
  splitIp();
}
const edit = (index, row) => {
  state.form_type = 'edit';
  state.isShowDialog = true;
  state.formdata = row;
  IpAddress.value = state.formdata.AgvIp;
  state.formdata.Operation = 'Update';
  splitIp();
}
const remove = (index, row) => {
  state.form_type = 'delete';
  state.formdata = row;
  state.formdata.Operation = 'Remove';
  AgvSetting(state.formdata).then(res => {
    ElMessage.success('已删除');
    initTable();
  });
}
const submitIp = () => {
  if (state.ip1 && state.ip2 && state.ip3 && state.ip4) {
    state.formdata.RemoteControlIP = state.ip1 + '.' + state.ip2 + '.' + state.ip3 + '.' + state.ip4;
  }
}
const checkVal = (val, key) => {
  if (parseInt(val) > 255) {
    switch (key) {
      case "1":
        state.ip1 = 255;
        ipinput2.value.focus();
        break;
      case "2":
        state.ip2 = 255;
        ipinput3.value.focus();
        break;
      case "3":
        state.ip3 = 255;
        ipinput4.value.focus();
        break;
      case "4":
        state.ip4 = 255;
        break;
      default:
        break;
    }
  } else if (parseInt(val) <= 255 && parseInt(val) >= 100) {
    switch (key) {
      case "1":
        ipinput2.value.focus();
        break;
      case "2":
        ipinput3.value.focus();
        break;
      case "3":
        ipinput4.value.focus();
        break;
      default:
        break;
    }
  }
}
const formaterAgvType = (type) => {
  let val = type.AgvType;
  state.left_agv_type.forEach(el => {
    if (el.value == val) {
      val = el.label;
    }
  })
  return val;
}
const keyupEvent = (index, e) => {
  if (e.keyCode === 37 || e.keyCode === 38) {
    if (index == 2) {
      ipinput1.value.focus();
    } else if (index == 3) {
      ipinput2.value.focus();
    } else if (index == 4) {
      ipinput3.value.focus();
    }
  }
  if (e.keyCode === 39 || e.keyCode === 40) {
    if (index == 1) {
      ipinput2.value.focus();
    } else if (index == 2) {
      ipinput3.value.focus();
    } else if (index == 3) {
      ipinput4.value.focus();
    }
  }
}
const splitIp = () => {
  if (state.formdata.RemoteControlIP) {
    let ipList = state.formdata.RemoteControlIP.split('.');
    state.ip1 = ipList[0];
    state.ip2 = ipList[1];
    state.ip3 = ipList[2];
    state.ip4 = ipList[3];
  }
}
const addOrEdit_Form = ref(null);
const submit = () => {
  addOrEdit_Form.value.validate((valid) => {
    if (valid) {
      AgvSetting(state.formdata).then(res => {
        let msg = state.form_type == 'add' ? '新增AGV配置信息成功' : state.form_type == 'edit' ? '修改AGV配置信息成功' : '已删除';
        ElMessage.success(msg);
        exit();
        initTable();
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
  state.tableData = state.tableData_old.filter(x => x.AgvId.indexOf(state.queryform.AgvId) != -1 && x.AgvName.indexOf(state.queryform.AgvName) != -1);
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
  GetAgvSettingList(state.queryform).then(res => {
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
};
const getMusic = () => {
  GetMusic().then(res => {
    if (res.data.data.length > 0) {
      state.musicOptions = res.data.data;
      global_config.musicOptions = res.data.data;
    }
  })
}

const formatterChargingPileType = (val) => {
  let type = val.ChargingPileType;
  if (type == "Normal") {
    type = "普通充电桩";
  }
  return type;
}
const formatterColors1 = (val) => {
  let color = val.RunningLed;
  return formatterColors(color);
}
const formatterColors2 = (val) => {
  let color = val.AlarmLed;
  return formatterColors(color);
}
const formatterColors3 = (val) => {
  let color = val.AvoidLed;
  return formatterColors(color);
}
const formatterColors4 = (val) => {
  let color = val.ChargeLed;
  return formatterColors(color);
}
const formatterColors5 = (val) => {
  let color = val.IdleLed;
  return formatterColors(color);
}
const formatterColors = (val) => {
  if (val == 'Red') {
    return '红色';
  }
  if (val == 'Green') {
    return '绿色';
  }
  if (val == 'Bule') {
    return '蓝色';
  }
  if (val == 'White') {
    return '白色';
  }
  if (val == 'Yellow') {
    return '黄色';
  }
  if (val == 'Cyan') {
    return '青色';
  }
  if (val == 'Carmine') {
    return '洋红色';
  }
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
  getMusic();
  emitter.on('getIpVal', val => {
    IpAddress.value = val;
    state.formdata.AgvIp = val;
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
  width: 30vw;
  height: 2vh;
  margin-top: 2vh;
  text-align: right;
}
:deep(.el-form-item__label) {
  color: white;
}
.ip-box {
  width: 200px;
  display: flex;
  align-items: cneter;
  position: relative;
  margin-top: 5px;
}
.ip-box :deep(.el-input__inner) {
  border: 0 !important;
}
.ip-box :deep(.el-input) {
  text-align: flex-start;
  width: 50px;
}
.ip-dot {
  width: 1px;
  height: 3px;
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
