<template>
	<div class="tj" :class="show ? 'toLeft' : 'toRight'">
		<div class="tj-content">
			<div class="item">
				<div class="title">
					<p class="title-left">进京列车:</p>
					<p class="title-right">{当前运行数量 / 今日总数量}</p>
				</div>
				<div class="list">
					<div class="list-item">
						<p
							class="blue2"
						>{{mapData.trainOperate && mapData.trainOperate.numberOfTrainsRunning ? mapData.trainOperate.numberOfTrainsRunning : 0}}</p>
						<p
							class="num-all"
						>&nbsp;/&nbsp;{{mapData.trainOperate && mapData.trainOperate.sumNumberOfTrainsRunning ? mapData.trainOperate.sumNumberOfTrainsRunning : 0}}</p>
					</div>
				</div>
			</div>
			<div class="item">
				<div class="title">
					<p class="title-left">当前出乘:</p>
					<p class="title-right">{当前出乘人数 / 今日总数量}</p>
				</div>
				<div class="list">
					<div class="list-item">
						<p class="blue2">{{data.numOfRiddingPoliceMen || 0}}</p>
						<p class="num-all">&nbsp;/&nbsp;{{mapData.policeMan || 0}}</p>
					</div>
				</div>
			</div>
			<div class="item zb">
				<div class="title">
					<p class="title-left">装备:</p>
					<p class="title-right">{当前在线数量 / 总数量}</p>
				</div>
				<div class="list">
					<div class="list-item">
						<p class="dcdcdc">警务通：</p>
						<p class="blue">{{data.numOfOnlineAccounts || 0}}</p>
						<p
							class="num-all"
						>&nbsp;/&nbsp;{{mapData.terminal && mapData.terminal.phoneAllCount ? mapData.terminal.phoneAllCount : 0}}</p>
					</div>
					<div class="list-item">
						<p class="dcdcdc">4G执法仪：</p>
						<p class="blue">{{data.numOfOnlineBodyWarnCamera || 0}}</p>
						<p
							class="num-all"
						>&nbsp;/&nbsp;{{mapData.terminal && mapData.terminal.recordingCameraAllCount ? mapData.terminal.recordingCameraAllCount : 0}}</p>
					</div>
					<div class="list-item">
						<p class="dcdcdc">350M手台：</p>
						<p class="blue">{{data.numOfOnlinePDT || 0}}</p>
						<p class="num-all">&nbsp;/&nbsp;318</p>
					</div>
					<div class="list-item">
						<p class="dcdcdc">无人机：</p>
						<p class="blue">{{data.numOfOnlineUAV || 0}}</p>
						<p class="num-all">&nbsp;/&nbsp;/8</p>
					</div>
				</div>
			</div>
			<div class="item lieche">
				<div class="title">
					<p class="title-left">列车分类:</p>
					<p class="title-right">{当前运行数量 / 今日总数量}</p>
				</div>
				<div class="list">
					<div class="list-item">
						<p class="blue2">{{data.totalOfRunningTrain || 0}}</p>
						<p class="num-all">&nbsp;/&nbsp;{{data.trainNumAll || 0}}</p>
					</div>
					<div class="list-item">
						<p class="dcdcdc">C城际: &nbsp;</p>
						<p
							class="blue"
						>{{data.numOfRunningTrain && data.numOfRunningTrain.C ? data.numOfRunningTrain.C : 0}}</p>
						<p class="num-all">&nbsp;/&nbsp;{{mapData.train && mapData.train.C ? mapData.train.C : 0}}</p>
					</div>
					<div class="list-item">
						<p class="dcdcdc">G 高铁: &nbsp;</p>
						<p
							class="blue"
						>{{data.numOfRunningTrain && data.numOfRunningTrain.G ? data.numOfRunningTrain.G : 0}}</p>
						<p class="num-all">&nbsp;/&nbsp;{{mapData.train && mapData.train.G ? mapData.train.G : 0}}</p>
					</div>
					<div class="list-item">
						<p class="dcdcdc">D 动车: &nbsp;</p>
						<p
							class="blue"
						>{{data.numOfRunningTrain && data.numOfRunningTrain.D ? data.numOfRunningTrain.D : 0}}</p>
						<p class="num-all">&nbsp;/&nbsp;{{mapData.train && mapData.train.D ? mapData.train.D : 0}}</p>
					</div>
					<div class="list-item">
						<p class="dcdcdc">Z 直达: &nbsp;</p>
						<p
							class="blue"
						>{{data.numOfRunningTrain && data.numOfRunningTrain.Z ? data.numOfRunningTrain.Z : 0}}</p>
						<p class="num-all">&nbsp;/&nbsp;{{mapData.train && mapData.train.Z ? mapData.train.Z : 0}}</p>
					</div>
					<div class="list-item">
						<p class="dcdcdc">T 特快: &nbsp;</p>
						<p
							class="blue"
						>{{data.numOfRunningTrain && data.numOfRunningTrain.T ? data.numOfRunningTrain.T : 0}}</p>
						<p class="num-all">&nbsp;/&nbsp;{{mapData.train && mapData.train.T ? mapData.train.T : 0}}</p>
					</div>
					<div class="list-item">
						<p class="dcdcdc">K 快速: &nbsp;</p>
						<p
							class="blue"
						>{{data.numOfRunningTrain && data.numOfRunningTrain.K ? data.numOfRunningTrain.K : 0}}</p>
						<p class="num-all">&nbsp;/&nbsp;{{mapData.train && mapData.train.K ? mapData.train.K : 0}}</p>
					</div>
					<div class="list-item">
						<p class="dcdcdc">L 临时: &nbsp;</p>
						<p
							class="blue"
						>{{data.numOfRunningTrain && data.numOfRunningTrain.L ? data.numOfRunningTrain.L : 0}}</p>
						<p class="num-all">&nbsp;/&nbsp;{{mapData.train && mapData.train.L ? mapData.train.L : 0}}</p>
					</div>
					<div class="list-item">
						<p class="dcdcdc">其 他: &nbsp;</p>
						<p
							class="blue"
						>{{data.numOfRunningTrain && data.numOfRunningTrain.O ? data.numOfRunningTrain.O : 0}}</p>
						<p
							class="num-all"
						>&nbsp;/&nbsp;{{mapData.train && mapData.train.other ? mapData.train.other : 0}}</p>
					</div>
				</div>
			</div>
		</div>
		<div class="tj-btn" @click="show = !show">
			<img v-show="show" src="./images/to_right.png" alt />
			<img v-show="!show" src="./images/to_left.png" alt />
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				mapData: {}
			}
		},
		props: [ 'data' ],
		mounted() {

		},
		methods: {
			getTrainData() {
				this.$post(this.$api.getMapDataAll).then(res => {
					if (res.status == 200) {
						console.log(res.content);
						this.mapData = res.content;
					}
				});
			}
		}
	}
