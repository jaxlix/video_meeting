<template>
	<div class="search-box" :style="styles">
		<div class="inp-box">
			<input v-model="keyword" class="inp" type="text" placeholder="请输入搜索关键字" @keyup.enter="search" />
			<img class="img" src="./images/icon_search_hover.png" alt @click="search" />
		</div>
		<div v-show="keyword" class="content">
			<el-scrollbar style="height: 100%;">
				<div v-for="(item, key) in filtedData" :key="key" class="sub">
					<div class="sub-title">{{name[key]}}</div>
					<!-- 列车 -->
					<ul v-if="key == 'TRAIN'">
						<li v-for="(subItem, i) in item" :key="i" class="sub-item" @click="showSearchDetail(subItem)">
							<keywords :keywords="keyword" :words="subItem.name" color="#f00"></keywords>&nbsp;
							<div>
								<keywords
									:keywords="keyword"
									:words="subItem.startingStation"
									color="#f00"
								></keywords>
								&nbsp;-&nbsp;
								<keywords
									:keywords="keyword"
									:words="subItem.terminus"
									color="#f00"
								></keywords>
							</div>
						</li>
					</ul>
					<!-- 车站 -->
					<ul v-else-if="key == 'TRAINSTATION'">
						<li v-for="(subItem, i) in item" :key="i" class="sub-item" @click="showSearchDetail(subItem)">
							<keywords :keywords="keyword" :words="subItem.name" color="#f00"></keywords>&nbsp;
						</li>
					</ul>
					<!-- 设备 -->
					<ul v-else>
						<li v-for="(subItem, i) in item" :key="i" class="sub-item" @click="showSearchDetail(subItem)">
							<keywords :keywords="keyword" :words="subItem.name" color="#f00"></keywords>&nbsp;
							<keywords :keywords="keyword" :words="subItem.no" color="#f00"></keywords>
							<div>
								<keywords
									:keywords="keyword"
									:words="subItem.department && subItem.department.name ? subItem.department.name : ''"
									color="#f00"
								></keywords>
							</div>
						</li>
					</ul>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import _ from 'underscore';
	import keywords from '@/components/common/keywords/keywords'
	import name from './name.json'
	import searchKey from './searchKey.json'

	export default {
		data() {
			return {
				searchKey: searchKey,
				allData: {},
				keyword: '',
				timer: null,
				name: name,
				filtedData: {}
			}
		},
		props: {
			styles: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		computed: {
			...mapGetters({
				dataSource: "dataSource"
			})
    	},
		watch: {
			keyword(val) {
				if (val) {
					clearTimeout(this.timer)
					this.timer = setTimeout(() => {
						this.search()
					}, 300)
				} else {
					this.filtedData = {}
				}
			},
			dataSource(val){
				console.log(val)
				this.allData = val
			}
		},
		components: {
			keywords
		},
		methods: {
			// 显示搜索详情
			showSearchDetail(item) {
				this.$emit('nodeClick', item)
				this.keyword = ''
			},
			// 搜索
			search() {
				this.filtedData = {}
				let _keyword = this.keyword;
				if (!_keyword && _keyword.length == 0) {
					return;
				}
				let allData = this.allData
				// 遍历所有设备数据
				for (let key in allData) {
					if(!allData[ key ].show){
						continue
					}
					let data = allData[ key ].data || []
					// 每个设备所要过滤的字段
					let filterKey = this.searchKey[key]
					let filtedArr = _.filter(data, function (item) {
						let conditionArr = []
						// 递归遍历需要过滤的字段
						function getKey(obj, filter) {
							if (!obj) {
								return false
							}
							for (let fkey in filter) {
								if (filter[fkey] instanceof Object) {
									getKey(obj[fkey], filter[fkey])
								} else {
									let flag = obj[fkey] ? String(obj[fkey]).indexOf(_keyword) != -1 : false
									conditionArr.push(flag)
								}
							}
						}
						getKey(item, filterKey)
						let condition = false
						conditionArr.forEach(con => {
							condition = condition || con
						})
						return condition
					})
					if (filtedArr.length) {
						this.filtedData[key] = filtedArr.slice(0, 5)
					}
				}
			},
		},
		mounted() {
			this.allData = this.dataSource
			console.log(this.allData)
		}
	};
</script>

<style lang="less" scoped>
.search-box {
	position: absolute;
	left: 4px;
	top: 80px;
	z-index: 2;

	.inp-box {
		position: relative;
		height: 40px;
		.inp {
			width: 300px;
			height: 50px;
			padding-left: 20px;
			padding-right: 30px;
			background: none;
			border: 0;
			background-color: #fff;
			box-shadow: 0 0 1px #000 inset;
			font-size: 16px;
		}

		.inp::-webkit-input-placeholder {
			/* WebKit browsers */
			color: #ddd;
		}
		.img {
			position: absolute;
			right: 10px;
			top: 14px;
			width: 18px;
			height: 18px;
		}
		.img:hover {
			cursor: pointer;
		}
	}
	.content {
		position: absolute;
		top: 49px;
		width: 340px;
		box-shadow: 0 0 1px #000 inset;
		margin: 10px 10px 10px 4px;
		max-height: 700px;
		.sub {
			background-color: #fff;
			padding: 0 16px 0 16px;
			.sub-title {
				font-size: 15px;
				line-height: 42px;
				color: #313131;
				border-bottom: solid #ddd 1px;
				padding-left: 6px;
			}
			ul {
				padding: 15px 0;
			}
			.sub-item {
				// padding: 8px 24px 8px 24px;
				
				font-size: 15px;
				line-height: 15px;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				color: #313131;
				margin-bottom: 10px;
				padding: 5px 0;
				padding-left: 40px;
				&:last-child {
					margin-bottom: 0;
				}
				div {
					margin-top: 8px;
					color: #898989;
					font-size: 13px;
					line-height: 13px;
				}
			}
			.sub-item:hover {
				box-shadow: 0 0 1px rgba(0, 186, 255, 0.8) inset;
				cursor: pointer;
				background: #eee;
			}
		}
	}
}

/deep/ .el-scrollbar {
	max-height: 700px;
}
/deep/ .el-scrollbar__wrap {
	max-height: 700px;
	padding-bottom: 17px;
	overflow-x: hidden !important;
}
/deep/ .is-vertical {
	opacity: 1 !important;
}
/deep/ .is-horizontal {
	opacity: 0 !important;
}
</style>