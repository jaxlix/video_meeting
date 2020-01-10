<template>
    <div class="circle-select">
        <div class="box" @mouseover="show = true" @mouseout="show=false">
            <div class="btn" :class="checked ? 'checked' : ''" @click="end">
                <img v-show="checked=='' || checked=='CIRCLE'" src="./images/circle_checked.png" alt="">
                <img v-show="checked=='RECTANGLE'" src="./images/square_checked.png" alt="">
                <img v-show="checked=='ELLIPSE'" src="./images/oval_checked.png" alt="">
                {{ checked ? types[checked] : '圈选' }}
            </div>
            <div class="box-hide" v-show="show">
                <div class="item" @click="draw('CIRCLE')"><img src="./images/circle.png" alt="">圆</div>
                <div class="item" @click="draw('RECTANGLE')"><img src="./images/square.png" alt="">矩形</div>
                <div class="item" @click="draw('ELLIPSE')"><img src="./images/oval.png" alt="">椭圆</div>
            </div>
        </div>
        <resultList v-show="showList" :data="dataList" @clsoe="close" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import resultList from "./resultList.vue";

export default {
    data () {
        return {
            // dataSource: {}, // 所有设备的数据源
            dataList: [],   // 圈选的数据
            show: false,    // 鼠标悬浮展示
            showList: false, // 展示数据列表
            checked: "",
            types: {
                "CIRCLE": "圆",
                "RECTANGLE": "矩形",
                "ELLIPSE": "椭圆"
            },
            target: null
        }
    },
    props: {
        map: Object
    },
    computed: {
        ...mapGetters({
            dataSource: "dataSource"
        })
    },
    watch: {
        dataSource(data) {
            console.log('数据更新了')
        }
    },
    components: {
        resultList
    },
    methods: {
        // 绘制圆、椭圆、长方形
        draw(type){
            if(this.target){
                this.target.deactivate()
            }
            this.checked = type
            this.target = this.$arcgis.draw(this.map, type, e => {
                this.target = e.target
                let arr = []
                for(let k in this.dataSource){
                    if(this.dataSource[k].show){
                        this.dataSource[k].data.forEach( d => {
                            if(this.$arcgis.isInCircle(e.geometry, d.position.longitude, d.position.latitude)){
                                arr.push(d)
                            }
                        });
                    }
                }
                this.dataList = arr
                console.log(arr)
                this.showList = true
            })
        },
        close(){
            this.showList = false
        },
        // 终止绘图
        end(){
            if(this.checked != ''){
                this.target.deactivate()
                this.target = null
                this.checked = ''
            }
        }
    },
    mounted(){

    }
}
</script>

<style lang="less" scoped>
    .circle-select{
        position: absolute;
        top: 20px;
        right: 300px;
        .box{
            width: 110px;
            font-size: 14px;
            .btn{
                width: 80px;
                height: 30px;
                margin: 0 auto;
                line-height: 30px;
                color: #00F0FF;
                border: 1px solid transparent;
                img{
                    width: 19px;
                    height: 19px;
                    margin-left: 10px;
                }
            }
            .btn.checked{
                border-color: #00F0FF;
                box-shadow: 0 0 8px rgba(0,240,255,.8) inset;
            }
            .box-hide{
                width: 110px;
                margin-top: 15px;
                border: 1px solid #000;
                background-color: rgba(6,9,44,0.7);
                box-shadow: 0 0 8px rgba(0,146,254,.8) inset;
                color: #fff;
                .item{
                    line-height: 40px;
                    cursor: pointer;
                    img{
                        width: 19px;
                        height: 19px;
                        margin-left: 20px;
                        margin-right: 10px;
                    }
                    &:after{
                        content: "";
                        display: block;
                        width: 80%;
                        height: 1px;
                        margin: 0 auto;
                        background: linear-gradient(to right,transparent, #00F0FF, transparent);
                    }
                }
            }
        }
    }
</style>