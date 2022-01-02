import {
    UPDATE_CURRENTUSERINFO,
    UPDATE_RUNTIME_SSTX_LOGDATA,
    UPDATE_RUNTIME_SSCZ_LOGDATA,
    UPDATE_RUNTIME_SSYX_LOGDATA
} from './mutations-type.js'
import moment from 'moment'
import { setCookie, getCookie } from '../utils/utils';

export default {
    [UPDATE_CURRENTUSERINFO](state, data) {
        state.currentUser = { USERNAME: data.username };
    },
    [UPDATE_RUNTIME_SSTX_LOGDATA](state, data) {
        if (getCookie('countortime_sstx') == null) {
            setCookie('countortime_sstx', 'count')
        }
        if (getCookie('countortime_sstx_val') == null) {
            setCookie('countortime_sstx_val', 1000)
        }
        if (parseInt(getCookie('countortime_sstx_val')) == 0) {
            //没有限制,直接插入
            state.runtime_log_sstxdata.push(data);
        }
        else {
            if (getCookie('countortime_sstx') == 'count') {
                let count = parseInt(getCookie('countortime_sstx_val'))
                state.runtime_log_sstxdata = state.runtime_log_sstxdata.slice(-1 * count)
                if (state.runtime_log_sstxdata.length >= count) {
                    state.runtime_log_sstxdata.shift();
                }
                state.runtime_log_sstxdata.push(data);
                //限制条数
            } else {
                //限制时间
                let minutes = parseInt(getCookie('countortime_sstx_val'))
                let begin_time = moment().add(-1 * minutes, 'minutes')
                state.runtime_log_sstxdata = state.runtime_log_sstxdata.filter(x => moment(x.Time).diff(begin_time) >= 0);
                state.runtime_log_sstxdata.push(data);
            }
        }
    },
    [UPDATE_RUNTIME_SSCZ_LOGDATA](state, data) {
        if (getCookie('countortime_sscz') == null) {
            setCookie('countortime_sscz', 'count')
        }
        if (getCookie('countortime_sscz_val') == null) {
            setCookie('countortime_sscz_val', 1000)
        }
        if (parseInt(getCookie('countortime_sscz_val')) == 0) {
            //没有限制,直接插入
            state.runtime_log_ssczzdata.push(data);
        }
        else {
            if (getCookie('countortime_sscz') == 'count') {
                let count = parseInt(getCookie('countortime_sscz_val'))
                state.runtime_log_ssczzdata = state.runtime_log_ssczzdata.slice(-1 * count)
                if (state.runtime_log_ssczzdata.length >= count) {
                    state.runtime_log_ssczzdata.shift();
                }
                state.runtime_log_ssczzdata.push(data);
                //限制条数
            } else {
                //限制时间
                let minutes = parseInt(getCookie('countortime_sscz_val'))
                let begin_time = moment().add(-1 * minutes, 'minutes')
                state.runtime_log_ssczzdata = state.runtime_log_ssczzdata.filter(x => moment(x.Time).diff(begin_time) >= 0);
                state.runtime_log_ssczzdata.push(data);
            }
        }

    },
    [UPDATE_RUNTIME_SSYX_LOGDATA](state, data) {
        if (getCookie('countortime_ssyx') == null) {
            setCookie('countortime_ssyx', 'count')
        }
        if (getCookie('countortime_ssyx_val') == null) {
            setCookie('countortime_ssyx_val', 1000)
        }
        if (parseInt(getCookie('countortime_ssyx_val')) == 0) {
            //没有限制,直接插入
            state.runtime_log_ssyxzdata.push(data);
        }
        else {
            if (getCookie('countortime_ssyx') == 'count') {
                let count = parseInt(getCookie('countortime_ssyx_val'))
                state.runtime_log_ssyxzdata = state.runtime_log_ssyxzdata.slice(-1 * count)
                if (state.runtime_log_ssyxzdata.length >= count) {
                    state.runtime_log_ssyxzdata.shift();
                }
                state.runtime_log_ssyxzdata.push(data);
                //限制条数
            } else {
                //限制时间
                let minutes = parseInt(getCookie('countortime_ssyx_val'))
                let begin_time = moment().add(-1 * minutes, 'minutes')
                state.runtime_log_ssyxzdata = state.runtime_log_ssyxzdata.filter(x => moment(x.Time).diff(begin_time) >= 0);
                state.runtime_log_ssyxzdata.push(data);
            }
        }

    }
}

