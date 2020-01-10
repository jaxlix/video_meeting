<template>
    <div id="ysx">
        <div class="ysx-header">
            <span>我的云视讯</span>
            <a class="ysx-close" href="javascript:void(0)" @click="$emit('close')">—</a>
        </div>
        <div class="ysx-nav">
            <span>VSXIN的云视讯</span>
            <a class="ysx-hangup" href="javascript:void(0)"></a>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        
    }
}
</script>
<style lang="less" scoped>
    #ysx{
        position: fixed;
        top: 200px;
        right: 380px;
        width: 260px;
        color: #fff;
        .ysx-header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 36px;
            padding: 0 10px;
            background-color: rgba(13,24,43,.7);
            .ysx-close{
                color: #fff;
            }
        }
        .ysx-nav{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 36px;
            padding: 0 10px;
            background-color: rgb(13,24,43);
            .ysx-hangup{
                width: 49px;
                height: 19px;
                background: url("./images/handup.png") center center no-repeat;
            }
        }
    }
</style>