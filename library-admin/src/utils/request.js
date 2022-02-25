import axios from 'axios'
import Message from 'element-ui'
import Vue from 'vue';
import cookie from 'js-cookie'
Vue.use(Message);


// 创建axios实例
const service = axios.create({
    baseURL: "http://localhost:9527",
    timeout: 5000 // 请求超时时间
  })

//配置登录信息拦截器
service.interceptors.request.use(
    config=>{
      //每次发送请求都判断cookie中是否含有token信息
      if (cookie.get('user_token')) {
        config.headers['token'] = cookie.get('user_token')
      }
      return config
    },
    error=>{
      return Promise.reject(error)
    }
)

service.interceptors.response.use(
  response=>{
      return response.data;
    },
  //返回错误信息
  error =>{
    return Promise.reject(error.response)
}
);
export default service