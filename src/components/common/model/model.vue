<template>
    <div id="model">
        <div class="box">
            <div class="title">
                <span>结束/离开会商</span>
                <a class="close" @click="close" href="javascript:void(0)"></a>
            </div>
            <div class="item">
                <a class="check" :class="checked == 1 ? 'checked' : ''" @click="check(1)" href="javascript:void(0)"></a>
                <div>
                    <p class="label">离开会商</p>
                    <p class="ms">会商将继续进行。</p>
                </div>
            </div>
            <div class="item">
                <a class="check" :class="checked == 2 ? 'checked' : ''" @click="check(2)" href="javascript:void(0)"></a>
                <div>
                    <p class="label-red">结束会商</p>
                    <p class="ms">会商将中断，其他人无法继续会商。</p>
                </div>
            </div>
            <div class="btns">
                <button @click="close">取消</button>
                <button @click="comit" >确定</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                checked: 1
            }
        },
        methods: {
            check(t){
                this.checked = t
            },
            comit(){
                this.$emit("stopType", this.checked)
            },
            close(){
                this.$emit("close")
            }
        }
    }
</script>

<style lang="less" scoped>
    #model{
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99999999999;
        background-color: rgba(0, 0, 0, .3);
        .box{
            width: 300px;
            background-color: #fff;
            .title{
                display: flex;
                justify-content: space-between;
                padding: 10px 10px 10px 20px;
                margin-bottom: 10px;
                font-size: 14px;
                .close{
                    width: 14px;
                    height: 14px;
                    background: url(./images/icon_close.png) center center no-repeat;
                    background-size: 100% 100%;
                }
            }
            .item{
                display: flex;
                padding: 10px 10px 0 20px;
                .check{
                    width: 16px;
                    height: 16px;
                    margin-right: 10px;
                    margin-top: 3px;
                    background: url(./images/icon_check.png) center center no-repeat;
                    background-size: 100% 100%;
                    &.checked{
                        background: url(./images/icon_checked.png) center center no-repeat;
                        background-size: 100% 100%;
                    }
                }
                .label{
                    font-size: 16px;
                    color: #000;
                }
                .label-red{
                    font-size: 16px;
                    color: #ff0000;
                }
                .ms{
                    font-size: 13px;
                    color: #a0a0a0;
                }
            }
            .btns{
                margin-top: 20px;
                margin-bottom: 20px;
                text-align: center;
                button{
                    width: 70px;
                    height: 24px;
                    margin-right: 20px;
                    background-color: #BEC7D6;
                    color: #fff;
                    text-align: center;
                    line-height: 24px;
                    border: 0;
                    font-size: 12px;
                    cursor: pointer;
                    &:last-child{
                        background-color: #3F83F9;
                    }
                }
            }
        }
    }
</style>