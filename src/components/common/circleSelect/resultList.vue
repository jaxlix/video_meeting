<template>
    <div class="result-list" :style="foldAnimation">
        <div class="tab">
            <div
                class="tab-item"
                :class="tabThis == 'camera' ? 'tab-this' : ''"
                @click="tabThis='camera'"
            >摄像头</div>
            <div
                class="tab-item"
                :class="tabThis == 'police' ? 'tab-this' : ''"
                @click="tabThis='police'"
            >警员</div>
            <div
                class="tab-item"
                :class="tabThis == 'lte' ? 'tab-this' : ''"
                @click="tabThis='lte'"
            >LTE</div>
            <div @click="close" class="close">&times;</div>
        </div>
        <div class="nav">
            <span class="check">
                <el-checkbox
                    v-show="tabThis == 'police'"
                    v-model="phoneChecked"
                    @change="changePoliceTerminal"
                >警务通</el-checkbox>
                <el-checkbox
                    v-show="tabThis == 'police'"
                    v-model="pdtChecked"
                    @change="changePoliceTerminal"
                >电台</el-checkbox>
            </span>
            <span class="sq" @click="folding">
                收起列表
                <i :class="fload ? 'sq-icon' : 'sq-icon-down'"></i>
            </span>
        </div>
        <div class="check-all">
            <el-checkbox v-model="checkedAll" @change="chooseAll">全选</el-checkbox>
            <div>
                <span class="check-num">{{checkNum}}</span>
                <span>/{{dataList.length}}</span>
            </div>
        </div>
        <div class="content">
            <div class="item" v-for="(d, i) in dataList" :key="i" :title="d.name">
                <div class="item-msg">
                    <el-checkbox v-model="checkeds[d.no]" @change="checkItem">{{d.name}}</el-checkbox>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="lsz" v-show="lsz" @click="buildLsz">临时组</div>
            <div class="video" v-show="video" @click="getVideo">图像</div>
            <div class="ysx" v-show="ysx" @click="buildYsx" :style="yl?'background-position-x: 20px;':''">云视讯</div>
            <div class="yl" v-show="yl" @click="getVideo">预览</div>
            <div class="txhc" v-show="txhc" @click="getVideo">图像回传</div>
        </div>
        <el-dialog title="创建临时组" :visible.sync="dialogFormVisible" :append-to-body="true" width="600px">
            <buildTemporaryGroup :dataList="groupData" :terminalList="terminalList" @close="dialogFormVisible=false" />
        </el-dialog>
        <ysx v-show="ysxShow" @close="ysxShow=false" />
    </div>
</template>

<script>
import buildTemporaryGroup from "./buildTemporaryGroup";
import ysx from "./ysx";

