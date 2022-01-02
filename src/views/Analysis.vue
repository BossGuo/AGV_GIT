<template>
  <div class="midiv" v-show="state.ishow">
    <div class="top">
      <p class="title">统计分析</p>
      <img @click="close" src="../assets/images/close_new.png" class="close" style="float:right;margin-top:1.5vh;margin-right:2vw;" />
      <div style="color:white;float:left;line-height:8vh;font-size:1vw">AGV选择：</div>
      <el-select v-model="state.tj_agv_ids" multiple placeholder="Select" size="small" style="margin-top:2.5vh;width:500px;">
        <el-option v-for="item in state.agv_all_data" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" style="margin-left:0.5vw;" @click="agv_tj_vals_change_Event">确定</el-button>
    </div>
    <div style="height:23vh;width:26vw;margin-left:1vw;float:left;">
      <div style="height:3vh;line-height:3vh;font-size:1vw;color:#00fffc">时长统计</div>
      <div style="height:20vh;width:26vw;" id="ect_yxsc"></div>
    </div>
    <div style="height:23vh;width:26vw;margin-left:2.5vw;float:left;">
      <div style="height:3vh;line-height:3vh;font-size:1vw;color:#00fffc">报警统计</div>
      <div style="height:20vh;width:26vw;" id="ect_bjtj"></div>
    </div>
    <div style="height:23vh;width:26vw;margin-left:2.5vw;float:left;">
      <div style="height:3vh;line-height:3vh;font-size:1vw;color:#00fffc">充电比统计</div>
      <div style="height:20vh;width:26vw;" id="ect_cdbtj"></div>
    </div>
    <div style="height:23vh;width:26vw;float:left;margin-top:2vh;margin-left:1vw;">
      <div style="height:3vh;line-height:3vh;font-size:1vw;color:#00fffc">里程统计</div>
      <div style="height:20vh;width:26vw;" id="ect_lctj"></div>
    </div>
    <div style="height:23vh;width:26vw;margin-top:2vh;margin-left:2.5vw;float:left;">
      <div style="height:3vh;line-height:3vh;font-size:1vw;color:#00fffc">工位等待时间统计</div>
      <div style="height:20vh;width:26vw;" id="ect_gwddsjtj"></div>
    </div>
    <div style="height:23vh;width:26vw;margin-top:2vh;margin-left:2.5vw;float:left;">
      <div style="height:3vh;line-height:3vh;font-size:1vw;color:#00fffc">任务统计</div>
      <div style="height:20vh;width:26vw;" id="ect_rwtj"></div>
    </div>
    <div style="height:26vh;width:20vw;margin-top:2vh;margin-left:1vw;float:left;">
      <div style="height:3vh;line-height:3vh;font-size:1vw;color:#00fffc">AGV有效利用率统计</div>
      <div style="height:23vh;width:20vw;" id="ect_yxlyltj"></div>
    </div>
    <div style="height:26vh;width:20vw;margin-top:2vh;margin-left:1vw;float:left;">
      <div style="height:3vh;line-height:3vh;font-size:1vw;color:#00fffc">AGV效率统计</div>
      <div style="height:23vh;width:20vw;" id="ect_agvxltj"></div>
    </div>
    <div style="height:26vh;width:20vw;margin-top:2vh;margin-left:1vw;float:left;">
      <div style="height:3vh;line-height:3vh;font-size:1vw;color:#00fffc">设备故障统计</div>
      <el-tabs type="card" v-model="state.sbjt_val" @tab-click="sbtj_tabs_Click">
        <el-tab-pane v-for="(item,index) in state.sbtj_tabs_data" :key="index" :label="item.type"></el-tab-pane>
      </el-tabs>
      <div style="height:17vh;width:20vw;" id="ect_sbgztj"></div>
    </div>
    <div style="height:26vh;width:20vw;margin-top:2vh;margin-left:1vw;float:left;">
      <div style="height:3vh;line-height:3vh;font-size:1vw;color:#00fffc">系统故障统计</div>
      <div style="height:23vh;width:20vw;" id="ect_xtgztj"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { reactive } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { GetMapList, GetAgvListByMapId, GetAgvstatistics } from '../service/getData'
