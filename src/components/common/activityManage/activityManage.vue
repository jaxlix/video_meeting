<template>
    <div class="content-classes" :class="show ? 'move-show' : 'move-hide'">
        <ul>
            <li
                class="item"
                @click="listen(item, key+1)"
                :title="item.groupNo"
                :style="listeningGroups[key+1] ? {color: colors[key+1][0]} : ''"
                v-for="(item, key) in dataList"
                :key="key"
            >
                <span class="title">{{item.name}}</span>
                <span class="listen" :class="listeningGroups[key+1] ? 'listening' : ''"></span>
                <span
                    class="speak"
                    :class="currentGroup.type == key+1 ? 'speakReady' : ''"
                    @click="choose(item, key+1)"
                ></span>
            </li>
        </ul>
        <img v-show="show" class="move-btn" @click="show = !show" src="./images/left_1.png" />
        <img v-show="!show" class="move-btn" @click="show = !show" src="./images/left_2.png" />
        <Layer
            v-for="(item, key) in activityScope"
            :key="key"
            :map="map"
            layerIndex="1"
            :visible="listeningGroups[key+1]"
            :lineData="item.line ? item.line : null"
            :circleData="item.circle ? item.circle : null"
            :scopeData="item.scope ? item.scope : null"
        />
    </div>
</template>

<script>
import Layer from "@/components/layers/Layer.vue";
import colors from "@/js/colors";

export default {
    data() {
        return {
            dataList: [],
            colors: {},
            listeningGroups: {}, // 已经选择的监听组
            currentGroup: {}, // 当前组信息
            linshijianting: "", // 临时监听组,即未监听的组，在选择为当前组时，需要临时加入监听组，切换当前组时，需要取消监听
            show: true,
            activityScope: [] // 已经选择的监听组的范围
        };
    },
    props: ["map", "data"],
    components: {
        Layer
    },
    methods: {
        init() {
            this.colors = colors;
            this.listeningGroups = { 1: this.dataList[0].groupNo };
            this.currentGroup = {
                type: 1,
                groupNo: this.dataList[0].groupNo,
                groupName: this.dataList[0].groupName,
                groupUniqueNo: this.dataList[0].groupUniqueNo
            };
            // 监听组的范围
            let arr = [];
            this.data.forEach(item => {
                let activityScope = item.activityScope;
                if (activityScope.length > 0) {
                    activityScope.forEach(d => {
                        if (d.type == "line") {
                            arr.push({
                                line: {
                                    data: d.data,
                                    color: [255, 0, 0, 0.5],
                                    width: 3
                                }
                            });
                        } else if (d.type == "circle") {
                            d.data.color = [0, 0, 0, 0.5];
                            d.data.type = "";
                            d.data.outlineColor = [0, 255, 255, 0.5];
                            d.data.outlineType = "STYLE_DASH";
                            d.data.width = 2;
                            arr.push({ circle: d.data });
                        } else if (d.type == "scope") {
                            arr.push({
                                scope: {
                                    data: d.data,
                                    color: [0, 0, 0, 0.5],
                                    type: "",
                                    outlineColor: [0, 255, 255, 0.5],
                                    outlineType: "STYLE_DASH",
                                    width: 3
                                }
                            });
                        }
                    });
                }
            });
            this.activityScope = arr;
            // 监听
            this.$rhtxApi.setMonitorGroup(this.dataList[0].groupNo);
            // 切组
            this.$rhtxApi.switchGroup(this.dataList[0].groupNo);
            // 监听组信息和当前组信息更新到vuex
            this.$store.commit("setListeningGroups", this.listeningGroups);
            this.$store.commit("setCurrentGroup", this.currentGroup);
            // 移动地图中心点
            let a = this.$common.wgs_gcj(
                this.dataList[0].centerLng,
                this.dataList[0].centerLat
            );
            this.$arcgis.centerTo(this.map, a.longitude, a.latitude);
        },
        // 监听
        listen(d, type) {
            if (this.listeningGroups[type]) {
                // 取消监听,若是当前组则不能取消
                if (this.currentGroup.type != type) {
                    // this.$rhtxApi.endSetMonitorGroup(d.groupNo)
                    this.$delete(this.listeningGroups, type);
                }
            } else {
                // 监听
                // this.$rhtxApi.setMonitorGroup(d.groupNo)
                this.$set(this.listeningGroups, type, d.groupNo);
            }
            this.$store.commit("setListeningGroups", this.listeningGroups);
        },
        // 切换当前组
        choose(d, type) {
            if (this.currentGroup.type != type) {
                if (this.linshijianting) {
                    // 取消临时组监听
                    this.$rhtxApi.endSetMonitorGroup(d.groupNo);
                    this.$delete(this.listeningGroups, this.linshijianting);
                    this.linshijianting = "";
                    this.$store.commit(
                        "setListeningGroups",
                        this.listeningGroups
                    );
                }
                if (!this.listeningGroups[type]) {
                    // 若未处于监听状态则需要监听
                    this.$rhtxApi.setMonitorGroup(d.groupNo);
                    this.$set(this.listeningGroups, type, d.groupNo);
                    this.linshijianting = type;
                    this.$store.commit(
                        "setListeningGroups",
                        this.listeningGroups
                    );
                }
                // 切换组
                this.currentGroup = {
                    type: type,
                    groupNo: d.groupNo,
                    groupName: d.groupName,
                    groupUniqueNo: d.groupUniqueNo
                };
                this.$store.commit("setCurrentGroup", this.currentGroup);
                // 切组
                this.$rhtxApi.switchGroup(d.groupNo);
                // 中心点
                let a = this.$common.wgs_gcj(d.centerLng, d.centerLat);
                this.$arcgis.centerTo(this.map, a.longitude, a.latitude);
            }
        }
    },
    mounted() {
        this.dataList = this.data;
        this.init();
    }
};
</script>


<style lang="less" scoped>
.content-classes {
    position: absolute;
    left: 17px;
    top: 19px;
    width: 286px;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 999;
    border-radius: 4px;
    .item {
        display: flex;
        height: 66px;
        line-height: 66px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        cursor: pointer;
        .title {
            flex: 1;
            padding-left: 34px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: bold;
        }
        .listen {
            background: url("./images/ico_leftlist_listening.png") no-repeat;
        }
        .listen {
            padding-right: 24px;
            cursor: pointer;
            background: url("./images/ico_leftlist_listen.png") no-repeat;
            width: 38px;
            height: 38px;
            margin-top: 14px;
        }
        .listening {
            background: url("./images/ico_leftlist_listening.png") no-repeat;
        }
        .speak {
            padding-right: 14px;
            cursor: pointer;
            background: url("./images/ico_leftlist_speeksilence.png") no-repeat;
            width: 38px;
            height: 38px;
            background-size: contain;
            margin-top: 14px;
        }
        .speakReady {
            background: url("./images/ico_leftlist_ready.png") no-repeat;
        }
        .speaking {
            background: url("./images/ico_leftlist_speeking.png") no-repeat;
        }
    }
    .item:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
    .move-btn {
        position: absolute;
        right: -18px;
        top: 40%;
    }
}
.move-show {
    animation: toShow 1s infinite;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}
@keyframes toShow {
    0% {
        left: -286px;
    }
    100% {
        left: 17px;
    }
}
.move-hide {
    animation: toHide 1s infinite;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}
@keyframes toHide {
    0% {
        left: 17px;
    }
    100% {
        left: -286px;
    }
}
</style>
