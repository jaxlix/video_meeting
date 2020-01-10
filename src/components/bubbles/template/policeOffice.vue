<template>
    <div class="police-station">
        <div @click="close" class="close">&times;</div>
        <div :class="arrow ? arrow : 'arrow-bottom'"></div>
        <div class="msg">
            <img src="../images/policeOffice/policeOffice.png" alt />
        </div>
        <div class="btns">
            <div class="name">{{data.name?data.name:"[未知]"}}</div>
            <div class="department">武汉市局</div>
            <div class="line contact_350M">基地台：<span class="blue" @click="individualCall(data.pdtNo)">{{data.pdtNo ? data.pdtNo : "[未知]"}}<img src="../images/policeOffice/call-type.png" alt=""></span></div>
            <div class="line contact_phone">值班电话：<span class="blue" @click="call(data.phoneNo)">{{data.phoneNo ? data.phoneNo : "[未知]"}}<img src="../images/policeOffice/phone-type.png" alt=""></span></div>
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
        // 个呼 ：警务通、车台、电台
        individualCall(num) {
            this.$rhtxApi.individualCall(num)
        },
        // 打电话
        call(num){
            this.$rhtxApi.phoneCall(num)
        },
        // 切组
        change(num){
           this.$rhtxApi.switchGroup(num)
       }
    },
}
</script>

<style lang="less" scoped>
.police-station {
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
            margin-top: 40px;
            margin-left: 16px;
        }
        .name{
            margin-top: 20px;
        }
    }
    .btns {
        margin-left: 130px;
        margin-top: 30px;
        .name{
            line-height:25px;
            font-size: 16px;
        }
        .department {
            font-size: 14px;
            margin-bottom: 20px;
        }
        .line{
            line-height:22px;
            font-size: 14px;
            display: flex;
            align-items: center;
            img {
                margin-left: 10px;
            }
        }
    }
    .blue{
        color: rgb(0, 255, 255);
        cursor: pointer;
    }
}
</style>

