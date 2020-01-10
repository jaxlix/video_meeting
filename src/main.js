import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import FastClick from 'fastclick'
import './assets/rest.css'
import './assets/InfoWindow.css'

//引入 ElementUI  UI库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// pad端
FastClick.attach(document.body)

// 配置地图的ip端口和api接口
import { api } from './api/api'
Vue.prototype.$api = api.api

// 引入arcgis地图模块
import arcgis from './js/arcgis.js'
Vue.prototype.$arcgis = arcgis

// 引入融合通信api
import rhtxApi from './js/rhtx.js'
Vue.prototype.$rhtxApi = rhtxApi

// 引入aiMapServe,创建websocket连接，接收ai人脸识别警情
// import aiMap from './aiMap'
// Vue.prototype.$aiMap = aiMap

// 引入封装的http请求方法
import { post, postJson, get } from './http/http'
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$postJson = postJson

// 公共的方法
import common from './js/common.js'
Vue.prototype.$common = common

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
