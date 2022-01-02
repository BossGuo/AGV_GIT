import axios from "../utils/axios.js";
import { getCookie } from "../utils/utils"
const baseUrl = map_config.requst_url

//系统登录
export function LoginIn(form) {
    let data = {
        username: form.username,
        password: form.password
    }
    return axios({
        url: baseUrl + "/login",
        method: "POST",
        data
    });
}

//退出登录
export function LogOut() {
    return true;
}
//判断当前系统是否已经登录,如果已登录,则返回当前的用户信息和菜单信息
export function GetCurrentUserInfo(form) {
    return new Promise(resolve => {
        let AuthCode = getCookie("AuthCode");
        setTimeout(() => {
            resolve(AuthCode);
        }, 10);
    })
}
//获取地图列表文件信息
export function GetMapList() {
    return axios({
        url: baseUrl + '/maplist',
        method: 'get'
    })
}
//获取AGV地图文件数据
export function GetMapFilesByMapId(mapid) {
    // 127.0.0.1:10086/mapfile/1
    return axios({
        url: baseUrl + "/mapfile/" + mapid,
        method: "get"
    });
}
//根据地图ID获取当前地图中的AGV设备列表用于初始化地图
export function GetAgvListByMapId(mapid) {
    // 127.0.0.1:10086/mapfile/1
    return axios({
        url: baseUrl + "/agvlist/" + mapid,
        method: "get"
    });
}
//根据地图ID获取当前地图中的AGV任务列表
export function GetTaskDataByMapId(mapid) {
    return axios({
        url: baseUrl + "/tasklist/" + mapid,
        method: "get"
    });
}
//AGV操作接口,1暂停;2运行
export function AgvOperation(MapId, AgvId, Operation) {
    return axios({
        url: baseUrl + "/agvoperation",
        method: "post",
        data: { MapId, AgvId, Operation }
    });
}
//任务操作接口,1暂停;2运行
export function TaskStateEdit(MapId, TaskId, TaskState) {
    return axios({
        url: baseUrl + "/taskstateedit",
        method: "post",
        data: { MapId, TaskId, TaskState }
    });
}

