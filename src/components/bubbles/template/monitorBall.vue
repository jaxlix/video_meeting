<template>
    <div class="monitorBall">
        <div @click="close" class="close">&times;</div>
        <div :class="arrow ? arrow : 'arrow-bottom'"></div>
        <div class="msg">
            <img src="../images/monitorBall/bukongqiu.png" alt />
        </div>
        <div class="btns">
            <div class="name">布控球</div>
            <div class="fenju">{{data.department && data.department.name ? data.department.name : '[未知]'}}</div>
            <p class="locationTime">设备类型：{{data.type ? data.type : '[未知]'}}</p>
            <p class="speed">移动速度：<span>{{data.speed ? data.speed : '[未知]'}}</span>km/h</p>
            <p class="locationTime">定位时间：{{data.position && data.position.lastUpdateTime ? $common.dateFormatter(data.position.lastUpdateTime) : '[未知]'}}</p>
            <div class="caozuo">
                <a @click="lteVideo('32010000001320000114')">
                    <span class="view"></span>
                </a>
                <a @click="lteVideo('32010000001320000114')">
                    <span class="video"></span>
                </a>
                <a @click="lteVideo('32010000001320000114')">
                    <span class="metting"></span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ["arrow", "data"],
    methods: {
        close() {
            this.$emit('closeBubble')
        },
        // 个呼 ：警务通、手台、车台、电台
        individualCall(num) {
            this.$rhtxApi.individualCall(num)
        },
        // 视频回调
        video(num, type) {
            this.$rhtxApi.video(num, type)
        },
        // lte视频回调
        lteVideo(num) {
            this.$rhtxApi.lteVideo(num)
        },
        // 城市摄像头
        cityVideo(num) {
            this.$rhtxApi.cityVideo(num)
        }
    }
}
</script>

<style lang="less" scoped>
.monitorBall {
    position: absolute;
    z-index: 99;
    width: 370px;
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
    .arrow-left {
        position: absolute;
        bottom: 90px;
        left: -20px;
        border: 10px solid transparent;
        border-right-color: rgba(0, 0, 0, 0.5);
    }
    .msg {
        float: left;
        width: 120px;
        text-align: center;
        overflow: hidden;
        img {
            width: 120px;
            height: 116px;
            margin-top: 20px;
            margin-left: 25px;
        }
        .name {
            margin-bottom: 5px;
            font-size: 14px;
        }
        .ssfj {
            font-size: 14px;
        }
        .sudu {
            margin-top: 10px;
            font-size: 14px;
            color: #b69c74;
        }
    }
    .btns {
        margin-left: 120px;
        margin-top: 20px;
        font-size: 14px;
        .name{
            font-size: 18px;
        }
        .fenju{
            margin-bottom: 15px;
        }
        .speed{
            span {
                color: #B69C74;
            }
        }
        .caozuo{
            margin-top: 15px;
            width: 100%;
            height: 34px;
            display: flex;
            align-items: center;
            a {
                margin-right: 20px;
                cursor: pointer;
                .view {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/monitorBall/preview1.png");
                }
                .video {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/monitorBall/videotape-1.png");
                }
                .metting {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/uav/metting-add1.png");
                }
                &:hover {
                    .view {
                        background: url("../images/monitorBall/preview2.png");
                    }
                    .video {
                        background: url("../images/monitorBall/videotape-2.png");
                    }
                    .metting {
                        background: url("../images/uav/metting-add2.png");
                    }
                }
            }
        }
    }
}
</style>