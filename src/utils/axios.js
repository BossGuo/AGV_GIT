import axios from "axios";
const baseUrl = import.meta.env.VITE_APP_REQUEST_URL
// 创建axios实例
const service = axios.create({
    baseURL: baseUrl, // api的base_url
    // withCredentials: true,
    timeout: 50000 // 请求超时时间
});
// request拦截器
service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// respone拦截器
service.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export default service;