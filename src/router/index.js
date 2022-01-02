import { createRouter, createWebHashHistory } from "vue-router";
// 路由懒加载,动态导入
const login = () => import('../views/Login.vue');
const Home = () => import('../views/Home.vue');
const AgvDispatch = () => import('../views/AgvDispatch.vue');
const HistoryTask = () => import('../views/HistoryTask.vue');
const HistoryAlarm = () => import('../views/HistoryAlarm.vue');
const AgvList = () => import('../views/AgvList.vue');
const AlarmList = () => import('../views/AlarmList.vue');
const ChargingPile = () => import('../views/ChargingPile.vue');
const Parameter = () => import('../views/Parameter.vue');
const Analysis = () => import('../views/Analysis.vue');
const Runtime_sstx = () => import('../views/Runtime_sstx.vue');//实时AGV通讯日志记录
const Runtime_sscz = () => import('../views/Runtime_sscz.vue');//实时系统操作记录
const Runtime_ssyx = () => import('../views/Runtime_ssyx.vue');//实时系统运行记录
const HistoryLogSel = () => import('../views/HistoryLogSel.vue');//历史日志记录查看
// const tjfx = () => import('../views/tjfx.vue');

const routes = [
    {
        path: '/login',
        name: 'login',
        component: login
    },
    {
        path: '/Home',
        name: 'Home',
        component: Home
    },
    {
        path: '/AgvDispatch',
        name: 'AgvDispatch',
        component: AgvDispatch
    },
    {
        path: '/HistoryTask',
        name: 'HistoryTask',
        component: HistoryTask
    },
    {
        path: '/HistoryAlarm',
        name: 'HistoryAlarm',
        component: HistoryAlarm
    },
    {
        path: '/AgvList',
        name: 'AgvList',
        component: AgvList
    },
    {
        path: '/AlarmList',
        name: 'AlarmList',
        component: AlarmList
    },
    {
        path: '/ChargingPile',
        name: 'ChargingPile',
        component: ChargingPile
    },
    {
        path: '/Parameter',
        name: 'Parameter',
        component: Parameter
    },
    {
        path: '/Analysis',
        name: 'Analysis',
        component: Analysis
    },
    {
        path: '/Runtime_sstx',
        name: 'Runtime_sstx',
        component: Runtime_sstx
    },
    {
        path: '/Runtime_sscz',
        name: 'Runtime_sscz',
        component: Runtime_sscz
    },
    {
        path: '/Runtime_ssyx',
        name: 'Runtime_ssyx',
        component: Runtime_ssyx
    },
    {
        path: '/HistoryLogSel',
        name: 'HistoryLogSel',
        component: HistoryLogSel
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router