import echarts from "echarts";
const router = useRouter()
const state = reactive({
  ishow: true,
  tj_agv_ids: [],
  all_agv_ids: [],
  agv_all_data: [],
  sbtj_tabs_data: [],
  sbjt_val: 0
})
const sbtj_tabs_Click = (val) => {
  init_ect_sbgztj_item(state.sbtj_tabs_data[state.sbjt_val])
}
const init_Bjtj = (data) => {
  let x_data = [];
  let y_x_data = [];
  let series_data = [];
  data[0].Alarms.forEach(el => {
    y_x_data.push(el.AlarmType)
  });
  y_x_data.forEach(ex => {
    let y_data = [];
    data.forEach(e => {
      y_data.push(e.Alarms.filter(x => x.AlarmType == ex)[0].AlarmNum)
    })
    series_data.push({
      name: ex,
      type: 'bar',
      barWidth: '5%',
      itemStyle: {
        normal: {
          color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#FF3366',
            },
            {
              offset: 1,
              color: '#FF3366',
            },
          ]),
        },
      },
      data: y_data,
    })
  })
  let use_data = [];
  data.forEach(el => {
    if (use_data.filter(x => x.AgvId == el.AgvId).length == 0) {
      x_data.push(el.AgvId);
      use_data.push({
        AgvId: el.AgvId
      })
    }
  })
  use_data.forEach(ex => {
    let y_data = data.filter(x => x.AgvId == ex.AgvId);
    y_data.forEach(i => {
      ex[i.AlarmType] = i.AlarmNum
    })
  })
  var option = {
    backgroundColor: '#323a5e',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true,
    },
    legend: {
      data: [
        // 'AGV、门控等设备丢失连接',
        // 'AGV急停触发',
        // 'AGV与辊道对接异常',
        // 'AGV低电量报警',
        // '充电桩故障',
        // '区域不可用',
        // '取消、修改任务',
        // 'MES接口超时',
        // 'AGV接口超时',
      ],
      right: 10,
      top: 12,
      textStyle: {
        color: '#fff',
      },
      itemWidth: 12,
      itemHeight: 10,
      // itemGap: 35
    },
    xAxis: {
      type: 'category',
      data: x_data,
      axisLine: {
        lineStyle: {
          color: 'white',
        },
      },
      axisLabel: {
        // interval: 0,
        // rotate: 40,
        textStyle: {
          fontFamily: 'Microsoft YaHei',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      axisLabel: {},
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: '8%',
        start: 10,
        end: 90,
        handleIcon:
          'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5',
        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#90979c',
      },
      {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35,
      },
    ],
    series: series_data
  };
  let myChart = echarts.init(document.getElementById("ect_bjtj"));
  myChart.setOption(option);
}
const init_Yxsc = (data) => {
  let xAxis_data = [];
  let cdsj_data = [] //充电时间
  let ycsj_data = [] //异常时间
  let kxsj_data = [] //空闲时间
  let gzsc_data = [] //工作时长
  data.forEach(el => {
    xAxis_data.push(el.AgvId);
    cdsj_data.push(el.ChargeTime == undefined ? 0 : el.ChargeTime);
    ycsj_data.push(el.ErrorTime == undefined ? 0 : el.ErrorTime);
    kxsj_data.push(el.IdleTime == undefined ? 0 : el.IdleTime);
    gzsc_data.push(el.WorkTime == undefined ? 0 : el.WorkTime);
  })
  var option = {
    backgroundColor: '#323a5e',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true,
    },
    legend: {
      data: [
        '充电时间',
        '异常时间',
        '空闲时间',
        '工作时长',
      ],
      right: 10,
      top: 12,
      textStyle: {
        color: '#fff',
      },
      itemWidth: 12,
      itemHeight: 10,
      // itemGap: 35
    },
    xAxis: {
      type: 'category',
      data: xAxis_data,
      axisLine: {
        lineStyle: {
          color: 'white',
        },
      },
      axisLabel: {
        // interval: 0,
        // rotate: 40,
        textStyle: {
          fontFamily: 'Microsoft YaHei',
        },
      },
    },

    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      axisLabel: {},
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: '8%',
        start: 10,
        end: 90,
        handleIcon:
          'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5',
        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#90979c',
      },
      {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35,
      },
    ],
    series: [
      {
        name: '充电时间',
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#fccb05',
              },
              {
                offset: 1,
                color: '#f5804d',
              },
            ]),
          },
        },
        data: cdsj_data,
      },
      {
        name: '异常时间',
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#8bd46e',
              },
              {
                offset: 1,
                color: '#09bcb7',
              },
            ]),
          },
        },
        data: ycsj_data,
      },
      {
        name: '空闲时间',
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#248ff7',
              },
              {
                offset: 1,
                color: '#6851f1',
              },
            ]),
          },
        },
        data: kxsj_data,
      },
      {
        name: '工作时长',
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#CC00FF',
              },
              {
                offset: 1,
                color: '#CC00FF',
              },
            ]),
          },
        },
        data: gzsc_data,
      }
    ],
  };
  let myChart = echarts.init(document.getElementById("ect_yxsc"));
  myChart.setOption(option);
}
const init_Cdbtj = (data) => {
  let x_data = [];
  let y_data = [];
  data.forEach(el => {
    x_data.push(el.AgvId);
    y_data.push(el.ChargeRatio)
  })
  var option = {
    backgroundColor: '#323a5e',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true,
    },
    legend: {
      data: [
        '充电比',
      ],
      right: 10,
      top: 12,
      textStyle: {
        color: '#fff',
      },
      itemWidth: 12,
      itemHeight: 10,
    },
    xAxis: {
      type: 'category',
      data: x_data,
      axisLine: {
        lineStyle: {
          color: 'white',
        },
      },
      axisLabel: {
        textStyle: {
          fontFamily: 'Microsoft YaHei',
        },
      },
    },

    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      axisLabel: {},
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: '8%',
        start: 10,
        end: 90,
        handleIcon:
          'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5',
        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#90979c',
      },
      {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35,
      },
    ],
    series: [
      {
        name: '充电比',
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#fccb05',
              },
              {
                offset: 1,
                color: '#f5804d',
              },
            ]),
          },
        },
        data: y_data,
      }
    ],
  };
  let myChart = echarts.init(document.getElementById("ect_cdbtj"));
  myChart.setOption(option);
}
const init_Lctj = (data) => {
  let x_data = [];
  let y_data = [];
  data.forEach(el => {
    x_data.push(el.AgvId);
    y_data.push(el.Mileage)
  })
  var option = {
    backgroundColor: '#323a5e',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true,
    },
    legend: {
      data: [
        '总里程',
      ],
      right: 10,
      top: 12,
      textStyle: {
        color: '#fff',
      },
      itemWidth: 12,
      itemHeight: 10,
    },
    xAxis: {
      type: 'category',
      data: x_data,
      axisLine: {
        lineStyle: {
          color: 'white',
        },
      },
      axisLabel: {
        textStyle: {
          fontFamily: 'Microsoft YaHei',
        },
      },
    },

    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      axisLabel: {},
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: '8%',
        start: 10,
        end: 90,
        handleIcon:
          'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5',
        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#90979c',
      },
      {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35,
      },
    ],
    series: [
      {
        name: '总里程',
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#fccb05',
              },
              {
                offset: 1,
                color: '#f5804d',
              },
            ]),
          },
        },
        data: y_data,
      }
    ],
  };
  let myChart = echarts.init(document.getElementById("ect_lctj"));
  myChart.setOption(option);
}
const init_gwddsj = (data) => {
  let x_data = [];
  let y_data = [];
  data.forEach(el => {
    x_data.push(el.StationName);
    y_data.push(el.IdleTime)
  })
  var option = {
    backgroundColor: '#323a5e',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true,
    },
    legend: {
      data: [
        '充电比',
      ],
      right: 10,
      top: 12,
      textStyle: {
        color: '#fff',
      },
      itemWidth: 12,
      itemHeight: 10,
    },
    xAxis: {
      type: 'category',
      data: x_data,
      axisLine: {
        lineStyle: {
          color: 'white',
        },
      },
      axisLabel: {
        textStyle: {
          fontFamily: 'Microsoft YaHei',
        },
      },
    },

    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      axisLabel: {},
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: '8%',
        start: 10,
        end: 90,
        handleIcon:
          'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5',
        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#90979c',
      },
      {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35,
      },
    ],
    series: [
      {
        name: '等待时间',
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#fccb05',
              },
              {
                offset: 1,
                color: '#f5804d',
              },
            ]),
          },
        },
        data: y_data,
      }
    ],
  };
  let myChart = echarts.init(document.getElementById("ect_gwddsjtj"));
  myChart.setOption(option);
}
const init_rwtj = (data) => {
  let x_data = [];
  let y_data = [];
  data.forEach(el => {
    x_data.push(el.AgvId);
    y_data.push(el.Tasks)
  })
  var option = {
    backgroundColor: '#323a5e',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true,
    },
    legend: {
      data: [
        '总里程',
      ],
      right: 10,
      top: 12,
      textStyle: {
        color: '#fff',
      },
      itemWidth: 12,
      itemHeight: 10,
    },
    xAxis: {
      type: 'category',
      data: x_data,
      axisLine: {
        lineStyle: {
          color: 'white',
        },
      },
      axisLabel: {
        textStyle: {
          fontFamily: 'Microsoft YaHei',
        },
      },
    },

    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      axisLabel: {},
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: '8%',
        start: 10,
        end: 90,
        handleIcon:
          'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5',
        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#90979c',
      },
      {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35,
      },
    ],
    series: [
      {
        name: '任务数',
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#fccb05',
              },
              {
                offset: 1,
                color: '#f5804d',
              },
            ]),
          },
        },
        data: y_data,
      }
    ],
  };
  let myChart = echarts.init(document.getElementById("ect_rwtj"));
  myChart.setOption(option);
}
const init_ect_yxlyltj = (data) => {
  let x_data = [];
  let y_data = [];
  data.forEach(el => {
    x_data.push(el.AgvId);
    y_data.push(el.UsageRate)
  })
  var option = {
    backgroundColor: '#323a5e',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true,
    },
    legend: {
      data: [
        '总里程',
      ],
      right: 10,
      top: 12,
      textStyle: {
        color: '#fff',
      },
      itemWidth: 12,
      itemHeight: 10,
    },
    xAxis: {
      type: 'category',
      data: x_data,
      axisLine: {
        lineStyle: {
          color: 'white',
        },
      },
      axisLabel: {
        textStyle: {
          fontFamily: 'Microsoft YaHei',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      axisLabel: {},
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: '8%',
        start: 10,
        end: 90,
        handleIcon:
          'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5',
        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#90979c',
      },
      {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35,
      },
    ],
    series: [
      {
        name: '有效率',
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#fccb05',
              },
              {
                offset: 1,
                color: '#f5804d',
              },
            ]),
          },
        },
        data: y_data,
      }
    ],
  };
  let myChart = echarts.init(document.getElementById("ect_yxlyltj"));
  myChart.setOption(option);
}
const init_ect_agvxltj = (data) => {
  var option = {
    backgroundColor: '#323a5e',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true,
    },
    legend: {
      data: [
        '效率',
      ],
      right: 10,
      top: 12,
      textStyle: {
        color: '#fff',
      },
      itemWidth: 12,
      itemHeight: 10,
    },
    xAxis: {
      type: 'category',
      data: ['AGV1', 'AGV2', 'AGV3', 'AGV4'],
      axisLine: {
        lineStyle: {
          color: 'white',
        },
      },
      axisLabel: {
        textStyle: {
          fontFamily: 'Microsoft YaHei',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      axisLabel: {},
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: '8%',
        start: 10,
        end: 90,
        handleIcon:
          'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5',
        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#90979c',
      },
      {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35,
      },
    ],
    series: [
      {
        name: '效率',
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#fccb05',
              },
              {
                offset: 1,
                color: '#f5804d',
              },
            ]),
          },
        },
        data: [99, 97, 80, 78],
      }
    ],
  };
  let myChart = echarts.init(document.getElementById("ect_agvxltj"));
  myChart.setOption(option);
}
const init_ect_sbgztj_tabs = (data) => {
  state.sbtj_tabs_data = [];
  data.forEach(el => {
    state.sbtj_tabs_data.push({
      type: el.DeviceType,
      Devices: el.Devices
    })
  })
  init_ect_sbgztj_item(data[0])
}
const init_ect_sbgztj_item = (data) => {
  let use_data = data.Devices;
  let x_data = [];
  let y_xdata = [];
  let seri_data = [];
  use_data[0].Fault.forEach(ex => {
    y_xdata.push(ex.FaultName);
  })
  use_data.forEach(el => {
    x_data.push(el.DeviceName);
  })

  y_xdata.forEach(el => {
    let y_data = [];
    use_data.forEach(ex => {
      y_data.push(ex.Fault.filter(x => x.FaultName == el)[0].FaultNum)
    })
    seri_data.push(
      {
        name: el,
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#fccb05',
              },
              {
                offset: 1,
                color: '#f5804d',
              },
            ]),
            barBorderRadius: 12,
          },
        },
        data: y_data,
      },
    )
  })
  var option = {
    backgroundColor: '#323a5e',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      data: x_data,
      axisLine: {
        lineStyle: {
          color: 'white',
        },
      },
      axisLabel: {
        // interval: 0,
        // rotate: 40,
        textStyle: {
          fontFamily: 'Microsoft YaHei',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      axisLabel: {},
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: '8%',
        start: 10,
        end: 90,
        handleIcon:
          'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5',
        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#90979c',
      },
      {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35,
      },
    ],
    series: seri_data,
  };
  let myChart = echarts.init(document.getElementById("ect_sbgztj"));
  myChart.setOption(option);
}

