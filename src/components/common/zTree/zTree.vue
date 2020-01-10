<template>
	<div :class="['zTree', moveShow ? 'move-show' : 'move-hide']" :style="treeStyle" v-loading.lock="fullscreenLoading">
		<!-- tab切换 -->
		<div class="tabBox" v-if="tabColumns.length">
			<div
				:class="['tab', activeIndex == index ? 'active' : '']"
				v-for="(item, index) in tabColumns"
				:key="index"
				@click="tabChange(item, index)"
			>{{item.title}}</div>
		</div>
		<!-- 搜索 -->
		<div class="searchBox">
			<input class="inp" type="text" placeholder="搜索" v-model="searchValue" @keyup.enter="toSearch" />
			<span class="search" @click="toSearch">
				<img src="./images/search.png" alt />
			</span>
		</div>
		<!-- 搜索出来的内容 -->
		<div class="searchContent" v-show="searchData.length">
			<el-scrollbar style="height: 100%;">
				<ul>
					<li v-for="(item, index) in searchData" :key="index" @click="toHandleClick(item)" :draggable="isDragable && item.groupType"
						@dragend="toHandleDragend(item, $event)">
						<p>
							<span>
								<keywords
									:keywords="searchValue"
									:words="item.name"
									color="#f00"
								></keywords>
							</span>
							<i>
								<keywords
									:keywords="searchValue"
									:words="String(item.no)"
									color="#f00"
								></keywords>
							</i>
						</p>
						<p class="department">
							<keywords
								:keywords="searchValue"
								:words="item.department.name"
								color="#f00"
							></keywords>
						</p>
					</li>
				</ul>
			</el-scrollbar>
		</div>
		<!-- 树组件 -->
		<div class="treeBox" v-show="!searchData.length">
			<el-scrollbar style="height: 100%;">
				<el-tree
					v-if="memberUniqueNo"
					ref="zTree"
					:data="lazy ? null : treeData"
					node-key="id"
					:show-checkbox="showCheckbox"
					:props="defaultProps"
					highlight-current
					:default-expanded-keys="defaultExpendedKeys"
					:default-checked-keys="defaultCheckedKeys"
					:default-expand-all="defaultExpandAll"
					:lazy="lazy"
					:load="loadMore"
					@node-click="nodeClick"
					@check="checkChange"
				>
					<!-- 自定义节点内容 -->
					<div
						:class="['custom-tree-node', data.type == 'device' && !data.state ? 'offline' : '']"
						slot-scope="{ node, data }"
						:draggable="isDragable && data.type == 'group'"
						@dragend="dragend(data, node, $event)"
					>
						<i :class="getIcon(data, node)"></i>
						<span class="nodeLabel">
							<!-- 名称 -->
							<span class="label" @mouseout="hideOperate" @mouseover="showOperate(data, $event)" :title="formatTitle(data)">
								{{data.name}} ({{ data.no || ''}})
								<!-- 在线或离线设备数量 -->
								<span
									class="lineData"
									v-if="data.onOffLineData"
								>[{{data.onOffLineData? data.onOffLineData.online : 0}}/{{data.onOffLineData ? data.onOffLineData.offline : 0}}]</span>
							</span>
						</span>
					</div>
				</el-tree>
			</el-scrollbar>
			<!-- 操作气泡 -->
			<div
				class="operate"
				v-show="operateShow"
				@mouseover="showFlag = true;operateShow = true"
				@mouseout="showFlag = false;operateShow = false"
				:style="{left: operateStyle.left, top: operateStyle.top}"
			>
				<span
					@click="toOperate(item)"
					@mouseover="showFlag = true;operateShow = true"
					v-for="(item, index) in operateData"
					:key="index"
					:class="item.operateType"
				></span>
			</div>
		</div>
		<!-- 伸缩 -->
		<div class="move" v-if="isToggle">
			<img v-show="moveShow" @click="treeShowHide" src="./images/to_right.png" alt />
			<img v-show="!moveShow" @click="treeShowHide" src="./images/to_left.png" alt />
		</div>
	</div>
