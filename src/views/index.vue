<template>
	<div id="index">
		<div class="video-content">
			<div v-for="(d,i) in playList" :key="i" class="video-box" :class="'video-box-'+videoNum">
				<video v-if="d.type == 'video' && d.url" autoplay class="video">
					<source :src="d.url" type="video/mp4">
					Your browser does not support HTML5 video.
				</video>
				<div class="phone" v-if="d.type == 'audio' && d.url" >
					<audio :src="d.url" autoplay></audio>
				</div>
			</div>
		</div>
		<div class="msg-list">
			<div class="header">
				<a class="v4" href="javascript:void(0)"></a>
				<a class="v6" href="javascript:void(0)"></a>
				<a class="v9" href="javascript:void(0)"></a>
				<a class="v16" href="javascript:void(0)"></a>
				<a class="to-right" href="javascript:void(0)"></a>
				<div>
					<a class="full-screen" href="javascript:void(0)"></a>
					<a class="close" href="javascript:void(0)"></a>
				</div>
			</div>
			<div class="btns">
				<a href="javascript:void(0)">主会场模式</a>
				<a href="javascript:void(0)">会商模式</a>
				<a href="javascript:void(0)">轮播</a>
				<a href="javascript:void(0)">添加</a>
			</div>
			<ul class="msg-content">
				<li v-for="(d,i) in magList" :key="i" class="msg-item">
					<span class="index">{{i+1}}</span>
					<div class="msg">
						<p class="name">{{d.name}} {{d.no}}</p>
						<p class="dept">{{d.deptment.name}}</p>
					</div>
					<a class="call" href="javascript:void(0)"></a>
					<a class="end" href="javascript:void(0)"></a>
					<a class="del" href="javascript:void(0)"></a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				videoNum: 9,
				playList: [],
				magList: [
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					},
					{
						name: "张三",
						no: 7894561,
						deptment: {
							name: "武汉市局"
						}
					}
				]
			}
		},
		components: {
			
		},
		methods: {
			getList(){
				let arr = [
					{
						type: "video",
						url: "https://www.w3school.com.cn/i/movie.MP4"
					},
					{
						type: "video",
						url: "https://media.w3.org/2010/05/sintel/trailer.mp4"
					},
					{
						type: "video",
						url: "https://www.zhangxinxu.com/study/media/cat2.mp4"
					},
					{
						type: "audio",
						url: "https://www.w3school.com.cn/i/horse.ogg"
					}
				]
				if(arr.length < this.videoNum){
					let num = this.videoNum - arr.length
					for (let index = 0; index < num; index++) {
						arr.push({})
					}
				}else{
					arr = arr.splice(0, 9)
				}
				console.log(arr)
				this.playList = arr
			}
		},
		created() {
			this.getList()
		},
		mounted() {
			// let times = setInterval(() => {
			// 	let loadAll = true
			// 	for (const key in this.$refs) {
			// 		if (this.$refs.hasOwnProperty(key) && key.indexOf("video") != -1) {
			// 			const element = this.$refs[key];
			// 			if(element.length > 0 && element[0].readyState == 4){
			// 				element[0].play()
			// 			}else{
			// 				loadAll = false
			// 			}
			// 		}
			// 	}
			// 	if(loadAll){
			// 		clearInterval(times)
			// 	}
			// }, 200);
		}
	};
</script>
<style lang="less" scoped>
#index {
	display: flex;
	width: 100%;
	height: 100%;
	background-color: rgb(34,34,34);
	.video-content{
		flex: 1;
		.video-box{
			float: left;
			box-sizing: border-box;
			border-right: 1px solid #000;
			border-bottom: 1px solid #000;
			background: url("../assets/icon/videoMeeting/bg.png") center center no-repeat;
			.video{
				width: 100%;
				height: 100%;
			}
			.phone{
				display: block;
				width: 100%;
				height: 100%;
				background: url("../assets/icon/videoMeeting/bg_audio.png") center center no-repeat;
				background-color: #2B3338;
			}
		}
		.video-box-9{
			width: calc(100%/3);
			height: calc(100%/4);
			&:first-child{
				width: calc(100%/3*2);
				height: calc(100%/2);
			}
		}
		.video-box-6{
			width: calc(100%/3);
			height: calc(100%/3);
			&:first-child{
				width: calc(100%/3*2);
				height: calc(100%/3*2);
			}
		}
	}
	.msg-list{
		width: 410px;
		height: 100%;
		color: #fff;
		overflow: hidden;
		.header{
			display: flex;
			align-items: center;
			height: 36px;
			.v4{
				margin: 10px;
				width: 22px;
				height: 15px;
				background: url(../assets/icon/videoMeeting/4.png) center center no-repeat;
				background-size: 100% 100%;
			}
			.v6{
				margin: 10px;
				width: 22px;
				height: 15px;
				background: url(../assets/icon/videoMeeting/6.png) center center no-repeat;
				background-size: 100% 100%;
			}
			.v9{
				margin: 10px;
				width: 22px;
				height: 15px;
				background: url(../assets/icon/videoMeeting/9.png) center center no-repeat;
				background-size: 100% 100%;
			}
			.v16{
				margin: 10px;
				width: 22px;
				height: 15px;
				background: url(../assets/icon/videoMeeting/16.png) center center no-repeat;
				background-size: 100% 100%;
			}
			.to-right{
				margin: 10px;
				width: 22px;
				height: 15px;
				background: url(../assets/icon/videoMeeting/to_right.png) center center no-repeat;
				background-size: 100% 100%;
			}
		}
		.btns{
			display: flex;
			padding-left: 5px;
			padding-right: 10px;
			a{
				flex: 1;
				height: 24px;
				border: 1px solid #19D1FF;
				box-shadow: 0 0 8px rgba(25, 209, 255, .6) inset;
				color: #fff;
				margin: 5px;
				text-align: center;
				line-height: 24px;
				font-size: 14px;
				&:hover{
					color: #19D1FF;
					box-shadow: 0 0 8px rgba(25, 209, 255, .8) inset;
				}
			}
		}
		.msg-content{
			padding: 10px;
			height: calc(100% - 60px);
			overflow-y: auto;
			.msg-item{
				display: flex;
				margin-top: 15px;
				.index{
					width: 30px;
				}
				.msg{
					flex: 1;
					.dept{
						font-size: 14px;
						color: #ccc;
					}
				}
				a{
					margin: 5px;
				}
				.call{
					width: 20px;
					height: 21px;
					background: url("../assets/icon/videoMeeting/call.png") center center no-repeat;
					background-size: 100% 100%;
				}
				.end{
					width: 30px;
					height: 15px;
					background: url("../assets/icon/videoMeeting/end.png") center center no-repeat;
					background-size: 100% 100%;
				}
				.del{
					width: 19px;
					height: 20px;
					background: url("../assets/icon/videoMeeting/del.png") center center no-repeat;
					background-size: 100% 100%;
				}
			}
			/*定义滚动条高宽及背景
			高宽分别对应横竖滚动条的尺寸*/
			&::-webkit-scrollbar {
				width:10px;
				height:16px;
				background-color:#999;
			}
			/*定义滚动条轨道
			内阴影+圆角*/
			&::-webkit-scrollbar-track {
				box-shadow: 0 0 6px rgba(0,0,0,0.3) inset;
				border-radius: 5px;
				background-color:#999;
			}
			/*定义滑块
			内阴影+圆角*/
			&::-webkit-scrollbar-thumb {
				border-radius:10px;
				box-shadow: 0 0 6px rgba(0,0,0,.3) inset;
				background-color:#555;
			}
		}
	}
}
</style>


