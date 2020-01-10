<template>
    <div class="wrj">
        <div @click="close" class="close">&times;</div>
        <div :class="arrow ? arrow : 'arrow-bottom'"></div>
        <div class="msg">
            <img src="../images/uav/ico_UAV_2x.png" alt />
        </div>
        <div class="btns">
            <div class="name">{{data.UAV && data.UAV.name ? data.UAV.name : "无人机"}} {{data.UAV && data.UAV.no ? data.UAV.no : "[未知]"}}</div>
            <div class="department">{{data.department ? data.department : "[部门未知]"}}</div>
            <div class="line speed">运动速度：<span class="speed">{{data.UAV && data.UAV.speed ? data.UAV.speed : "[未知]"}}km/h</span></div>
            <div class="line gps_time">定位时间： {{data.UAV && data.UAV.lastUpdateTime ? $common.dateFormatter(data.UAV.lastUpdateTime):"[未知]"}}</div>
            <div class="caozuo" >
                <a @click="video(data.UAV.no,'TERMINAL_UAV')" href="javascript:void(0)">
                    <span class="view"></span>
                </a>
                <a @click="getVcr(data.UAV.no,'TERMINAL_UAV')" href="javascript:void(0)">
                    <span class="video"></span>
                </a>
                <a @click="getMetting" href="javascript:void(0)">
                    <span class="metting"></span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['arrow', 'data'],
    methods: {
        // 关闭气泡
        close(){
            this.$emit('closeBubble')
        }, 
        // 视频回调
        video(num, type){
            this.$rhtxApi.video(num, type)
        },
        getVcr(num, type){
            this.$rhtxApi.vcr(num, type)
        },
        getMetting() {
            
        }
    }
}
</script>

<style lang="less" scoped>
.wrj{
    position: absolute;
    z-index: 99;
    width: 370px;
    height: 200px;
    background-color: rgba(13, 24, 43, 0.9);
    box-shadow: 4px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.9);
    color: #fff;
    border-radius: 4px;
    .close{  
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
    .arrow-bottom{
        position: absolute;
        bottom: -20px;
        left: 175px;
        border: 10px solid transparent;
        border-top-color: rgba(0, 0, 0, .5);
    }
    .arrow-left{
        position: absolute;
        bottom: 90px;
        left: -20px;
        border: 10px solid transparent;
        border-right-color: rgba(0, 0, 0, .5);
    }
    .msg{
        float: left;
        width: 120px;
        text-align: center;
        img {
            width: 120px;
            height: 116px;
            margin-top: 30px;
            margin-left: 18px;
        }
    }
    .btns{
        margin-left: 0px;
        margin-top: 20px;
        text-align: left;
        .name{
            height: 21px;
            line-height: 21px;
            margin-top:30px;
            font-size: 16px;
        }
        .department{
            font-size: 14px;
            line-height: 21px;
            margin-bottom: 20px;
        }
        .line{
            line-height:22px;
            font-size: 14px;
        }
        .caozuo{
            margin-top: 10px;
            padding-left: 120px;
            height: 34px;
            display: flex;
            align-items: center;
            a{
                margin-right: 20px;
                .view {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/uav/preview1.png");
                }
                .video {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/uav/videotape-1.png");
                }
                .metting {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/uav/metting-add1.png");
                }
                &:hover {
                    .view {
                        background: url("../images/uav/preview2.png");
                    }
                    .video {
                        background: url("../images/uav/videotape-2.png");
                    }
                    .metting {
                        background: url("../images/uav/metting-add2.png");
                    }
                }
            }
        }
        .yellow{
            color: #b69c74;
        }
    }

}
</style>