</template>

<script>
	import operateConfig from "./operateConfig"
	import keywords from "@/components/common/keywords/keywords"

	export default {
		data() {
			return {
				moveShow: true,
				activeIndex: 0,
				searchValue: '',
				searchData: [],
				operateShow: true,
				showFlag: false,
				operateStyle: {
					left: 0,
					top: 0
				},
				operateData: [],
				defaultProps: {
					children: "children",
					label: "name",
					isLeaf: "leaf"
				},
				memberUniqueNo: '',
				fullscreenLoading: false
			};
		},
		props: {
			// 是否收缩
			isToggle: {
				type: Boolean,
				default: true
			},
			// 树样式
			treeStyle: {
				type: Object,
				default() {
					return {}
				}
			},
			// tab切换数组
			tabColumns: {
				type: Array,
				default() {
					return []
				}
			},
			// 是否显示勾选
			showCheckbox: {
				type: Boolean,
				default: false
			},
			// tree data
			treeData: {
				type: Array,
				default() {
					return []
				}
			},
			// 是否能拖动
			isDragable: {
				type: Boolean,
				default: true
			},
			// 默认展开的id数组
			defaultExpendedKeys: {
				type: Array,
				default() {
					return []
				}
			},
			// 默认选中的id数组
			defaultCheckedKeys: {
				type: Array,
				default() {
					return []
				}
			},
			// 默认是否全部展开
			defaultExpandAll: {
				type: Boolean,
				default: false
			},
			// 是否懒加载
			lazy: {
				type: Boolean,
				default: false
			},
			// 基础数据, 当lazy为true时生效
			baseData: {
				type: Array
			},
			// 懒加载的数据加载类型：人-person，设备-equipment，组-group,当lazy为true时生效, tabColumns不为空时，不用传loadMoreType，默认tabColumns[0].searchType
			loadMoreType: {
				type: String
			},
			// 搜索的数据类型：人-person，设备-equipment，组-group, tabColumns不为空时，不用传searchType，默认搜索tabColumns[0].searchType
			searchType: {
				type: String
			}
		},
		created() {
			this.getMemberUniqueNo()
		},
		components: {
			keywords
		},
		methods: {
			// 获取登录用户的UnicodeNo
			getMemberUniqueNo(){
				this.$get("http://127.0.0.1:8099/config/getMemberUniqueNo").then( res => {
					if(res.result == "success"){
						this.memberUniqueNo = res.memberUniqueNo
					}
				})
			},
			// 组件显示/隐藏
			treeShowHide() {
				this.moveShow = !this.moveShow
				this.$emit('stateChange', this.moveShow)
			},
			// tab切换
			tabChange(item, index) {
				this.fullscreenLoading = true
				this.activeIndex = index
				this.searchValue = ''
				// this.$emit("tabChange", item.key)
					var loadMoreType = this.loadMoreType
					if(this.tabColumns.length>0){
						loadMoreType = this.tabColumns[this.activeIndex].searchType
						var type = this.tabColumns[this.activeIndex].type
					}
					if(loadMoreType == "group"){
						var url = this.$api.getDeptData + '?type=DEPARTMENTS_GROUPS_DATA&memberId='+this.memberUniqueNo+'&id=' + this.baseData[0].id
					}else if(loadMoreType == "person"){
						var url = this.$api.getDeptData + '?type=PC_CONTACTS_ALL_DATA&memberId='+this.memberUniqueNo+'&id=' + this.baseData[0].id
					}else if(loadMoreType == "equipment"){
						var url = this.$api.getDept + '?type='+type+'&uniqueNo='+this.memberUniqueNo+'&id=' + this.baseData[0].id
					}
					this.$get(url).then(res => {
						this.fullscreenLoading = false;
						if (res.memberGroups) {
							// 部门-组
							var deptList = res.memberGroups.deptList
							var dataList = res.memberGroups.groupList
							dataList = dataList.map(g => {
								g.type = "group"
								g.leaf = true
								g.id = g.id+"#"
								return g
							});
						} else if (res.allMember) {
							// 部门-人
							var deptList = res.allMember.deptList
							var dataList = res.allMember.accountDtos
							dataList = dataList.map(g => {
								g.type = "TERMINAL_PERSONNEL"
								g.leaf = true
								g.id = g.id+"#"
								return g
							});
						} else if(res.terminals.length > 0){
							// 部门-设备
							var deptList = res.deptList
							var dataList = res.terminals
							dataList = dataList.map(g => {
								let d = g.account
								d.type = "device"
								d.terminalMemberType = g.terminalMemberType
								d.leaf = true
								d.id = d.id+"#"+Math.random()
								return d
							});
						}else{
							var deptList = []
							var dataList = []
							this.$message({
								message: '暂无数据',
								type: 'warning'
							});
						}
						deptList = deptList.map(d => {
							d.type = "department"
							return d
						});
						this.$refs.zTree.updateKeyChildren(this.defaultExpendedKeys[0], deptList.concat(dataList))
					})
			},
			// 查找
			toSearch() {
				if (!this.searchValue) {
					this.searchData = []
					return false
				}
				// 搜索设备： http://192.168.1.100:6061/file/terminal/findByDeptAndKey?page=0&pageSize=10&deptId='+this.defaultExpendedKeys[0]+'&key=1&type=TERMINAL_PHONE
				// 搜索组： http://192.168.1.100:6061/file/findGroups?page=0&pageSize=10&deptId='+this.defaultExpendedKeys[0]+'&keyword=%E5%AE%BD%E5%B8%A6&uniqueNo=156033195398314371&filterTempGroup=false
				// 搜索人员： http://192.168.1.100:6061/file/findMembers?page=0&pageSize=10&memberStr=12&isAll=true&id='+this.defaultExpendedKeys[0]+'
				if(this.tabColumns.length>0){
					this.searchType = this.tabColumns[this.activeIndex].searchType
					var type = this.tabColumns[this.activeIndex].type
				}
				if(this.searchType == "group"){
					var url = this.$api.findGroups + '?page=0&pageSize=10&deptId='+this.defaultExpendedKeys[0]+'&uniqueNo='+this.memberUniqueNo+'&filterTempGroup=false&keyword=' + this.searchValue
				}else if(this.searchType == "person"){
					var url = this.$api.findMembers + '?page=0&pageSize=10&isAll=true&id='+this.defaultExpendedKeys[0]+'&memberStr=' + this.searchValue
				}else if(this.searchType == "equipment"){
					var url = this.$api.findByDeptAndKey + '?page=0&pageSize=10&deptId='+this.defaultExpendedKeys[0]+'&type='+type+'&key=' + this.searchValue
				}
				this.fullscreenLoading = true
				this.$get(url).then(res => {
					console.log(res)
					this.fullscreenLoading = false
					this.searchData = res.content || []
					if(res.content == null || res.content == undefined || res.content == "" || res.content.length == 0){
						this.$message({
							message: '没有搜索到对应结果',
							type: 'warning'
						});
					}
				})
			},
			// 加载更多节点
			loadMore(node, resolve) {
				if (node.level == 0) {
					resolve(this.baseData)
					return false
				} else {
					// 部门-设备： http://192.168.1.100:6061/file/getDept?type=TERMINAL_PHONE&uniqueNo=156033195398314371&id='+this.defaultExpendedKeys[0]+'
					// 部门-人员： http://192.168.1.100:6061/file/getDeptData?type=PC_CONTACTS_ALL_DATA&memberId=156033195398314371&id='+this.defaultExpendedKeys[0]+'
					// 部门-组： http://192.168.1.100:6061/file/getDeptData?type=DEPARTMENTS_GROUPS_DATA&memberId=156033195398314371&id='+this.defaultExpendedKeys[0]+'
					var loadMoreType = this.loadMoreType
					if(this.tabColumns.length>0){
						loadMoreType = this.tabColumns[this.activeIndex].searchType
						var type = this.tabColumns[this.activeIndex].type
					}
					if(loadMoreType == "group"){
						var url = this.$api.getDeptData + '?type=DEPARTMENTS_GROUPS_DATA&memberId='+this.memberUniqueNo+'&id=' + node.data.id
					}else if(loadMoreType == "person"){
						var url = this.$api.getDeptData + '?type=PC_CONTACTS_ALL_DATA&memberId='+this.memberUniqueNo+'&id=' + node.data.id
					}else if(loadMoreType == "equipment"){
						var url = this.$api.getDept + '?type='+type+'&uniqueNo='+this.memberUniqueNo+'&id=' + node.data.id
					}
					
					this.$get(url).then(res => {
						console.log(res)
						if (res.memberGroups) {
							// 部门-组
							var deptList = res.memberGroups.deptList
							var dataList = res.memberGroups.groupList
							dataList = dataList.map(g => {
								g.type = "group"
								g.leaf = true
								g.id = g.id+"#"
								return g
							});
						} else if (res.allMember) {
							// 部门-人
							var deptList = res.allMember.deptList
							var dataList = res.allMember.accountDtos
							dataList = dataList.map(g => {
								g.type = "TERMINAL_PERSONNEL"
								g.leaf = true
								g.id = g.id+"#"
								return g
							});
						} else if(res){
							// 部门-设备
							var deptList = res.deptList
							var dataList = res.terminals
							dataList = dataList.map(g => {
								g.type = 'device'
								g.leaf = true
								g.id = g.id+"#"
								return g
							});
						}
						deptList = deptList.map(d => {
							d.type = "department"
							return d
						});
						resolve (deptList.concat(dataList))
					})
				}
			},
			// 获取父节点
			getParentNode(node, level) {
				if (node.level == level) {
					return node
				} else {
					if (node.level < level) {
						return null
					} else {
						return this.getParentNode(node.parent, level)
					}
				}
			},
			// 拖动结束
			dragend(data, node, e) {
				let parentNode = this.getParentNode(node, 2)
				this.$emit("dragChange", {
					parentNode: parentNode,
					data: data,
					left: e.pageX,
					top: e.pageY,
					width: e.target.offsetWidth,
					height: e.target.offsetHeight
				})
				console.log(parentNode)
			},
			// 滑过显示操作按钮
			showOperate(data, e) {
				/*
				if (data.type == 'department') {
					this.operateShow = false
					return false
				}
				this.showFlag = true
				let domRect = e.target.getBoundingClientRect()
				this.operateStyle = {
					left: domRect.left + domRect.width + 'px',
					top: domRect.top - 3 + 'px'
				}
				this.operateData = []
				if (data.type == 'group') {
					let arr = operateConfig.group || []
					arr.forEach(item => {
						this.operateData.push({
							operateType: item,
							data: data
						})
					})
				} else if (data.type == 'device') {
					let arr = operateConfig[ data.terminalMemberType ] || []
					arr.forEach(item => {
						this.operateData.push({
							operateType: item,
							data: data
						})
					})
				} else if (data.type == 'TERMINAL_PERSONNEL') {
					let arr = operateConfig.TERMINAL_PERSONNEL || []
					arr.forEach(item => {
						this.operateData.push({
							operateType: item,
							data: data
						})
					})
				}
				if (this.operateData.length) {
					this.operateShow = true
				} else {
					this.operateShow = true
				}
				*/
			},
			// 隐藏操作按钮
			hideOperate() {
				this.showFlag = false
				setTimeout(() => {
					if (!this.showFlag) {
						this.operateShow = false
					}
				}, 200)
			},
			// 节点点击
			nodeClick(item) {
				this.$emit("nodeClick", item)
			},
			// 设置icon class
			getIcon(data, node) {
				if (data.type == 'group') {
					return 'icon-group'
				} else if(data.type == 'device') {
					return 'icon-' + data.terminalMemberType
				} else if(data.type == "TERMINAL_PERSONNEL"){
					return 'icon-policeman'
				} else {
					if (node.expanded) {
						return 'icon-open-floder'
					} else {
						return 'icon-close-floder'
					}
				}
			},
			// 阻止事件冒泡
			stopBubble(e) {
				if (e && e.stopPropagation)
					e.stopPropagation()
				else
					window.event.cancelBubble = true
			},
			// 操作
			toOperate(item) {
				console.log(item)
				let type = item.operateType
				if (type == 'call') {
					// 个呼
				} else if (type == 'message') {
					// 发送消息
				} else if (type == 'switchGroup') {
					// 切换为当前组
				} else if (type == 'receiveVideo') {
					// 回传图像
				} else if (type == 'reviewVideo') {
					// 录像回看
				} else if (type == 'previewVideo') {
					// 预览
				} else if (type == 'cloudVideo') {
					// 云视讯
				} else if (type == 'tempGroup') {
					// 临时组
				} else if (type == 'playTrack') {
					// 轨迹查询
				}
			},
			// check 变化
			checkChange() {
				let checkedNodes = this.$refs.zTree.getCheckedNodes()
				this.$emit("checkChange", {
					type: this.tabColumns[ this.activeIndex ].key,
					data: checkedNodes
				})
			},
			// title显示内容
			formatTitle(data) {
				let str = data.name
				if (data.type == 'TERMINAL_PERSONNEL') {
					str = str + ' ' + data.no
				}
				if (data.onOffLineData) {
					str = str + ' [' + data.onOffLineData.online + '/' + data.onOffLineData.offline + ']'
				}
				return str
			},
			// 搜索内容点击
			toHandleClick(data) {
				debugger
				data.type = "TERMINAL_PERSONNEL";
				this.$emit('nodeClick', data);
			},
			// 搜索内容拖拽
			toHandleDragend(data, e) {
				this.$emit("dragChange", {
					data: data,
					left: e.pageX,
					top: e.pageY,
					width: e.target.offsetWidth,
					height: e.target.offsetHeight
				})
			}
		}
	};
