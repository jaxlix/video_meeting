import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dataSource: {},          // 所有上图设备、人员的数据源
    listeningGroups: {},   // 监听组
    currentGroup: {},      // 当前组
    planAction: '',         // 当前预案
    call: {}              // 当前正在呼叫人员、设备信息
  },
  getters: {
    dataSource(state){
      return state.dataSource
    },
    listeningGroups(state) {
      return state.listeningGroups
    },
    currentGroup(state) {
      return state.currentGroup
    },
    planAction(state) {
      return state.planAction
    },
    call(state) {
      return state.call
    },
  },
  mutations: {
    setDataSource(state, res){
      state.dataSource = res
    },
    setListeningGroups(state, res) {
      state.listeningGroups = res
    },
    setCurrentGroup(state, res) {
      state.currentGroup = res
    },
    setPlanAction(state, res) {
      state.planAction = res
    },
    setCall(state, res) {
      state.call = res
    },
  }
})
