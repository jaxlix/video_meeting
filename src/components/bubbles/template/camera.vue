<template>
    <div class="sxt">
        <div @click="close" class="close">&times;</div>
        <div :class="arrow ? arrow : 'arrow-bottom'"></div>
        <div class="msg">
            <img src="../images/camera/cameraInfoIcon.png" alt />
        </div>
        <div class="btns">
            <div class="name">摄像头 {{data.no || '[未知]'}}</div>
            <div class="address" :title="data.address">地点：{{data.address || '[未知]'}}</div>
            <div class="department">部门：{{data.department && data.department.name ? data.department.name : '[未知]'}}</div>
            <div class="leixing">类型：高清球机</div>
            <div class="caozuo">
                <a @click="cityVideo" href="javascript:void(0)">
                    <span class="view"></span>
                </a>
                <a @click="cityVideo" href="javascript:void(0)">
                    <span class="playback"></span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["arrow", "data"],
    data() {
        return{
        }
    },
    watch: {
        data(){
            this.initData();
        }
    },
    methods: {
        close() {
            this.$emit("closeBubble")
        },
        // 城市摄像头
        cityVideo() {
            this.$rhtxApi.lteVideo(this.data.no)
        }
    }
}
</script>

<style lang="less" scoped>
.sxt {
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
        .name{
            margin-top:30px;
            font-size: 16px;
        }
        .address{
            margin-top: 20px;
            font-size: 14px;
            line-height: 21px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .department{
            font-size: 14px;
            line-height: 21px;
        }
        .leixing{
            line-height: 21px;
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
                    background: url("../images/camera/preview1.png");
                }
                .playback {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/camera/playback1.png");
                }
                &:hover {
                    .view {
                        background: url("../images/camera/preview2.png");
                    }
                    .playback {
                        background: url("../images/camera/playback2.png");
                    }
                }
            }
        }
    }
}
</style>