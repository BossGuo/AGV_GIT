import { createStore } from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
    currentUser: undefined, //当前登录的用户信息
    menuInfo: [], // 菜单信息
    RoleInfo: [], //角色信息
    runtime_log_sstxdata: [],//实时通讯日志
    runtime_log_ssczzdata: [],//实时操作日志
    runtime_log_ssyxzdata: [],//实时运行日志
}

export default createStore({
    state,
    getters,
    actions,
    mutations
})