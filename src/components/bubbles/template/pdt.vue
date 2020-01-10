<template>
    <div class="shoutai">
        <div @click="close" class="close">&times;</div>
        <div :class="arrow ? arrow : 'arrow-bottom'"></div>
        <div class="msg">
            <img src="../images/pdt/hand-bg.png" alt />
        </div>
        <div class="btns">
            <div class="name">{{data.name?data.name:"350M手台"}} {{data.no?data.no:""}}</div>
            <div class="department">{{data && data.deptOuter ? data.deptOuter.deptName:"[部门未知]"}}</div>
            <div class="working_status">设备类型：{{data.type ? data.type : '[未知]'}}</div>
            <div class="speed">移动速度：<span class="yellow">{{data.speed ? data.speed : '[未知]'}}</span>km/h</div>
            <div class="gps_time">定位时间：{{data.position && data.position.lastUpdateTime ? $common.dateFormatter(data.position.lastUpdateTime) : "[未知]"}}</div>
            <div class="caozuo">
                <a @click="individualCall" href="javascript:void(0)">
                    <span class="call"></span>
                </a>
                <a @click="sendMessage" href="javascript:void(0)">
                    <span class="conversation"></span>
                </a>
                <router-link :to="'/trajectory/'+data.no+'/TERMINAL_PDT'">
                    <span class="trajectory"></span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            st: '',
            no: '',
            name:''
        }
    },
    props: ["arrow", "data"],
    watch: {
        data(d){
            this.st = d.dt
            this.name = d.name
            this.no = d.no
        }
    },
    methods: {
        close() {
            this.$emit('closeBubble')
        },
        // 个呼 ：警务通、手台、车台、电台
        individualCall() {
            this.$rhtxApi.individualCall(this.data.no, this.data.no)
        },
        getVideo(){
            this.$rhtxApi.video("7202"+this.st)
        },
        sendMessage(){
            this.$rhtxApi.sendMsgHasPanel(this.no, this.name)
        }
    }
}
</script>

<style lang="less" scoped>
.shoutai {
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
        border-top-color: rgba(0, 0, 0, 0.5);
    }
    .msg {
        float: left;
        width: 120px;
        text-align: center;
        img {
            width: 120px;
            height: 116px;
            margin-top: 30px;
            margin-left: 31px;
        }
    }
    .btns {
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
        }
        .working_status{
            margin-top: 10px;
            line-height: 21px;
            font-size: 14px;
        }
        .speed {
            line-height: 21px;
            font-size: 14px;
            .yellow {
                color: #FFCA7A;
            }
        }
        .gps_time{
            line-height: 21px;
            font-size: 14px;
        }
        .caozuo{
            margin-top: 10px;
            padding-left: 120px;
            display: flex;
            height: 34px;
            align-items: center;
            a{
                margin-right: 20px;
                .call {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/pdt/call1.png");
                }
                .conversation {
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/pdt/Conversation1.png");
                }
                .trajectory{
                    display: block;
                    width: 34px;
                    height: 34px;
                    background: url("../images/trace.png");
                }
                &:hover {
                    .call {
                        background: url("../images/pdt/call2.png");
                    }
                    .conversation {
                        background: url("../images/pdt/Conversation2.png");
                    }
                    .trajectory{
                        background: url("../images/trace_hover.png");
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

