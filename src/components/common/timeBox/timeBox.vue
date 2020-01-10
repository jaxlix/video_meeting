<template>
    <div id="clock" :style="styles">
        <div class="digits" :class="type">
            <div :class="digitName[h1]">
                <span class="d1"></span>
                <span class="d2"></span>
                <span class="d3"></span>
                <span class="d4"></span>
                <span class="d5"></span>
                <span class="d6"></span>
                <span class="d7"></span>
            </div>
            <div :class="digitName[h2]">
                <span class="d1"></span>
                <span class="d2"></span>
                <span class="d3"></span>
                <span class="d4"></span>
                <span class="d5"></span>
                <span class="d6"></span>
                <span class="d7"></span>
            </div>
            <div class="dots"></div>
            <div :class="digitName[m1]">
                <span class="d1"></span>
                <span class="d2"></span>
                <span class="d3"></span>
                <span class="d4"></span>
                <span class="d5"></span>
                <span class="d6"></span>
                <span class="d7"></span>
            </div>
            <div :class="digitName[m2]">
                <span class="d1"></span>
                <span class="d2"></span>
                <span class="d3"></span>
                <span class="d4"></span>
                <span class="d5"></span>
                <span class="d6"></span>
                <span class="d7"></span>
            </div>
            <div v-if="!timeFormat || timeFormat=='HH:MM:SS'" class="dots"></div>
            <div v-if="!timeFormat || timeFormat=='HH:MM:SS'" :class="digitName[s1]">
                <span class="d1"></span>
                <span class="d2"></span>
                <span class="d3"></span>
                <span class="d4"></span>
                <span class="d5"></span>
                <span class="d6"></span>
                <span class="d7"></span>
            </div>
            <div  v-if="!timeFormat || timeFormat=='HH:MM:SS'" :class="digitName[s2]">
                <span class="d1"></span>
                <span class="d2"></span>
                <span class="d3"></span>
                <span class="d4"></span>
                <span class="d5"></span>
                <span class="d6"></span>
                <span class="d7"></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        "type", // 默认蓝色  white：白色
        "time", // 时间戳
        "timeFormat", // 格式，HH:MM小时分钟; HH:MM:SS小时分钟秒(默认值)
        "styles"    // 自定义样式
    ],
    data() {
        return {
            digitName: [
                "zero",
                "one",
                "two",
                "three",
                "four",
                "five",
                "six",
                "seven",
                "eight",
                "nine"
            ],
            h1: 0,
            h2: 0,
            m1: 0,
            m2: 0,
            s1: 0,
            s2: 0,
            times: ''
        };
    },
    methods: {
        timeAdd(t) {
            let time = new Date(t);
            let hour = time.getHours() + "";
            hour = hour > 9 ? hour : "0" + hour;
            let minute = time.getMinutes() + "";
            minute = minute > 9 ? minute : "0" + minute;
            let second = time.getSeconds() + "";
            second = second > 9 ? second : "0" + second;
            this.h1 = hour[0];
            this.h2 = hour[1];
            this.m1 = minute[0];
            this.m2 = minute[1];
            this.s1 = second[0];
            this.s2 = second[1];
        }
    },
    mounted() {
        if(!this.time){
            this.time2 = new Date().getTime();
        }else{
            this.time2 = this.time
        }
        setInterval(() => {
            this.time2 = this.time2 + 1000;
            this.timeAdd(this.time2);
        }, 1000);
    }
};
</script>

