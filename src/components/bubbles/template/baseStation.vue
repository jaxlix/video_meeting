<template>
    <div class="base-station">
        <div @click="close" class="close">&times;</div>
        <div :class="arrow ? arrow : 'arrow-bottom'"></div>
        <div class="msg">
            <img src="../images/baseStation/baseStation.png" alt />
        </div>
        <div class="btns">
            <div class="name">{{data.name?data.name:"[未知]"}}</div>
            <div class="department">武汉市局</div>
            <div class="line contact_350M">基站类型：-</div>
            <div class="line contact_phone">基站状态：-</div>
        </div>
    </div>
</template>

<script>

export default {
    props: ["arrow", "data"],
    methods: {
        close() {
            this.$emit("closeBubble")
        }
    },
}
</script>

<style lang="less" scoped>
.base-station {
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
            margin-left: 20px;
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
            margin-bottom: 20px;
            font-size: 14px;
        }
        .line{
            line-height:22px;
            font-size: 14px;
        }
    }
}
</style>