const init_ect_xtgztj = (data) => {
  let x_data = [];
  let y_data = [];
  data.forEach(el => {
    x_data.push(el.FaultName);
    y_data.push(el.FaultNum);
  })
  var option = {
    backgroundColor: '#323a5e',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true,
    },
    legend: {
      data: [
        '系统故障',
      ],
      right: 10,
      top: 12,
      textStyle: {
        color: '#fff',
      },
      itemWidth: 12,
      itemHeight: 10,
    },
    xAxis: {
      type: 'category',
      data: x_data,
      axisLine: {
        lineStyle: {
          color: 'white',
        },
      },
      axisLabel: {
        textStyle: {
          fontFamily: 'Microsoft YaHei',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      axisLabel: {},
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: '8%',
        start: 10,
        end: 90,
        handleIcon:
          'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5',
        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#90979c',
      },
      {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35,
      },
    ],
    series: [
      {
        name: '故障次数',
        type: 'bar',
        barWidth: '5%',
        itemStyle: {
          normal: {
            color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#fccb05',
              },
              {
                offset: 1,
                color: '#f5804d',
              },
            ]),
          },
        },
        data: y_data,
      }
    ],
  };
  let myChart = echarts.init(document.getElementById("ect_xtgztj"));
  myChart.setOption(option);
}
const close = () => {
  state.ishow = false;
  router.push('AgvDispatch');
}
const agv_tj_vals_change_Event = () => {
  if (state.tj_agv_ids.length == 0) {
    let all_agv_ids_str = state.all_agv_ids.join(',')
    GetAgvstatistics(all_agv_ids_str).then(res => {
      init_All_Echart_Event(res.data.data);
    })
  } else {
    GetAgvstatistics(state.tj_agv_ids.join(',')).then(res => {
      init_All_Echart_Event(res.data.data);
    })
  }
}
const init_All_Echart_Event = (tjdata) => {
  init_Yxsc(tjdata.AgvTimeStatics);//运行时长统计
  init_Bjtj(tjdata.AgvAlarmStatics);//报警统计
  init_Cdbtj(tjdata.AgvChargeRatios);//充电比统计
  init_Lctj(tjdata.AgvMileages);//里程统计
  init_gwddsj(tjdata.StationIdleTime);//工位等待时间统计
  init_rwtj(tjdata.AgvTasks);//任务统计
  init_ect_yxlyltj(tjdata.AgvUsageRate);//有效利用率统计
  init_ect_agvxltj(tjdata.AgvEfficiency);//效率统计
  init_ect_sbgztj_tabs(tjdata.DeviceFault);//设备故障统计
  init_ect_xtgztj(tjdata.SystemFault);//系统故障统计
}
onMounted(() => {
  GetMapList().then(res => {
    res.data.data.forEach((el, index) => {
      GetAgvListByMapId(el.MapId).then(result => {
        result.data.data.forEach(ex => {
          state.all_agv_ids.push(ex.AgvId)
          state.agv_all_data.push({
            value: ex.AgvId,
            label: ex.AgvName
          })
        })
        let all_agv_ids_str = state.all_agv_ids.join(',')
        if (index == res.data.data.length - 1) {
          GetAgvstatistics(all_agv_ids_str).then(res => {
            init_All_Echart_Event(res.data.data);
          })
        }
      })
    });
  })
});
</script>

<style scoped>
.midiv {
  position: absolute;
  top: 10vh;
  left: 7vw;
  width: 90vw;
  height: 88vh;
  z-index: 99;
  background-image: url("../assets/images/max.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: rgb(0, 11, 35, 0.8);
}
.top {
  height: 8vh;
}
.title {
  font-size: 24px;
  font-weight: 600;
  font-family: 微软雅黑;
  margin-left: 20px;
  margin-top: 20px;
  width: 7vw;
  float: left;
  color: #00fffc;
}
.close {
  float: right;
  margin-top: -6.5vh;
  margin-right: 1vw;
  cursor: pointer;
}
</style>

