<template>
	<div id="index">
        <!-- 左侧视频列表 -->
		<div class="video-content" v-if="room.status == 0">
			<button v-show="playListFilter().length == 1 || room.status == 0" class="start-btn" @click="start">开始会商</button>
		</div>
		<div class="video-content" v-if="room.status == 2">
			<div class="start-btn">会商已结束</div>
		</div>
		<div class="video-content" v-if="room.status == 1">
			<div v-for="d in playListFilter().slice(0, videoNum)" :key="d.uniqueNo" class="video-box" :class="'video-box-'+videoNum">
				<video  autoplay class="video" :id="'video-' + d.uniqueNo"
                :class="fullScreen===d.uniqueNo ? 'fullScreen' : ''"
                @dblclick="fullScreen = fullScreen == '' ? d.uniqueNo : ''">
					Your browser does not support HTML5 video.
				</video>
				<div class="watermark" :class="fullScreen===d.uniqueNo ? 'watermark_fullScreen' : ''">
					<span>{{d.name}}</span>
					<span>{{d.no}}</span>
					<span v-show="d.deptName">({{d.deptName}})</span>
				</div>
				<img v-if="d.audioEnable == 0" class="jy" :class="fullScreen===d.uniqueNo ? 'jy_fullScreen' : ''" src="@/assets/icon/videoMeeting/jingyin.png" alt="静音">
			</div>
            <!-- 超过九分屏以外的视频，用于轮播全屏展示 -->
            <div v-for="d in playListFilter().slice(videoNum)" :key="d.id">
                <video  autoplay v-show="false" :class="fullScreen===d.uniqueNo ? 'fullScreen' : ''">
					<source :src="d.url" type="video/mp4">
					Your browser does not support HTML5 video.
				</video>
            </div>
            <button v-show="showCloseBanner" class="banner-btn" @click="closeBanner">退出轮播</button>
		</div>
        <!-- 右侧信息列表 -->
		<div class="msg-list" v-if="room.status == 0 || room.status == 1">
			<div class="header">
				<a class="v4" :class="videoNum == 4 ? 'active' : ''" href="javascript:void(0)" @click="videoNum = 4"></a>
				<a class="v6" :class="videoNum == 6 ? 'active' : ''" href="javascript:void(0)" @click="videoNum = 6"></a>
				<a class="v9" :class="videoNum == 9 ? 'active' : ''" href="javascript:void(0)" @click="videoNum = 9"></a>
				<a class="v16" :class="videoNum == 16 ? 'active' : ''" href="javascript:void(0)" @click="videoNum = 16"></a>
				<a class="to-right" href="javascript:void(0)"></a>
				<div>
					<a class="full-screen" href="javascript:void(0)"></a>
					<a class="close" href="javascript:void(0)"></a>
				</div>
			</div>
			<div class="btns">
				<a href="javascript:void(0)" @click="changeRoomMode(0)" :class="room.mode == '0' ? 'this' : ''" v-show="room">主会场模式</a>
				<a href="javascript:void(0)" @click="changeRoomMode(1)" :class="room.mode == '1' ? 'this' : ''" v-show="room">会商模式</a>
				<a href="javascript:void(0)" @click="banner">轮播</a>
				<a href="javascript:void(0)" @click="showAdd = true" v-if="currentUser.uniqueNo == room.presidentId">添加</a>
			</div>
			<ul class="msg-content">
				<li v-if="magList.length == 0 && currentUser.uniqueNo == room.presidentId" class="msg-item">
					<span class="icon_TERMINAL_PC"></span>
					<div class="msg">
						<p class="name">{{currentUser.name}} {{currentUser.no}}</p>
						<p class="dept">{{currentUser.deptName}}</p>
					</div>
				</li>
				<li v-for="(d,i) in magListFilter()" :key="i" class="msg-item">
					<span :class="'icon_'+d.type"></span>
					<div class="msg">
						<p class="name">{{d.name}} {{d.no}}</p>
						<p class="dept">{{d.deptName}}</p>
					</div>
					<!-- 禁言，拨通，挂断，踢出 -->
					<a class="call" title="呼叫" v-show="room.status ==1 && !d.online" @click="notifyUserJoin(d)" href="javascript:void(0)"></a>
					<a class="sound_on" title="关闭声音" v-show="showSoundToggle(d, d.soundEnable == 1)" @click="toggleSound(d, 0)" href="javascript:void(0)"></a>
					<a class="sound_off" title="打开声音" v-show="showSoundToggle(d, d.soundEnable == 0)" @click="toggleSound(d, 1)"  href="javascript:void(0)"></a>
					<a class="audio_on" title="禁言" v-show="showAudioToggle(d, !isDisableUserAudio(d))" @click="toggleAudio(d, 0)" href="javascript:void(0)"></a>
					<a class="audio_off" title="开麦" v-show="showAudioToggle(d, isDisableUserAudio(d))" @click="toggleAudio(d, 1)"  href="javascript:void(0)"></a>
					<a class="end" title="挂断" v-show="room.status ==1 && d.online && room.presidentId == currentUser.uniqueNo && room.presidentId != d.uniqueNo" @click="hangUp(d)"  href="javascript:void(0)"></a>
					<a class="del" title="踢出" href="javascript:void(0)" v-show="room.presidentId == currentUser.uniqueNo && room.presidentId != d.uniqueNo" @click="kickOut(d)"></a>
				</li>
			</ul>
			<div class="stop" @click="stopVis=true" v-if="currentUser.uniqueNo == room.presidentId && room.status == 1">结束视频会商</div>
		</div>
        <!-- 添加弹框 -->
        <el-dialog title="添加成员" :visible.sync="showAdd" :close-on-click-modal="false" :destroy-on-close="true" class="dialog-bg" width="750px">
            <addPerson @close="showAdd = false" @checkedData="checkedData" />
        </el-dialog>
		<!-- 结束视频会商 -->
		<model v-show="stopVis" @close="stopVis=false" @stopType="stop" />
	</div>
