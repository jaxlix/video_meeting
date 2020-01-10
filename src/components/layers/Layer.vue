<template>
    <div>
        <div v-if="aggregation" v-show="singlesShow" class="singles" :style="singlesStyle">
            <div @click="singlesShow = false" class="close">&times;</div>
            <div class="arrow-bottom"></div>
            <div v-for="(d, i) in singlesData" :key="i">{{d.attributes.data.name}}</div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            layer: null,
            singlesData: [], // 聚合到达18级时，还未展开的数据
            singlesShow: false,
            singlesStyle: {},
            startPoint: {},
            callTagPic: null
        };
    },
    props: [
        "map",          //  "map": 底图对象
        "layerIndex",   //  "layerIndex"：图层层级
        "visible",      //  "visible"：是否显示
        "circleData",   //  "circleData": {longitude: 经度, latitude：纬度, radius：半径} 绘制圆形范围的数据
        "lineData",     //  "lineData": [[114.53210449,30.51663971],[114.52935791,30.51782227],[114.52386475,30.52018738],[114.51940155,30.52314568],[114.51287842,30.52808189]] 绘制路线的数据
        "scopeData",    //  "scopeData": [[114.1,30.1],[114.2,30.5],[114.8,30.9],[114.1,30.1]] 绘制不规则区域的数据，顶点坐标,多边形的各个角的顶点坐标，注意：首尾要链接，也就是说，第一个点和最后一个点要一致
        "icon",         //  "icon": 图标
        "styles",       //  "styles"： 图标样式
        "aggregation",  //  "aggregation"： true/false，是否聚合，只有type在point时才起作用，默认false
        "aggregationIcon",  //  "aggregationIcon": 聚合图标
        "data",          //  "data"： 数据源
        "callTag",        //  "callTag": 是否需要呼叫标记
        "callTagIcon"       // 呼叫标记图标，当callTag为true时必须传
    ],
    computed: {
        ...mapGetters({
            call: 'call',
            listeningGroups: "listeningGroups"
        })
    },
    watch: {
        data(d) {
            this.init();
        },
        visible(d) {
            if (!d) {
                this.layer.clear();
            } else {
                this.init();
            }
        },
        // 当前正在呼叫人员、设备信息
        call (v){
            if(this.callTag){
                this.showCallMarker(v)
            }
        },
        // 监听组变化，将监听组设备改变颜色
        listeningGroups (v){
            console.log(v)
        }
    },
    methods: {
        // 初始化方法
        init() {
            this.layer.clear();
            // 绘制圆形范围
            if(this.circleData){
                if(Array.isArray(this.circleData)){
                    this.circleData.forEach( d => {
                        this.$arcgis.setCircle(this.layer, d, {})
                    })
                }else if(this.circleData.constructor === Object){
                    this.$arcgis.setCircle(this.layer, this.circleData, {})
                }
            }
            // 绘制路线
            if(this.lineData){
                if(Array.isArray(this.lineData)){
                    this.lineData.forEach( d => {
                        this.$arcgis.setPolyline(this.layer, d, {})
                    })
                }else if(this.lineData.constructor === Object){
                    this.$arcgis.setPolyline(this.layer, this.lineData, {})
                }
            }
            // 绘制多边形区域
            if(this.scopeData){
                if(Array.isArray(this.scopeData)){
                    this.scopeData.forEach( d => {
                        this.$arcgis.setPolygon(this.layer, d, {})
                    })
                }else if(this.scopeData.constructor === Object){
                    this.$arcgis.setPolygon(this.layer, this.scopeData, {})
                }
            }
            // 绘制坐标点，聚合
            if (this.data) {
                if (this.aggregation) {
                    this.clusterLayer(this.data);
                }else{
                    this.data.forEach(item => {
                        // if (item.type == "TERMINAL_UAV") {
                        //     // 无人机
                        //     let uav = item.UAV;
                        //     let option = {
                        //         longitude: uav.position.longitude,
                        //         latitude: uav.position.latitude,
                        //         img: this.icon ? this.icon[0] : "",
                        //         width: this.styles.iconWidth || 16,
                        //         height: this.styles.iconHeight || 27
                        //     }
                        //     this.$arcgis.addPictureMarker(this.layer, option, uav);
                        //     // 飞手
                        //     let flyer = item.flyer;
                        //     let option2 = {
                        //         longitude: flyer.position.longitude,
                        //         latitude: flyer.position.latitude,
                        //         img: this.icon ? this.icon[1] : "",
                        //         width: this.styles.iconWidth || 16,
                        //         height: this.styles.iconHeight || 27
                        //     }
                        //     this.$arcgis.addPictureMarker(this.layer, option2, flyer);
                        // } else {
                            let option = {
                                longitude: item.position.longitude,
                                latitude: item.position.latitude,
                                img: this.icon,
                                width: this.styles.iconWidth || 16,
                                height: this.styles.iconHeight || 27
                            }
                            this.$arcgis.addPictureMarker(this.layer, option, item);
                        // }
                    });
                }
            }
        },
        // 设备聚合
        clusterLayer(data) {
            //聚合图层
            let aggreData = [];
            data.forEach(d => {
                let a = this.$common.wgs_gcj(
                    d.position.longitude,
                    d.position.latitude
                );
                d.x = a.longitude;
                d.position.longitude = a.longitude;
                d.y = a.latitude;
                d.position.latitude = a.latitude;
                let _data = this.$arcgis.changePosXY(a.longitude, a.latitude);
                _data.attributes = {
                    id: d.no,
                    data: d
                };
                aggreData.push(_data);
            });
            let clusterLayer = this.$arcgis.initClusterLayer(
                "minjing_clusters",
                aggreData,
                this.map,
                null
            );
            let config = {
                img0: {
                    url: this.aggregationIcon,
                    width: this.styles.aggregationIconWidth,
                    height: this.styles.aggregationIconHeight
                },
                img1: {
                    url: this.icon,
                    width: this.styles.iconWidth,
                    height: this.styles.iconHeight
                }
            };
            this.$arcgis.setCluterLayer(config, clusterLayer);
            this.map.addLayer(clusterLayer, this.layerIndex);
            let arcgis = this.$arcgis;
            let _this = this;
            // 绑定点击事件
            clusterLayer.onClick = function(e) {
                this.clearSingles(this._singles);
                let singles = [];
                let _clusterData = null;
                for (let i = 0, il = this._clusterData.length; i < il; i++) {
                    if (
                        e.graphic.attributes.clusterId ==
                        this._clusterData[i].attributes.clusterId
                    ) {
                        _clusterData = this._clusterData[i];
                        singles.push(_clusterData);
                    }
                }
                // 只有一个
                if (singles.length == 1) {
                    // 把气泡弹出来
                    let d = _clusterData.attributes.data;
                    _this.$emit("clickIcon", d);
                } else {
                    e.stopPropagation();
                    let _map = this.getMap();
                    if (_map.getLevel() == 18) {
                        console.log("已经到达18级");
                        console.log(singles);
                        _this.singlesShow = true;
                        _this.singlesData = singles;
                        let point = _this.$arcgis.toScreenPoint(
                            _this.map,
                            singles[0].attributes.data.x,
                            singles[0].attributes.data.y
                        );
                        _this.singlesStyle = {
                            left: point.x - 185 + "px",
                            top: point.y - 230 + "px"
                        };
                        _this.startPoint = {
                            left: point.x - 185 + "px",
                            top: point.y - 230 + "px"
                        };
                    } else {
                        // 居中，向内飞入2层
                        _map.centerAndZoom(
                            arcgis.createPoint(
                                _clusterData.attributes.data.x,
                                _clusterData.attributes.data.y
                            ),
                            _map.getLevel() + 2
                        );
                        this._addSingles(singles);
                    }
                }
            };
        },
        // 展示正在呼叫标记
        showCallMarker(data){
            // 结束组呼
            if(data == 'end'){
                setTimeout(()=>{
                    console.log("结束")
                    this.layer.remove(this.callTagPic);
                },1000)
                return
            }
            //x:经度，y:纬度，img：新图片 width: 图片宽, height图片高
            for (let i = 0; i < this.data.length; i++) {
                let item = this.data[i]
                let id = item.no
                if (String(id).indexOf(data.memberId) != -1) {
                    let option = {
                        longitude: item.position.longitude,
                        latitude: item.position.latitude,
                        img: this.callTagIcon,
                        width: this.styles.callTagIconWidth || 16,
                        height: this.styles.callTagIconHeight || 27
                    }
                    this.callTagPic = this.$arcgis.addPictureMarker(this.layer, option, item);
                    break;
                }
            }
        }
    },
    mounted() {
        // 创建图层
        this.layer = this.$arcgis.createLayer(this.map, this.layerIndex);
        // 初始化方法
        if (this.visible) {
            this.init();
        }
        // 扩展
        this.$emit("extend", this.layer);
        // 点击事件
        this.$arcgis.click(this.layer, e => {
            console.log(e)
            this.$emit("clickIcon", e.graphic.attributes);
        });
        // 移动地图改变气泡位置
        if (this.visible && this.aggregation) {
            this.$arcgis.pan(this.map, e => {
                if(this.singlesShow){
                    let offx = e.delta.x;
                    let offy = e.delta.y;
                    let style = {
                        left: this.startPoint.left.replace("px", "") * 1 + offx + "px",
                        top: this.startPoint.top.replace("px", "") * 1 + offy + "px"
                    };
                    this.singlesStyle = style;
                }
            });
            // 移动地图结束更新气泡位置
            this.$arcgis.panend(this.map, () => {
                if(this.singlesShow){
                    this.startPoint = this.singlesStyle;
                }
            });
        }
    }
};
</script>

<style lang="less" scope>
.singles {
    position: absolute;
    z-index: 99;
    width: 350px;
    height: 200px;
    background-color: rgba(13, 24, 43, 0.9);
    box-shadow: 4px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.9);
    color: #fff;
    border-radius: 4px;
    .close {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 30px;
        font-size: 30px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
    }
    .arrow-bottom {
        position: absolute;
        bottom: -20px;
        left: 175px;
        border: 10px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.5);
    }
}
</style>