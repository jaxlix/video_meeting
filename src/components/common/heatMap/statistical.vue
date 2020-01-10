<template>
    <div id="statistical">
        <div class="item" v-for="(d, i) in data" :key="i">
            {{d.name}}:
            <span class="num">{{d.value}}</span>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            data: [
                {
                    name: "上班",
                    value: 255
                },
                {
                    name: "下班",
                    value: 255
                },
                {
                    name: "出警",
                    value: 255
                },
                {
                    name: "出乘",
                    value: 255
                },
                {
                    name: "退乘",
                    value: 255
                },
                {
                    name: "巡逻",
                    value: 255
                }
            ]
        }
    }
}
</script>

<style lang="less" scoped>
    #statistical{
        box-sizing: border-box;
        position: absolute;
        left: 20px;
        top: 100px;
        width: 270px;
        padding: 20px 10px;
        background-color: rgba( 0, 89, 152, .85);
        z-index: 1;
        background: url("./images/bg2.png") center center no-repeat;
        background-size: 100% 100%;
        .item{
            margin-left: 20px;
            height: 36px;
            line-height: 36px;
            color: #fff;
            .num{
                margin-left: 20px;
                color: #08F6FF;
            }
        }
    }
</style>