</template>

<script>
	import addPerson from "@/views/addPerson/addPerson";
	import { post, postJson, get } from '@/http/http';
	import model from "@/components/common/model/model";
	var _ = require("underscore")._;
	export default {
		data() {
			return {
				videoNum: 9,
				magList: [],
				showAdd: false,
				roomId: -1,
				room: {},
				currentUser: {},
                fullScreen: "",
                timer: null,
				showCloseBanner: false,
				playList:[],
				stopVis: false
			}
		},
        components: {
            addPerson,
			model
		},
		mounted() {
			let uniqueNo = this.$route.query.uniqueNo;
			let params = new URLSearchParams();
			let _this = this;
			params.append('no', uniqueNo);
			get(this.$api.getMemberByNo, params).then(res => {
				_this.currentUser = {
					deptId: res.account.department.id,
					deptName: res.account.department.name,
					name: res.account.name,
					no: res.account.no,
					phone: res.account.phoneNumber,
					// status: child.status,
					type: res.terminalMemberType,
					uniqueNo: res.uniqueNo,
				}
				
			}).catch(err => {
				console.log(err)
			})
			// 暴露给pc调用
			window['stopMetting'] = () => {
				this.stopMetting()
			}
		},
		methods: {
			showSoundToggle(mag, enable) {
				return this.room.status ==1 && mag.online && enable && this.currentUser.uniqueNo != mag.uniqueNo;
			},
			// 此处audio实际指mic
			showAudioToggle(mag, enable) {
				if(this.currentUser.uniqueNo == this.room.presidentId) {
					return this.room.status ==1 && mag.online && enable;
				} else {
					return this.room.status ==1 && mag.online && enable && this.currentUser.uniqueNo == mag.uniqueNo;
				}
				
			},
			stopMetting(){
				this.stopVis = true
			},
			isDisableUserAudio(item) {
				if(this.room.mode == 0 && this.currentUser.uniqueNo != item.uniqueNo) {
					return true;
				}
				return item.audioEnable == 0;
			},
			magListFilter() {
				if(this.currentUser.uniqueNo == this.room.presidentId) {
					return this.magList;
				} else {
					return _.filter(this.magList, mag => (mag.online || mag.uniqueNo == this.currentUser.uniqueNo));
				}
			},
			play() {
				this.$nextTick(()=>{
					this.playListFilter().forEach(playItem => {
						var video = document.getElementById('video-' + playItem.uniqueNo);
						if(playItem.uniqueNo == this.currentUser.uniqueNo) {
							this.$meetingApi.sendOnly(video, !this.muted(playItem));
						} else {
							this.$meetingApi.receiveOnly(video, playItem.uniqueNo, !this.muted(playItem));
						}
					});

				});
			},
			playListFilter() {
				if(this.room.status == 1) {
					return _.filter(this.magList, mag => (mag.online || mag.uniqueNo == this.currentUser.uniqueNo));
				} else {
					return [];
				}
			},
			notifyUserJoin(user) {
				this.$meetingApi.notifyUserJoin(this.roomId, user.uniqueNo, (res)=>{
                    if(res.success == false) {
                        this.$message({
							message: res.message,
							type: "info"
						});
                    }
                });
			},
			initUserSoundEnable(user) {
				if(window.localStorage) {
					let storage = window.localStorage;
					let soundEnable = storage.getItem(`meeting_${this.roomId}_${this.currentUser.uniqueNo}_${user.uniqueNo}_soundEnable`);
					if(soundEnable != undefined) {
						user.soundEnable = soundEnable;
					}
				}
			},
			toggleSound(user, enable) {
				user.soundEnable = enable;
				if(window.localStorage) {
					let storage = window.localStorage;
					storage.setItem(`meeting_${this.roomId}_${this.currentUser.uniqueNo}_${user.uniqueNo}_soundEnable`, enable);
				}
				this.$meetingApi.enableAudio(user.uniqueNo, !this.muted(user));
			},
			toggleAudio(user, enable) {
				user.audioEnable = enable;
				if(this.currentUser.uniqueNo == user.uniqueNo || this.currentUser.uniqueNo == this.room.presidentId) {
					this.$meetingApi.toggleAudio(user.uniqueNo, enable);
					this.$meetingApi.enableAudio(user.uniqueNo, !this.muted(user));
				} 
			},
			kickOut(user) {
				this.$meetingApi.kickOutUser(user.uniqueNo);
			},
			hangUp(user) {
				this.$meetingApi.hangUpUser(user.uniqueNo);
			},
			muted(playItem) {

				if(playItem.enableAudio == 0 || playItem.soundEnable == 0) {
					return true;
				}

				// 主持人模式
				if(this.room.mode == 0) {
					if(playItem.uniqueNo == this.room.presidentId) {
						return playItem.audioEnable == 0 || playItem.soundEnable == 0;
					} else {
						return true;
					}
				};

				// 如果已经被禁言，那么没有声音
				return playItem.audioEnable == 0 || playItem.soundEnable == 0;
			},
			checkedData(data) {
				let addUserList = [];
				let _this = this;
				addUserList.push(this.currentUser);
				addUserList = addUserList.concat(data);
				if(addUserList.length > 0) {
					this.$meetingApi.addRoomUsers(this.roomId, addUserList, function(data){
						_this.$meetingApi.getRoomUsers(_this.roomId, function(result) {
							if(_this.room.status == 0) {
								_this.magList = result.data;
								var mag = _.findWhere(_this.magList, item => item.uniqueNo == _this.currentUser.uniqueNo);
								if(mag) {
									mag.online = true;
								}
							} else {
								result.data.forEach(item => {
									var finded = _.some(_this.magList, mag => {
										return mag.uniqueNo == item.uniqueNo;
									});
									if(!finded) {
										_this.magList.push(item);
									}
								})
							}
							
							
							_this.showAdd = false;
						});
					});
				}
			},

			//开始视频会商
            start(){
				if(this.magList.length > 1){
					this.$meetingApi.startMeeting(this.roomId, (res)=>{
						this.room = res.data;
						this.play();
					});
                }else{
                    this.$message({
                        message: "请添加人员",
                        type: "warning"
                    })
				}
			},

			changeRoomMode(mode) {
				if(this.room.presidentId == this.currentUser.uniqueNo) {
					this.$meetingApi.changeRoomMode(mode);
				} else {
					this.$message({
							message: "仅发起人支持该操作",
							type: "warning"
					})
				}
				
			},
            // 轮播
            banner(){
				let playList = this.playListFilter();
                if(playList.length == 0){
                    this.$message({
                        message: "暂无轮播视频",
                        type: "warning"
                    })
                    return
                }
                let index = 0
                this.fullScreen = playList[0].uniqueNo
                this.showCloseBanner = true
                this.timer = setInterval(() => {
                    index++
                    if(index < playList.length){
                        this.fullScreen = playList[index].uniqueNo
                    }else{
                        index = 0
                        this.fullScreen = playList[index].uniqueNo
                    }
                }, 10000);
            },
            // 结束轮播
            closeBanner(){
                this.fullScreen = ""
                this.showCloseBanner = false
                clearInterval(this.timer)
			},
			// 结束视频会商
			stop(t){
				this.stopVis = false
				if(t == 1){	// 离开会商
					this.$get("http://127.0.0.1:8099/system/closeVideoMeetingWindow").then(res => {
						console.log(res)
					})
				}else{	// 结束会商
					this.$meetingApi.endMeeting(this.roomId, (res)=>{
						this.room = res.data;
					});
				}
			}
		},
		computed: {
			existingParticipants() {
				return this.$store.state.existingParticipants;
			},
			// newParticipant() {
			// 	return this.$store.state.newParticipant;
			// },
			meetingWsConnected() {
				return this.$store.state.meetingWsConnected;
			},
			invitedUsers() {
				return this.$store.state.checkedData;
			},
			roomMode() {
				return this.$store.state.roomMode;
			},
			kickOutParticipant() {
				return this.$store.state.kickOutParticipant;
			},
			userAudioState() {
				return this.$store.state.userAudioState;
			},
			userAddedState() {
                return this.$store.state.userAdded;
            }

		},
		watch: {
			userAddedState() {
                this.$meetingApi.getRoomUsers(this.roomId, (result) =>{
                    result.data.forEach(item => {
                        var finded = _.some(this.magList, mag => {
                            return mag.uniqueNo == item.uniqueNo;
                        });
                        if(!finded) {
							initUserSoundEnable(item);
                            this.magList.push(item);
                        }
                    });
                });
            },
			userAudioState(newVal) {
				this.magList.forEach((item, i) => {
					if(item.uniqueNo == newVal.uniqueNo) {
						item.audioEnable = newVal.enable;
						this.$set(this.magList, i, item);
						this.$meetingApi.enableAudio(item.uniqueNo, !this.muted(item));
					}
				});

			},
			roomId (val) {
				let query = this.$router.history.current.query;
				let path = this.$router.history.current.path;
				//对象的拷贝
				let newQuery = JSON.parse(JSON.stringify(query));
				// 地址栏的参数值赋值
				newQuery.roomId = val;
				this.$router.push({ path, query: newQuery });
			},
			meetingWsConnected(newVal, oldVal) {
				let _this = this;
				if(newVal === true) {
					this.roomId = this.$route.query.roomId;
					var uniqueNo = this.$route.query.uniqueNo;
					if(this.roomId) {
						this.$meetingApi.getRoomInfo(_this.roomId, function(result) {
							_this.room = result.data;
							_this.$meetingApi.getRoomUsers(_this.roomId, function(result) {
								_this.magList = result.data;
								_this.magList.forEach(mag => _this.initUserSoundEnable(mag));
								_this.$meetingApi.register(uniqueNo, _this.roomId);
							});
						});
					} else {
						this.$meetingApi.createRoom(uniqueNo,function(result) {
							_this.roomId = '' + result.data.id;
							_this.room = result.data;
							_this.$meetingApi.register(uniqueNo, result.data.id);
						});
					}
				}
			},

			existingParticipants(newVal, oldVal) {
				this.magList.forEach(mag => mag.online = false);
				newVal.forEach(item => {
					this.magList.filter(mag => mag.uniqueNo == item).forEach(mag => mag.online = true);
				});
				this.magList.filter(mag => mag.uniqueNo == this.currentUser.uniqueNo).forEach(mag => mag.online = true);
				this.$forceUpdate();
				this.play();

            },

			roomMode(newVal, oldVal) {
				console.log("room mode changed", newVal, oldVal);
				this.room.mode = newVal;
				this.magList.forEach(item =>{
					this.$meetingApi.enableAudio(item.uniqueNo, !this.muted(item));
				});
			},
			kickOutParticipant(newVal, oldVal) {
				this.magList = this.magList.filter(item => item.uniqueNo != newVal);
			}
		}
	};