</script>

<style lang="less" scope>
.tj {
	position: fixed;
	top: 100px;
	right: -300px;
	width: 340px;
	height: 649px;
	background-color: rgba(13, 24, 43, 0.8);
	color: #fff;
	font-size: 15px;
	border-radius: 25px;
	.tj-content {
		padding: 20px;
		.zb {
			// height: 184px;
			.dcdcdc {
				width: 92px;
			}
		}
		.lieche {
			height: 297px;
			.dcdcdc {
				width: 92px;
			}
		}
		.item:first-child {
			margin-top: 0;
		}
		.item {
			margin-top: 12px;
			padding: 5px 10px;
			background-color: rgba(78, 220, 255, 0.1);
			.title {
				display: flex;
				.title-left {
					margin-right: 10px;
				}
			}
			.list {
				padding-top: 5px;
				.list-item {
					display: flex;
					padding-bottom: 5px;
					line-height: 23px;
					.blue {
						color: #4edcff;
						font-size: 20px;
						width: 50px;
						text-align: right;
					}
				}
			}
		}
	}
	.tj-btn {
		position: absolute;
		left: -18px;
		top: 240px;
		width: 18px;
		height: 130px;
		color: #fff;
		cursor: pointer;
	}
}
.toRight {
	animation: toRight 1s infinite;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
}
@keyframes toRight {
	0% {
		right: 20px;
	}
	100% {
		right: -340px;
	}
}
.toLeft {
	animation: toLeft 1s infinite;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
}
@keyframes toLeft {
	0% {
		right: -340px;
	}
	100% {
		right: 20px;
	}
}
.dcdcdc {
	color: #dcdcdc;
}
.num-all {
	font-size: 20px;
}
.blue2 {
	color: #4edcff;
	font-size: 20px;
}
</style>