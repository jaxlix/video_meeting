<template>
    <div class="changeMap" :style="styles">
        <div @click="changeMap('gaodeLayer')">
            <img src="./images/ditu1.png" alt />
        </div>
        <div @click="changeMap('gaodeLayerColor')">
            <img src="./images/ditu2.png" alt />
        </div>
        <div @click="changeMap('gaodeLayerDark')">
            <img src="./images/ditu3.png" alt />
        </div>
    </div>
</template>

<script>
export default {
    props: ["styles"],
    methods: {
        // 切换底图
        changeMap(layer) {
            localStorage.setItem("map_layer", layer);
            window.location.reload();
        }
    }
};
</script>

<style lang="less" scope>
.changeMap {
    position: absolute;
    right: 20px;
    bottom: 20px;
    display: flex;
    justify-content: space-between;
    width: 280px;
    div {
        width: 80px;
        height: 60px;
        background-color: #999;
        cursor: pointer;
    }
}
</style>
        