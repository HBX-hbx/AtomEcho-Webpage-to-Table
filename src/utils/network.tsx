import axios from 'axios'
import { getTokenState } from '../store/store'
import { getToken, TokenKey } from './auth'
import { useSelector } from 'react-redux';

// create an axios instance
const service = axios.create({
  baseURL: 'https://dj.atomecho.cn', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60 * 1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
      // do something before request is sent

      if (config && config.headers) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        // config.headers['Access-Control-Allow-Headers'] = "x-token"
        config.headers['authorization'] = 'Bearer ' + getToken()
      }
      return config
    },
    error => {
      // do something with request error
      console.log('request拦截器:', error) // for debug
      return Promise.reject(error)
    }
)

// response拦截器
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
    response => {
      console.log('<---------------receiving--------------------->')
      console.log(response)
      return response.data
    }
)

export default service