</script>

<style lang="less" scoped>
.zTree {
	transition: all linear 0.5s;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 22222;
	width: 310px;
	height: 100%;
	background: linear-gradient(
		to right,
		rgba(6, 9, 44, 1) 20%,
		rgba(6, 9, 44, 0.3)
	);
	padding-top: 70px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	/deep/ .el-tree {
		background: transparent;
	}
	.move {
		position: absolute;
		right: -18px;
		top: 50%;
		margin-top: -65px;
		cursor: pointer;
	}
	.tabBox {
		width: 276px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		.tab {
			width: 90px;
			height: 24px;
			background: rgba(16, 145, 236, 0.3);
			box-shadow: 0 2px 2px #17b6ce inset, 0 -2px 2px #17b6ce inset;
			text-align: center;
			line-height: 24px;
			font-size: 14px;
			color: #fff;
			border-radius: 2px;
			margin-right: 3px;
			margin-bottom: 4px;
			cursor: pointer;
			&:nth-child(3n) {
				margin-right: 0;
				box-shadow: 0 2px 2px #17b6ce inset, 0 -2px 2px #17b6ce inset,
					-2px 0 2px #17b6ce inset;
			}
			&:last-child {
				box-shadow: 0 2px 2px #17b6ce inset, 0 -2px 2px #17b6ce inset,
					-2px 0 2px #17b6ce inset;
			}
			&:nth-child(3n + 1) {
				box-shadow: 0 2px 2px #17b6ce inset, 0 -2px 2px #17b6ce inset,
					2px 0 2px #17b6ce inset;
			}
		}
		.active {
			background: linear-gradient(to top, #0185e9, #78e3ff);
			box-shadow: none;
		}
	}
	.searchBox {
		width: calc(100% - 30px);
		height: 30px;
		border: 1px solid #1d9bee;
		border-radius: 2px;
		margin: 0 auto;
		margin-top: 8px;
		margin-bottom: 12px;
		input {
			display: block;
			width: calc(100% - 40px);
			height: 100%;
			font-size: 14px;
			color: #fff;
			background: transparent;
			border: none;
			outline: none;
			float: left;
			padding: 0 14px;
			box-sizing: border-box;
		}
		input::-webkit-input-placeholder { /* WebKit browsers 适配谷歌 */
			color: rgba(255,255,255,.6);
		}
		input:-moz-placeholder { /* Mozilla Firefox 4 to 18 适配火狐 */
			color: rgba(255,255,255,.6);
		}
		input::-moz-placeholder { /* Mozilla Firefox 19+ 适配火狐 */
			color: rgba(255,255,255,.6);
		}
		input:-ms-input-placeholder { /* Internet Explorer 10+  适配ie*/
			color: rgba(255,255,255,.6);
		}
		.search {
			display: block;
			width: 40px;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			background: rgba(16, 145, 236, 0.5);
			float: right;
			cursor: pointer;
		}
	}
	.searchContent {
		width: 100%;
		flex: 1;
		overflow-y: hidden;
		ul {
			li {
				padding-left: 30px;
				margin-bottom: 10px;
				cursor: pointer;
				&:hover {
					background: linear-gradient(
						to bottom,
						rgba(58, 154, 236, 0.5) 0%,
						rgba(58, 154, 236, 0) 30%,
						rgba(58, 154, 236, 0) 70%,
						rgba(58, 154, 236, 0.5) 100%
					);
				}
				&:last-child {
					margin-bottom: 0;
				}
				p {
					color: #fff;
					font-size: 14px;
					span {
						margin-right: 5px;
					}
				}
				.department {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
	.treeBox {
		width: 100%;
		flex: 1;
		overflow-y: hidden;
		.operate {
			position: fixed;
			z-index: 2;
			height: 32px;
			background: rgba(6, 9, 44, 1);
			padding: 0 15px;
			display: flex;
			align-items: center;
			span {
				display: block;
				cursor: pointer;
				margin-right: 15px;
				&:last-child {
					margin-right: 0;
				}
			}
			.switchGroup {
				width: 28px;
				height: 28px;
				background: url(./images/call_1.png);
				background-size: 100% 100%;
				&:hover {
					background: url(./images/call_2.png);
					background-size: 100% 100%;
				}
			}
			.call {
				width: 28px;
				height: 28px;
				background: url(./images/call_1.png);
				background-size: 100% 100%;
				&:hover {
					background: url(./images/call_2.png);
					background-size: 100% 100%;
				}
			}
			.message {
				width: 28px;
				height: 28px;
				background: url(./images/conversation_1.png);
				background-size: 100% 100%;
				&:hover {
					background: url(./images/conversation_2.png);
					background-size: 100% 100%;
				}
			}
			.receiveVideo {
				width: 28px;
				height: 28px;
				background: url(./images/lte_preview1.png);
				background-size: 100% 100%;
				&:hover {
					background: url(./images/lte_preview2.png);
					background-size: 100% 100%;
				}
			}
			.reviewVideo {
				width: 28px;
				height: 28px;
				background: url(./images/videotape-1.png);
				background-size: 100% 100%;
				&:hover {
					background: url(./images/videotape-2.png);
					background-size: 100% 100%;
				}
			}
			.playTrack {
				width: 28px;
				height: 28px;
				background: url(./images/track1.png);
				background-size: 100% 100%;
				&:hover {
					background: url(./images/track2.png);
					background-size: 100% 100%;
				}
			}
			.tempGroup {
				width: 28px;
				height: 28px;
				background: url(./images/metting-add_1.png);
				background-size: 100% 100%;
				&:hover {
					background: url(./images/metting-add_2.png);
					background-size: 100% 100%;
				}
			}
		}
		/deep/ .el-tree-node:focus > .el-tree-node__content {
			background: transparent;
		}
		/deep/ .el-tree-node__content {
			background: transparent;
			&:hover {
				background: linear-gradient(
					to bottom,
					rgba(58, 154, 236, 0.5) 0%,
					rgba(58, 154, 236, 0) 30%,
					rgba(58, 154, 236, 0) 70%,
					rgba(58, 154, 236, 0.5) 100%
				);
			}
			&:focus {
				background: linear-gradient(
					to bottom,
					rgba(58, 154, 236, 0.5) 0%,
					rgba(58, 154, 236, 0) 30%,
					rgba(58, 154, 236, 0) 70%,
					rgba(58, 154, 236, 0.5) 100%
				);
			}
		}
		/deep/
			.el-tree--highlight-current
			.el-tree-node.is-current
			> .el-tree-node__content {
			background: linear-gradient(
				to bottom,
				rgba(58, 154, 236, 0.5) 0%,
				rgba(58, 154, 236, 0) 30%,
				rgba(58, 154, 236, 0) 70%,
				rgba(58, 154, 236, 0.5) 100%
			);
		}
		/deep/
			.el-tree--highlight-current
			.el-tree-node.is-expanded
			> .el-tree-node__content {
			background: transparent;
		}
		/deep/ .el-checkbox__inner {
			background: #396586;
			border: none;
			&:after {
				color: #fff;
			}
		}
		/deep/ .is-checked {
			.el-checkbox__inner {
				background: #f58700;
				border: none;
				&:after {
					color: #fff;
				}
			}
		}
		/deep/ .nodeLabel {
			color: #fff !important;
			font-size: 14px;
			line-height: 26px;
			display: flex;
			overflow: hidden;
			.label {
				padding-left: 5px;
				color: #fff;
				font-size: 14px;
				line-height: 26px !important;
				display: block;
				height: 26px;
				flex: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				&:hover {
					text-decoration: underline;
				}
			}
		}
		/deep/ .el-tree-node__expand-icon {
			color: #00baff;
			border: 1px solid #00baff;
			width: 12px;
			height: 12px;
			padding: 0;
			margin-right: 8px;
			border-radius: 2px;
			font-size: 12px;
			margin-left: 15px;
			&::before {
				content: "\E6D9";
			}
		}
		/deep/ .el-tree-node__expand-icon.is-leaf {
			color: transparent;
			border: 0;
		}
		/deep/ .el-tree-node__expand-icon.expanded {
			transform: none;
			&::before {
				content: "\E6D8";
			}
		}
		/deep/ .el-tree-node__expand-icon.is-leaf {
			border: 1px solid transparent;
		}
		/deep/
			.el-checkbox__input.is-indeterminate
			.el-checkbox__inner::before {
			top: 6px;
		}
		/deep/ .el-checkbox__inner::after {
			left: 5px;
			top: 2px;
		}
		/deep/ .el-tree-node__loading-icon {
			display: none !important;
		}
		// 自定义子组件内容样式
		/deep/ .custom-tree-node {
			flex: 1;
			display: flex;
			align-items: center;
			overflow: hidden;
			// 设备图标
			.icon-TERMINAL_PERSONNEL {
				width: 16px;
				height: 16px;
				background: url(./images/policeman2.png);
				background-size: 100% 100%;
			}
		}
		// 设备离线
		/deep/ .offline {
			opacity: 0.5;
			.icon-TERMINAL_PERSONNEL {
				width: 16px;
				height: 16px;
				background: url(./images/policeman1.png);
				background-size: 100% 100%;
			}
		}

		/deep/ .nodeLabel {
			flex: 1;
		}
	}
}
.move-show {
	transform: translateX(0);
}
.move-hide {
	transform: translateX(-100%);
}
/deep/ .el-scrollbar__wrap {
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