export default {
    data() {
        return {
            dataList: [],
            cameraData: [],
            phoneData: [],
            pdtData: [],
            lteData: [],
            checkedAll: true,
            phoneChecked: true,
            pdtChecked: true,
            tabThis: "police",
            checkeds: {},
            checkObj: {},
            lsz: true,
            video: true,
            ysx: true,
            yl: false,
            txhc: false,
            foldAnimation: {height: "600px"},
            fload: true,
            dialogFormVisible: false,
            groupData: [],
            terminalList: [],
            ysxShow: false
        };
    },
    components: {
        buildTemporaryGroup,
        ysx
    },
    props: {
        data: Array
    },
    watch: {
        data(val) {
            let obj = {
                CAMERA: {},
                TERMINAL_PDT: {},
                TERMINAL_PHONE: {},
                TERMINAL_LTE: {}
            };
            let camera = [];
            let phone = [];
            let pdt = [];
            let lte = [];
            val.forEach(e => {
                if (e.type == "CAMERA") {
                    // 去重
                    if (!obj.CAMERA[e.no]) {
                        camera.push(e);
                        obj.CAMERA[e.no] = true;
                    }
                } else if (e.type == "TERMINAL_PDT") {
                    pdt.push(e);
                    obj.TERMINAL_PDT[e.no] = true;
                } else if (e.type == "TERMINAL_PHONE") {
                    phone.push(e);
                    obj.TERMINAL_PHONE[e.no] = true;
                } else if (e.type == "TERMINAL_LTE") {
                    lte.push(e);
                    obj.TERMINAL_LTE[e.no] = true;
                }
            });
            this.cameraData = camera;
            this.pdtData = pdt;
            this.phoneData = phone;
            this.lteData = lte;
            this.checkObj = obj;
            if (this.tabThis == "police") {
                if (this.phoneChecked && this.pdtChecked) {
                    this.dataList = phone.concat(pdt);
                    this.checkeds = Object.assign(
                        {},
                        obj.TERMINAL_PHONE,
                        obj.TERMINAL_PDT
                    );
                } else if (this.phoneChecked) {
                    this.dataList = phone;
                    this.checkeds = obj.TERMINAL_PHONE;
                } else if (this.pdtChecked) {
                    this.dataList = pdt;
                    this.checkeds = obj.TERMINAL_PDT;
                }
            } else if (this.tabThis == "camera") {
                this.dataList = camera;
                this.checkeds = obj.CAMERA;
            } else {
                this.dataList = lte;
                this.checkeds = obj.TERMINAL_LTE;
            }
        },
        tabThis(val) {
            if (this.tabThis == "police") {
                this.lsz = true;
                this.video = true;
                this.ysx = true;
                this.yl = false;
                this.txhc = false;
                if (this.phoneChecked && this.pdtChecked) {
                    this.dataList = this.phoneData.concat(this.pdtData);
                    this.checkeds = Object.assign(
                        {},
                        this.checkObj.TERMINAL_PHONE,
                        this.checkObj.TERMINAL_PDT
                    );
                } else if (this.phoneChecked) {
                    this.dataList = this.phoneData;
                    this.checkeds = this.checkObj.TERMINAL_PHONE;
                } else if (this.pdtChecked) {
                    this.dataList = this.pdtData;
                    this.checkeds = this.checkObj.TERMINAL_PDT;
                }
            } else if (this.tabThis == "camera") {
                this.lsz = false;
                this.video = false;
                this.ysx = true;
                this.yl = true;
                this.txhc = false;
                this.dataList = this.cameraData;
                this.checkeds = this.checkObj.CAMERA;
            } else {
                this.lsz = false;
                this.video = false;
                this.ysx = false;
                this.yl = false;
                this.txhc = true;
                this.dataList = this.lteData;
                this.checkeds = this.checkObj.TERMINAL_LTE;
            }
        }
    },
    computed: {
        checkNum: function() {
            let num = 0;
            for (let key in this.checkeds) {
                if (this.checkeds[key]) {
                    num++;
                }
            }
            return num;
        }
    },
    methods: {
        close() {
            this.$emit("clsoe");
        },
        changePoliceTerminal() {
            if (this.phoneChecked && this.pdtChecked) {
                this.dataList = this.phoneData.concat(this.pdtData);
                this.checkeds = Object.assign(
                    {},
                    this.checkObj.TERMINAL_PHONE,
                    this.checkObj.TERMINAL_PDT
                );
            } else if (this.phoneChecked) {
                this.dataList = this.phoneData;
                this.checkeds = this.checkObj.TERMINAL_PHONE;
            } else if (this.pdtChecked) {
                this.dataList = this.pdtData;
                this.checkeds = this.checkObj.TERMINAL_PDT;
            }
        },
        chooseAll() {
            for (let key in this.checkeds) {
                if (this.checkedAll) {
                    this.checkeds[key] = true;
                } else {
                    this.checkeds[key] = false;
                }
            }
        },
        checkItem(){
            let all = true
            for (let key in this.checkeds){
                if(!this.checkeds[key]){
                    all = false
                    break
                }
            }
            this.checkedAll = all
        },
        folding() {
            this.fload = !this.fload
            if(this.foldAnimation.height == "600px"){
                this.foldAnimation = {height: "100px"}
            }else{
                this.foldAnimation = {height: "600px"}
            }
        },
        buildLsz() {
            let arr = []
            this.dataList.forEach( d => {
                if(this.checkeds[d.no]){
                    arr.push(d)
                }
            })
            if(arr.length > 0){
                this.$get("http://127.0.0.1:8099/config/getMemberUniqueNo").then( res => {
                    this.$get("http://127.0.0.1:8099/getTempGroupsByCreator", {requestMemberNoStr: res.memberUniqueNo}).then( res => {
                        this.dialogFormVisible = true
                        this.groupData = res.data.data
                        this.terminalList = arr
                    })
                })
            }else{
                this.$message({
                    message: "请选择设备",
                    type: "warning"
                })
            }
        },
        getVideo(){
            let arr = []
            this.dataList.forEach( d => {
                if(this.checkeds[d.no]){
                    arr.push(d)
                }
            })
            console.log(arr)
            this.$rhtxApi.video(arr[0].no, arr[0].name, arr[0].type)
        },
        buildYsx(){
            this.ysxShow = true
            this.openVideoClient()
        },
        openVideoClient() {
            let url = "http://127.0.0.1:8099/sky/pullup_by_sky";
            let msgTask = setTimeout(function () {
                alert("宽带融合通讯服务未启动")
            }, 1000 * 10);
            this.$get(url).then( res => {
                clearTimeout(msgTask);
            })
        }
    }
};
</script>

