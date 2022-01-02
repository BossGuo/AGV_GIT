
export const SetCurrentUserInfo = ({ commit }, userinfo) => {
    commit('UPDATE_CURRENTUSERINFO', userinfo);
}

export const SetRuntime_Sstx_log_data = ({ commit }, data) => {
    commit('UPDATE_RUNTIME_SSTX_LOGDATA', data);
}
export const SetRuntime_Sscz_log_data = ({ commit }, data) => {
    commit('UPDATE_RUNTIME_SSCZ_LOGDATA', data);
}
export const SetRuntime_Ssyx_log_data = ({ commit }, data) => {
    commit('UPDATE_RUNTIME_SSYX_LOGDATA', data);
}