/* eslint-disable no-undef */
import axios from 'axios'
import { useUserStore } from '@/stores/user';
import router from '@/router';

const instance = axios.create({
  baseURL: 'https://big-event-vue-api-t.itheima.net/',
  timeout: 2000
});

// 添加请求拦截器
instance.interceptors.request.use((config)=>{
  //请求携带token
  const userStore = useUserStore()
  if(userStore.token) config.headers.Authorization = userStore.token
  return config;
}, function (error) {
  return Promise.reject(error);
});


// 添加响应拦截器
instance.interceptors.response.use( (resp)=>{
  if (resp.data.code === 0) {
    ElMessage({
      message: resp.data.message,
      type: 'success',
      plain: true,
    })
    return resp
  }else{
    ElMessage({
      message: resp.data.message||'服务异常',
      type: 'error',
      plain: true,
    })
    return Promise.reject(resp)
  }
}, (error) => {
  //响应状态码非200返回
  if (error.response?.status === 401) {
    ElMessage({
      message: error.response.data.message||'服务异常',
      type: 'error',
      plain: true,
    })
    router.push('/login')
  }
  return Promise.reject(error);
});

export default instance