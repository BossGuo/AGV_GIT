<template>
  <div>
    <div @mouseenter="leftshowenter" @mouseleave="leftshowleave" :class="state.showleft?'left_agv_div_show':'left_agv_div_hide'">
      <div style="height:6vh;line-height:6vh;">
        <div v-show="state.showleft" @click="agvlb_click" :class="state.left_active_key=='agvlist'?'left_div_titlle_active':'left_div_titlle_default'" style="margin-left:.5vw;">AGV列表</div>
        <div v-show="state.showleft" @click="xzrw_click" :class="state.left_active_key=='xzrw'?'left_div_titlle_active':'left_div_titlle_default'" style="">新增任务</div>
        <el-checkbox class="lock_left" v-if="state.showleft" v-model="state.locked_left">锁定</el-checkbox>
      </div>
      <div v-show="state.showleft" v-if="state.left_active_key=='agvlist'" class="left_div_show">
        <div style="float:left;color:white;">
          <div style="float:left;height:5vh;line-height:5vh;width:5vw;margin-top:.1vh;margin-left:1vw;">AGVID/名称</div>
          <el-input v-model="state.AgvSearchForm.AgvName" size="mini" style="width:7.5vw;margin-top:1vh;float:left;" placeholder="AGVID/名称" @change="changesearchform" />
          <div style="margin-top:1.1vh;float:left;margin-left:.2vw">
            <!-- <el-button size="mini" type="primary" class="el-icon-search" style="width:3.5vw;" @click="searchAgv">查询</el-button> -->
          </div>
          <img class="allon" src="../assets/images/关机on1.png" @click="runStopALL(6)" title="一键开机">
          <img class="alloff" src="../assets/images/关机off1.png" @click="runStopALL(5)" title="一键关机">
        </div>
        <div style="height:.2vh;width:22.2vw;float:left;margin-left:.2vw;border-top:1px dashed #735f5f;"></div>
        <div style="height:35vh;width:22.2vw;float:left;margin-left:.2vw;overflow-y: auto;overflow-x: hidden;">
          <div v-for="(el,key) in state.left_agv_data" :key="key" :class="el.Online?'left_agv_item':'left_agv_item_out'">
            <div class="agv_div">
              <img class="agvimg" src="../assets/images/agv_model.png" @click="location_AgvByXY(el)">
              <div class="agvname">
                <p>{{el.AgvName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <!-- <span v-if="el.Online" class="agvspanonline">&nbsp;&nbsp;在线&nbsp;&nbsp;</span>
                  <span v-else class="agvspan"> &nbsp;&nbsp;离线&nbsp;&nbsp;</span> -->
                </p>
                <p class="agvaddress">
                  <span class="agvspanonline" v-if="el.Alarms==0">&nbsp;&nbsp;未报警&nbsp;&nbsp;</span>
                  <span class="agvspan" v-else>&nbsp;&nbsp;已报警&nbsp;&nbsp;</span>
                  <span class="agvspankongxian" v-if="el.TaskState==0">&nbsp;&nbsp;空闲中&nbsp;&nbsp;</span>
                  <span class="agvspanrun" v-else-if="el.TaskState==1">&nbsp;&nbsp;任务执行中&nbsp;&nbsp;</span>
                  <span class="agvspanonline" v-else>&nbsp;&nbsp;任务完成&nbsp;&nbsp;</span>
                  <span class="agvspanonline" v-if="el.IsCharging==0">&nbsp;&nbsp;未充电&nbsp;&nbsp;</span>
                  <span class="agvspan" v-else>&nbsp;&nbsp;充电中&nbsp;&nbsp;</span>
                </p>
              </div>
              <p class="agv_operation">

                <!-- <img v-if="el.PowerState==6" class="onoroff" @click="runStop(el,5,'PowerState')" src="../assets/images/关机off1.png" title="关机">
              <img v-else class="onoroff" @click="runStop(el,6,'PowerState')" src="../assets/images/关机on1.png" title="开机"> -->
                <span v-if="el.PowerState==6" class="agv_button shut_down" @click="runStop(el,5,'PowerState')">&nbsp;&nbsp;关机&nbsp;&nbsp;</span>
                <span v-else class="agv_button power_on" @click="runStop(el,6,'PowerState')">&nbsp;&nbsp;开机&nbsp;&nbsp;</span>
                <!-- <img v-if="el.EnableState==4&&el.PowerState==6" class="runordisable" @click="runStop(el,3,'EnableState')" src="../assets/images/禁用.png" title="禁用">
              <img v-else-if="el.EnableState==3&&el.PowerState==6" class="runordisable" @click="runStop(el,4,'EnableState')" src="../assets/images/启动.png" title="启用">
              <img v-else-if="el.EnableState==4&&el.PowerState==5" class="runordisable_hide" src="../assets/images/禁用_hide.png" title="禁用(已关机)">
              <img v-else-if="el.EnableState==3&&el.PowerState==5" class="runordisable_hide" src="../assets/images/启动_hide.png" title="启用(已关机)"> -->
                <span v-if="el.EnableState==4&&el.PowerState==6" class="agv_button disable_agv" @click="runStop(el,3,'EnableState')">&nbsp;&nbsp;禁用&nbsp;&nbsp;</span>
                <span v-else-if="el.EnableState==3&&el.PowerState==6" class="agv_button enable_agv" @click="runStop(el,4,'EnableState')">&nbsp;&nbsp;启用&nbsp;&nbsp;</span>
                <span v-else-if="el.EnableState==4&&el.PowerState==5" class="agv_button sd_agv">&nbsp;&nbsp;禁用&nbsp;&nbsp;</span>
                <span v-else-if="el.EnableState==3&&el.PowerState==6" class="agv_button sd_agv">&nbsp;&nbsp;启用&nbsp;&nbsp;</span>
                <!-- <img v-if="el.RunState==2&&el.PowerState==6" class="runorstop" @click="runStop(el,1,'RunState')" src="../assets/images/stop_in.png" title="暂停">
              <img v-else-if="el.RunState==1&&el.PowerState==6" class="runorstop" @click="runStop(el,2,'RunState')" src="../assets/images/run_in.png" title="运行">
              <img v-else-if="el.RunState==2&&el.PowerState==5" class="runorstop_hide" src="../assets/images/stop_out.png" title="暂停(已关机)">
              <img v-else-if="el.RunState==1&&el.PowerState==5" class="runorstop_hide" src="../assets/images/run_out.png" title="运行(已关机)"> -->
                <span v-if="el.RunState==2&&el.PowerState==6" class="agv_button disable_agv" @click="runStop(el,1,'RunState')">&nbsp;&nbsp;暂停&nbsp;&nbsp;</span>
                <span v-else-if="el.RunState==1&&el.PowerState==6" class="agv_button enable_agv" @click="runStop(el,2,'RunState')">&nbsp;&nbsp;运行&nbsp;&nbsp;</span>
                <span v-else-if="el.RunState==2&&el.PowerState==5" class="agv_button sd_agv">&nbsp;&nbsp;暂停&nbsp;&nbsp;</span>
                <span v-else-if="el.RunState==1&&el.PowerState==5" class="agv_button sd_agv">&nbsp;&nbsp;运行&nbsp;&nbsp;</span>
              </p>
              <!-- <img v-if="!el.Online&el.TaskState==1" class="runorstop" src="../assets/images/stop_out.png">
                <img v-if="!el.Online&el.TaskState==0" class="runorstop" src="../assets/images/run_out.png"> -->

              <el-progress class="elprogressp" type="circle" :percentage="el.Soc" :width="40" :stroke-width="2"></el-progress>
              <!-- <el-checkbox class="checkagvlist" v-model="state.checkagv[key]" @change="handleChange(el,key)"></el-checkbox> -->

              <i v-if="state.showAgvsArr.indexOf(el.AgvId)>=0" class="agvbutton el-icon-caret-top" @click="left_agv_item_click_event(el.AgvId)"></i>
              <i v-else class="agvbutton el-icon-caret-bottom" @click="left_agv_item_click_event(el.AgvId)"></i>
            </div>
            <div :class="el.Online?'hidediv':'hidediv_out'" v-if="state.showAgvsArr.indexOf(el.AgvId)>=0">
              <el-row>
                <el-col :span="6">
                  <p class="hidediv_name">编号</p>
                  <p class="hidediv_value">{{el.AgvId}}</p>
                </el-col>
                <el-col :span="6">
                  <p class="hidediv_name">类型</p>
                  <p class="hidediv_value">{{formaterAgvType(el.AgvType)}}</p>
                </el-col>
                <el-col :span="6">
                  <p class="hidediv_name">载货状态</p>
                  <p class="hidediv_value">{{el.IsLoad?'载货':'未载货'}}</p>
                </el-col>
                <el-col :span="6">
                  <p class="hidediv_name">DI状态</p>
                  <p class="hidediv_value">{{el.DIState}}</p>
                </el-col>
                <el-col :span="6">
                  <p class="hidediv_name">长</p>
                  <p class="hidediv_value">{{el.Length}}mm</p>
                </el-col>
                <el-col :span="6">
                  <p class="hidediv_name">宽</p>
                  <p class="hidediv_value">{{el.Width}}mm</p>
                </el-col>
                <el-col :span="6">
                  <p class="hidediv_name">高</p>
                  <p class="hidediv_value">{{el.Height}}mm</p>
                </el-col>
                <el-col :span="6">
                  <el-col :span="6">
                    <p class="hidediv_name">DO状态</p>
                    <p class="hidediv_value">{{el.DOState}}</p>
                  </el-col>
                </el-col>
                <el-col :span="6">
                  <p class="hidediv_name">速度</p>
                  <p class="hidediv_value">{{el.Speed}}m/s</p>
                </el-col>
                <el-col :span="6">
                  <p class="hidediv_name">角度</p>
                  <p class="hidediv_value">{{formaterAngle(el.Angle)}}°</p>
                </el-col>
                <el-col :span="6">
                  <p class="hidediv_name">X</p>
                  <p class="hidediv_value">{{el.X}}mm</p>
                </el-col>
                <el-col :span="6">
                  <p class="hidediv_name">Y</p>
                  <p class="hidediv_value">{{el.Y}}mm</p>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
      <div v-show="state.showleft" v-else class="left_div_show">
        <div>
          <!-- <div style="width:100%;height:2vh;line-height:2vh;color:white;float:left;">
            <div style="height:5vh;line-height:5vh;width:5vw;margin-top:.1vh;float:left;margin-left:1vw;">任务名称：</div>
            <el-input v-model="addTaskForm.name" size="mini" style="width:15vw;float:left;" placeholder="清输入任务名称" />
          </div> -->
          <div style="float:left;color:white;">
            <div style="float:left;height:4vh;line-height:4vh;width:5vw;margin-top:.1vh;margin-left:1vw;">AGV类型：
              <el-select v-model="state.addTaskForm.AgvType" @change="changeAgvType" filterable placeholder="请选择" size="mini" style="width:7.5vw;margin-top:-3.2vh;margin-left:4vw;float:left;">
                <el-option v-for="item in state.left_agv_type" :key="item.id" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </div>
            <br />
            <div style="float:left;height:5vh;line-height:4vh;width:5vw;margin-top:.1vh;margin-left:1vw;">AGV名称：
              <el-select v-model="state.addTaskForm.AgvName" filterable placeholder="请选择" size="mini" style="width:7.5vw;margin-top:-3.2vh;margin-left:4vw;float:left;">
                <el-option key="0_0" label="自动" value="0"> </el-option>
                <el-option v-for="item in state.left_agv_datashow" :key="item.AgvId" :label="item.AgvName" :value="item.AgvId"> </el-option>
              </el-select>
              <div style="margin-top:-4vh;margin-left:12vw;float:left">
                <el-col :span="12">
                  <el-button size="mini" type="primary" @click="clean_add_task_form">清空</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button size="mini" type="success" style="margin-left:20px;" @click="submitTask">提交</el-button>
                </el-col>
              </div>
            </div>

          </div>
        </div>
        <div style="height:.2vh;width:22.5vw;float:left;margin-left:.2vw;border-top:1px dashed #735f5f;"></div>
        <div style="height:34vh;width:22.4vw;float:left;margin-left:.2vw;">
          <div style="height:4vh;line-height:4vh;color:white;font-size:1.2vw;padding-left:1vw;color:white;margin-top:1vh;">
            序列
            <!-- <el-button @click="add_ls_task_Event" style="float:right;margin-top:.5vh;margin-right:1.6vw;width:6.8vw;" size="mini" type="primary" icon="el-icon-plus">新增</el-button> -->
          </div>
          <div class="task_container">
            <el-table :data="state.addTaskForm.TaskNodes" :row-style="GetRowStyle" :cell-style="GetCellStyle" style="width: 99%;background:transparent;"
              :default-sort="{prop: 'date', order: 'descending'}" height="250">
              <el-table-column prop="sort_id" label="序号" width="80">
              </el-table-column>
              <el-table-column prop="NodeId" label="站点">
              </el-table-column>
              <el-table-column prop="Action" label="动作类型" :formatter="GetActIdName">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template v-slot="scope">
                  <i class="el-icon-setting" style="cursor:pointer;" @click="edit_xl(scope)" title="编辑"></i>
                  <i class="el-icon-delete" style="cursor:pointer;" @click="del_xl(scope)" title="删除"></i>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <div @mouseenter="rightshowenter" @mouseleave="rightshowleave" :class="state.showright?'right_agv_div_show':'right_agv_div_hide'">
      <div style="text-align:left;color:#01C3FF;margin-left:1vw;font-size:1.2vw;">
        <span v-show="state.showright" style="line-height:60px;">报警列表</span>
        <el-checkbox class="lock_right" v-if="state.showright" v-model="state.locked_right">锁定</el-checkbox>
      </div>
      <div v-show="state.showright" style="float:left;color:white;">
        <div style="float:left;height:5vh;line-height:5vh;width:5vw;margin-top:.1vh;margin-left:1vw;">设备编号:</div>
        <el-input v-model="state.AlarmSearchForm.AgvId" size="mini" style="width:12.5vw;margin-top:1vh;float:left;" placeholder="清输入设备编号" />
        <div style="margin-top:1.1vh;float:left;margin-left:.7vw">
          <!-- <el-button size="mini" type="primary" style="width:3vw;" @click="searchAlarm">查询</el-button> -->
        </div>
      </div>
      <div v-show="state.showright" style="height:.2vh;width:22.2vw;float:left;margin-left:.2vw;border-top:1px dashed #735f5f;"></div>
      <div v-show="state.showright" class="right_div_show">
        <div v-for="(el,key) in state.alarms_Data" :key="key+'_'+el.AlarmId" class="left_agv_item">
          <div>
            <img class="agvimg" src="../assets/images/agv_model.png" @click="location_Alarms_AGV(el)">
            <div class="agvname">
              <p>{{el.DeviceId}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </p>
              <p class="agvaddress">报警类型：{{el.AlarmType}}</p>
            </div>
            <!-- <i v-if="state.showAlarmArr.indexOf(el.AlarmId)>=0" class="agvbutton el-icon-caret-top" @click="right_alarm_item_click_event(el.AlarmId)"></i>
            <i v-else class="agvbutton el-icon-caret-bottom" @click="right_alarm_item_click_event(el.AlarmId)"></i> -->
          </div>
          <!-- v-if="state.showAlarmArr.indexOf(el.AlarmId)>=0" -->
          <div class="hidediv">
            <el-row>
              <el-col :span="8">
                <p class="hidediv_name">报警时间</p>
                <p class="hidediv_value">{{formatterATime(el.AlarmTime)}}</p>
              </el-col>
              <el-col :span="8">
                <p class="hidediv_name">持续时间</p>
                <p class="hidediv_value">{{formatterTimeLen(el.TimeLen)}}</p>
              </el-col>
              <el-col :span="8">
                <p class="hidediv_name">报警ID</p>
                <p class="hidediv_value">{{el.AlarmId}}</p>
              </el-col>
              <el-col :span="8">
                <p class="hidediv_name">报警码</p>
                <p class="hidediv_value">{{el.AlarmCode}}</p>
              </el-col>
              <el-col :span="8">
                <p class="hidediv_name">报警描述</p>
                <p class="hidediv_value" :title="el.AlarmInfo">{{formatterAInfo(el.AlarmInfo)}}</p>
              </el-col>
              <el-col :span="8">
                <p class="hidediv_name">处理方法</p>
                <p class="hidediv_value">{{el.ProcessingMethod}}</p>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>

    <div @mouseenter="bottomshowenter" @mouseleave="bottomshowleave" :class="state.showbottom?'bottom_agv_div_show':'bottom_agv_div_hide'">
      <div style="text-align:left;width:98vw;color:#01C3FF;margin-left:1vw;font-size:1.2vw;">
        <span v-if="state.showbottom" style="line-height:60px;">任务列表</span>
        <span v-else style="line-height:70px;">任务列表</span>
        <span v-if="!state.showbottom" style="line-height:60px;font-size:18px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          运行中任务量：{{state.task_list_Data.filter(x=>x.TaskState=='Running').length}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          等待中任务量：{{state.task_list_Data.filter(x=>x.TaskState=='Waitting').length}}
        </span>
        <el-checkbox class="lock_bottom" v-if="state.showbottom" v-model="state.locked_bottom">锁定</el-checkbox>
      </div>
      <el-table v-show="state.showbottom" :data="state.task_list_Data" :row-style="GetRowStyle" :cell-style="GetCellStyle" style="width:99%;background-color: rgb(0, 11, 35, 0.8);"
        :default-sort="{prop: 'date', order: 'descending'}" height="270">
        <el-table-column prop="TaskId" label="任务编码" sortable align="center" width="360" show-overflow-tooltip>
          <template v-slot="scope">
            <textarea cols="40" rows="1" :id="'selecttaskid'+scope.$index" class="textareaselect" @click="copyCode(scope.$index,scope.row)">{{scope.row.TaskId}}</textarea>
          </template>
        </el-table-column>
        <el-table-column prop="AgvId" label="AGV编码" sortable align="center" width="120">
        </el-table-column>
        <el-table-column prop="Priority" label="优先级" sortable align="center" width="100">
        </el-table-column>
        <el-table-column prop="TaskState" label="任务状态" sortable :formatter="formatterstatus" align="center" width="100">
        </el-table-column>
        <el-table-column prop="TaskType" label="任务类型" sortable align="center" width="100">
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" sortable :formatter="formatTimes" align="center" width="150">
        </el-table-column>
        <el-table-column prop="StartTime" label="开始执行时间" sortable :formatter="formatStartTimes" align="center" width="150">
        </el-table-column>
        <el-table-column prop="StartTime" label="任务关键点集" sortable align="center" width="480">
          <template v-slot="scope">
            <div style="width:600px;max-width:600px;overflow-x:auto;">
              <div :style="1==1?'width:'+scope.row.TaskNodes.length*380+'px':''">
                <span v-for="(obj,index) in scope.row.TaskNodes" :key="index" :style="index==0?'':'margin-left:1vw;'" style="float:left;background:#178a90;padding:0px 5px;">
                  序号：{{index+1}}-站点：{{obj.NodeId }}-动作：{{GetActIdName(obj) }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template v-slot="scope">
            <el-button size="mini" icon="el-icon-s-order" @click="taskStateEdit(scope.$index, scope.row,1)">执行</el-button>
            <el-button :disabled="scope.row.TaskState!='Running'" size="mini" icon="el-icon-s-order" @click="taskStateEdit(scope.$index, scope.row,2)">完成</el-button>
            <el-button size="mini" icon="el-icon-s-order" @click="taskStateEdit(scope.$index, scope.row,0)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-dialogdrag class="my_dialog">
      <el-dialog :title="state.xl_dialog_name" v-model="state.isShowAddOrEdit_XL_Dialog" width="17%" :modal="false" :close-on-click-modal="false">
        <div style="height:15vh;width:15vw;padding-left:1vw;">
          <div style="height:5vh;float:left;">
            <div style="height:5vh;line-height:5vh;font-size:1vw;float:left;width:6.5vw;color:white;">站点名称/ID：</div>
            <div style="float:left;width:8vw;">
              <el-input readonly v-model="state.xl_dialog_form.NodeName" size="small" style="margin-top:.8vh;width:8vw;" placeholder="单击选择站点" @click="chose_station_Btn_Click_Event"></el-input>
              <el-input readonly v-model="state.xl_dialog_form.NodeId" v-show="false" size="small" style="margin-top:.8vh;width:8vw;" placeholder="单击选择站点" @click="chose_station_Btn_Click_Event">
              </el-input>
            </div>
          </div>
          <div style="height:5vh;float:left;">
            <div style="height:5vh;line-height:5vh;font-size:1vw;width:6.5vw;float:left;color:white;">动作类型：</div>
            <el-select v-model="state.xl_dialog_form.Action" placeholder="请选择" size="small" style="width:8vw;margin-top:1vh;">
              <el-option v-for="item in state.action_ops" :key="item.ActId" :label="item.Action" :value="item.ActId">
              </el-option>
            </el-select>
          </div>
          <div style="float:left;width:14.5vw;height:5vh;text-align:right;">
            <el-button type="primary" @click="ok_addOredit_xl_Event">确定</el-button>
            <el-button type="danger" @click="cancel_addOredit_xl_Event">取消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { reactive } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { getStore } from '../utils/utils';
import moment from 'moment'
import emitter from 'tiny-emitter/instance'
import { ElMessage } from 'element-plus'
import { GetAgvListByMapId, GetStationActionList, AgvOperation, TaskStateEdit, TaskAdd } from '../service/getData'
const router = useRouter()
const state = reactive({
  left_active_key: 'agvlist',
  left_agv_data: [],
  left_agv_datashow: [],
  left_agv_type: agvtypeoption,
  left_agv_data_old: [],
  action_ops: [],//新增序列弹窗中动作类型下拉选择数据容器
  ActionOptions: [],
  task_list_Data: [],//任务列表数据容器
  isShowAddOrEdit_XL_Dialog: false, //是否展示添加或者编辑任务序列对话框
  xl_dialog_type: 'add',
  xl_dialog_name: '新增序列',
  xl_dialog_form: { NodeId: '', Action: 0 },//新增或者编辑序列对话框
  current_xh: 1,//用于当前新增序列中的序号
  addTaskForm: { MapId: '', AgvId: 0, AgvName: '0', AgvType: agvtypeoption[0].value, Priority: 'high', TaskNodes: [] },//左侧新增任务的数据容器
  AgvSearchForm: { AgvId: '', AgvName: '', NodeName: '' },
  AlarmSearchForm: { AgvId: '', },
  alarms_Data: [],
  alarms_Data_old: [],
  showbottom: false,//bottom显隐
  showleft: false,//
  showright: false,//
  showAgvsArr: [],//左侧需要展开的AGVID容器
  showAlarmArr: [],//右侧需要展开的容器
  mapid: "",
  checkagv: [],
  locked_left: false,
  locked_right: false,
  locked_bottom: false,
  runStop_lock: true,
})
const changeAgvType = computed(() => {
  let data = state.left_agv_data_old;
  if (state.addTaskForm.AgvType != "") {
    state.left_agv_datashow = data.filter(x => x.AgvType == state.addTaskForm.AgvType);
  } else {
    state.left_agv_datashow = data;
  }
  return data;
});

const leftshowenter = () => {
  state.showleft = true;
}
const leftshowleave = () => {
  if (!state.locked_left) {
    state.showleft = false;
  }
}

const rightshowenter = () => {
  state.showright = true;
}
const rightshowleave = () => {
  if (!state.locked_right) {
    state.showright = false;
  }
}

const bottomshowenter = () => {
  state.showbottom = true;
}
const bottomshowleave = () => {
  if (!state.locked_bottom) {
    state.showbottom = false;
  }
}



const formatterATime = (val) => {
  let reval = moment(val).format("YYYY年MM月DD日 HH时mm分ss秒");
  return reval;
}
const formatterTimeLen = (val) => {
  let reval = Math.round(val / 60);
  let s = val % 60
  return reval + "分" + s + "秒";
}
const formatterAInfo = (val) => {
  let revel = val;
  if (val.length > 18) {
    revel = revel.slice(0, 15) + "...";
  }
  return revel;
}
const formaterAgvType = (type) => {
  let val = type;
  state.left_agv_type.forEach(el => {
    if (el.value == type) {
      val = el.label;
    }
  })
  return val;
}
const formaterAngle = (type) => {
  return type.toFixed(1);
}
const copyCode = (index, row) => {
  var copycode = document.getElementById("selecttaskid" + index);
  copycode.select();
  // var copycode = row.TaskId;
  document.execCommand("Copy"); // 执行浏览器复制命令
  ElMessage("已复制好，可贴粘。");
}
const runStop = (item, type, state) => {
  if (state.runStop_lock) {
    state.runStop_lock = !state.runStop_lock;
    AgvOperation(state.mapid, item.AgvId, type).then(res => {
      if (res.data.code == 0) {
        state.runStop_lock = !state.runStop_lock;
        ElMessage({
          message: '执行成功',
          type: 'success'
        });
        const el = item;
        if (state == 'PowerState') {
          el.PowerState = type;
        } else if (state == 'EnableState') {
          el.EnableState = type;
        } else if (state == 'RunState') {
          el.RunState = type;
        }
      } else {
        ElMessage.error(res.data.message);
      }
    })
  } else {
    ElMessage.error('请勿重复提交');
  }
}
const runStopALL = (type) => {
  AgvOperation(state.mapid, 0, type).then(res => {
    if (res.data.code == 0) {
      ElMessage({
        message: '执行成功',
        type: 'success'
      });
    } else {
      ElMessage.error(res.data.message);
    }
  })
}
const changesearchform = () => {
  state.AgvSearchForm.AgvId = '';
}
const taskStateEdit = (index, item, type) => {
  TaskStateEdit(state.mapid, item.TaskId, type).then(res => {
    if (res.data.code == 0) {
      ElMessage({
        message: '修改成功：',
        type: 'success'
      });
    } else {
      ElMessage.error(res.data.message);
    }
  })
}
const GetActIdName = (val) => {
  let action = val.Action;
  let list = state.ActionOptions.filter(x => x.Action == val.Action);
  if (list.length > 0) {
    action = list[0].Action;
  }
  return action;
}
const agvlb_click = () => {
  state.left_active_key = 'agvlist';
  emitter.emit('chose_Station_Event', false);
}
const xzrw_click = () => {
  state.left_active_key = 'xzrw';
  state.addTaskForm.AgvId = 0;
  state.addTaskForm.AgvName = '0';
  emitter.emit('chose_Station_Event', true);
}
//左侧agv列表中展开按钮事件
const left_agv_item_click_event = (agvid) => {
  if (state.showAgvsArr.indexOf(agvid) < 0) {
    state.showAgvsArr.push(agvid)
  } else {
    state.showAgvsArr = state.showAgvsArr.filter(x => x != agvid)
  }
}
//右侧需要展开的容器
const right_alarm_item_click_event = (DeviceId) => {
  if (state.showAlarmArr.indexOf(DeviceId) < 0) {
    state.showAlarmArr.push(DeviceId)
  } else {
    state.showAlarmArr = state.showAlarmArr.filter(x => x != DeviceId)
  }
}
//监听到地图切换所需要做的事件集合
const change_Map_Event = (mapid) => {
  //获取站点动作列表
  GetStationActionList_Method()
  //重新渲染AGV列表
  GetAgvList(mapid)
}
//获取站点动作列表
const GetStationActionList_Method = () => {
  GetStationActionList().then(res => {
    if (res.data.code == 0) {
      state.ActionOptions = res.data.data;
      state.action_ops = res.data.data;
    } else {
      ElMessage.error(res.data.message);
    }
  })
}
//获取AGV列表
const GetAgvList = (mapid) => {
  GetAgvListByMapId(mapid).then(res => {
    if (res.data.code == 0) {
      state.left_agv_data_old = res.data.data;
      agvlist = res.data.data;
      state.left_agv_data = res.data.data;
      state.left_agv_datashow = res.data.data;
      state.left_agv_data.forEach(el => {
        state.checkagv.push(false);
      })
    } else {
      ElMessage.error(res.data.message);
    }
  })
}
const handleChange = (item, key) => {
  state.checkagv.forEach((el, index) => {
    if (index != key) {
      state.checkagv[index] = false;
    }
  })
  if (state.checkagv[key]) {
    ElMessage({
      message: '订阅' + item.AgvName + '路线成功',
      type: 'success',
    })
    emitter.emit('change_Active_AgvID_Event', item.AgvId);
  } else {
    ElMessage({
      message: '取消订阅' + item.AgvName + '路线成功',
      type: 'success',
    })
    emitter.emit('change_Active_AgvID_Event', null);
  }
}
//报警列表某一行单击定位事件
const location_Alarms_AGV = (row) => {
  if (true) {
    //判断为AGV报警
    // let position = { X: agv.X, Y: agv.Y, ID: agv.AgvId, MapId: row.MapId };
    if (state.mapid == row.MapId) {
      let agv = state.left_agv_data.filter(x => x.AgvId == row.DeviceId)[0];
      let position = { X: agv.X, Y: agv.Y, ID: agv.AgvId, MapId: row.MapId };
      emitter.emit("Locate_AgvByXY", position);
    } else {
      let position = { ID: row.DeviceId, MapId: row.MapId };
      emitter.emit("change_Map_Event_Alarm", position);
    }
  } else if (false) {
    //判断为其他设备报警
  }
}
//定位AGV事件
const location_AgvByXY = (agv) => {
  let position = { X: agv.X, Y: agv.Y, ID: agv.AgvId };
  emitter.emit("Locate_AgvByXY", position);
}
//左侧AGV面板字段过滤器
// GetTaskStatus(val) {
//   return val == 0 ? '空闲' : (val == '1' ? '任务执行中' : '任务完成')
// },
//格式化报警列表中的报警时间
const formatterAlarmTime = (row) => {
  return moment(row.AlarmTime).format('MM/DD HH:mm:ss')
}
//清空新增任务容器
const clean_add_task_form = () => {
  state.current_xh = 1;
  state.addTaskForm = { MapId: '', AgvId: 0, AgvName: '0', AgvType: agvtypeoption[0].value, Priority: 'high', TaskNodes: [] };
}
//提交任务
const submitTask = () => {
  state.addTaskForm.MapId = state.mapid;
  state.addTaskForm.AgvId = state.addTaskForm.AgvName == '0' ? "0" : state.addTaskForm.AgvName;
  let post_data = JSON.parse(JSON.stringify(state.addTaskForm));
  delete post_data.AgvName
  TaskAdd(post_data).then(res => {
    if (res.data.code == 0) {
      state.addTaskForm = { MapId: '', AgvId: 0, AgvName: '0', Priority: 'high', TaskNodes: [] };
      ElMessage.success("任务提交成功");
    } else {
      ElMessage.error(res.data.message);
    }
  });
}
//左侧序列某一行中的编辑图标点击事件
const edit_xl = (xl) => {
  state.xl_dialog_type = "edit";
  state.xl_dialog_name = "编辑序列";
  Object.assign(state.xl_dialog_form, xl.row)
  state.isShowAddOrEdit_XL_Dialog = true;
}
//左侧序列某一行中删除图标点击事件
const del_xl = (xl) => {
  let row_xh = xl.row.sort_id;
  state.addTaskForm.TaskNodes = state.addTaskForm.TaskNodes.filter(x => x.sort_id != row_xh);
  state.addTaskForm.TaskNodes.filter(x => x.sort_id > row_xh).forEach(el => el.sort_id--);
  state.current_xh--;
}
//新增序列对话框中选择站点输入框点击事件
const chose_station_Btn_Click_Event = () => {
  state.isShowAddOrEdit_XL_Dialog = false;
  emitter.emit('chose_Station_Event', true);//打开地图站点拾取开关
}
//新增或者编辑序列对话框Dialog中,确定按钮点击事件
const ok_addOredit_xl_Event = () => {
  if (state.xl_dialog_form.NodeId == "") {
    ElMessage.error('请选择站点之后进行保存操作!');
    return;
  } else if (state.xl_dialog_form.Action == "") {
    ElMessage.error('请选择站点对应动作之后再进行保存操作!');
    return;
  } else {
    let myMethod = state.xl_dialog_type == 'add' ? () => {
      state.addTaskForm.TaskNodes.push({ sort_id: state.current_xh, NodeId: state.xl_dialog_form.NodeId, Action: state.xl_dialog_form.Action })
    } : () => {
      let row = state.addTaskForm.TaskNodes.filter(x => x.sort_id == state.xl_dialog_form.sort_id)[0];
      row.NodeId = state.xl_dialog_form.NodeId;
      row.Action = state.xl_dialog_form.Action;
    };
    myMethod();
    state.current_xh++;
    state.isShowAddOrEdit_XL_Dialog = false;
    state.xl_dialog_type = 'add';
    state.xl_dialog_name = '新增序列';
    ElMessage.success('新增成功');
  }
}
//新增或者编辑序列对话框中,取消按钮点击事件
const cancel_addOredit_xl_Event = () => {
  state.isShowAddOrEdit_XL_Dialog = false;
  state.xl_dialog_type = 'add';
  state.xl_dialog_name = '新增序列';
}
//序列新增按钮点击事件
const add_ls_task_Event = () => {
  state.xl_dialog_type = 'add';
  state.xl_dialog_name = '新增序列';
  state.xl_dialog_form = { sort_id: '', NodeId: '', Action: '', NodeName: '' };
  state.isShowAddOrEdit_XL_Dialog = true;
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
const formatTimes = (val) => {
  let reval = moment(val.CreateTime).format('YYYY-MM-DD HH:mm:ss');
  return reval;
}
const formatStartTimes = (val) => {
  if (!val.StartTime) {
    return "--";
  }
  let reval = moment(val.StartTime).format('YYYY-MM-DD HH:mm:ss');
  return reval;
}
const GetRowStyle = ({ row, rowIndex }) => {
  if (rowIndex % 2 != 0) {
    return 'background-color:rgba(0,0,0,.5);color:white; border:none'
  }
}
// 动态获取单元格样式
const GetCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex % 2 != 0) {
    return 'background-color:rgba(0,0,0,.5);color:white; border:none'
  } else {
    return 'background-color:rgba(0,0,0,.2);color:white; border:none'
  }
}
const execute = (index, item) => {
  ElMessage('执行');
}
const complete = (index, item) => {
  ElMessage('完成');
}
const exit = (index, item) => {
  ElMessage('取消');
}
onMounted(() => {
  state.mapid = getStore('mapid');
  change_Map_Event(state.mapid);
  //通过scoket获取到实时agv信息,
  emitter.on("ReceiveAgvRuntimeInfo", data => {
    state.left_agv_data_old.forEach(el => {
      Object.assign(el, data.filter(x => x.AgvId == el.AgvId)[0])
    });
    state.left_agv_data = state.left_agv_data_old
    if (state.AgvSearchForm.AgvName != '') {
      state.left_agv_data = state.left_agv_data_old.filter(x => x.AgvId.indexOf(state.AgvSearchForm.AgvName) != -1 | x.AgvName.indexOf(state.AgvSearchForm.AgvName) != -1 | x.AgvId == state.AgvSearchForm.AgvId);
    }
  });
  emitter.on("choseOkStation", station => {
    state.xl_dialog_form.NodeName = station.text == "" ? station.id : station.text;
    state.xl_dialog_form.NodeId = station.id;
    state.action_ops = [];
    state.ActionOptions.forEach(el => {
      let index = el.NodeType.indexOf(station.Type)
      if (index != -1) {
        state.action_ops.push(el);
      }
    })
    state.xl_dialog_form.Action = '';
    state.isShowAddOrEdit_XL_Dialog = true;
    //emitter.emit('chose_Station_Event', false);//关闭地图站点拾取开关
  })
  emitter.on("Alarms_Info_Change_Event", data => {
    state.alarms_Data_old = data;
    state.alarms_Data = data;
    if (state.AlarmSearchForm.AgvId != '') {
      state.alarms_Data = state.alarms_Data_old.filter(x => x.DeviceId.indexOf(state.AlarmSearchForm.AgvId) != -1);
    }
  });
  emitter.on("Task_Info_Change_Event", data => {
    state.task_list_Data = data;
  });
  //监听完报警世间点击定位图标之后的事件
  emitter.on('change_map_ok_event', data => {
    state.mapid = data.MapId;
    change_Map_Event(state.mapid);
    GetAgvListByMapId(state.mapid).then(res => {
      if (res.data.code == 0) {
        let agv = res.data.data.filter(x => x.AgvId == data.id)[0];
        let position = { X: agv.X, Y: agv.Y };
        emitter.emit("Locate_AgvByXY", position);
      }
    })
  });
  emitter.on('change_Map_Event', mapid => {
    state.mapid = mapid;
    change_Map_Event(state.mapid)
  });
  emitter.on('agvlocation', item => {
    state.AgvSearchForm.AgvId = item.AgvId;
    state.AgvSearchForm.AgvName = item.AgvName;
    state.left_agv_data.forEach((el, key) => {
      if (el.AgvId == item.AgvId) {
        state.checkagv[key] = true;
      }
    });
  });
});
onUnmounted(() => {
  emitter.emit('chose_Station_Event', false);
})
</script>

<style scoped>
.my_dialog :deep(.el-dialog) {
  background: #349ea9e6;
}
.my_dialog :deep(.el-icon-close:before) {
  color: white;
}
.my_dialog :deep(.el-dialog__title) {
  color: white;
}
.my_dialog :deep(.el-dialog__body) {
  padding: 0px !important;
}
.my_dialog :deep(.input__inner) {
  color: black !important;
}
.left_agv_div_show :deep(.el-input__inner) {
  background-color: #3a272700;
  color: white !important;
}
.agv_div {
  height: 52px;
}
.agvimg {
  float: left;
  cursor: pointer;
  margin-top: -3px;
  margin-left: 10px;
  width: 40px;
}
.agvname {
  width: 200px;
  height: 50px;
  margin-left: 70px;
  line-height: 10px;
}
.allon {
  width: 30px;
  height: 30px;
  margin-left: 10px;
  margin-top: 10px;
  cursor: pointer;
}
.alloff {
  width: 30px;
  height: 30px;
  margin-left: 10px;
  margin-top: 10px;
  cursor: pointer;
}
.onoroff {
  float: right;
  width: 20px;
  height: 20px;
  margin-right: 8vw;
  margin-top: -45px;
  cursor: pointer;
}
.runordisable {
  float: right;
  width: 20px;
  height: 20px;
  margin-right: 6.6vw;
  margin-top: -45px;
  cursor: pointer;
}
.runordisable_hide {
  float: right;
  width: 20px;
  height: 20px;
  margin-right: 6.6vw;
  margin-top: -45px;
}
.runorstop {
  float: right;
  width: 20px;
  height: 20px;
  margin-right: 5.5vw;
  margin-top: -45px;
  cursor: pointer;
}
.runorstop_hide {
  float: right;
  width: 20px;
  height: 20px;
  margin-right: 5.5vw;
  margin-top: -45px;
}
.agvrun {
  width: 20px;
  height: 20px;
}
.elprogressp {
  float: right;
  margin-top: -5.6vh;
  margin-right: 1.8vw;
}
:deep(.el-progress__text) {
  margin-left: -3px;
}
.agvspanonline {
  border: 1px solid #08a4ec;
  border-radius: 10px;
  background-color: #08a4ec;
  color: white;
  font-size: 10px;
}
.agvspankongxian {
  border: 1px solid #858888;
  border-radius: 10px;
  background-color: #858888;
  color: white;
  font-size: 10px;
}
.agvspanrun {
  border: 1px solid #13cf32;
  border-radius: 10px;
  background-color: #13cf32;
  color: white;
  font-size: 10px;
}
.agv_button {
  color: white;
  font-size: 10px;
  cursor: pointer;
}
.shut_down {
  border: 1px solid #e43b07;
  border-radius: 10px;
  background-color: #e43b07;
}
.power_on {
  border: 1px solid #13cfa0;
  border-radius: 10px;
  background-color: #13cfa0;
}
.disable_agv {
  border: 1px solid #e43b07;
  border-radius: 10px;
  background-color: #e43b07;
}
.enable_agv {
  border: 1px solid #13cfa0;
  border-radius: 10px;
  background-color: #13cfa0;
}
.sd_agv {
  border: 1px solid #858888;
  border-radius: 10px;
  background-color: #858888;
}
.agv_operation {
  float: left;
  width: 220px;
  color: rgb(128, 126, 126);
  font-size: 10px;
  margin-top: -50px;
  margin-left: 220px;
}
.checkagv {
  float: left;
  margin-left: 200px;
  margin-top: -36px;
}
.checkagvlist {
  float: left;
  margin-left: 370px;
  margin-top: -53px;
}
.agvspan {
  border: 1px solid #f97000;
  border-radius: 10px;
  background-color: #f97000;
  color: white;
  font-size: 10px;
}
.agvaddress {
  float: left;
  width: 220px;
  color: rgb(128, 126, 126);
  font-size: 10px;
  margin-top: -2px;
}
.agvbutton {
  float: right;
  margin-top: -4.5vh;
  margin-right: 0.5vw;
  cursor: pointer;
}
.hidediv {
  height: 18vh;
  width: 21vw;
  margin-left: 0.5vw;
  margin-bottom: 1vh;
  border-radius: 10px;
  background: rgb(23, 36, 78);
}
.hidediv_out {
  height: 18vh;
  width: 21vw;
  margin-left: 0.5vw;
  margin-bottom: 1vh;
  border-radius: 10px;
  background: #4f4f53;
}
.hidediv_name {
  font-size: 10px;
  line-height: 10px;
  color: rgb(156, 154, 154);
  margin-left: 20px;
  width: 60px;
}
.hidediv_value {
  width: 120px;
  font-size: 12px;
  line-height: 12px;
  margin-left: 20px;
}
.elprogress {
  float: right;
  margin-top: 5vh;
  margin-right: 1vw;
}

.triangleRight {
  margin-top: 15px;
  width: 0;
  height: 0;
  border-left: 30px solid rgb(17, 231, 167);
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  -webkit-transform: scale(0.6, 1.2);
  -moz-transform: scale(0.6, 1.2);
  transform: scale(0.6, 1.2);
}
.pause {
  margin-top: 15px;
  width: 5px;
  height: 22px;
  background: rgb(17, 231, 167);
  float: left;
}
.pause1 {
  margin-left: 7px;
}
.triangleRightout {
  margin-top: 15px;
  width: 0;
  height: 0;
  border-left: 30px solid rgb(103, 104, 103);
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  -webkit-transform: scale(0.6, 1.2);
  -moz-transform: scale(0.6, 1.2);
  transform: scale(0.6, 1.2);
}
.pauseout {
  margin-top: 15px;
  width: 5px;
  height: 22px;
  background: rgb(103, 104, 103);
  float: left;
}
</style>

<style>
.el-progress__text {
  color: white !important;
}
.task_container {
  height: 26vh;
  width: 22.3vw;
  background: rgba(0, 0, 0, 0.2);
  max-height: 26vh;
}

.el-table td,
.el-table th.is-leaf {
  border: none !important;
}
.el-table::before {
  height: 0px !important;
  border: none !important;
}
.el-table th,
.el-table tr {
  background: transparent !important;
  border: none !important;
}
.left_div_titlle_default {
  text-align: center;
  width: 6vw;
  float: left;
  color: #01c3ff;
  cursor: pointer;
  font-size: 1.2vw;
}
.left_div_titlle_active {
  text-align: center;
  width: 6vw;
  float: left;
  color: #01fcff;
  border-bottom: 1px solid #01fcff;
  cursor: pointer;
  font-size: 1.2vw;
}
.left_agv_div_show {
  position: absolute;
  z-index: 3;
  top: 12vh;
  width: 23vw;
  height: 50vh;
  left: 1vw;
  background-image: url("../assets/images/little.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.left_agv_div_hide {
  position: absolute;
  z-index: 3;
  top: 12vh;
  width: 3vw;
  height: 30vh;
  left: 1vw;
  background-image: url("../assets/images/agvlist_hidden.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.lock_left {
  margin-left: 6.5vw;
  margin-top: 1vh;
  width: 10px;
  cursor: pointer;
}
.lock_right {
  margin-left: 13vw;
  margin-top: 1vh;
  width: 10px;
  cursor: pointer;
}
.lock_bottom {
  margin-left: 88vw;
  margin-top: 1vh;
  width: 10px;
  cursor: pointer;
}
.right_agv_div_show {
  position: absolute;
  z-index: 2;
  top: 12vh;
  width: 23vw;
  height: 50vh;
  right: 1vw;
  background-image: url("../assets/images/little.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.right_agv_div_hide {
  position: absolute;
  z-index: 2;
  top: 12vh;
  width: 3vw;
  height: 30vh;
  right: 1vw;
  background-image: url("../assets/images/alarmlist_hidden.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.bottom_agv_div_show {
  user-select: text;
  width: 98vw;
  height: 35vh;
  position: absolute;
  bottom: 1vh;
  margin-left: 1vw;
  background-image: url("../assets/images/bottom.png");
  background-size: 100% 100%;
}
.bottom_agv_div_hide {
  width: 98vw;
  height: 8vh;
  position: absolute;
  bottom: 1vh;
  margin-left: 1vw;
  background-image: url("../assets/images/tasklist_hidden.png");
  background-size: 100% 100%;
}

.left_div_show {
  height: 38.8vh;
  width: 22.4vw;
  margin-top: 1vh;
  margin-left: 0.2vw;
  max-height: 38.8vh;
  background-color: rgb(0, 11, 35, 0.8);
}
.left_agv_item {
  width: 22vw;
  margin-top: 0.2vh;
  border: 1px solid #023c64;
  border-radius: 5px;
  color: white;
  background-color: #023c64;
}
.left_agv_item_out {
  width: 22vw;
  margin-top: 0.2vh;
  border: 1px solid #4f4f53;
  border-radius: 5px;
  color: white;
  background-color: #4f4f53;
}
.right_div_show {
  height: 35vh;
  width: 22.2vw;
  float: left;
  margin-left: 0.2vw;
  overflow: auto;
  background-color: rgb(0, 11, 35, 0.8);
}

.textareaselect {
  height: 18px;
  line-height: 18px;
  width: 300px;
  background-color: black;
  color: white;
  font-size: 16px;
  font-weight: 200;
  border: 1px solid black !important;
  resize: none;
  outline: none;
  margin-top: 6px;
}
</style>
