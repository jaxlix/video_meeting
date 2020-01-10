<template>
    <div id="heat-map">
        <Header />
        <Statistical />
        <Cqbb />
        <div id="map"></div>
        <div class="playback" @mouseover="showList=true" @mouseout="showList=false">
            <div class="title">勤务回放</div>
            <ul class="list" v-show="showList">
                <li>
                    <a href="javascript:void(0)" @click="playType = 'date',showList = false">按天回放</a>
                </li>
                <li>
                    <a href="javascript:void(0)" @click="playType = 'month',showList = false">按月回放</a>
                </li>
            </ul>
        </div>
        <div class="play" v-show="playType">
            <a class="close" @click="close" href="javascript:void(0)"></a>
            <div class="time">
                <el-date-picker
                    class="picker-"
                    v-model="dayTime"
                    :type="playType"
                    @change="getData"
                ></el-date-picker>
            </div>
            <div class="play-btn">
                <a href="javascript:void(0)" @click="play">
                    <img v-show="!playing" src="./images/icon_play.png" alt />
                    <img v-show="playing" src="./images/icon_pause.png" alt />
                </a>
                <ul class="play-ul">
                    <li v-for="(k,index) in keyframes" :key="index" :class="key>=index?'this':''"></li>
                </ul>
            </div>
        </div>
        <div class="key-num" v-show="keyframes.length>0">{{String(keyframes[key]).substring(String(keyframes[key]).length-2)}}</div>
    </div>
</template>

<script>
import Header from "./header";
import Statistical from "./statistical";
import Cqbb from "./cqbb";

export default {
    data() {
        return {
            map: null, // 实例化地图
            featureLayer: null, // 热力图图层
            showList: false,
            dayTime: new Date(), // 播放日期,默认当天，或当月
            playType: "", // 播放类型，按月，按天
            dataObj: null, // 数据源
            keyframes: [], // 需要播放的帧
            key: 0, // 当前播放的帧下标
            playing: false, // 是否正在播放
            index: null // 定时器
        };
    },
    components: {
        Header,
        Statistical,
        Cqbb
    },
    watch: {
        playType(val) {
            if(val != ""){
                this.getData()
            }
        }
    },
    methods: {
        getData() {
            let dayTime = this.dateFormatter(
                this.dayTime,
                this.playType == "month" ? 1 : 2
            );
            let params = {
                dayTime: dayTime,
                flag: this.playType == "month" ? 1 : 2
            };
            this.$get(this.$api.getThermodynamicChart, params).then(res => {
                if(Object.keys(res).length>0){
                    this.dataObj = res;
                    this.keyframes = Object.keys(res);
                    // 加载第一帧
                    let data = res[this.keyframes[0]];
                    if (data.length > 0) {
                        this.featureLayer = this.$arcgis.heatmapRenderer(
                            this.map,
                            data
                        );
                    }
                }else{
                    this.dataObj = null
                    this.keyframes = []
                    this.key = 0
                    this.map.removeLayer(this.featureLayer)
                    this.$message({
                        message: '没有对应的数据',
                        type: 'warning'
                    });
                }
            });
        },
        dateFormatter(date, type) {
            let d = new Date(date);
            let y = String(d.getFullYear());
            let m = d.getMonth() + 1;
            m = String(m > 9 ? m : "0" + m);
            let day = String(d.getDate());
            day = day > 9 ? day : "0" + day;
            if (type == 1) {
                return y + m;
            } else {
                return y + m + day;
            }
        },
        play() {
            if(this.dataObj == null){
                return
            }
            if (this.playing) {
                // 正在播放，暂停
                this.playing = false;
                clearInterval(this.index);
            } else {
                this.playing = true;
                this.index = setInterval(() => {
                    this.key = this.key + 1;
                    // 播放完成
                    if (this.key == this.keyframes.length) {
                        clearInterval(this.index);
                        this.playing = false;
                        this.key = 0;
                        this.map.removeLayer(this.featureLayer);
                        let data = this.dataObj[this.keyframes[0]];
                        if (data.length > 0) {
                            this.featureLayer = this.$arcgis.heatmapRenderer(
                                this.map,
                                data
                            );
                        }
                        return;
                    }
                    // 清除上一帧
                    if (this.featureLayer) {
                        this.map.removeLayer(this.featureLayer);
                    }
                    // 绘制当前帧
                    let data = this.dataObj[this.keyframes[this.key]];
                    console.log(data)
                    if (data.length > 0) {
                        this.featureLayer = this.$arcgis.heatmapRenderer(
                            this.map,
                            data
                        );
                    }
                }, 1000);
            }
        },
        close(){
            this.playType = ""
            this.dataObj = null
            this.keyframes = []
            this.key = 0
            this.map.removeLayer(this.featureLayer)
        }
    },
    mounted() {
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
                    layer: "gaodeLayerDark"
                });
            }
        }, 200);
    }
};
</script>

<style lang="less" scoped>
#heat-map {
    width: 100%;
    height: 100%;
    #map {
        width: 100%;
        height: 100%;
    }
    .playback {
        position: absolute;
        top: 40px;
        right: 20px;
        z-index: 2;
        width: 124px;
        .title {
            width: 114px;
            height: 48px;
            background: rgba(30, 136, 211, 0.8);
            color: #fff;
            text-align: center;
            line-height: 48px;
            background: url("./images/bg1.png") center center no-repeat;
            background-size: 100% 100%;
        }
        .list {
            position: relative;
            top: 10px;
            right: 30px;
            width: 124px;
            background: rgba(30, 136, 211, 0.8);
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.8) inset;
            li {
                padding: 5px 10px;
                text-align: center;
                a {
                    color: #fff;
                }
            }
            li:first-child {
                &:after {
                    content: "";
                    display: block;
                    height: 1px;
                    background: linear-gradient(
                        to right,
                        transparent,
                        #00ffff,
                        transparent
                    );
                    position: relative;
                    top: 5px;
                }
            }
        }
    }
    .play {
        position: absolute;
        top: 100px;
        right: 20px;
        width: 278px;
        height: 134px;
        padding: 10px 20px;
        box-sizing: border-box;
        background: rgba(0, 76, 129, 0.85);
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.8) inset;
        .close {
            position: absolute;
            right: 10px;
            top: 10px;
            width: 13px;
            height: 14px;
            background: url("./images/icon_close.png") center center no-repeat;
            background-size: 100% 100%;
        }
        .time {
            text-align: center;
            /deep/.picker- {
                background-color: transparent;
                input {
                    background-color: transparent;
                    text-align: center;
                    border: 0;
                    color: #fff;
                }
            }
        }
        .play-btn {
            display: flex;
            margin-top: 10px;
            border-top: 1px solid rgba(30, 136, 211, 0.8);
            padding-top: 15px;
            a {
                margin-right: 10px;
                img {
                    width: 38px;
                    height: 36px;
                }
            }
            .play-ul {
                flex: 1;
                display: flex;
                align-items: center;
                li {
                    flex: 1;
                    height: 13px;
                    margin: 0 2px;
                    background-color: #fff;
                }
                li.this {
                    background-color: #ff9600;
                }
            }
        }
    }
    .key-num {
        position: absolute;
        left: 300px;
        top: 100px;
        color: #fff;
        font-size: 100px;
        opacity: 0.5;
    }
}
</style>