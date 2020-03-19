<template>
    <div>
        <tree @checkedData="checkedData" @close="close" />
    </div>
</template>

<script>
import tree from "@/components/common/tree/tree"
export default {
    components: {
        tree
    },
    methods: {
        checkedData(d){
            this.$emit("checkedData", d)
        },
        close(){
            this.$emit("close")
        }
    }
}
</script>