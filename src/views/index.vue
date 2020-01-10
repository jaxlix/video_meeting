<template>
	<div id="index">
		<div class="video-content">
			<div v-for="(d,i) in videoList" :key="i" class="video-box" :class="'video-box-'+videoNum">
				<video v-if="d.url" :src="d.url" poster="@/assets/icon/gloable-bg.png" autoplay controls class="video"></video>
			</div>
		</div>
		<div class="msg-list">
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
					<a class="call" href="javascript:void(0)"></a>
					<a class="call" href="javascript:void(0)"></a>
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
				videoList: [],
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
						url: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
					},
					{
						url: "http://vjs.zencdn.net/v/oceans.mp4"
					},
					{
						url: "https://media.w3.org/2010/05/sintel/trailer.mp4"
					},
					{
						url: "http://mirror.aarnet.edu.au/pub/TED-talks/911Mothers_2010W-480p.mp4"
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
				this.videoList = arr
			}
		},
		created() {
			this.getList()
		},
		mounted() {
			
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
			.video{
				width: 100%;
				height: 100%;
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
		color: #fff;
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
			.msg-item{
				display: flex;
				margin-top: 10px;
				.index{
					width: 30px;
				}
				.msg{
					flex: 1;
				}
				.call{
					width: 25px;
					height: 26px;
					background: url("../assets/icon/videoMeeting/call.png") center center no-repeat;
				}
			}
		}
	}
}
</style>