<style lang="less" scope>
#clock {
    width: 225px;
    height: 92px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99999;
    background-size: 100% 100%;
    text-align: center;
    .digits {
        margin-top: 29px;
        div {
            text-align: left;
            position: relative;
            width: 28px;
            height: 41px;
            display: inline-block;
            span {
                opacity: 0;
                position: absolute;
                -webkit-transition: 0.25s;
                -moz-transition: 0.25s;
                transition: 0.25s;
                background-color: #00528a;
                border-color: #00528a;
            }
            span:before,
            span:after {
                content: "";
                position: absolute;
                width: 0;
                height: 0;
                border: 5px solid transparent;
            }
        }
        .d1 {
            height: 5px;
            width: 8px;
            top: 0;
            left: 6px;
        }
        .d1:before {
            border-width: 0 5px 5px 0;
            border-right-color: inherit;
            left: -5px;
        }
        .d1:after {
            border-width: 0 0 5px 5px;
            border-left-color: inherit;
            right: -5px;
        }
        .d2 {
            height: 5px;
            width: 8px;
            top: 14px;
            left: 6px;
        }
        .d2:before {
            border-width: 3px 4px 2px;
            border-right-color: inherit;
            left: -8px;
        }
        .d2:after {
            border-width: 3px 4px 2px;
            border-left-color: inherit;
            right: -8px;
        }

        .d3 {
            height: 5px;
            width: 8px;
            top: 29px;
            left: 6px;
        }
        .d3:before {
            border-width: 5px 5px 0 0;
            border-right-color: inherit;
            left: -5px;
        }
        .d3:after {
            border-width: 5px 0 0 5px;
            border-left-color: inherit;
            right: -5px;
        }

        .d4 {
            width: 5px;
            height: 6.7px;
            top: 5px;
            left: 0;
        }
        .d4:before {
            border-width: 0 5px 5px 0;
            border-bottom-color: inherit;
            top: -5px;
        }
        .d4:after {
            border-width: 0 0 5px 5px;
            border-left-color: inherit;
            bottom: -5px;
        }

        .d5 {
            width: 5px;
            height: 6.7px;
            top: 5px;
            right: 8px;
        }
        .d5:before {
            border-width: 0 0 5px 5px;
            border-bottom-color: inherit;
            top: -5px;
        }
        .d5:after {
            border-width: 5px 0 0 5px;
            border-top-color: inherit;
            bottom: -5px;
        }

        .d6 {
            width: 5px;
            height: 6.7px;
            top: 22px;
            left: 0;
        }
        .d6:before {
            border-width: 0 5px 5px 0;
            border-bottom-color: inherit;
            top: -5px;
        }
        .d6:after {
            border-width: 0 0 5px 5px;
            border-left-color: inherit;
            bottom: -5px;
        }

        .d7 {
            width: 5px;
            height: 6.7px;
            top: 22px;
            right: 8px;
        }
        .d7:before {
            border-width: 0 0 5px 5px;
            border-bottom-color: inherit;
            top: -5px;
        }
        .d7:after {
            border-width: 5px 0 0 5px;
            border-top-color: inherit;
            bottom: -5px;
        }

        /* 1 */

        div.one .d5,
        div.one .d7 {
            opacity: 1;
        }

        /* 2 */

        div.two .d1,
        div.two .d5,
        div.two .d2,
        div.two .d6,
        div.two .d3 {
            opacity: 1;
        }

        /* 3 */

        div.three .d1,
        div.three .d5,
        div.three .d2,
        div.three .d7,
        div.three .d3 {
            opacity: 1;
        }

        /* 4 */

        div.four .d5,
        div.four .d2,
        div.four .d4,
        div.four .d7 {
            opacity: 1;
        }

        /* 5 */

        div.five .d1,
        div.five .d2,
        div.five .d4,
        div.five .d3,
        div.five .d7 {
            opacity: 1;
        }

        /* 6 */

        div.six .d1,
        div.six .d2,
        div.six .d4,
        div.six .d3,
        div.six .d6,
        div.six .d7 {
            opacity: 1;
        }

        /* 7 */

        div.seven .d1,
        div.seven .d5,
        div.seven .d7 {
            opacity: 1;
        }

        /* 8 */

        div.eight .d1,
        div.eight .d2,
        div.eight .d3,
        div.eight .d4,
        div.eight .d5,
        div.eight .d6,
        div.eight .d7 {
            opacity: 1;
        }

        /* 9 */

        div.nine .d1,
        div.nine .d2,
        div.nine .d3,
        div.nine .d4,
        div.nine .d5,
        div.nine .d7 {
            opacity: 1;
        }

        /* 0 */

        div.zero .d1,
        div.zero .d3,
        div.zero .d4,
        div.zero .d5,
        div.zero .d6,
        div.zero .d7 {
            opacity: 1;
        }

        div.dots {
            width: 5px;
        }

        div.dots:before,
        div.dots:after {
            width: 5px;
            height: 5px;
            content: "";
            position: absolute;
            left: -4px;
            top: 6px;
            background-color: #00528a;
        }

        div.dots:after {
            top: 21px;
        }
    }
}
#clock{
    .white {
        div{
            span{
                background-color: #fff;
                border-color: #fff;
            }
        }
        div.dots:before, div.dots:after {
            background-color: #fff;
        }
    }
}
</style>