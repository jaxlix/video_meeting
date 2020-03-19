<template>
    <div id="app">
        <div v-for="(d, i) in playListFilter()" :key="d.uniqueNo" class="video-box" v-show="index == i" @click="menu(1)">
            <video autoplay="autoplay" class="video" :id="'video-' + d.uniqueNo"  webkit-playsinline playsinline>
            </video>
            <div class="watermark">
				<span>{{d.name}}</span>
				<span>{{d.no}}</span>
				<span v-show="d.deptName" class="dept-name">({{d.deptName}})</span>
			</div>
        </div>
        <button v-show="playListFilter().length > 0 && !listShow" class="banner" @click="banner">{{bannerName}}</button>
        <button v-show="playListFilter().length > 0 && !listShow" class="menu" @click="menuOpen"></button>
        <div v-show="playListFilter().length > 0" class="hangup" @click="hangUp">
            <i class="icon-hangup"></i>
            <span class="hangup-text">挂断</span>
        </div>
        <div class="list-box" @click="menu($event)">
            <div class="list" :style="styles"  ref="listMenu">
            <div class="item" v-for="(d, i) in playListFilter()" :key="d.uniqueNo" >
                <div class="item-icon" title="关闭声音" v-show="showSoundToggle(d, d.soundEnable == 1)" @click="toggleSound(d, 0)">
                    <i class="icon-sound-on"></i>
                </div>
                <div class="item-icon" title="打开声音" v-show="showSoundToggle(d, d.soundEnable == 0)" @click="toggleSound(d, 1)">
                    <i class="icon-sound-off"></i>
                </div>
                <div class="item-icon" title="禁言" v-show="showAudioToggle(d, !isDisableUserAudio(d))" @click="toggleAudio(d, 0)">
                    <i class="icon-call"></i>
                </div>
                <div class="item-icon" title="开麦" v-show="showAudioToggle(d, isDisableUserAudio(d))" @click="toggleAudio(d, 1)">
                    <i class="icon-end"></i>
                </div>
                <div class="item-msg" @click="index=i">
                    <p>
                        <span :class="'icon-'+d.type"></span>
                        <span class="name">{{d.name}}</span>
                        <span>{{d.no}}</span>
                    </p>
                    <p class="dept">{{d.deptName}}</p>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
	import addPerson from "@/views/addPerson/addPerson";
	import { post, postJson, get } from '@/http/http';
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
                index: 0,
                bannerName: "轮播",
                styles: null,
                listShow: false
			}
		},
        components: {
            addPerson
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
			isDisableUserAudio(item) {
				if(this.room.mode == 0 && this.currentUser.uniqueNo != item.uniqueNo) {
					return true;
				}
				return item.audioEnable == 0;
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
            // 列表显示隐藏
            menu(e) {
                if(!this.$refs.listMenu.contains(e.target)){
                    this.listShow = false
                    this.styles = {
                        right:'-240px'
                    }
                }
            },
            menuOpen(){
                this.styles = {
                    right: 0
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
				return _.filter(this.magList, mag => (mag.online || mag.uniqueNo == this.currentUser.uniqueNo));
			},
			notifyUserJoin(user) {
				this.$meetingApi.notifyUserJoin(this.roomId, user.uniqueNo, (res)=>{
                    if(res.success == false) {

                    }
                });
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
			hangUp() {
                this.$meetingApi.hangUpUser(this.currentUser.uniqueNo);
                android.hangUp();
                
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
				let _this = this;
				let addUserList = [];
				addUserList.push(this.currentUser);
				data.forEach(function(parent) {
					parent.members.forEach(function(child) {
						addUserList.push({
							deptId: child.deptId,
							deptName: parent.deptName,
							name: child.name,
							no: child.no,
							phone: child.phone,
							status: child.status,
							type: child.type,
							uniqueNo: child.uniqueNo,
						});
					});
				});
				if(addUserList.length > 0) {
					this.$meetingApi.addRoomUsers(this.roomId, addUserList, function(data){
						_this.$meetingApi.getRoomUsers(_this.roomId, function(result) {
							_this.magList = result.data;
							_this.showAdd = false;
						});
					});
				}
			},

			//开始视频会商
            start(){
				if(this.magList.length > 0){
					this.$meetingApi.startMeeting(this.roomId, (res)=>{
						this.room = res.data;
					});
                }else{
                    this.$message({
                        message: "请添加人员",
                        type: "warning"
                    })
				}
				this.$forceUpdate();

			},
			changeRoomMode(mode) {
				this.$meetingApi.changeRoomMode(mode);
			},
            // 轮播
          // 轮播
            banner() {
                if(this.bannerName == "轮播"){
                    this.bannerName = "关闭"
                    this.timer = setInterval(() => {
                        if (this.index == this.playListFilter().length-1) {
                            this.index = 0;
                        } else {
                            this.index = this.index + 1;
                        }
                    }, 10000);
                }else{
                    clearInterval(this.timer)
                    this.bannerName = "轮播"
                }

            },
            // 结束轮播
            closeBanner(){
                this.fullScreen = ""
                this.showCloseBanner = false
                clearInterval(this.timer)
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
#app {
    position: relative;
    width: 100%;
    height: 100%;
    .video-box {
        position: relative;
        width: 100%;
        height: 100%;
        .video {
            width: 100%;
            height: 100%;
            background-color: #000;
            object-fit: cover;
        }
        .watermark {
            position: absolute;
            left: 20px;
            bottom: 30px;
            color: #fff;
            span {
                margin-right: 10px;
            }
            .dept-name{
                display: block;
                margin-top: 3px;
            }
        }
    }
    .banner {
        position: absolute;
        top: 10px;
        right: 80px;
        z-index: 99;
        width: 90px;
        height: 40px;
        border: 1px solid #fff;
        color: #fff;
        text-align: center;
        line-height: 40px;
        border-radius: 20px;
        background-color: transparent;
        font-size: 20px;
        &:focus{
            outline: 0;
        }
    }
    .menu {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 99;
        width: 24px;
        height: 21px;
        background: url(./images/menu.png) center center no-repeat;
        background-size: 100% 100%;
        border: 0;
    }
    .hangup {
        position: absolute;
        bottom: 20px;
        z-index: 99;
        left: calc(50% - 50px);
        width: 100px;
        text-align: center;
        .icon-hangup {
            display: inline-block;
            width: 95px;
            height: 95px;
            background: url(./images/hangup.png) center center no-repeat;
            background-size: 100% 100%;
        }
        .hangup-text {
            color: #fff;
            font-size: 20px;
        }
    }
    .list-box{
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 0;
        top: 0;
        left: 0;
        background: transparent;
        pointer-events: none;
        .list {
            position: absolute;
            right: -240px;
            top: 0;
            z-index: 99999;
            width: 240px;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            transition: all 0.5s linear;
            overflow: hidden;
            overflow-y: auto;
            .item {
                display: flex;
                margin-top: 10px;
                .item-icon {
                    width: 40px;
                    text-align: center;
                    .icon-sound-on {
                        display: inline-block;
                        width: 17px;
                        height: 25px;
                        background: url("../../assets/icon/videoMeeting/metting-list/sound_on.png")
                            center center no-repeat;
                        background-size: 100% 100%;
                    }
                    .icon-sound-off {
                        display: inline-block;
                        width: 17px;
                        height: 25px;
                        background: url("../../assets/icon/videoMeeting/metting-list/sound_off.png")
                            center center no-repeat;
                        background-size: 100% 100%;
                    }
                    .icon-call {
                        display: inline-block;
                        width: 17px;
                        height: 25px;
                        background: url("../../assets/icon/videoMeeting/can_speak.png")
                            center center no-repeat;
                        background-size: 100% 100%;
                    }
                    .icon-end {
                        display: inline-block;
                        width: 17px;
                        height: 25px;
                        background: url("../../assets/icon/videoMeeting/cannot_speak.png")
                            center center no-repeat;
                        background-size: 100% 100%;
                    }
                }
                .item-msg {
                    flex: 1;
                    .name{
                        margin-right: 10px;
                    }
                    .dept{
                        margin-left: 18px;
                        color: #aaa;
                        font-size: 14px;
                    }
                    .icon-TERMINAL_PC{
                        position: relative;
                        top: 3px;
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        margin-right: 10px;
                        background: url(./images/pc.png) center center no-repeat;
                        background-size: 100% 100%;
                    }
                    .icon-TERMINAL_PHONE{
                        position: relative;
                        top: 3px;
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        margin-right: 10px;
                        background: url(./images/phone.png) center center no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
        }
    }
}
</style>