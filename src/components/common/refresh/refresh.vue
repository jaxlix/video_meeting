<template>
    <div class="refresh" :style="styles" @click="refresh">
        <img src="./refresh.png" alt />
    </div>
</template>

<script>
export default {
    props: ["styles"],
    methods: {
        refresh() {
            // 刷新整个页面
            window.location.reload();
        }
    }
}
</script>

<style lang="less" scope>
    .refresh {
        position: absolute;
        right: 326px;
        bottom: 20px;
        cursor: pointer;
    }
</style>