<template>
    <div id="cqbb">
        <div class="title">
            <img src="./images/policeman.png" alt="">
            <span>出勤标兵</span>
        </div>
        <div class="msg">
            <div>张明亮  678544</div>
            <div>武铁公安处</div>
            <div>本月累计出勤(小时)： <span class="num">156</span></div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    }
}
</script>

<style lang="less" scoped>
    #cqbb{
        box-sizing: border-box;
        position: absolute;
        left: 20px;
        top: 369px;
        width: 270px;
        padding: 20px 10px;
        background-color: rgba( 0, 89, 152, .85);
        z-index: 1;
        color: #fff;
        background: url("./images/bg3.png") center center no-repeat;
        background-size: 100% 100%;
        .title{
            text-align: center;
            &:after{
                content: "";
                display: block;
                height: 1px;
                background: linear-gradient(to right, transparent , #00FFFF, transparent);
            }
            img{
                width: 30px;
            }
            span{
                background: linear-gradient(#fff, #00F6FF);
                color: transparent;
                background-clip: text;
            }
        }
        .msg{
            margin-left: 20px;
            div{
                height: 30px;
                line-height: 30px;
                .num{
                    color: #08F6FF;
                }
            }
        }
    }
</style>