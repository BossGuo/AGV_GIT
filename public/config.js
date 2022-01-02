var map_config = {
    line_width: 2,
    node_width: 16,
    node_height: 16,
    requst_url: 'http://127.0.0.1:10086',
    map_data_scoket_url: 'ws://127.0.0.1:10087/rcs/map/',
    alarms_scoket_url: 'ws://127.0.0.1:10087/rcs/ alarms',
    logs_scoket_url: 'ws://127.0.0.1:10087/rcs/logs',
    tasks_scoket_url: 'ws://127.0.0.1:10087/rcs/tasks'
}
var global_config = {
    node_EN_CN: {
        Name: '名称',
        X: 'X',
        Y: 'Y',
        DmCode: '数字编码',
        StopAngle: '停止角',
        FullTurnAvoidZone: '全回转避开区',
        TurnAvoidZone: '转弯避开区',
        TurnMaxSpeed: '转向最大速度',
        Length: '长',
        Width: '宽',
        Height: '高',
        Type: '类型',
        ShelfPose: '架子姿势',
        // ErrFixX: '二维码粘贴位置X误差(mm)',
        // ErrFixY: '二维码粘贴位置Y误差(mm)',
        // ErrFixAngle: '二维码粘贴角度误差(°)',
    },
    node_CN: [
        { en: 'Name', cn: '名称', value: '', unit: '' },
        { en: 'X', cn: 'X', value: '', unit: 'mm' },
        { en: 'Y', cn: 'Y', value: '', unit: 'mm' },
        { en: 'DmCode', cn: '数字编码', value: '', unit: '' },

        { en: 'StopAngle', cn: '停止角', value: '', unit: '°' },
        { en: 'FullTurnAvoidZone', cn: '全回转避开区', value: '', unit: '' },
        { en: 'TurnAvoidZone', cn: '转弯避开区', value: '', unit: '' },
        { en: 'TurnMaxSpeed', cn: '转向最大速度', value: '', unit: 'm/s' },

        { en: 'Length', cn: '长', value: '', unit: 'mm' },
        { en: 'Width', cn: '宽', value: '', unit: 'mm' },
        { en: 'Height', cn: '高', value: '', unit: 'mm' },
        { en: 'Type', cn: '类型', value: '', unit: '' },

        { en: 'ShelfPose', cn: '架子姿势', value: '', unit: '' },
    ],
    agv_CN: [
        { en: 'AgvType', cn: 'AGV类型', value: '', unit: '' },
        { en: 'Alarms', cn: '报警信息', value: '', unit: '' },
        //  { en: 'Online', cn: '在线/离线', value: '', , unit: ''},
        { en: 'Taskstate', cn: '任务状态', value: '', unit: '' },

        { en: 'IsLoad', cn: '是否载货', value: '', unit: '' },
        { en: 'Angle', cn: '角度', value: '', unit: '°' },
        { en: 'Speed', cn: '速度', value: '', unit: 'm/s' },

        { en: 'IsEStop', cn: '是否急停', value: '', unit: '' },
        { en: 'X', cn: 'X', value: '', unit: 'mm' },
        { en: 'Y', cn: 'Y', value: '', unit: 'mm' },

        { en: 'Length', cn: '长', value: '', unit: 'mm' },
        { en: 'Width', cn: '宽', value: '', unit: 'mm' },
        { en: 'Height', cn: '高', value: '', unit: 'mm' },
    ],
    door_CN: [
        { en: 'Angle', cn: '角度', value: '', unit: '°' },
        { en: 'Name', cn: '名称', value: '', unit: '' },
        { en: 'Type', cn: '类型', value: '', unit: '' },
        { en: 'X', cn: 'X', value: '', unit: 'mm' },
        { en: 'Length', cn: '长', value: '', unit: 'mm' },
        { en: 'Width', cn: '宽', value: '', unit: 'mm' },
        { en: 'Height', cn: '高', value: '', unit: 'mm' },
        { en: 'Alarms', cn: '报警信息', value: '', unit: '' },
        { en: 'DevId', cn: '设备ID', value: '', unit: '' },
        { en: 'DevType', cn: '设备类型', value: '', unit: '' },
        { en: 'IsEStop', cn: '是否急停', value: '', unit: '' },
        { en: 'IsLoad', cn: '是否有货', value: '', unit: '' },
        { en: 'IsOpen', cn: '开关状态', value: '', unit: '' },
        { en: 'Online', cn: '在线/离线', value: '', unit: '' },
    ],
    //充电桩类型
    charg_Type: [
        { label: '普通充电桩', value: 'Normal' },
    ],
    colorOptions: [
        { value: 'Red', title: '红色' },
        { value: 'Green', title: '绿色' },
        { value: 'Bule', title: '蓝色' },
        { value: 'White', title: '白色' },
        { value: 'Yellow', title: '黄色' },
        { value: 'Cyan', title: '青色' },
        { value: 'Carmine', title: '洋红色' },
    ],
    musicOptions: ['a音乐', 'bbbbb音乐', '欢迎使用', '避障音乐'],
}

var logs_config = {
    typeoptions: [
        { id: 1, label: "AGV交互指令", value: "AGVCmd" },
        { id: 2, label: "用户操作", value: "UserOperation" },
        { id: 3, label: "系统运行日志", value: "SystemRun" },

    ],
    leveloption: [
        { id: 1, label: "调试", value: "Debug" },
        { id: 2, label: "正常", value: "Info" },
        { id: 3, label: "错误", value: "Error" },
    ],
}

var agvtypeoption = [
    { id: 1, label: "叉车式AGV", value: "Fork" },
    { id: 2, label: "牵引式AGV", value: "Trac" },
    { id: 3, label: "潜伏举升式AGV", value: "Lift" },
    { id: 4, label: "滚筒AGV", value: "Roller" },
    { id: 5, label: "全向举升车", value: "LaserAllRoundJackAgv" },
    { id: 6, label: "全向滚筒车", value: "LaserAllRoundConveyorAgv" },
]

var agvlist = []