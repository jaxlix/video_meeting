<template>
	<div class="video-box" :class="show ? 'move-show' : 'move-hide'">
		<video v-for="item in videoList" :id="item.id" :key="item.id" controls class="video"></video>
		<div class="move">
			<img v-show="show" @click="show = !show" src="./images/to_right.png" alt />
			<img v-show="!show" @click="show = !show" src="./images/to_left.png" alt />
		</div>
	</div>
</template>
<script>
	import flvjs from "flv.js";
	export default {
		data() {
			return {
				dataList: [],
				videoMap: {},
				show: false,
				counter: 0,
				videoBoxPtr: 0,
				playerOptions: {
					height: "210",
					autoplay: true, //如果true,浏览器准备好时开始回放。
					muted: false, // 默认情况下将会消除任何音频。
					loop: false, // 导致视频一结束就重新开始。
					preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					language: "zh-CN",
					aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					sources: [
						{
							withCredentials: false,
							type: "application/x-mpegURL",
							src: "" //url地址
						}
					],
					flash: { hls: { withCredentials: false } },
					html5: { hls: { withCredentials: false } },
					poster:
						"https://surmon-china.github.io/vue-quill-editor/static/images/surmon-5.jpg",
					// poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-9.jpg", //你的封面地址
					// width: document.documentElement.clientWidth, //播放器宽度
					notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
					controlBar: {
						timeDivider: true,
						durationDisplay: true,
						remainingTimeDisplay: false,
						fullscreenToggle: true //全屏按钮
					}
				}
			};
		},
		props: {
			// 摄像头编号数组
			data: {
				type: Array,
				default () {
					return []
				}
			},
			// 页面展示视频流个数
			count: {
				type: Number,
				default () {
					return 4
				}
			},
			//是否轮播
			isSwiper: {
				type: Boolean,
				default () {
					return false
				}
			},
			// 轮播时间
			swiperTime: {
				type: Number,
				default () {
					return 5000
				}
			}
		},
		computed: {
			videoList () {
				let arr = []
				for (let i = 0; i < this.count; i++) {
					arr.push({
						id: `videoBox${i}`
					})
				}
				return arr
			}
		},
		watch: {
			data: {
				immediate: true,
				handler (d) {
					this.dataList = d;
					if (this.dataList.length) {
						this.counter = 0;
						this.videoBoxPtr = 0;
						this.$nextTick(() => {
							this.keepAlive();
							this.nextVideo();
						})
					}
				}
			}
		},
		methods: {
			// 直播流保活
			keepAlive() {
				for (let i = 0; i < this.dataList.length; i++) {
					if (this.videoMap['videoBox' + i]) {
						this.sendKeepAlive(this.videoMap['videoBox' + i])
					}
				}
				setTimeout(this.keepAlive, 5000);
			},
			// 直播流保活，长时间不保活会停止直播流
			sendKeepAlive(box) {
				if (box && box.no) {
					var curTime = new Date().getTime();
					var url =
						this.$api.touchVideo +
						"?serial=" +
						box.no +
						"&code=" +
						box.no +
						"&_=" +
						curTime;
					this.$get(url).then();
				}
			},
			// 延时5000ms播放下一个视频
			nextVideo() {
				var _data = this.dataList[ this.counter ];
				if (!_data) {
					return;
				}
				var curTime = new Date().getTime();
				var no = _data.no;
				var url =
					this.$api.startVideo +
					"?serial=" +
					no +
					"&code=" +
					no +
					"&_=" +
					curTime;
				// this.$get(url).then(res => {
					if (!this.videoBoxPtr && this.videoBoxPtr != 0) {
						this.videoBoxPtr = 0;
					}

					var key = "videoBox" + (this.videoBoxPtr % this.count);
					var videoElement = document.getElementById(key);
					var oldPlayer = this.videoMap[ key ] ? this.videoMap[ key ].player : null;
					var timer;
					if (oldPlayer) {
						oldPlayer.destroy();
					}
					var flvPlayer = flvjs.createPlayer({
						type: "flv",
						// url: res.FLV
						url: _data.url
					});
					flvPlayer.attachMediaElement(videoElement);
					flvPlayer.load();
					// 部分谷歌浏览器无法播放，必须静音后才能播放
					var userAgent = navigator.userAgent
					if (userAgent.indexOf('WebKit') > -1) {
						flvPlayer.muted = true
					}
					flvPlayer.play();
					this.videoMap[ key ] = {
						no: no,
						player: flvPlayer
					};
					this.counter = (this.counter + 1) % this.dataList.length;
					this.videoBoxPtr = (this.videoBoxPtr + 1) % this.count;

					timer = setTimeout(this.nextVideo, this.swiperTime);
					// 判断是否轮播，且最后一个播放完成，取消掉延时器
					if (!this.isSwiper && this.videoBoxPtr == 0) {
						clearTimeout(timer)
					}

					// 监听播放视频报错，立即播放下一个视频
					flvPlayer.on("error", error => {
						console.log("视频流报错：" + error);
						if (this.videoBoxPtr == 0) {
							this.videoBoxPtr = this.count - 1;
						} else {
							this.videoBoxPtr = (this.videoBoxPtr - 1) % this.count;
						}
						clearTimeout(timer);
						this.playVideo();
					});
				// });
			},
			// 直接播放下一个视频
			playVideo() {
				var _data = this.dataList[ this.counter ];
				if (!_data) {
					return;
				}
				var curTime = new Date().getTime();
				var no = _data.no;
				var url =
					this.$api.startVideo +
					"?serial=" +
					no +
					"&code=" +
					no +
					"&_=" +
					curTime;
				// this.$get(url).then(res => {
					if (!this.videoBoxPtr && this.videoBoxPtr != 0) {
						this.videoBoxPtr = 0;
					}

					var key = "videoBox" + (this.videoBoxPtr % this.count);
					var videoElement = document.getElementById(key);
					var oldPlayer = this.videoMap[ key ] ? this.videoMap[ key ].player : null;
					var timer;
					if (oldPlayer) {
						oldPlayer.destroy();
					}
					var flvPlayer = flvjs.createPlayer({
						type: "flv",
						// url: res.FLV
						url: _data.url
					});
					flvPlayer.attachMediaElement(videoElement);
					flvPlayer.load();
					// 部分谷歌浏览器无法播放，必须静音后才能播放
					var userAgent = navigator.userAgent
					if (userAgent.indexOf('WebKit') > -1) {
						flvPlayer.muted = true
					}
					flvPlayer.play();
					this.videoMap[ key ] = {
						no: no,
						player: flvPlayer
					};
					this.counter = (this.counter + 1) % this.dataList.length;
					this.videoBoxPtr = (this.videoBoxPtr + 1) % this.count;

					timer = setTimeout(this.nextVideo, this.swiperTime);
					// 判断是否轮播，且最后一个播放完成，取消掉延时器
					if (!this.isSwiper && this.videoBoxPtr == 0) {
						clearTimeout(timer)
					}

					// 监听播放视频报错，立即播放下一个视频
					flvPlayer.on("error", error => {
						console.log("视频报错：" + error);
						if (this.videoBoxPtr == 0) {
							this.videoBoxPtr = this.count - 1;
						} else {
							this.videoBoxPtr = (this.videoBoxPtr - 1) % this.count;
						}
						clearTimeout(timer)
						this.playVideo();
					});
				// });
			}
		}
	};
</script>
<style lang="less" scoped>
.video-box {
	position: fixed;
	right: 16px;
	top: 50%;
	transform: translateY(-50%);
	z-index: 99;
	width: 380px;
	box-sizing: border-box;
	background-color: rgba(0, 0, 0, 0.2);
	padding: 5px;
	.video {
		display: block;
		width: 370px;
		height: 210px;
		margin-bottom: 5px;
		&:nth-last-child(2) {
			margin-bottom: 0;
		}
	}
	.move {
		position: absolute;
		left: -18px;
		top: 45%;
	}
}
.move-show {
	animation: toShow 1s infinite;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
}
@keyframes toShow {
	0% {
		right: -382px;
	}
	100% {
		right: 16px;
	}
}
.move-hide {
	animation: toHide 1s infinite;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
}
@keyframes toHide {
	0% {
		right: 16px;
	}
	100% {
		right: -382px;
	}
}
</style>