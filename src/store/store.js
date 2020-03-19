import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dataSource: {},          // 所有上图设备、人员的数据源
    listeningGroups: {},   // 监听组
    currentGroup: {},      // 当前组
    planAction: '',         // 当前预案
    call: {},              // 当前正在呼叫人员、设备信息
    existingParticipants: [], // 参与会议的人员
    kickOutParticipant: '',
    meetingWsConnected: false,
    roomMode: -1,
    userAudioState: {version: -1},
    userAdded: 0
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
    onMeetingWsConnected(state, res) {
      state.meetingWsConnected = res;
    },
    onExistingParticipants(state, res) {
      state.existingParticipants = res
    },
    onNewParticipant(state, res) {
      if(state.existingParticipants.indexOf(res) == -1) {
        state.existingParticipants.push(res);
      }
    },
    onParticipantLeft(state, res) {
      state.existingParticipants = state.existingParticipants.filter(item => item !== res);
    },
    onParticipantKickOut(state, res) {
      state.existingParticipants = state.existingParticipants.filter(item => item !== res);
      state.kickOutParticipant = res;
    },
    onRoomModeChanged(state, res) {
      state.roomMode = res;
    },
    onUsersAdded(state, res) {
      state.userAdded = state.userAdded + 1;
    },
    onEnableUserAudio(state, res) {
      state.userAudioState = {
        uniqueNo : res.name,
        enable : res.enable,
        version: state.version + 1
      }
    }
  }
})
