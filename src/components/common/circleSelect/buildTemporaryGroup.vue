<template>
    <div id="btg">
        <div v-show="dataList.length>0 && !createSelf">
            <div v-for="(d,i) in dataList" :key="i">
                <el-radio v-model="radio" :label="d.no" @change="check">{{d.name}}</el-radio>
            </div>
            <div class="btns">
                <el-button type="primary" @click="create">创建临时组</el-button>
            </div>
        </div>
        <div v-show="dataList.length==0 || createSelf">
            <el-form :model="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="form.tempGroupName" placeholder="临时组名称"></el-input>
                </el-form-item>
                <el-form-item label="存活时间">
                    <el-time-picker v-model="form.holdTime" placeholder="选择时间"></el-time-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即创建</el-button>
                    <el-button @click="$emit('close')">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            radio: "",
            form: {
                tempGroupName: "",
                holdTime: new Date(2019, 12, 21, 23, 59, 59)
            },
            createSelf: false
        };
    },
    props: {
        dataList: {
            type: Array,
            default: []
        },
        terminalList: {
            type: Array,
            default: []
        }
    },
    created(){
        this.$get("http://127.0.0.1:8099/config/getMemberNo").then( res => {
            this.form.tempGroupName = "临时组"+(this.dataList.length+1)+"-"+String(res.memberNo).substring(4)
        })
    },
    methods: {
        onSubmit(){
            let memberList = ""
            let uniqueNoList = ""
            this.terminalList.forEach( d => {
                memberList += d.no+","
                uniqueNoList += d.uniqueNo+","
            })
            // let params = {
            //     tempGroupName: this.form.tempGroupName,    // 临时组名称
            //     memberList: memberList,     // 邀请的成员列表
            //     uniqueNoList: uniqueNoList, // 邀请的成员uniqueNo列表
            //     code: "",                   //授权码 PC自己不需要
            //     holdTime: this.timeFormatter(this.form.holdTime),         //存活时间
            //     isLock: false,              //是否锁定
            //     forceSwitchGroup: false,    //是否自动切组
            //     lockTime: 0,                //锁定时间
            //     isLocalPc: true,            //是否本地PC请求
            //     isScan: false               //是否扫描
            // }
            let params = new URLSearchParams()
            params.append("tempGroupName", this.form.tempGroupName)
            params.append("memberList", memberList)
            params.append("uniqueNoList", uniqueNoList)
            params.append("code", "")
            params.append("holdTime", this.timeFormatter(this.form.holdTime))
            params.append("isLock", false)
            params.append("forceSwitchGroup", false)
            params.append("lockTime", 0)
            params.append("isLocalPc", true)
            params.append("isScan", false)
            this.$post("http://127.0.0.1:8099/tempGroup", params).then( res => {
                if(res){
                    this.$message({
                        message: "创建成功！",
                        type: "success"
                    })
                    this.$emit("close")
                }
            })
        },
        timeFormatter(time){
            let t = new Date(time)
            return t.getHours()*3600+t.getMinutes()*60+t.getSeconds()
        },
        check(val){
            this.$confirm('将设备添加到'+val+"?", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.add(val)
            }).catch(()=>{
                this.$emit("close")
            })
        },
        add(tempGroupNoStr){
            let uniqueNoList = ""
            this.terminalList.forEach( d => {
                uniqueNoList += d.uniqueNo+","
            })
            let params = new URLSearchParams()
            params.append("tempGroupNoStr", tempGroupNoStr)
            params.append("uniqueNoList", uniqueNoList)
            this.$post("http://127.0.0.1:8099/addMemberToTempGroup", params).then( res => {
                if(res){
                    this.radio = tempGroupNoStr
                    this.$message({
                        message: "创建成功！",
                        type: "success"
                    })
                    this.$emit("close")
                }
            })
        },
        create(){
            this.createSelf = true
        }
    },
    mounted() {
        console.log(this.dataList);
    }
};
</script>

<style lang="less" scoped>
    #btg{
        .btns{
            margin-top: 20px;
            text-align: center;
        }
    }
</style>