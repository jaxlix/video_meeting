<template>
    <div id="trajectory">
        <!-- 返回按钮 -->
        <a class="back" href="javascript:void(0)" @click="$router.go(-1)"></a>
        <!-- 地图 -->
        <div id="map"></div>
        <!-- 绘制路线 -->
        <Layer v-if="map" :map="map" layerIndex="1" :visible="true" :lineData="lineData" />
        <!-- 绘制圆点 -->
        <Layer v-if="map" :map="map" layerIndex="1" :visible="true" :circleData="circleData" />
        <!-- 树形菜单 -->
        <zTree
            v-if="baseData"
            class="customTree"
            :showCheckbox="false"
            :isDragable="true"
            :lazy="true"
            :baseData="baseData"
            :defaultExpendedKeys="defaultExpendedKeys"
            :defaultCheckedKeys="defaultCheckedKeys"
            :tabColumns="tabColumns"
            @nodeClick="nodeClick"
            @stateChange="stateChange"
        />
        <!-- 底部 -->
        <div class="footer" :style="searchStyle">
            <el-select class="transparent" v-model="value" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <div class="no">{{gpsId}}</div>
            <div class="label">开始时间</div>
            <el-date-picker
                :readonly="radio==2"
                class="transparent"
                v-model="beginTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间">
            </el-date-picker>
            <div class="label">结束时间</div>
            <el-date-picker
                :readonly="radio==2"
                class="transparent"
                v-model="endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间">
            </el-date-picker>
            <div class="label">
                <el-radio v-model="radio" label="1">历史轨迹</el-radio>
                <!-- <el-radio v-model="radio" label="2">实时轨迹</el-radio> -->
            </div>
            <el-button class="btn" type="primary" size="small" @click="search">查询</el-button>
        </div>
    </div>
</template>

<script>
import Layer from "@/components/layers/Layer";
import zTree from "@/components/common/zTree/zTree";
import tabColumns from "@/components/common/zTree/tabColumns.json";

export default {
    data() {
        return {
            map: null, // 实例化地图
            lineData: {
                data: [],
                color: [255, 0, 255, 1],
                width: 3
            },
            circleData: [],
            baseData: null,
            userMsg: null,
            defaultExpendedKeys: null,
            defaultCheckedKeys: null,
            tabColumns: tabColumns,
            options: [
                {
                    value: "TERMINAL_PDT",
                    label: "电台"
                },
                {
                    value: "TERMINAL_PERSONNEL",
                    label: "民警"
                },
                {
                    value: "TERMINAL_PHONE",
                    label: "警务通"
                },
                {
                    value: "TERMINAL_BODY_WORN_CAMERA",
                    label: "执法仪"
                }
            ],
            value: "TERMINAL_PDT",
            radio: '1',
            beginTime: new Date().getTime()-86400000,
            endTime: new Date().getTime(),
            searchStyle: null,
            gpsId: '',
        };
    },
    components: {
        Layer,
        zTree
    },
    watch: {
        radio(val){
            if(val == 2){
                this.beginTime = new Date()
            }else{
                this.beginTime = ''
            }
        }
    },
    created() {
        this.getMemberNo();
    },
    methods: {
        // 获取当前用户信息
        getMemberNo() {
            this.$get("http://127.0.0.1:8099/config/getMemberNo").then(res => {
                if (res.result == "success") {
                    this.$get(
                        "http://127.0.0.1:8099/memberController/getAccountByNo?no=" +
                            res.memberNo
                    ).then(res => {
                        if (res.result == "success") {
                            this.userMsg = res.account;
                            this.defaultExpendedKeys = [
                                res.account.department.id
                            ];
                            this.defaultCheckedKeys = [
                                res.account.department.id
                            ];
                            this.baseData = [
                                {
                                    id: res.account.department.id,
                                    name: res.account.department.name,
                                    type: "department"
                                }
                            ];
                        }
                    });
                }
            });
        },
        // 查询历史轨迹
        getTerminalTraceByNo(){
            let params = {
                gpsId: this.gpsId,
                beginTime: new Date(this.beginTime).getTime(),
                endTime: new Date(this.endTime).getTime(),
                memberType: this.value
            }
            // 校验
            for(let k in params){
                if(params[k] == null || params[k] == "" || params[k] == 0 || params[k] == undefined){
                    let obj = {
                        gpsId: "设备id不能为空",
                        beginTime: "开始时间不能为空",
                        endTime: "结束时间不能为空",
                        memberType: "查询类型不能为空"
                    }
                    this.$message({
						message: obj[k],
						type: 'warning'
					});
                    return
                }
            }
            this.$postJson(this.$api.getTerminalTraceByNo, params).then( res => {
                console.log(res.phoneTraces)
                if(res.phoneTraces != null && res.phoneTraces.length > 0){
                    let arr = res.phoneTraces;
                    this.$arcgis.centerTo(this.map, arr[0].longitude, arr[0].latitude);
                    let i = 0;
                    let index = setInterval(() => {
                        let d = this.lineData.data;
                        this.circleData.push({
                            longitude: arr[i].longitude, 
                            latitude: arr[i].latitude, 
                            radius: 100,
                            color: [255,255,255,1],
                            type: '',
                            outlineColor: [255,255,255,1],
                            outlineType: 'STYLE_DASH',
                            width: 2
                        });
                        d.push([arr[i].longitude,arr[i].latitude]);
                        this.lineData = Object.assign({}, this.lineData, { data: d });
                        i++;
                        if (i == arr.length) {
                            clearInterval(index);
                        }
                    }, 1000);
                }else{
                    this.$message({
						message: '暂无数据',
						type: 'warning'
					});
                }
            })
        },
        // 查询实时轨迹
        getTerminalCurrentTrace(){
            let params = {
                gpsId: this.gpsId,
                beginTime: this.beginTime,
                endTime: this.endTime,
                memberType: this.value
            }
            this.$postJson(this.$api.getTerminalCurrentTrace, params).then( res => {
                console.log(res)
            })
        },
        // 查询
        search(){
            if(this.radio == "1"){
                this.getTerminalTraceByNo()
            }else{
                this.getTerminalCurrentTrace()
            }
        },
        // 点击树形菜单节点
        nodeClick(val) {
            console.log(val);
            if(val.type == "TERMINAL_PERSONNEL"){
                this.value = "TERMINAL_PERSONNEL"
                this.gpsId = val.no
            }else if(val.terminalMemberType == "TERMINAL_PHONE"){
                this.value = "TERMINAL_PHONE"
                this.gpsId = val.no
            }
        },
        // 树形菜单显示隐藏
        stateChange(d) {
            if (d) {
                this.searchStyle = {
                    transition: "all linear 0.5s",
                    left: "320px"
                };
            } else {
                this.searchStyle = {
                    transition: "all linear 0.5s",
                    left: "10px"
                };
            }
        }
    },
    mounted() {
        this.gpsId = this.$route.params.gpsId
        this.value = this.$route.params.memberType

        // 判断arcgis模块是否加载完成
        let i = setInterval(() => {
            if (this.$arcgis.all) {
                clearInterval(i);
                // 创建地图
                this.map = this.$arcgis.mapInit({
                    id: "map",
                    center: [114.414, 30.549],
                    zoom: 12,
                    minZoom: 5,
                    maxZoom: 18,
                    layer: "gaodeLayerColor"
                });
            }
        });
    }
};
</script>