<style lang="less" scoped>
.result-list {
    position: fixed;
    top: 200px;
    right: 50px;
    width: 300px;
    height: 600px;
    background-color: rgb(61, 70, 85);
    color: #fff;
    overflow: hidden;
    transition: all linear 0.5s;
    .tab {
        display: flex;
        height: 32px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        line-height: 32px;
        background-color: #0d182b;
        .tab-item {
            width: 76px;
            height: 32px;
            text-align: center;
            cursor: pointer;
        }
        .tab-this {
            color: #00d1ff;
            background: linear-gradient(#0d182b, #00d1ff);
        }
        .close {
            width: 40px;
            margin-left: 30px;
            font-size: 22px;
            text-align: center;
            cursor: pointer;
        }
    }
    .nav {
        display: flex;
        align-items: center;
        height: 34px;
        padding-left: 20px;
        background-color: #0d182b;
        .check {
            flex: 1;
        }
        .sq {
            font-size: 12px;
            cursor: pointer;
        }
        .sq-icon {
            display: inline-block;
            width: 13px;
            height: 9px;
            margin-left: 5px;
            margin-right: 10px;
            background: url("./images/up.png") center center no-repeat;
        }
        .sq-icon-down{
            display: inline-block;
            width: 13px;
            height: 9px;
            margin-left: 5px;
            margin-right: 10px;
            background: url("./images/down.png") center center no-repeat;
        }
    }
    .check-all {
        display: flex;
        justify-content: space-between;
        height: 34px;
        margin-left: 15px;
        margin-right: 15px;
        padding-left: 5px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        line-height: 34px;
        .check-num {
            color: #f8b551;
        }
    }
    .content {
        height: 460px;
        overflow-y: auto;
        .item {
            height: 40px;
            line-height: 40px;
            &:hover {
                background: linear-gradient(
                    to bottom,
                    rgba(58, 154, 236, 0.5) 0%,
                    rgba(58, 154, 236, 0) 30%,
                    rgba(58, 154, 236, 0) 70%,
                    rgba(58, 154, 236, 0.5) 100%
                );
            }
            .item-msg {
                margin-left: 15px;
                margin-right: 15px;
                padding-left: 5px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
        }
    }
    .footer {
        display: flex;
        align-items: center;
        height: 40px;
        margin-left: 15px;
        margin-right: 15px;
        background-color: rgb(61, 70, 85);
        div {
            flex: 1;
            height: 28px;
            padding-left: 10px;
            font-size: 14px;
            text-align: center;
            line-height: 28px;
            background-color: #1091ec;
            box-shadow: 0 0 8px rgba(16, 154, 236, 0.8) inset;
            cursor: pointer;
        }
        .lsz {
            background: url("./images/cloud3.png") left center no-repeat;
            background-size: 25px 25px;
        }
        .video {
            margin-left: 10px;
            margin-right: 10px;
            background: url("./images/video.png") 5px center no-repeat;
        }
        .ysx {
            background: url("./images/ysx.png") 5px center no-repeat;
        }
        .yl {
            margin-left: 10px;
            background: url("./images/preview1.png") 20px center no-repeat;
        }
        .txhc {
            background: url("./images/video.png") 90px center no-repeat;
        }
    }
    /*定义滚动条高宽及背景
        高宽分别对应横竖滚动条的尺寸*/
    .content::-webkit-scrollbar {
        width: 6px;
        background-color: rgba(0, 0, 0, 0.7);
    }
    /*定义滚动条轨道
        内阴影+圆角*/
    .content::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #f5f5f5;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.7);
    }
    /*定义滑块
        内阴影+圆角*/
    .content::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.3);
        background-color: #ddd;
    }
}
</style>