</script>
<style lang="less" scoped>
#index {
    display: flex;
    width: 100%;
    height: 100%;
    .video-content {
        position: relative;
        flex: 1;
        background-color: rgb(34, 34, 34);
        .fullScreen{
            display: block !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 99999 !important;
            background-color: #000 !important;
        }
        .banner-btn{
            position: fixed;
            right: 10px;
            top: 30px;
            width: 120px;
            height: 30px;
            background-color: rgba(255, 10, 0, 0.3);
            color: #fff;
            text-align: center;
            line-height: 30px;
            z-index: 9999999;
            border-radius: 15px;
            border: 0;
            cursor: pointer;
        }
        .start-btn{
            position: absolute;
            left: calc(50% - 110px);
            top: calc(50% - 35px;);
            width: 220px;
            height: 70px;
            text-align: center;
            line-height: 70px;
            border: 1px solid #19C1FF;
            color: #19C1FF;
            background-color: rgb(34, 34, 34);
            cursor: pointer;
        }
        .video-box {
			position: relative;
            float: left;
            box-sizing: border-box;
            border-right: 1px solid #000;
            border-bottom: 1px solid #000;
            text-align: center;
            background: url("../assets/icon/videoMeeting/bg.png") center center
                no-repeat;
            .video {
                width: 100%;
                height: 100%;
				object-fit: cover;
            }
            .phone {
                display: block;
                width: 100%;
                height: 100%;
                background: url("../assets/icon/videoMeeting/bg_audio.png")
                    center center no-repeat;
                background-color: #2b3338;
            }
			.watermark{
				position: absolute;
				left: 20px;
				bottom: 30px;
				color: #fff;
				span{
					margin-right: 10px;
				}
				&.watermark_fullScreen{
					position: fixed !important;
					z-index: 999999 !important;
				}
			}
			.jy{
				position: absolute;
				top: 10px;
				right: 10px;
				width: 26px;
				height: 26px;
				&.jy_fullScreen{
					position: fixed !important;
					z-index: 999999 !important;
				}
			}
        }
        .video-box-4 {
            width: calc(100% / 2);
            height: calc(100% / 2);
        }
        .video-box-6 {
            width: calc(100% / 3);
            height: calc(100% / 3);
            &:first-child {
                width: calc(100% / 3 * 2);
                height: calc(100% / 3 * 2);
            }
        }
        .video-box-9 {
            width: calc(100% / 3);
            height: calc(100% / 4);
            &:first-child {
                width: calc(100% / 3 * 2);
                height: calc(100% / 2);
            }
        }
        .video-box-16 {
            width: calc(100% / 4);
            height: calc(100% / 4);
        }
    }
    .msg-list {
        width: 410px;
        height: 100%;
        color: #fff;
        overflow: hidden;
        background-color: rgb(79, 79, 79);
        .header {
            display: flex;
            align-items: center;
            height: 36px;
            .v4 {
                margin: 10px;
                width: 22px;
                height: 22px;
                background: url(../assets/icon/videoMeeting/top/screen_four.png) center center
                    no-repeat;
				background-size: 100% 100%;
				&.active{
					background: url(../assets/icon/videoMeeting/top/screen_four_active.png) center center
                    no-repeat;
                	background-size: 100% 100%;
				}
			}
            .v6 {
                margin: 10px;
                width: 22px;
                height: 22px;
                background: url(../assets/icon/videoMeeting/top/screen_six.png) center center
                    no-repeat;
				background-size: 100% 100%;
				&.active{
					background: url(../assets/icon/videoMeeting/top/screen_six_active.png) center center
                    no-repeat;
                	background-size: 100% 100%;
				}
            }
            .v9 {
                margin: 10px;
                width: 22px;
                height: 22px;
                background: url(../assets/icon/videoMeeting/top/screen_nine.png) center center
                    no-repeat;
				background-size: 100% 100%;
				&.active{
					background: url(../assets/icon/videoMeeting/top/screen_nine_active.png) center center
                    no-repeat;
                	background-size: 100% 100%;
				}
            }
            .v16 {
                margin: 10px;
                width: 22px;
                height: 22px;
                background: url(../assets/icon/videoMeeting/top/screen_sixteen.png) center
                    center no-repeat;
				background-size: 100% 100%;
				&.active{
					background: url(../assets/icon/videoMeeting/top/screen_sixteen_active.png) center center
                    no-repeat;
                	background-size: 100% 100%;
				}
            }
            .to-right {
                margin: 10px;
                width: 22px;
                height: 22px;
                background: url(../assets/icon/videoMeeting/top/forword_1.png) center
                    center no-repeat;
                background-size: 100% 100%;
            }
        }
        .btns {
            display: flex;
            padding-left: 5px;
            padding-right: 10px;
            a {
                flex: 1;
                height: 24px;
                border: 1px solid #19d1ff;
                box-shadow: 0 0 8px rgba(25, 209, 255, 0.6) inset;
                color: #fff;
                margin: 5px;
                text-align: center;
                line-height: 24px;
                font-size: 14px;
                &:hover {
                    color: #19d1ff;
                    box-shadow: 0 0 8px rgba(25, 209, 255, 0.8) inset;
                }
			}
			.this{
				background-color: #19d1ff;
				color: #222;
				&:hover {
                    color: #222;
                    box-shadow: 0 0 8px rgba(25, 209, 255, 0.8) inset;
                }
			}
        }
        .msg-content {
            padding: 10px;
            height: calc(100% - 152px);
            overflow-y: auto;
            .msg-item {
                display: flex;
				margin-top: 15px;
				.icon_TERMINAL_PC{
					width: 28px;
					height: 28px;
					background: url(../assets/icon/videoMeeting/metting-list/11.png) center center no-repeat;
					background-size: 100% 100%;
				}
				.icon_TERMINAL_PHONE{
					width: 28px;
					height: 28px;
					background: url(../assets/icon/videoMeeting/metting-list/44.png) center center no-repeat;
					background-size: 100% 100%;
				}
                .msg {
                    flex: 1;
                    .dept {
                        font-size: 14px;
                        color: #ccc;
                    }
                }
                a {
                    margin: 5px;
                }
                .call {
                    width: 24px;
                    height: 24px;
                    background: url("../assets/icon/videoMeeting/metting-list/5.png")
                        center center no-repeat;
                    background-size: 100% 100%;
                }
                .end {
                    width: 24px;
                    height: 24px;
                    background: url("../assets/icon/videoMeeting/metting-list/1.png")
                        center center no-repeat;
                    background-size: 100% 100%;
                }
                .del {
                    width: 24px;
                    height: 24px;
                    background: url("../assets/icon/videoMeeting/metting-list/2.png")
                        center center no-repeat;
                    background-size: 100% 100%;
				}
				.audio_on {
                    width: 24px;
                    height: 24px;
                    background: url("../assets/icon/videoMeeting/metting-list/4.png")
                        center center no-repeat;
                    background-size: 100% 100%;
				}
				.audio_off {
                    width: 24px;
                    height: 24px;
                    background: url("../assets/icon/videoMeeting/metting-list/3.png")
                        center center no-repeat;
                    background-size: 100% 100%;
				}
				.sound_on {
                    width: 24px;
                    height: 24px;
                    background: url("../assets/icon/videoMeeting/metting-list/sound_on.png")
                        center center no-repeat;
                    background-size: 100% 100%;
				}
				.sound_off {
                    width: 24px;
                    height: 24px;
                    background: url("../assets/icon/videoMeeting/metting-list/sound_off.png")
                        center center no-repeat;
                    background-size: 100% 100%;
				}
				
            }
            /*定义滚动条高宽及背景
			高宽分别对应横竖滚动条的尺寸*/
            &::-webkit-scrollbar {
                width: 10px;
                height: 16px;
                background-color: #999;
            }
            /*定义滚动条轨道
			内阴影+圆角*/
            &::-webkit-scrollbar-track {
                box-shadow: 0 0 6px rgba(0, 0, 0, 0.3) inset;
                border-radius: 5px;
                background-color: #999;
            }
            /*定义滑块
			内阴影+圆角*/
            &::-webkit-scrollbar-thumb {
                border-radius: 10px;
                box-shadow: 0 0 6px rgba(0, 0, 0, 0.3) inset;
                background-color: #555;
            }
		}
		.stop{
			width: 160px;
			height: 40px;
			margin: 10px auto;
			text-align: center;
			line-height: 40px;
			background-color: rgba(255, 85, 85, .5);
			color: #fff;
			cursor: pointer;
			border-radius: 8px;
		}
	}
	/deep/.dialog-bg{
		.el-dialog{
			background-color: #222A30;
			border-radius: 6px;
			box-shadow: 0 0 8px rgba(25, 209, 255, 0.6) inset;
			.el-dialog__title{
				color: #fff !important;
			}
			.el-dialog__body{
				padding: 0;
			}
		}
	}
}
</style>


