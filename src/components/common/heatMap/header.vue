<template>
    <div id="heatMap-header">
        <div class="title">勤备热力图</div>
        <img class="home" @click="back" src="./images/icon_home.png" alt="">
    </div>
</template>

<script>
export default {
    methods: {
        back(){
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="less" scope>
    #heatMap-header{
        position: absolute;
        left: 0;
        top: -2px;
        width: 100%;
        height: 80px;
        text-align: center;
        color: #fff;
        z-index: 1;
        background: url("./images/bg_header.png") center center no-repeat;
        background-size: 100% 100%;
        .title{
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: center;
            font-size: 29px;
            font-weight: bold;
            background: linear-gradient(#fff, #00F6FF);
            background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
        }
        .home{
            position: absolute;
            left: 20px;
            top: 10px;
            width: 40px;
            cursor: pointer;
        }
    }
</style>