//获取站点动作列表
export function GetStationActionList() {
    return axios({
        url: baseUrl + "/actionlist",
        method: "get"
    });
}
//实时报警数据
export function GetAlarmlist() {
    //alarmlist
    return axios({
        url: baseUrl + "/alarmlist",
        method: "get",
    });
}
//提交任务
export function TaskAdd(model) {
    return axios({
        url: baseUrl + "/taskadd",
        method: "post",
        data: model
    });
}
//Agv信息
export function GetAgvList(queryform) {
    let data = {
        MapId: queryform.MapId,
    }
    return axios({
        url: baseUrl + "/historyalarmexport",
        method: "post",
        data: data
    });
}
//音乐列表
export function GetMusic() {
    return axios({
        url: baseUrl + "/agvmusic",
        method: "get",
    });
}
//AGV信息列表
export function GetAgvSettingList() {
    return axios({
        url: baseUrl + "/getagvsetting",
        method: "get",
    });
}
//AGV信息修改
export function AgvSetting(data) {
    return axios({
        url: baseUrl + "/agvsetting",
        method: "post",
        data: data
    });
}
//充电桩信息列表
export function GetChargingPileSetting() {
    return axios({
        url: baseUrl + "/getchargingpilesetting",
        method: "get",
    });
}
//充电桩信息修改
export function ChargingPileSetting(data) {
    return axios({
        url: baseUrl + "/chargingpilesetting",
        method: "post",
        data: data
    });
}
//充电桩手动解锁
export function ChargingPileOperation(data) {
    return axios({
        url: baseUrl + "/chargingpileoperation",
        method: "post",
        data: data
    });
}
//配置属性
export function GetParameter(queryform) {
    let list = {
        DataCount: 1,
        DataList: []
    };
    let min = (queryform.PageNum - 1) * queryform.PageSize
    let max = list.DataCount;
    for (var i = min + 1; i < max + 1; i++) {
        list.DataList.push({
            IsMap: '是',
            MapName: "E仓",
            Clear: '已清除',
            ProjectName: "巡检",
            IsRun: "未启动",
            Tcp: "9667",
            Udp: "8087",
            Rundiaodu: "未启动",
            Runcontrol: "未启动",
            RepeatMes: "未启动",
            Socket: "开启验证",
            Ack: "50ms",
            AckCount: "10",
            Goods: "未校验",
            AdhesionPonits: "关闭",
            TurnPoints: "关闭",
            PointsTurn: "开启",
            MapCount: "3",
        })
    };
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(list);
        }, 100);
    })
}
//历史任务
export function GetHistoryTaskSearch(queryform) {
    let data = {
        PageNum: queryform.PageNum,
        PageSize: queryform.PageSize,
        AgvId: queryform.AgvId,
        TaskState: queryform.TaskState,
        EndTime: queryform.EndTime,
        StartTime: queryform.StartTime
    }
    return axios({
        url: baseUrl + "/historytasksearch",
        method: "post",
        data: data
    });
}
//历史任务导出
export function GetHistoryTaskExport(queryform) {
    let data = {
        AgvId: queryform.AgvId,
        TaskState: queryform.TaskState,
        EndTime: queryform.EndTime,
        StartTime: queryform.StartTime
    }
    return axios({
        url: baseUrl + "/historytaskexport",
        method: "post",
        data: data
    });
}
//历史报警
export function GetHistoryAlarmSearch(queryform) {
    let data = {
        AlarmType: queryform.AlarmType,
        EndTime: queryform.EndTime,
        StartTime: queryform.StartTime,
        PageNum: queryform.PageNum,
        PageSize: queryform.PageSize,
    }
    return axios({
        url: baseUrl + "/historyalarmsearch",
        method: "post",
        data: data
    });
}
//历史报警导出
export function GetHistoryAlarmExport(queryform) {
    let data = {
        AlarmType: queryform.AlarmType,
        EndTime: queryform.EndTime,
        StartTime: queryform.StartTime,
    }
    return axios({
        url: baseUrl + "/historyalarmexport",
        method: "post",
        data: data
    });
}

//系统控制接口
export function SetSystemcontrol(val) {
    return axios({
        url: baseUrl + "/systemcontrol",
        method: "post",
        data: { SystemControl: val }
    });
}
//任务模式切换接口
export function SetTaskMode(val) {
    return axios({
        url: baseUrl + "/taskmode",
        method: "post",
        data: { TaskMode: val }
    });
}
//3.9获取当前系统控制和任务模式
export function GetSytemstatus() {
    return axios({
        url: baseUrl + "/sytemstatus",
        method: "get",
    });
}
//历史日志查询接口
export function Historylogsearch(queryform) {
    let data = {
        PageNum: queryform.PageNum,
        PageSize: queryform.PageSize,
        Type: queryform.Type,
        Lvl: queryform.Lvl,
        Sender: queryform.Sender,
        Receiver: queryform.Receive,
        EndTime: queryform.EndTime,
        StartTime: queryform.StartTime
    }
    return axios({
        url: baseUrl + "/historylogsearch",
        method: "post",
        data: data
    });
}
//AGV数据统计接口
export function GetAgvstatistics(agvids) {
    let data = {
        AgvId: agvids,
        EndTime: "2021-03-12 11:28:00",
        StartTime: "2021-03-01 01:22:00"
    }
    return axios({
        url: baseUrl + "/agvstatistics",
        method: "post",
        data
    });
}

//获取地图中显示名称的节点

export function GetShowNamesNode(mapid){
    return new Promise(resolve => {
        let data=[1,2]
        setTimeout(() => {
            resolve(data);
        }, 10);
    })
}