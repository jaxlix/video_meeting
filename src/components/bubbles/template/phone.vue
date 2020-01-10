<template>
    <div class="jingwutong">
        <div @click="close" class="close">&times;</div>
        <div :class="arrow ? arrow : 'arrow-bottom'"></div>
        <div class="msg">
            <img src="../images/phone/jwt.png" alt />
        </div>
        <div class="btns">
            <div class="name">{{data.name?data.name:"警务通"}} {{data.no?String(data.no).replace(/^8[8|7]/, ''):"[未知]"}}</div>
            <div class="department">{{data.department?data.department:"[部门未知]"}}</div>
            <div class="phone_no">移动号码：<span class="blue" @click="call((data && data.account)?data.phoneNo:0)">{{data && data.account && data.phoneNo?data.phoneNo:"[未知]"}}</span></div>
            <div class="working_status">执勤状态：{{data.workingStatus?data.workingStatus:"[未知]"}}</div>
            <div class="gps_time">定位时间：{{data.position && data.position.lastUpdateTime ?$common.dateFormatter(data.position.lastUpdateTime):'[未知]'}}</div>
            <div class="caozuo">
                <a @click="individualCall" href="javascript:void(0)">
                    <span class="call"></span>
                </a>
                <a @click="sendMsgHasPanel" href="javascript:void(0)">
                    <span class="conversation"></span>
                </a>
                <a @click="getVideo" href="javascript:void(0)">
                    <span class="video"></span>
                </a>
                <a @click="historyVideo" href="javascript:void(0)">
                    <span class="historyVideo"></span>
                </a>
                
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            account: '',
            name: ''
        }
    },
    props: ["arrow", "data"],
    watch: {
        data(d){
            console.log(d)
            this.data.account = d.account
            this.data.name = d.name
            this.data.no = this.data.no
        }
    },
    methods: {
        close() {
            this.$emit('closeBubble')
        },
        // 个呼 ：警务通、手台、车台、电台
        individualCall() {
            this.$rhtxApi.individualCall(this.data.no, this.data.name)
        },
        getVideo(){
            this.$rhtxApi.video(this.data.no, "TERMINAL_PHONE", this.data.name)
        },
        sendMsgHasPanel(){
            this.$rhtxApi.sendMsgHasPanel(this.data.no, this.data.no)
        },
        historyVideo(){
            this.$rhtxApi.historyVideo(this.data.no)
        },
        getVcr(){
            this.$rhtxApi.vcr(this.data.no, "TERMINAL_PHONE")
        },
        // 打电话
        call(num){
            this.$rhtxApi.phoneCall(num)
        }
    },
    mounted() {
        if(this.data && this.data.account){
            // this.data.account = d.account
            // this.data.name = d.name
            // this.data.no = this.data.no
        }
    },
}
</script>

<style lang="less" scoped>
.jingwutong {
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
        border-top-color: rgba(13, 24, 43, 0.7);
    }
    .arrow-left {
        position: absolute;
        bottom: 90px;
        left: -20px;
        border: 10px solid transparent;
        border-right-color: rgba(13, 24, 43, 0.7);
    }
    .msg {
        float: left;
        width: 120px;
        text-align: center;
        img {
            width: 120px;
            height: 116px;
            margin-top: 40px;
            margin-left: 35px;
        }
    }
    .btns {
        margin-left: 0px;
        margin-top: 10px;
        text-align: left;
        .name{
            height: 21px;
            line-height: 22px;
            margin-top:20px;
            font-size: 16px;
        }
        .department{
            font-size: 14px;
            line-height: 21px;
        }
        .phone_no{            
            margin-top: 10px;
            line-height: 22px;
            font-size: 14px;
        }
        .working_status{
            line-height: 22px;
            font-size: 14px;
        }
        .gps_time{
            line-height: 22px;
            font-size: 14px;
        }
        .caozuo{
            margin-top: 10px;
            margin-left: 120px;
            display: flex;
            align-items: center;
            height: 34px;
            a{
                margin-right: 20px;
                .call {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/phone/call1.png");
                }
                .conversation {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/phone/Conversation1.png");
                }
                .video {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/phone/video1.png");
                }
                .historyVideo {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/phone/videotape-1.png");
                }
                &:hover {
                    .call {
                        background: url("../images/phone/call2.png");
                    }
                    .conversation {
                        background: url("../images/phone/Conversation2.png");
                    }
                    .video {
                        background: url("../images/phone/video2.png");
                    }
                    .historyVideo {
                        background: url("../images/phone/videotape-2.png");
                    }
                }
            }
        }
        .yellow{
            color: #b69c74;
        }
    }
    .blue{
        color: rgb(0, 255, 255);
        cursor: pointer;
    }
}
</style>

