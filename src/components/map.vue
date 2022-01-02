<template>
  <div id="mapcontainer">
    <canvas id="agv_canvas" :width=mapData.width :height=mapData.height v-if="showCanvas"></canvas>
  </div>
  <div @mouseleave.stop="menuItem_mse_out_Event" @mouseover="menu_msIn_Event('gongju')" class="gongju_menu_conotainer" v-if="mapData.isShowMenu=='gongju'">
    <div class="ment_item" style="cursor:default;">
      <el-col :span="10">切换地图:</el-col>
      <select v-model="mapData.mapid" style="width:100px;height:25px;outline:none;" @change="map_Change_Event">
        <option v-for="(item,index) in map_options" :key="index" :value="item.value">{{item.label}}</option>
      </select>
      <!-- <el-select class="elselect" v-model="mapData.mapid" placeholder="请选择" size="mini">
          <el-option v-for="item in map_options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
    </div>
    <div class="ment_item" style="cursor:default;">
      <el-col :span="10">地图工具:</el-col>
      <el-col :span="5" style="margin-left:13px;">
        <img src="../assets/images/zoomout.png" class="zoomimg" @click="zoomOutMap" />
      </el-col>
      <el-col :span="5">
        <img src="../assets/images/zoomin.png" class="zoomimg" @click="zoomInMap" />
      </el-col>
      <el-col :span="5">
        <img src="../assets/images/rocate_90.png" class="zoomimg" @click="map_Rocate" />
      </el-col>
    </div>
    <div class="ment_item" style="cursor:default;">
      <el-col :span="10">节点查询:</el-col>
      <el-col :span="10" style="margin-left:13px;">
        <select v-model="node_val" style="width:100px;height:25px;outline:none;" placeholder="查询" size="mini" clearable :clear="node_opts_val=node_opts" filterable :filter-method="filter_Node_Method"
          @change="find_node" :popper-append-to-body="false">
          <option v-for="(item,index) in node_opts_val" :key="index" :value="item.node_id" :label="item.node_name"></option>
        </select>
      </el-col>
    </div>
    <div class="ment_item" style="cursor:default;">
      <div style="float:left;width:68px;">系统设置:</div>
      <div style="float:left;margin-left:13px;">
        <el-switch v-model="mapData.sys_control" active-color="#13ce66" inactive-color="#C0C0C0" active-text="运行" inactive-text="暂停" @change="SetSystemcontrol_Method" />
      </div>
    </div>
    <div class="ment_item" style="cursor:default;">
      <div style="float:left;width:68px;">任务模式:</div>
      <div style="float:left;margin-left:13px;">
        <el-switch v-model="mapData.task_mode" active-color="#13ce66" inactive-color="#C0C0C0" active-text="自动" inactive-text="手动" @change="SetTask_Mode_Method" />
      </div>
    </div>
  </div>
  <!-- 气泡 -->
  <div id="agv_bubble" class="left_agv_item" :style="true?mapData.bubbleStyle:'position:absolute;'" v-if="mapData.isShowBubble">
    <div id="agv_bubble_top" class="agv_bubble_top">
      <div class="agvname">
        <p style="line-height:60px;">{{mapData.clickname}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span v-show="mapData.datatype!='door'&&mapData.datatype!='node'" class="agvspanonline">&nbsp;&nbsp; {{mapData.Online=="0"?'离线':'在线'}}&nbsp;&nbsp;</span>
          <span v-show="['door','node'].indexOf(mapData.datatype)>=0">{{mapData.clickid}}</span>
        </p>
      </div>
    </div>
    <img src="../assets/images/bubbleclose.png" class="bubble_top_img" @click="closeForm" />
    <div class="hidediv">
      <el-row v-if="mapData.datatype=='agv'">
        <el-col :span="18">
          <el-col :span="8" v-for="(item,index) in  mapData.bubbleData" :key="index">
            <p class="hidediv_name">{{item.cn}}</p>
            <p class="hidediv_value">{{item.value}}</p>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-progress class="elprogress" type="circle" :percentage="mapData.Soc" :width="80" :stroke-width="4"></el-progress>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="6" v-for="(item,index) in mapData.bubbleData" :key="index">
          <p class="hidediv_name">{{item.cn}}</p>
          <p class="hidediv_value">{{item.value}}</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import moment from 'moment';
import { useStore } from 'vuex';
import { setStore } from '../utils/utils'
import emitter from 'tiny-emitter/instance'
import { ElMessage } from 'element-plus'
import { GetMapFilesByMapId, SetTaskMode, GetMapList, SetSystemcontrol, GetSytemstatus, GetShowNamesNode } from '../service/getData'
const showCanvas = ref(true);
const node_opts = ref([]);
const node_val = ref(['']);
const node_opts_val = ref([]);
const store = useStore();
let scoket_timeInterval = {};

let mapData = reactive({
  sys_control: true,
  task_mode: true,
  mapid: '',
  stage: {},
  scene: null,
  height: 0,
  width: 0,
  showNameNodes: [],
  door_normal_pic: "door_normal",
  door_alert_pic: "door_alert",
  o_x_right_img: "o_x_right",
  o_x_bottom_img: "o_x_bottom",
  o_x_left_img: "o_x_left",
  o_x_top_img: "o_x_top",
  o_y_top_img: "o_y_top",
  o_y_right_img: "o_y_right",
  o_y_bottom_img: "o_y_bottom",
  o_y_left_img: "o_y_left",

  ccsred: "ccsred",
  ccsgreen: "ccsgreen",
  ccsblue: "ccsblue",
  ccstraffic: "ccstraffic",
  qysagv_traffic: "qysagv_traffic",
  qysred: "qysred",
  qysgreen: 'qysgreen',
  qysblue: 'qysblue',
  qfjssagv_traffic: "qfjssagv_traffic",
  qfjssred: "qfjssred",
  qfjssgreen: "qfjssgreen",
  qfjssblue: "qfjssblue",
  gtsagv_traffic: 'gtsagv_traffic',
  gtsred: 'gtsred',
  gtsgreen: 'gtsgreen',
  gtsblue: 'gtsblue',
  qxjsc_traffic: 'qxjsc_traffic',
  qxjscred: 'qxjscred',
  qxjscgreen: 'qxjscgreen',
  qxjscblue: 'qxjscblue',

  rocate_num: 0,
  ActiveAgvId: '',
  isShowBubble: false,
  bubbleStyle: {
    height: "32vh",
    width: "22vw",
    top: "20vh",
    left: "20vw",
    position: "absolute"
  },
  clickname: '',
  clickid: '',
  datatype: '',
  Soc: '',
  Online: '',
  bubbleType: '',
  bubbleData: [],
  clickNode: '',
  isPickStation: false,
  ActiveDeviceId: '',
  route_arr: [],
  isShowMenu: false,//工具箱
})
const GetImg = (name) => {
  const path = '../assets/images/' + name + '.png';
  const modules = import.meta.globEager('../assets/images/*.png');
  return modules[path].default;
}
const GetAgvImg = (name) => {
  const path = '../assets/images/AGV/' + name + '.png';
  const modules = import.meta.globEager('../assets/images/AGV/*.png');
  return modules[path].default;
}
const find_node = () => {
  let node = mapData.scene.findElements(x => x.nodeid == node_val.value)[0]
  if (node != undefined) {
    let position = { X: node._x, Y: node._y };
    emitter.emit('Locate_AgvByXY', position);
  }
}
const map_options = ref([]);
const scoketData = reactive({
  map_data_scoket: {},
  alarms_scoket: {},
  logs_scoket: {},
  tasks_scoket: {},
  scoket_map_Path: map_config.map_data_scoket_url,
  scoket_alarm_Path: map_config.alarms_scoket_url,//报警频道
  scoket_log_Path: map_config.logs_scoket_url,//日志频道
  scoket_tasks_Path: map_config.tasks_scoket_url,//任务频道
  scoket_Map_Data_HeartData: {
    Src: "UIServiceTemp", Time: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  scoket_Alarms_Data_HeartData: {
    Src: "UIServiceTemp", Time: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  scoket_Logs_Data_HeartData: {
    Src: "UIServiceTemp", Time: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  scoket_Tasks_Data_HeartData: {
    Src: "UIServiceTemp", Time: moment().format('YYYY-MM-DD HH:mm:ss')
  },
})
const filter_Node_Method = (val) => {
  let isNumber = parseFloat(val).toString() != "NaN";
  node_opts_val.value = node_opts.value.filter(x => (isNumber && x.node_id == parseInt(val)) || x.node_name.indexOf(val) >= 0)
}
const get_rocate_xy = loc => {
  let new_loc = loc;
  if (mapData.rocate_num == 1) {
    new_loc = rocate_Method(loc);
    new_loc = rocate_Method(new_loc);
    new_loc = rocate_Method(new_loc);
  } else if (mapData.rocate_num == 2) {
    new_loc = rocate_Method(loc);
    new_loc = rocate_Method(new_loc);
  } else if (mapData.rocate_num == 3) {
    new_loc = rocate_Method(loc);
  }
  return new_loc;
}
const rocate_Method = loc => {
  let obj = {};
  if (loc.x >= 0 && loc.y >= 0) {
    obj.x = loc.y;
    obj.y = -1 * loc.x;
    return obj;
  } else if (loc.x >= 0 && loc.y <= 0) {
    obj.x = 1 * loc.y;
    obj.y = -1 * loc.x;
    return obj;
  } else if (loc.x <= 0 && loc.y <= 0) {
    obj.x = 1 * loc.y;
    obj.y = -1 * loc.x;
    return obj;
  } else {
    obj.x = loc.y;
    obj.y = -1 * loc.x;
    return obj;
  }
}
const clickPoint = (e) => {
  if (document.documentElement.clientWidth - e.layerX < 430) {
    mapData.bubbleStyle.left = (document.documentElement.clientWidth - 430) + 'px';
  } else {
    mapData.bubbleStyle.left = e.layerX + 'px';
  }
  mapData.bubbleStyle.top = (e.layerY + 17) + 'px';
  let obj = JSON.parse(e.target.info);
  mapData.clickname = obj["Name"];
  mapData.clickid = 'ID:' + e.target.nodeid;
  mapData.datatype = obj.datatype;
  mapData.bubbleData = global_config.node_CN;
  mapData.bubbleData.forEach(el => {
    el.value = obj[el.en] + el.unit;
  })
  mapData.isShowBubble = true;
  moveDiv();
}
const initMapById = () => {
  GetMapFilesByMapId(mapData.mapid).then(res => {
    let data = res.data.data;
    var canvas = document.getElementById('agv_canvas');
    mapData.stage = new JTopo.Stage(canvas);
    mapData.stage.wheelZoom = null;
    mapData.stage.setCenter(300, 300);
    mapData.scene = new JTopo.Scene(mapData.stage);
    mapData.stage.dragable = false;
    mapData.scene.frames = 0;
    mapData.stage.addEventListener("mousewheel", eventHandler => {
      if (eventHandler.deltaY < 0) {
        mapData.stage.zoomOut(0.85)
      } else {
        mapData.stage.zoomIn(0.85)
      }
    });
    initMapZero();
    var nodeStart = null;
    var nodeEnd = null;
    var link;
    data.Segments.forEach((l) => {
      let start_node = data.Nodes.filter(x => x.NodeId == l.StartNodeId);
      let end_node = data.Nodes.filter(x => x.NodeId == l.EndNodeId);
      if (start_node.length > 0) {
        nodeStart = new JTopo.Node();
        let loc = get_rocate_xy({ x: 1 * (start_node[0].X / 10) - (map_config.node_width / 2), y: -1 * (start_node[0].Y / 10) + (map_config.node_height / 2) });
        if (node_opts.value.filter(x => x.node_id == start_node[0].NodeId).length <= 0) {
          node_opts.value.push({
            node_id: start_node[0].NodeId,
            node_name: start_node[0].Name == undefined ? start_node[0].NodeId : start_node[0].Name
          })
        };
        nodeStart.setCenterLocation(loc.x, loc.y);
        nodeStart.borderRadius = 3.2;
        // nodeStart.text = start_node[0].NodeId;
        nodeStart.text = mapData.showNameNodes.indexOf(start_node[0].NodeId) < 0 ? '' : (start_node[0].Name == undefined ? start_node[0].NodeId : start_node[0].Name); // 文字
        nodeStart.font = '16px 微软雅黑'; // 字体
        nodeStart.id = start_node[0].NodeId;
        nodeStart.nodeid = start_node[0].NodeId;
        nodeStart._x = start_node[0].X;//初始坐标
        nodeStart._y = start_node[0].Y;//初始坐标
        start_node[0].datatype = "node";
        nodeStart.info = JSON.stringify(start_node[0]);
        nodeStart.setSize(map_config.node_width, map_config.node_height);
        nodeStart.textPosition = 'Bottom_Right';// 文字居中
        nodeStart.zIndex = 15;
        nodeStart.dragable = false;
        nodeStart.Type = start_node[0].Type;
        mapData.scene.add(nodeStart);
        nodeStart.click(function (e) {
          mapData.clickNode = e.target.id;
          e.shadow = false;
          e.showSelected = true;
          if (mapData.isPickStation) {
            emitter.emit("choseOkStation", e.target);
          } else {
            clickPoint(e);//点击站点
          }
        });
      }
      if (end_node.length > 0) {
        nodeEnd = new JTopo.Node();
        let loc_end = get_rocate_xy({ x: 1 * end_node[0].X / 10 - (map_config.node_width / 2), y: -1 * end_node[0].Y / 10 + (map_config.node_height / 2) });
        nodeEnd.setCenterLocation(loc_end.x, loc_end.y);
        if (node_opts.value.filter(x => x.node_id == end_node[0].NodeId).length <= 0) {
          node_opts.value.push({
            node_id: end_node[0].NodeId,
            node_name: end_node[0].Name == undefined ? end_node[0].NodeId : end_node[0].Name
          })
        };
        nodeEnd.borderRadius = 3.2;
        // nodeEnd.text = end_node[0].NodeId;
        nodeEnd.text = mapData.showNameNodes.indexOf(end_node[0].NodeId) < 0 ? '' : (end_node[0].Name == undefined ? end_node[0].NodeId : end_node[0].Name); // 文字
        nodeEnd.font = '16px 微软雅黑'; // 字体
        nodeEnd.id = end_node[0].NodeId;
        nodeEnd._x = end_node[0].X;//初始坐标
        nodeEnd._y = end_node[0].Y;//初始坐标
        end_node[0].datatype = "node";
        nodeEnd.setSize(map_config.node_width, map_config.node_height);
        nodeEnd.info = JSON.stringify(end_node[0]);
        nodeEnd.textPosition = 'Bottom_Right';// 文字居中
        nodeEnd.dragable = false;
        nodeEnd.Type = end_node[0].Type;
        mapData.scene.add(nodeEnd);
        nodeEnd.click(function (e) {
          mapData.clickNode = e.target.id;
          e.shadow = false;
          e.showSelected = true;
          if (mapData.isPickStation) {
            emitter.emit("choseOkStation", e.target)
          } else {
            clickPoint(e);//点击站点
          }
        });
      }
      node_opts_val.value = node_opts.value;
      //绘制直线
      if (l.Type == 0) {
        if (nodeStart !== null && nodeEnd !== null) {
          link = new JTopo.Link(nodeStart, nodeEnd);
          link.isGl = false;
          link.linkid = nodeStart.id + "_" + nodeEnd.id + '&' + nodeEnd.id + "_" + nodeStart.id;
          link.id = l.SegId;
          link.lineWidth = map_config.line_width;
          mapData.scene.add(link);
          link.click(e => {
            // _self.clickLike = e.target.info;
          });
          nodeStart = null;
          nodeEnd = null;
        }
      } //绘制圆弧
      else if (l.Type == 1) {
        let start_node = data.Nodes.filter(x => x.NodeId == l.StartNodeId)[0];
        let end_node = data.Nodes.filter(x => x.NodeId == l.EndNodeId)[0];
        //计算圆弧的半径
        let radius_yh = Math.sqrt(Math.pow(parseFloat(l.ArcCenter.X - start_node.X), 2) + Math.pow(parseFloat(l.ArcCenter.Y - start_node.Y), 2));
        // var arc = new THREE.ArcCurve(l.ArcCenter.X, l.ArcCenter.Y, radius_yh, ((360 - l.StartAngle) * Math.PI) / 180, ((360 - l.EndAngle) * Math.PI) / 180, true); // 圆心  半径  起始角度
        var arc = new THREE.ArcCurve(l.ArcCenter.X, l.ArcCenter.Y, radius_yh, ((90 - l.StartAngle) * Math.PI) / 180, ((90 - l.EndAngle) * Math.PI) / 180, l.ArcClockwise != 0); // 圆心  半径  起始角度

        var points = arc.getPoints(100)
        for (var i = 0; i < points.length - 1; i++) {
          let start = new JTopo.Node();
          let loc = get_rocate_xy({ x: 1 * (points[i].x / 10) - (map_config.node_width / 2), y: -1 * (points[i].y / 10) + (map_config.node_height / 2) });
          start.setCenterLocation(loc.x, loc.y);
          start.setSize(map_config.node_width, map_config.node_height);
          let end = new JTopo.Node();
          let loc_end = get_rocate_xy({ x: 1 * (points[i + 1].x / 10) - (map_config.node_width / 2), y: -1 * (points[i + 1].y / 10) + (map_config.node_height / 2) });
          end.setCenterLocation(loc_end.x, loc_end.y);
          end.setSize(map_config.node_width, map_config.node_height);
          link = new JTopo.Link(start, end);
          link.lineWidth = map_config.line_width;
          link.isGl = false;
          link.linkid = l.StartNodeId + "_" + l.EndNodeId + '&' + l.EndNodeId + "_" + l.StartNodeId;
          mapData.scene.add(link);
        }
        //绘制贝塞尔曲线
      } else if (l.Type == 2) {
        let statrNode = mapData.scene.findElements(x => x.nodeid == l.StartNodeId)[0];
        let endNode = mapData.scene.findElements(x => x.nodeid == l.EndNodeId)[0];
        let p1_loc = { x: statrNode._x, y: statrNode._y };
        let p2_loc = { x: l.ControlPoint1.X, y: l.ControlPoint1.Y };
        let p3_loc = { x: l.ControlPoint2.X, y: l.ControlPoint2.Y };
        let p4_loc = { x: endNode._x, y: endNode._y };

        var p1 = new THREE.Vector3(p1_loc.x, p1_loc.y);
        var p2 = new THREE.Vector3(p2_loc.x, p2_loc.y, 0);
        var p3 = new THREE.Vector3(p3_loc.x, p3_loc.y, 0);
        var p4 = new THREE.Vector3(p4_loc.x, p4_loc.y);
        var curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4).getPoints(300);
        for (var i = 0; i < curve.length - 1; i++) {
          let start = new JTopo.Node();
          let loc = get_rocate_xy({ x: 1 * (curve[i].x / 10) - (map_config.node_width / 2), y: -1 * (curve[i].y / 10) + (map_config.node_height / 2) });
          start.setCenterLocation(loc.x, loc.y);
          start.setSize(map_config.node_width, map_config.node_height);
          let end = new JTopo.Node();
          let loc_end = get_rocate_xy({ x: 1 * (curve[i + 1].x / 10) - (map_config.node_width / 2), y: -1 * (curve[i + 1].y / 10) + (map_config.node_height / 2) });
          end.setCenterLocation(loc_end.x, loc_end.y);
          end.setSize(map_config.node_width, map_config.node_height);
          link = new JTopo.Link(start, end);
          link.lineWidth = map_config.line_width;
          link.isGl = false;
          link.linkid = statrNode.id + "_" + endNode.id + '&' + endNode.id + "_" + statrNode.id;
          mapData.scene.add(link);
        }
      }
    })
    if (data.Devices != undefined) {
      data.Devices.forEach((el, key) => {
        if (el.Type == 0) {
          el.datatype = 'door';
          let info = JSON.stringify(el);
          let door_node = new JTopo.Node();
          let pos = get_rocate_xy({ x: (el.X / 10), y: -1 * (el.Y / 10) });
          door_node.setCenterLocation(pos.x, pos.y);
          door_node.alpha = 1;
          door_node.setImage(mapData.door_normal_pic);
          door_node.info = info;
          door_node.font = '6px 微软雅黑'; // 字体
          door_node.id = '自动门_' + el.Id;
          door_node.deviceid = el.Id;
          door_node.type = 'device'
          door_node.setSize(30, 30);
          door_node.zIndex = mapData.isPickStation ? 10 : 20;
          door_node.dragable = false;
          door_node.click(e => {
            mapData.bubbleStyle.left = e.layerX + 'px';
            mapData.bubbleStyle.top = e.layerY + 'px';
            let obj = JSON.parse(e.target.info) //属性信息
            mapData.clickname = obj.Name;
            mapData.datatype = obj.datatype;
            mapData.bubbleType = 'Device';//设备属性气泡
            mapData.ActiveDeviceId = el.Id;
            mapData.bubbleData = global_config.door_CN;
            mapData.bubbleData.forEach(el => {
              el.value = obj[el.en] + el.unit;
            })
            mapData.isShowBubble = true;
          })
          mapData.scene.add(door_node);
        }
      })
    }
    expandCanvas();
    initScoket('all');
  })
};
const initMapZero = () => {
  let pos_1 = get_rocate_xy({ x: -1500, y: 0 });
  let pos_2 = get_rocate_xy({ x: 1500, y: 0 });
  let pos_3 = get_rocate_xy({ x: 0, y: -1500 });
  let pos_4 = get_rocate_xy({ x: 0, y: 1500 });
  let o_nodes = [{ x: pos_1.x, y: pos_1.y, id: "o_0" }, { x: pos_2.x, y: pos_2.y, id: "o_1" }, { x: pos_3.x, y: pos_3.y, id: "o_2" }, { x: pos_4.x, y: pos_4.y, id: "o_3" }];
  o_nodes.forEach(el => {
    let o_node = new JTopo.Node();
    if (mapData.rocate_num == 0) {
      o_node.setCenterLocation(1 * (el.x / 10) - 16, -1 * (el.y / 10));
    }
    else if (mapData.rocate_num == 1) {
      o_node.setCenterLocation(1 * (el.x / 10) - 16, -1 * (el.y / 10) - 16);
    } else if (mapData.rocate_num == 2) {
      o_node.setCenterLocation(1 * (el.x / 10), -1 * (el.y / 10) - 16);
    }
    else {
      o_node.setCenterLocation(1 * (el.x / 10), -1 * (el.y / 10));
    }
    o_node.alpha = 1;
    o_node.text = 'X';
    o_node.fontColor = '26,250,41';
    o_node.textOffsetY = -5
    if (el.id == "o_0") {
      if (mapData.rocate_num == 0) {
        o_node.visible = false;
      }
      else if (mapData.rocate_num == 1) {
        o_node.textPosition = 'Middle_Right';
        o_node.setImage(GetImg(mapData.o_x_bottom_img));
      }
      else if (mapData.rocate_num == 2) {
        o_node.visible = false;
      }
      else if (mapData.rocate_num == 3) {
        o_node.textPosition = 'Top_Center';
        o_node.setImage(GetImg(mapData.o_x_top_img));
      }
    }
    else if (el.id == "o_1") {
      o_node.text = 'X';
      o_node.textOffsetY = -5
      o_node.fontColor = '26,250,41';
      if (mapData.rocate_num == 0) {
        o_node.textPosition = 'Middle_Right';
        o_node.setImage(GetImg(mapData.o_x_right_img));
      }
      else if (mapData.rocate_num == 1) {
        o_node.visible = false;
      }
      else if (mapData.rocate_num == 2) {
        o_node.textPosition = 'Middle_Left';
        o_node.setImage(GetImg(mapData.o_x_left_img));
      }
      else if (mapData.rocate_num == 3) {
        o_node.visible = false;
      }
    }
    else if (el.id == "o_2") {
      o_node.fontColor = '250,250,210';
      o_node.text = 'Y';
      if (mapData.rocate_num == 0) {
        o_node.visible = false;
      }
      else if (mapData.rocate_num == 1) {
        o_node.textPosition = 'Top_Center';
        o_node.setImage(GetImg(mapData.o_y_right_img));
      }
      else if (mapData.rocate_num == 2) {
        o_node.visible = false;
      }
      else if (mapData.rocate_num == 3) {
        o_node.setImage(GetImg(mapData.o_y_left_img));
      }
    }
    else if (el.id == "o_3") {
      o_node.fontColor = '250,250,210';
      o_node.text = 'Y';
      if ([0, 4].indexOf(mapData.rocate_num) >= 0) {
        o_node.textPosition = 'Top_Center';
        o_node.setImage(GetImg(mapData.o_y_top_img));
      } else if (mapData.rocate_num == 1) {
        o_node.visible = false;
      }
      else if (mapData.rocate_num == 2) {
        o_node.textPosition = 'Bottom_Center';
        o_node.setImage(GetImg(mapData.o_y_bottom_img));
      } else if (mapData.rocate_num == 3) {
        o_node.visible = false;
      }
    }
    o_node.font = '24px 微软雅黑'; // 字体
    o_node.id = el.id;
    o_node.zIndex = 15;
    o_node.selected = false;
    o_node.dragable = false;
    o_node.editAble = false;
    o_node.showSelected = false;
    mapData.scene.add(o_node);
  })
  let x_start_node = mapData.scene.findElements(x => x.id == "o_0")[0];
  let x_end_node = mapData.scene.findElements(x => x.id == "o_1")[0];
  let y_start_node = mapData.scene.findElements(x => x.id == "o_2")[0];
  let y_end_node = mapData.scene.findElements(x => x.id == "o_3")[0];
  let xlink = new JTopo.Link(x_start_node, x_end_node);
  let ylink = new JTopo.Link(y_start_node, y_end_node);
  xlink.strokeColor = '26,250,41';
  xlink.lineWidth = '3';
  ylink.strokeColor = '250,250,210';
  ylink.lineWidth = '3';
  mapData.scene.add(xlink);
  mapData.scene.add(ylink);
};
const expandCanvas = () => {
  mapData.scene.centerAndZoom();
  mapData.stage.zoomIn(0.85)
};
const map_Rocate = () => {
  mapData.rocate_num = mapData.rocate_num <= 2 ? ++mapData.rocate_num : 0
  map_Change_Event();
}
const map_Change_Event = () => {
  mapData.stage.remove(mapData.scene);
  mapData.scene.clear();
  mapData.stage.clear();
  showCanvas.value = false;
  nextTick(() => {
    showCanvas.value = true;
    initMapById();
  })
  emitter.emit('change_Map_Event', mapData.mapid);
}
//初始化地图数据Scoket接口
const initScoket = (type) => {
  if (typeof (WebSocket) === "undefined") {
    alert("您的浏览器不支持socket")
  } else {
    if (type == 'all' || type == 'map_data') {
      //地图数据Scoket
      scoketData.map_data_scoket = new WebSocket(scoketData.scoket_map_Path + mapData.mapid);
      scoketData.map_data_scoket.onopen = () => { console.log("地图数据频道订阅成功成功") };
      scoketData.map_data_scoket.onerror = () => { console.log('地图数据频道连接错误') };
      scoketData.map_data_scoket.onmessage = GetRealTime_Maps_Data_Data;
    }
    if (type == 'all' || type == 'alarms') {
      //报警Scoket
      scoketData.alarms_scoket = new WebSocket(scoketData.scoket_alarm_Path);
      scoketData.alarms_scoket.onopen = () => { console.log("报警频道订阅成功") };
      scoketData.alarms_scoket.onerror = () => { console.log('报警频道连接错误') };
      scoketData.alarms_scoket.onmessage = GetRealTime_Alarms_Data_Data;
    }
    if (type == 'all' || type == 'logs') {
      //日志Scokrt
      scoketData.logs_scoket = new WebSocket(scoketData.scoket_log_Path);
      scoketData.logs_scoket.onopen = () => { console.log("日志频道订阅成功") };
      scoketData.logs_scoket.onerror = () => { console.log('日志频道连接错误') };
      scoketData.logs_scoket.onmessage = GetRealTime_Logs_Data_Data;
    }
    if (type == 'all' || type == 'tasks') {
      //任务Scoket
      scoketData.tasks_scoket = new WebSocket(scoketData.scoket_tasks_Path);
      scoketData.tasks_scoket.onopen = () => { console.log("任务频道订阅成功") };
      scoketData.tasks_scoket.onerror = () => { console.log('任务频道连接错误') };
      scoketData.tasks_scoket.onmessage = GetRealTime_Tasks_Data_Data;
    }
  }
}

const GetRealTime_Maps_Data_Data = msg => {
  let node = JSON.parse(msg.data);
  if (node.Heart != undefined) {//心跳数据
    scoketData.scoket_Map_Data_HeartData = node.Heart;
  }
  if (node.UpdateAgv != undefined) {
    node.UpdateAgv.forEach(el => {
      el.datatype = "agv";
      el.Agvname = el.AgvId;
      // el.Length = 1000;
      // el.Width = 1200;
      // el.Height = 700;
      //先移除该ID的上一个AGV实体
      let mynode = mapData.scene.findElements(x => x.id == el.AgvId && x.inLinks == null);
      if (mynode.length > 0) {
        mapData.scene.remove(mynode[0]);
      }
      let loc = {};
      let agvNode = new JTopo.Node();
      if (mapData.rocate_num == 0) {
        let x = 1 * (el.X) / 10 - el.Length / 20;
        let y = 16 - (el.Y) / 10 - el.Width / 20;
        loc = get_rocate_xy({ x, y });
        agvNode.rotate = (-1 * (el.Angle + (mapData.rocate_num * 90))) * Math.PI / 180;
      } else if (mapData.rocate_num == 1) {
        let x = el.X / 10 - el.Width / 20;
        let y = el.Length / 20 - el.Y / 10;
        loc = get_rocate_xy({ x, y });
        agvNode.rotate = (-1 * (el.Angle - (mapData.rocate_num * 90))) * Math.PI / 180;
      }
      else if (mapData.rocate_num == 2) {
        let x = (el.X) / 10 + el.Length / 20 - 16;
        let y = el.Width / 20 - el.Y / 10;
        loc = get_rocate_xy({ x, y });
        agvNode.rotate = (-1 * (el.Angle + (mapData.rocate_num * 90))) * Math.PI / 180;
      }
      else {
        let x = (el.X) / 10 + el.Width / 20 - 16;
        let y = 16 - (el.Y) / 10 - el.Length / 20;
        loc = get_rocate_xy({ x, y });
        agvNode.rotate = (-1 * (el.Angle - (mapData.rocate_num * 90))) * Math.PI / 180;
      }
      agvNode.setCenterLocation(loc.x, loc.y);
      agvNode.id = el.AgvId;
      agvNode.type = 'agv';
      agvNode.deviceid = el.AgvId;
      agvNode.text = el.AgvId;
      // agvNode.text = el.AgvId;
      agvNode.font = '20px 微软雅黑';
      agvNode.data = el;
      agvNode.textPosition = 'Bottom_Center';
      agvNode.dragable = false;
      if (el.AgvType == 'Fork') {
        if (el.Alarms !== "0") {//如果报警码不等于0或者状态为'不可用'
          agvNode.setImage(mapData.ccsred)//红色
        }
        else if (el.TrafficControl === 1) {//交通管制
          agvNode.setImage(mapData.ccstraffic)//绿色
        }
        else if (el.IsCharging === 1) {//充电
          agvNode.setImage(mapData.ccsgreen)//绿色
        }
        else {//其余
          agvNode.setImage(mapData.ccsblue)//蓝色
        }
        //叉车式AGV
      } else if (el.AgvType == 'Trac') {
        //牵引式AGV
        if (el.Alarms !== "0") {//如果报警码不等于0或者状态为'不可用'
          agvNode.setImage(mapData.qysred)//红色
        }
        else if (el.TrafficControl === 1) {//交通管制
          agvNode.setImage(mapData.qysagv_traffic)//绿色
        }
        else if (el.IsCharging === 1) {//充电
          agvNode.setImage(mapData.qysgreen)//绿色
        }
        else {//其余
          agvNode.setImage(mapData.qysblue)//蓝色
        }
      } else if (el.AgvType == 'Lift') {
        //潜伏举升式AGV
        if (el.Alarms !== "0") {//如果报警码不等于0或者状态为'不可用'
          agvNode.setImage(mapData.qfjssred)//红色
        }
        else if (el.TrafficControl === 1) {//交通管制
          agvNode.setImage(mapData.qfjssagv_traffic)//绿色
        }
        else if (el.IsCharging === 1) {//充电
          agvNode.setImage(mapData.qfjssgreenj)//绿色
        }
        else {//其余
          agvNode.setImage(mapData.qfjssblue)//蓝色
        }
      } else if (el.AgvType == 'Roller') {
        //滚筒AGV
        if (el.Alarms !== "0") {//如果报警码不等于0或者状态为'不可用'
          agvNode.setImage(mapData.gtsred)//红色
        }
        else if (el.TrafficControl === 1) {//交通管制
          agvNode.setImage(mapData.gtsagv_traffic)//绿色
        }
        else if (el.IsCharging === 1) {//充电
          agvNode.setImage(mapData.gtsgreen)//绿色
        }
        else {//其余
          agvNode.setImage(mapData.gtsblue)//蓝色
        }
      } else if (el.AgvType == 'LaserAllRoundJackAgv') {
        //全向举升车
        if (el.Alarms !== "0") {//如果报警码不等于0或者状态为'不可用'
          agvNode.setImage(mapData.qxjscred)//红色
        }
        else if (el.TrafficControl === 1) {//交通管制
          agvNode.setImage(mapData.qxjsc_traffic)//绿色
        }
        else if (el.IsCharging === 1) {//充电
          agvNode.setImage(mapData.qxjscgreen)//绿色
        }
        else {//其余
          agvNode.setImage(mapData.qxjscblue)//蓝色
        }
      } else if (el.AgvType == 'LaserAllRoundConveyorAgv') {
        //全向滚筒车
        if (el.Alarms !== "0") {//如果报警码不等于0或者状态为'不可用'
          agvNode.setImage(mapData.qxjscred)//红色
        }
        else if (el.TrafficControl === 1) {//交通管制
          agvNode.setImage(mapData.qxjsc_traffic)//绿色
        }
        else if (el.IsCharging === 1) {//充电
          agvNode.setImage(mapData.qxjscgreen)//绿色
        }
        else {//其余
          agvNode.setImage(mapData.qxjscblue)//蓝色
        }
      }
      agvNode.setSize(el.Length / 10, el.Width / 10);
      agvNode.borderRadius = 1;
      try {
        agvNode.zIndex = mapData.isPickStation ? 10 : 20;
        // agvNode.visible = mapData.isPickStation ? false : true;
      }
      catch (ex) {
      }
      mapData.scene.add(agvNode);
      agvNode.click(function (e) {
        // mapData.ActiveAgvId = e.target.id;
        // emitter.emit('change_Active_AgvID_Event', e.target.id)
        mapData.bubbleStyle.left = e.layerX + 'px';
        mapData.bubbleStyle.top = e.layerY + 'px';
        let obj = e.target.data;
        mapData.clickname = obj.Agvname;
        mapData.datatype = obj.datatype;
        mapData.Soc = obj.Soc;
        mapData.Online = obj.Online;
        mapData.bubbleType = "AGV"
        mapData.bubbleData = global_config.agv_CN;
        mapData.bubbleData.forEach(el => {
          el.value = obj[el.en] + el.unit;
        })
        // ElMessage({
        //   message: '订阅' + obj.Agvname + '路线成功',
        //   type: 'success',
        // })
        // emitter.emit("agvlocation", obj);
        mapData.isShowBubble = true;
      })
    })
    //更新AGV信息的实时气泡展示
    if (mapData.bubbleType == "AGV") {
      let active_agv_info = node.UpdateAgv.filter(x => x.AgvId == mapData.ActiveAgvId);
      if (active_agv_info.length > 0) {
        let info = active_agv_info[0];
        // mapData.bubbleData = [];/
        mapData.ActiveAgvId = info.AgvId;
        mapData.clickname = info.Agvname;
        mapData.datatype = info.datatype;
        mapData.Soc = info.Soc;
        mapData.Online = info.Online;
        mapData.bubbleType = "AGV"
        mapData.bubbleData = global_config.agv_CN;
        mapData.bubbleData.forEach(el => {
          el.value = info[el.en] + el.unit;
        })
      }
    }
    emitter.emit("ReceiveAgvRuntimeInfo", node.UpdateAgv);
  }
  //更新AGV路线信息
  if (node.UpdateAgvPath != undefined) {
    mapData.route_arr = node.UpdateAgvPath;
    showAgvRoute_Event(mapData.ActiveAgvId)
  }
}
const GetRealTime_Alarms_Data_Data = msg => {
  let node = JSON.parse(msg.data);
  if (node.Heart != undefined) {//心跳数据
    scoketData.scoket_Alarms_Data_HeartData = node.Heart;
  }
  //更新实时报警
  if (node.UpdateAlarmList != undefined) {
    emitter.emit('Alarms_Info_Change_Event', node.UpdateAlarmList)
  }
}
const GetRealTime_Logs_Data_Data = msg => {
  let node = JSON.parse(msg.data);
  if (node.Heart != undefined) {//心跳数据
    scoketData.scoket_Logs_Data_HeartData = node.Heart;
  }
  //更新实时日志
  if (node.UpdateLogs != undefined) {
    if (node.UpdateLogs.Type == "AGVCmd") {
      store.dispatch("SetRuntime_Sstx_log_data", node.UpdateLogs)
    } else if (node.UpdateLogs.Type == "UserOperation") {
      store.dispatch("SetRuntime_Sscz_log_data", node.UpdateLogs)
    } else {
      store.dispatch("SetRuntime_Ssyx_log_data", node.UpdateLogs)
    }
  }
}
const GetRealTime_Tasks_Data_Data = msg => {
  let node = JSON.parse(msg.data);
  if (node.Heart != undefined) {//心跳数据
    scoketData.scoket_Tasks_Data_HeartData = node.Heart;
  }
  //更新实时任务
  if (node.UpdateTaskList != undefined) {
    emitter.emit('Task_Info_Change_Event', node.UpdateTaskList)
  }
}
const closeForm = () => {
  mapData.isShowBubble = false;
  mapData.bubbleType = "";
  mapData.ActiveDeviceId = null;
}
const showAgvRoute_Event = (agvid) => {
  if (agvid != null && agvid != "") {
    let GlLink = mapData.scene.findElements(x => x.hasOwnProperty("isGl") && x.isGl);
    if (GlLink.length > 0) {
      GlLink.forEach(el => {
        el.isGl = false;//是否高亮
        el.strokeColor = '22,124,255';
      })
    }
    //寻找实时推送过来中的激活AGV的路线
    if (mapData.route_arr.length >= 0) {
      let path_arr = mapData.route_arr.filter(x => x.AgvId == agvid)
      let path = [];
      if (path_arr.length > 0) {
        path = path_arr[0].Paths;
        for (var i = 0; i < path.length; i++) {
          let link_id_1 = path[i] + "_" + path[i + 1] + "&" + path[i + 1] + "_" + path[i];
          let link_id_2 = path[i + 1] + "_" + path[i] + "&" + path[i] + "_" + path[i + 1];
          let linkarr = mapData.scene.findElements(x => x.hasOwnProperty("linkid") && ((x.linkid == link_id_1 || (x.linkid == link_id_2))));
          if (linkarr.length > 0) {
            linkarr.forEach(el => {
              el.isGl = true;//是否高亮
              el.strokeColor = '255,255,255';
            })
          }
        }
      }
    }
  } else {
    let GlLink = mapData.scene.findElements(x => x.hasOwnProperty("isGl") && x.isGl);
    if (GlLink.length > 0) {
      GlLink.forEach(el => {
        el.isGl = false;//是否高亮
        el.strokeColor = '22,124,255';
      })
    }
  }
}
const menu_msIn_Event = (val) => {
  mapData.isShowMenu = val;
}
const menuItem_mse_out_Event = () => {
  mapData.isShowMenu = '';
  emitter.emit("notshow_map_gongju", "gongju");
}
const zoomOutMap = () => {
  mapData.stage.zoomOut(0.8)
}
const zoomInMap = () => {
  mapData.stage.zoomIn(0.8)
}
const SetSystemcontrol_Method = (val) => {
  SetSystemcontrol(val ? 'Run' : 'Pause').then(res => {
    ElMessage({
      message: '系统控制操作成功',
      type: 'success',
    })
  }).catch(err => {
    mapData.sys_control = !val;
    ElMessage.error('系统控制操作失败,请联系管理员!')
  })
}
const SetTask_Mode_Method = (val) => {
  SetTaskMode(val ? 'Auto' : 'Manual').then(res => {
    ElMessage({
      message: '任务模式切换成功',
      type: 'success',
    })
  }).catch(err => {
    mapData.sys_control = !val;
    ElMessage.error('任务模式切换失败,请联系管理员!')
  })
}
const moveDiv = () => {
  var bubble = document.getElementById("agv_bubble");
  var div = document.getElementById("agv_bubble_top");
  if (div != null && bubble != null) {
    var isDrag = false;
    var distanceX, distanceY;
    //按下鼠标时，定义事件
    div.onmousedown = function (evt) {
      evt = evt || window.event;
      isDrag = true;
      //保存鼠标相对于div的偏移量
      distanceX = evt.offsetX;
      distanceY = evt.offsetY;
      // 按下鼠标时，定义document的移动事件
      document.onmousemove = function (evt) {
        evt = evt || window.event;
        var divLeft = evt.clientX - distanceX;
        var divTop = evt.clientY - distanceY;
        var maxLeft = document.documentElement.clientWidth - bubble.offsetWidth;
        var maxTop = document.documentElement.clientHeight - bubble.offsetHeight;
        if (divLeft < 0) {
          divLeft = 0;
        }
        if (divTop < 0) {
          divTop = 0;
        }
        if (divLeft > maxLeft) {
          divLeft = maxLeft;
        }
        if (divTop > maxTop) {
          divTop = maxTop;
        }
        bubble.style.left = divLeft + "px";
        bubble.style.top = divTop + "px";
        return false;
      }
      //按下鼠标时，定义document的鼠标弹起事件
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }
  }
}
const getSytemstatus = () => {
  GetSytemstatus().then(res => {
    mapData.sys_control = res.data.data.SystemControl == 'Run';
    mapData.task_mode = res.data.data.TaskMode == 'Auto';
    setTimeout(getSytemstatus, 3000);
  })
}
onMounted(() => {
  mapData.ccsred = GetAgvImg("ccsred");
  mapData.ccsgreen = GetAgvImg("ccsgreen");
  mapData.ccsblue = GetAgvImg("ccsblue");
  mapData.ccstraffic = GetAgvImg('ccsagv_traffic');

  mapData.qysagv_traffic = GetAgvImg("qysagv_traffic")
  mapData.qysred = GetAgvImg("qysred");
  mapData.qysgreen = GetAgvImg("qysgreen");
  mapData.qysblue = GetAgvImg("qysblue");

  mapData.qfjssagv_traffic = GetAgvImg("qfjssagv_traffic");
  mapData.qfjssred = GetAgvImg("qfjssred");
  mapData.qfjssgreen = GetAgvImg("qfjssgreen");
  mapData.qfjssblue = GetAgvImg("qfjssblue");


  mapData.gtsagv_traffic = GetAgvImg("gtsagv_traffic");
  mapData.gtsred = GetAgvImg("gtsred");
  mapData.gtsgreen = GetAgvImg("gtsgreen");
  mapData.gtsblue = GetAgvImg("gtsblue");

  mapData.qxjsc_traffic = GetAgvImg("qxjsc_traffic");
  mapData.qxjscred = GetAgvImg("qxjscred");
  mapData.qxjscgreen = GetAgvImg("qxjscgreen");
  mapData.qxjscblue = GetAgvImg("qxjscblue");

  mapData.door_normal_pic = GetImg("door_normal");
  mapData.door_alert_pic = GetImg("door_alert");
  mapData.height = document.getElementById('mapcontainer').clientHeight;
  mapData.width = document.getElementById('mapcontainer').clientWidth;

  GetShowNamesNode(1).then(res => {
    mapData.showNameNodes = res
  })
  emitter.on('change_Map_Event_Alarm', val => {
    if (val.MapId != mapData.mapid) {
      mapData.mapid = val.MapId;
      map_Change_Event();
    };
    let data = { id: val.ID, MapId: val.MapId };
    emitter.emit('change_map_ok_event', data);
  })
  emitter.on("Locate_AgvByXY", data => {
    mapData.stage.setCenter((data.X / 10), -1 * (data.Y / 10));
  })
  emitter.on("chose_Station_Event", val => {
    mapData.isPickStation = val
    // let agvs = mapData.scene.findElements(x => x.hasOwnProperty("type") && x.type == 'agv');
    // agvs.forEach(el => {
    //   if (val) {
    //     // 如果是新增任务,则将AGV节点的zIndex调低
    //     el.zIndex = 10;
    //   } else {
    //     el.zIndex = 20;
    //   }
    // })
  })
  emitter.on('show_map_gongju', val => {
    menu_msIn_Event(val);
  });
  emitter.on('change_Active_AgvID_Event', val => {
    if (val == null || val == '') {
      scoketData.map_data_scoket.send('{"SubscribeAgvPath":{"AgvId": ' + mapData.ActiveAgvId + ',"Subscribe": false }}')
      showAgvRoute_Event(null)
    } else {
      scoketData.map_data_scoket.send('{"SubscribeAgvPath":{"AgvId": ' + val + ',"Subscribe": true }}')
      showAgvRoute_Event(val)
    }
    mapData.ActiveAgvId = val;
  })
  GetMapList().then(res => {
    if (res.data.data.length > 0) {
      mapData.mapid = res.data.data[0].MapId;
      initMapById();
      setStore('mapid', mapData.mapid);
      emitter.emit('change_Map_Event', mapData.mapid);
      res.data.data.forEach(el => {
        map_options.value.push({ value: el.MapId, label: el.MapName });
      })
    }
  });
  getSytemstatus();
  scoket_timeInterval = window.setInterval(() => {
    let end_Now = moment();
    let map_data_begin_Date = moment(scoketData.scoket_Map_Data_HeartData.Time);
    let mapdata_date_diff = end_Now.diff(map_data_begin_Date, "seconds");
    if (mapdata_date_diff > 5) {
      initScoket('map_data');
    }
    let alarms_begin_Date = moment(scoketData.scoket_Alarms_Data_HeartData.Time);
    let alarms_date_diff = end_Now.diff(alarms_begin_Date, "seconds");
    if (alarms_date_diff > 5) {
      initScoket('alarms');
    }
    let logs_begin_Date = moment(scoketData.scoket_Logs_Data_HeartData.Time);
    let logs_date_diff = end_Now.diff(logs_begin_Date, "seconds");
    if (logs_date_diff > 5) {
      initScoket('logs');
    }
    let tasks_begin_Date = moment(scoketData.scoket_Tasks_Data_HeartData.Time);
    let tasks_date_diff = end_Now.diff(tasks_begin_Date, "seconds");
    if (tasks_date_diff > 5) {
      initScoket('tasks');
    }
  }, 2000)
});
onUnmounted(() => {
  emitter.off("Locate_AgvByXY");
  emitter.off("show_map_gongju");
  emitter.off("chose_Station_Event");
  emitter.off('change_Active_AgvID_Event');
  window.clearInterval('scoket_timeInterval');
})
</script>
<style>
.el-switch__label--right {
  margin-left: 2px !important;
}
.el-switch__label--left {
  margin-right: 2px !important;
}
.el-switch__label.is-active {
  color: greenyellow !important;
}
#mapcontainer {
  height: 100vh;
  width: 100vw;
  /* background-image: url("../assets/images/bg_test.jpeg"); */
  background: #01032c;
  float: right;
}
:deep(.el-input__inner) {
  background: rgb(243, 239, 239);
  border: 1px solid black;
  color: rgb(5, 5, 5);
}
.gongju_menu_conotainer {
  height: 15vh;
  width: 10vw;
  position: absolute;
  right: 4.7vw;
  top: 7.3vh;
  z-index: 200;
  color: white;
}
.elselect {
  width: 100px;
}
.ment_item {
  height: 5vh;
  line-height: 5vh;
  background: #00a7c7;
  cursor: pointer;
  text-align: center;
  padding-left: 3px;
}

.ment_item:hover {
  background: #06d4fb;
}

.zoomimg {
  height: 3vh;
  width: 3vh;
  margin-top: 0.8vh;
  cursor: pointer;
}
.agvimg {
  float: left;
  cursor: pointer;
  margin-top: -4px;
  margin-left: 10px;
  width: 40px;
}
.agv_bubble_top {
  margin-top: -20px;
  height: 60px;
  width: 90%;
}
.agvname {
  width: 240px;
  height: 50px;
  margin-left: 20px;
}
.elprogressp {
  float: right;
  margin-top: -5.8vh;
  margin-right: 2vw;
}
.agvspanonline {
  border: 1px solid #08a4ec;
  border-radius: 10px;
  background-color: #08a4ec;
  color: white;
  font-size: 10px;
}
.agvspan {
  border: 1px solid #f97000;
  border-radius: 10px;
  background-color: #f97000;
  color: white;
  font-size: 10px;
}
.agvaddress {
  color: rgb(128, 126, 126);
  font-size: 10px;
  margin-top: -10px;
}
.bubble_top_img {
  float: right;
  cursor: pointer;
  margin-right: 8px;
  margin-top: -48px;
  z-index: 9999;
}
.hidediv {
  height: 24vh;
  width: 21vw;
  margin-left: 0.5vw;
  margin-top: 1vh;
  margin-bottom: 1vh;
  border-radius: 10px;
  background: rgb(23, 36, 78);
}
.hidediv_name {
  font-size: 10px;
  line-height: 10px;
  color: rgb(156, 154, 154);
  margin-left: 20px;
}
.hidediv_value {
  font-size: 12px;
  line-height: 12px;
  margin-left: 20px;
}
.elprogress {
  float: right;
  margin-top: 5vh;
  margin-right: 1vw;
}
.left_agv_item {
  width: 22vw;
  margin-top: 0.2vh;
  border: 1px solid #023c64;
  border-radius: 5px;
  color: white;
  background-color: #023c64;
  z-index: 9999;
}
</style>