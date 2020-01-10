<template>
    <div class="zhifayi">
        <div @click="close" class="close">&times;</div>
        <div :class="arrow ? arrow : 'arrow-bottom'"></div>
        <div class="msg">
            <img src="../images/bodyWornCamera/Recorder.png" alt />
        </div>
        <div class="btns">
            <div class="name">{{data.name?data.name:"执法记录仪"}} {{data.no?data.no:"00000000"}}</div>
            <div class="department">{{data.department?data.department:"[武汉铁路公安局]"}}</div>
            <div class="working_status">执勤状态：{{data.workingStatus?data.workingStatus:"[未知]"}}</div>
            <div class="gps_time">定位时间：{{data.uploadTime?data.uploadTime:"[未知]"}}</div>
            <div class="caozuo">
                <a @click="getVideo" href="javascript:void(0)">
                    <span class="view"></span>
                </a>
                <a @click="historyVideo" href="javascript:void(0)">
                    <span class="video"></span>
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
            this.$emit("closeBubble")
        },
        getVideo(){
            this.$rhtxApi.video(this.data.no, "TERMINAL_BODY_WORN_CAMERA", this.data.name)
        },
        historyVideo(){
            this.$rhtxApi.historyVideo(this.data.no)
        }
    }
}
</script>

<style lang="less" scoped>
.zhifayi {
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
        img {
            width: 120px;
            height: 116px;
            margin-top: 30px;
            margin-left: 22.5px;
        }
    }
    .btns {
        margin-left: 0px;
        margin-top: 20px;
        text-align: left;
        .name{
            margin-top:25px;
            font-size: 16px;
        }
        .department{
            font-size: 14px;
            line-height: 22px;
        }
        .working_status{
            margin-top: 20px;
            line-height: 22px;
            font-size: 14px;
        }
        .gps_time{
            line-height: 22px;
            font-size: 14px;
        }
        .caozuo{
            margin-top: 10px;
            display: flex;
            height: 34px;
            align-items: center;
            width: 100%;
            padding-left: 120px;
            a{
                margin-right: 20px;
                .view {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/bodyWornCamera/preview1.png");
                }
                .video {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/bodyWornCamera/videotape-1.png");
                }
                &:hover {
                    .view {
                        display: block;
                        width: 34px;
                        height: 34px;
                        background: url("../images/bodyWornCamera/preview2.png");
                    }
                    .video {
                        display: block;
                        width: 34px;
                        height: 34px;
                        background: url("../images/bodyWornCamera/videotape-2.png");
                    }
                }
            }
        }
    }
}
</style>