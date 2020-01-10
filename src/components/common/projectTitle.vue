<template>
    <div v-show="show=='show'" class="speed">
        <div class="title-box">
            <div class="title">{{title}}</div>
            <img class="title_icon" src="@/assets/icon/title_logo_white.png" />
            <img src="@/assets/icon/title_bg.png" style="width: 360px" alt />
        </div>
    </div>
</template>

<script>
import projectConfig from "@/json/projectConfig.json";

export default {
    data() {
        return {
            title: "",
            show: "show"
        };
    },
    components: {
        projectConfig
    },
    methods: {
        mousedown() {
            this.show = "";
        },
        mouseover() {
            this.show = "show";
        }
    },
    mounted() {
        this.title = projectConfig.projectTitle;
    }
};
</script>

<style lang="less" scoped>
.speed {
    position: absolute;
    left: 2px;
    top: 2px;
    z-index: 1000;
    .title-box {
        position: center;
        height: 40px;
        .title {
            cursor: default;
            left: 40px;
            height: 25px;
            line-height: 25px;
            padding: 20px;
            background: none;
            position: fixed;
            text-align: center;
            color: #fff;
            font-size: 25px;
        }
        .title::-webkit-input-placeholder {
            /* WebKit browsers */
            color: #ddd;
        }
        .title_icon {
            width: 30px;
            top: 15px;
            left: 15px;
            position: absolute;
        }
        .img {
            position: absolute;
            right: 90%;
            top: 12px;
            width: 16px;
            height: 16px;
        }
    }
    .title-box:hover {
        .title {
            color: rgba(255, 255, 255, 1);
        }
    }
    .content {
        position: absolute;
        /*bottom: 40px;*/
        width: 280px;
        .item {
            position: relative;
            height: 40px;
            line-height: 40px;
            color: #fff;
            img {
                margin-left: 10px;
                margin-right: 10px;
            }
            .item-ul {
                position: absolute;
                right: 140px;
                /*bottom: 140px;*/
                li {
                    position: relative;
                    width: 140px;
                    height: 40px;
                    line-height: 40px;
                    color: #fff;
                    background-color: rgba(0, 0, 0, 0.8);
                    text-align: center;
                }
                li:hover {
                    box-shadow: 0 0 20px rgba(0, 186, 255, 0.8) inset;
                    color: #2ec6ff;
                }
            }
        }
        .item:hover {
            box-shadow: 0 0 20px rgba(0, 186, 255, 0.8) inset;
            color: #2ec6ff;
        }
    }
}
</style>