<style lang="less" scope>
#trajectory {
    width: 100%;
    height: 100%;
    .back{
        position: fixed;
        left: 0;
        top: 0;
        z-index: 99999;
        width: 78px;
        height: 68px;
        background: url("./images/home.png") center center no-repeat;
    }
    #map {
        width: 100%;
        height: 100%;
    }
    .footer{
        position: absolute;
        left: 320px;
        bottom: 20px;
        width: 100%;
        margin-left: 10px;
        margin-right: 10px;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, .8);
        color: #fff;
        .no{
            display: inline-block;
            margin-left: 20px;
            margin-right: 60px;
        }
        .label{
            display: inline-block;
        }
        .transparent{
            background-color: transparent;
            input{
                background-color: transparent;
                border: 0;
                color: #fff;
            }
        }
        .btn{
            margin-left: 60px;
        }
    }
    .customTree {
    padding-top: 70px;
	// 自定义子组件内容样式
	/deep/ .custom-tree-node {
		// 部门和组的折叠图标
		.icon-close-floder {
			display: block;
			width: 16px;
			height: 16px;
			background: url(./images/icon_folder_close.png);
			background-size: 100% 100%;
		}
		// 部门和组的打开折叠图标
		.icon-open-floder {
			display: block;
			width: 16px;
			height: 16px;
			background: url(./images/icon_folder_open.png);
			background-size: 100% 100%;
		}
		// 民警图标
		.icon-policeman {
			display: block;
			width: 16px;
			height: 16px;
			background: url(./images/1.png);
			background-size: 100% 100%;
		}
		// PDT设备图标
		.icon-TERMINAL_PDT {
			display: block;
			width: 16px;
			height: 16px;
			background: url(./images/2.png);
			background-size: 100% 100%;
        }
        // 警务通
        .icon-TERMINAL_PHONE{
            display: block;
			width: 16px;
			height: 16px;
			background: url(./images/3.png);
			background-size: 100% 100%;
        }
        // 执法仪
        .icon-TERMINAL_BODY_WORN_CAMERA{
            display: block;
			width: 16px;
			height: 16px;
			background: url(./images/4.png);
			background-size: 100% 100%;
        }
        // 警车
        .icon-TERMINAL_CAR{
            display: block;
			width: 16px;
			height: 16px;
			background: url(./images/5.png);
			background-size: 100% 100%;
        }
        // 布控球
        .icon-TERMINAL_EQUIPMENT{
            display: block;
			width: 16px;
			height: 16px;
			background: url(./images/6.png);
			background-size: 100% 100%;
        }
		// 树子组件字颜色
		.label {
			color: #A3F3FF !important;
		}
    }
}
}
</style>