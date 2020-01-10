<template>
	<div class="speed" :style="styles" @mouseout.stop="hide">
		<div class="inp-box">
			<input v-model="number" class="inp" type="text" placeholder="请输入设备编号" />
			<img class="img" src="./images/dialInputPic.png" alt />
		</div>
		<div v-show="number" class="content">
			<ul>
				<li
					class="item"
					v-for=" (d, i) in dataList"
					:key="i"
					@mouseover="showItem(i+1)"
					@click.stop="caozuo(d.type)"
				>
					<img v-show="!(show1 == i+1) || (show1 === '')" :src="d.img" alt />
					<img v-show="show1 === i+1" :src="d.img2" alt />
					<span>{{d.name}}</span>
					<ul v-if="d.items" v-show="show1 == i+1" class="item-ul">
						<li
							v-for=" (v, k) in d.items"
							:key="k"
							@mouseover="showItem2(k+1)"
							@click.stop="caozuo(v.type)"
						>
							{{v.name}}
							<ul v-if="v.items" v-show="show2 == k+1" class="item-ul">
								<li v-for=" (val, key) in v.items" :key="key" @click.stop="caozuo(val.type)">{{val.name}}</li>
							</ul>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [
					{
						name: "个呼",
						img: require("./images/fu_ca1.png"),
						img2: require("./images/fu_ca2.png"),
						items: [
							{ name: "LTE", type: "call,TERMINAL_LTE" },
							{ name: "电台", type: "call,TERMINAL_PDT" },
							{ name: "警务通", type: "call,TERMINAL_PHONE" }
						]
					},
					{
						name: "请求图像",
						img: require("./images/fu_vi1.png"),
						img2: require("./images/fu_vi2.png"),
						items: [
							{ name: "执法记录仪", type: "video,TERMINAL_BODY_WORN_CAMERA" },
							{ name: "无人机", type: "video,TERMINAL_UAV" },
							{ name: "LTE", type: "lteVideo,TERMINAL_LTE" },
							{ name: "摄像头", type: "lteVideo,TERMINAL_CAMERA" },
							{
								name: "警务通",
								items: [
									{ name: "普通回传", type: "ordinaryVideo,TERMINAL_PHONE" },
									{ name: "紧急回传", type: "emergencyVideo,TERMINAL_PHONE" }
								]
							}
						]
					}
				],
				phoneCallData: {
					name: "拨打电话",
					img: require("./images/fu_te1.png"),
					img2: require("./images/fu_te2.png"),
					type: "phone,call"
				},
				positionData: {
					name: '定位到地图', 
					img: require('./images/dingwei1.png'), 
					img2: require('./images/dingwei2.png'), 
					items: [
						{name: '交管电台', type: 'position,TERMINAL_PDT'}, 
						{name: '布控球', type: 'position,TERMINAL_LTE'}, 
						{name: 'LTE', type: 'position,TERMINAL_LTE'}, 
						{name: '警车', type: 'position,TERMINAL_CAR'}, 
						{name: '执法记录仪', type: 'position,TERMINAL_BODY_WORN_CAMERA'}, 
						{name: '无人机', type: 'position,TERMINAL_UAV'},
						{name: '电台', type: 'position,TERMINAL_PDT'},
						{name: '警务通', type: 'position,TERMINAL_PHONE'}
					]
				},
				trajectoryData: {
					name: '查询轨迹', 
					img: require('./images/trace1.png'), 
					img2: require('./images/trace2.png'), 
					items: [
						{name: '交管电台', type: 'trajectory,TERMINAL_PDT'},
						{name: '电台', type: 'trajectory,TERMINAL_PDT'},
						{name: '执法记录仪', type: 'trajectory,TERMINAL_BODY_WORN_CAMERA'},
						{name: '警车', type: 'trajectory,TERMINAL_CAR'},
						{name: '警务通', type: 'trajectory,TERMINAL_PHONE'}
					]
				},
				number: "",
				show1: "",
				show2: ""
			};
		},
		props: [
			"phoneCall",	// 拨打电话
			"position",		// 定位
			"trajectory",	// 轨迹查询
			"styles"		// 自定义样式
		],
		methods: {
			showItem(i) {
				this.show1 = i;
			},
			showItem2(i) {
				this.show2 = i;
			},
			hide() {
				this.show1 = "";
				this.show2 = "";
			},
			caozuo(t) {
				console.log(t);
				let a = t.split(',')
				t = a[0]
				let type = a[1]
				switch (t) {
					case "call":	// 个呼
						this.$rhtxApi.individualCall(this.number, this.number, type);
						break;
					case "phone":	// 拨打电话
						this.$rhtxApi.phoneCall(this.number);
						break;
					case "video":	// 请求图像
						this.$rhtxApi.video(this.number, this.number, type);
						break;
					case "lteVideo":	// 请求lte和固定摄像头图像
						this.$rhtxApi.lteVideo(this.number);
						break;
					case "emergencyVideo":	// 紧急回传
						this.$rhtxApi.video(this.number, this.number, type, true);
						break;
					case "ordinaryVideo":	// 普通回传
						this.$rhtxApi.video(this.number, this.number, type, false);
						break;
					default:
						break;
				}
			}
		},
		mounted(){
			if(this.trajectory){
				this.dataList.unshift(this.trajectoryData)
			}
			if(this.position){
				this.dataList.unshift(this.positionData)
			}
			if(this.phoneCall){
				this.dataList.unshift(this.phoneCallData)
			}
		}
	};
</script>

<style lang="less" scoped>
.speed {
	position: absolute;
	right: 400px;
	bottom: 20px;
	z-index: 1000;
	.inp-box {
		position: relative;
		height: 40px;
		.inp {
			width: 230px;
			height: 40px;
			padding-left: 20px;
			padding-right: 30px;
			background: none;
			border: 0;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.5);
			font-size: 16px;
		}
		.inp:focus {
			background-color: rgba(0, 0, 0, 0.8);
		}
		.inp::-webkit-input-placeholder {
			/* WebKit browsers */
			color: #ddd;
		}
		.img {
			position: absolute;
			right: 10px;
			top: 6px;
			width: 20px;
			height: 27px;
		}
	}
	.content {
		position: absolute;
		bottom: 40px;
		width: 280px;
		background-color: rgba(0, 0, 0, 0.8);
		.item {
			position: relative;
			height: 40px;
			line-height: 40px;
			color: #fff;
			img {
				margin-left: 10px;
				margin-right: 10px;
				width: 26px;
				height: 26px;
			}
			.item-ul {
				position: absolute;
				right: -140px;
				bottom: 0;
				li {
					position: relative;
					width: 140px;
					height: 40px;
					line-height: 40px;
					color: #fff;
					background-color: rgba(0, 0, 0, 0.8);
					text-align: center;
				}
				li:hover {
					box-shadow: 0 0 20px rgba(0, 186, 255, 0.8) inset;
					color: #2ec6ff;
				}
			}
		}
		.item:hover {
			box-shadow: 0 0 20px rgba(0, 186, 255, 0.8) inset;
			color: #2ec6ff;
		}
	}
}
</style>

