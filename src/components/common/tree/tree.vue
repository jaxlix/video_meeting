<template>
    <div id="tree">
        <div class="tree-content">
            <div class="tree-tree">
                <div class="tree-nav">
                    <a
                        href="javascript:void(0)"
                        :class="nav == 'TERMINAL_PC' ? 'this' : ''"
                        @click="nav = 'TERMINAL_PC'"
                    >PC</a>
                    <a
                        href="javascript:void(0)"
                        :class="nav == 'TERMINAL_PHONE' ? 'this' : ''"
                        @click="nav = 'TERMINAL_PHONE'"
                    >警务通</a>
                </div>
                <div class="tree-search">
                    <input type="text" class="inp" v-model="kw" @keyup.enter="search" />
                    <a href="javascript:void(0)" class="el-icon-search" @click="search"></a>
                </div>
                <div class="search" v-show="searchData.length>0 || kw!=''">
                    <div v-for="(d,i) in searchData" :key="i" class="search-item" @click="checkSearch(d)">
                        <i :class="'icon-'+nav"></i>
                        <span>{{d.name}}</span>
                        <span>{{d.no}}</span>
                    </div>
                </div>
                <div class="treeBox" v-show="searchData.length==0 && kw==''">
                    <el-tree
                        node-key="id"
                        ref="zTree"
                        lazy
                        show-checkbox
                        highlight-current
                        :props="defaultProps"
                        :load="loadMore"
                        :default-expanded-keys="defaultExpendedKeys"
                        @node-click="nodeClick"
                        @check="checkChange"
                    >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <i :class="getIcon(data, node)"></i>
                            <span>{{ data.name }}</span>
                        </span>
                    </el-tree>
                </div>
                <div class="phone">
                    <input type="text" class="phone-inp" v-model="phone" />
                    <button class="phone-btn" @click="addPhone">添加电话</button>
                </div>
            </div>
            <div class="tree-checked">
                <p class="title">已选中({{checked.length}})</p>
                <div class="list">
                    <div class="item" v-for=" (item, key) in checked" :key="key">
                        <div>
                            <i :class="'icon-'+item.type"></i>
                            <span class="name">{{ item.name }}</span>
                            <span class="no">{{ item.no ? item.no : "" }}</span>
                        </div>
                        <i class="el-icon-error" @click="del(item.id)"></i>
                    </div>
                </div>
                <div class="btns">
                    <button class="qx" @click="cancel">取消</button>
                    <button class="qd" @click="commit">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            baseData: [
                {
                    id: 1,
                    name: "顶级部门",
                    children: []
                }
            ],
            defaultProps: {
                children: "children",
                label: "name",
                isLeaf: "leaf"
            },
            defaultExpendedKeys: [1], // 默认展开的id数组
            nav: "TERMINAL_PC",
            phone: "",
            kw: '',
            searchData: [],
            checked: [], // 选中项
            checkedPc: [],
            checkedPhone: [],
            serrchChecked:[]
        };
    },
    watch: {
        // 切换类型时重新加载树形菜单
        nav(val) {
            this.search()
            let p = {
                type: "PC_CONTACTS_DEVICE_DATA",
                id: this.defaultExpendedKeys[0],
                terminalMemberTypes: val
            };
            this.$get(this.$api.getDeptData, p).then(res => {
                let deptList = res.allMember.deptList;
                let dataList = res.allMember.accountDtos;
                dataList = dataList.map(g => {
                    g.type = this.nav;
                    g.leaf = true;
                    return g;
                });
                this.$refs.zTree.updateKeyChildren(1, deptList.concat(dataList));
                if(this.nav == "TERMINAL_PC"){
                    this.$refs.zTree.setCheckedNodes(this.checkedPc);
                }else if(this.nav == "TERMINAL_PHONE"){
                    this.$refs.zTree.setCheckedNodes(this.checkedPhone);
                }
            });
        }
    },
    methods: {
        // 加载更多节点
        loadMore(node, resolve) {
            if (node.level == 0) {
                resolve(this.baseData);
                return false;
            } else {
                let p = {
                    type: "PC_CONTACTS_DEVICE_DATA",
                    id: node.data.id,
                    terminalMemberTypes: this.nav
                };
                this.$get(this.$api.getDeptData, p).then(res => {
                    let deptList = res.allMember.deptList;
                    let dataList = res.allMember.accountDtos;
                    dataList = dataList.map(g => {
                        g.type = this.nav;
                        g.leaf = true;
                        return g;
                    });
                    resolve(deptList.concat(dataList));
                    let arr = [];
                    this.$refs.zTree.getCheckedNodes(true).forEach(d => {
                        if (d.leaf) {
                            arr.push(d);
                        }
                    });
                    if(this.nav == "TERMINAL_PC"){
                        this.checkedPc = arr
                    }else if(this.nav == "TERMINAL_PHONE"){
                        this.checkedPhone = arr
                    }
                    this.checked = this.checkedPc.concat(this.checkedPhone).concat(this.serrchChecked);
                });
            }
        },
        // 节点点击
        nodeClick(item) {
            this.$emit("nodeClick", item);
        },
        // check 变化
        checkChange(node) {
            if(!node.leaf){
                this.defaultExpendedKeys.push(node.id)
            }
            let arr = [];
            this.$refs.zTree.getCheckedNodes(true).forEach(d => {
                if (d.leaf) {
                    arr.push(d);
                }
            });
            if(this.nav == "TERMINAL_PC"){
                this.checkedPc = arr
            }else if(this.nav == "TERMINAL_PHONE"){
                this.checkedPhone = arr
            }
            this.checked = this.checkedPc.concat(this.checkedPhone).concat(this.serrchChecked);
        },
        // 确定提交
        commit() {
            let data = []
            this.checked.forEach( d => {
                if(d.members.length > 0){
                    let obj = {
                        deptId: d.deptId ? d.deptId : d.department.id,
                        deptName: d.deptName ? d.deptName : d.department ? d.department.name : '',
                        name: d.name,
                        no: d.no,
                        phone: d.phone ? d.phone : d.phoneNumber ? d.phoneNumber : '',
                        status: '',
                        type: '',
                        uniqueNo: ''
                    }
                    const element = d.members[0];
                    if(element.terminalMemberStatus == "OFFLINE"){
                        obj.status = 0
                    }else if(element.terminalMemberStatus == "ONLINE"){
                        obj.status = 1
                    }else{
                        obj.status = element.status
                    }
                    obj.type = element.type || element.terminalMemberType || ''
                    obj.uniqueNo = element.uniqueNo || ''
                    data.push(obj)
                }
            })
            this.$emit("checkedData", data);
        },
        // 取消
        cancel() {
            this.$emit("close");
        },
        // 设置icon class
        getIcon(data, node) {
            if (data.type) {
                return "icon-" + data.type;
            } else {
                if (node.expanded) {
                    return "icon-open-floder";
                } else {
                    return "icon-close-floder";
                }
            }
        },
        // 添加电话
        addPhone() {
            if (this.phone != "" && this.phone != null) {
                this.checked.push({
                    id: Math.random(),
                    type: "TERMINAL_PHONE",
                    name: this.phone,
                    no: ""
                });
            }
        },
        // 删除
        del(id) {
            this.checked.forEach((d, i) => {
                if (d.id == id) {
                    this.checked.splice(i, 1);
                }
            });
            this.$refs.zTree.setCheckedNodes(this.checked);
        },
        // 搜索
        search(){
            if(this.kw == ""){
                this.searchData = []
                return
            }
            let p = {
                page: 0,
                pageSize: 100,
                memberStr: this.kw,
                isAll: true,
                id: 1,
                terminalMemberTypes: this.nav
            }
            this.$get(this.$api.searchDeptData, p).then( res => {
                if(res.content.length > 0){
                    this.searchData = res.content
                }else{
                    this.searchData = []
                    this.$message({
                        message: "暂无数据",
                        type: "warning"
                    })
                }
            })
        },
        // 选中搜索项
        checkSearch(d){
            d.type = this.nav
            for (let index = 0; index < this.checked.length; index++) {
                const element = this.checked[index];
                if(element.members[0].uniqueNo == d.members[0].uniqueNo){
                    return
                }
            }
            this.checked.push(d);
            this.serrchChecked = this.checked;
        }
    }
};
</script>

<style lang="less" scope>
#tree {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .tree-content {
        display: flex;
        width: 700px;
        padding: 0 20px 20px 20px;
        .tree-tree {
            width: 400px;
            height: 420px;
            padding-right: 10px;
            overflow: hidden;
            border-right: 1px solid #f5f5f5;
            .tree-nav {
                margin-bottom: 10px;
                a {
                    padding: 10px;
                    color: #fff;
                    font-size: 15px;
                }
                .this {
                    color: #15c8ff;
                }
            }
            .tree-search {
                position: relative;
                margin-bottom: 10px;
                margin-right: 30px;
                .inp {
                    box-sizing: border-box;
                    width: 100%;
                    height: 26px;
                    padding-left: 20px;
                    padding-right: 40px;
                    line-height: 26px;
                    border-radius: 13px;
                    border: 1px solid #a9efff;
                }
                .el-icon-search {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 40px;
                    height: 26px;
                    text-align: center;
                    line-height: 26px;
                    font-size: 16px;
                }
            }
            .search{
                flex: 1;
                height: 310px;
                overflow-x: hidden;
                overflow-y: auto;
                .search-item{
                    height: 36px;
                    line-height: 36px;
                    cursor: pointer;
                    &:hover{
                        background: linear-gradient(
                            to bottom,
                            rgba(58, 154, 236, 0.5) 0%,
                            rgba(58, 154, 236, 0) 30%,
                            rgba(58, 154, 236, 0) 70%,
                            rgba(58, 154, 236, 0.5) 100%
                        );
                    }
                    span{
                        margin-left: 10px;
                    }
                    // pc
                    .icon-TERMINAL_PC {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(./images/0.png);
                        background-size: 100% 100%;
                    }
                    // 警务通
                    .icon-TERMINAL_PHONE {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(./images/3.png);
                        background-size: 100% 100%;
                    }
                }
            }
            .treeBox {
                flex: 1;
                height: 310px;
                overflow-x: hidden;
                overflow-y: auto;
                // 部门和组的折叠图标
                .icon-close-floder {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/icon_folder_close.png);
                    background-size: 100% 100%;
                }
                // 部门和组的打开折叠图标
                .icon-open-floder {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/icon_folder_open.png);
                    background-size: 100% 100%;
                }
                // pc
                .icon-TERMINAL_PC {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/0.png);
                    background-size: 100% 100%;
                }
                .icon-TERMINAL_PC-OFFLINE {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/0_1.png);
                    background-size: 100% 100%;
                }
                // 警务通
                .icon-TERMINAL_PHONE {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/3.png);
                    background-size: 100% 100%;
                }
                .icon-TERMINAL_PHONE-OFFLINE {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/3_1.png);
                    background-size: 100% 100%;
                }
                // 民警图标
                .icon-policeman {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/1.png);
                    background-size: 100% 100%;
                }
                // PDT设备图标
                .icon-TERMINAL_PDT {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/2.png);
                    background-size: 100% 100%;
                }
                .icon-TERMINAL_PDT-OFFLINE {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/2_1.png);
                    background-size: 100% 100%;
                }
                // 执法仪
                .icon-TERMINAL_BODY_WORN_CAMERA {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/4.png);
                    background-size: 100% 100%;
                }
                // 警车
                .icon-TERMINAL_CAR {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/5.png);
                    background-size: 100% 100%;
                }
                // 布控球
                .icon-TERMINAL_EQUIPMENT {
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(./images/6.png);
                    background-size: 100% 100%;
                }
                // 树子组件字颜色
                .nodeLabel {
                    span.label {
                        color: #a3f3ff;
                    }
                }
                .operate {
                    position: fixed;
                    z-index: 2;
                    height: 32px;
                    background: rgba(6, 9, 44, 1);
                    padding: 0 15px;
                    display: flex;
                    align-items: center;
                    span {
                        display: block;
                        cursor: pointer;
                        margin-right: 15px;
                        &:last-child {
                            margin-right: 0;
                        }
                    }
                    .switchGroup {
                        width: 28px;
                        height: 28px;
                        background: url(./images/call_1.png);
                        background-size: 100% 100%;
                        &:hover {
                            background: url(./images/call_2.png);
                            background-size: 100% 100%;
                        }
                    }
                    .call {
                        width: 28px;
                        height: 28px;
                        background: url(./images/call_1.png);
                        background-size: 100% 100%;
                        &:hover {
                            background: url(./images/call_2.png);
                            background-size: 100% 100%;
                        }
                    }
                    .message {
                        width: 28px;
                        height: 28px;
                        background: url(./images/conversation_1.png);
                        background-size: 100% 100%;
                        &:hover {
                            background: url(./images/conversation_2.png);
                            background-size: 100% 100%;
                        }
                    }
                    .receiveVideo {
                        width: 28px;
                        height: 28px;
                        background: url(./images/lte_preview1.png);
                        background-size: 100% 100%;
                        &:hover {
                            background: url(./images/lte_preview2.png);
                            background-size: 100% 100%;
                        }
                    }
                    .reviewVideo {
                        width: 28px;
                        height: 28px;
                        background: url(./images/videotape-1.png);
                        background-size: 100% 100%;
                        &:hover {
                            background: url(./images/videotape-2.png);
                            background-size: 100% 100%;
                        }
                    }
                    .playTrack {
                        width: 28px;
                        height: 28px;
                        background: url(./images/track1.png);
                        background-size: 100% 100%;
                        &:hover {
                            background: url(./images/track2.png);
                            background-size: 100% 100%;
                        }
                    }
                    .tempGroup {
                        width: 28px;
                        height: 28px;
                        background: url(./images/metting-add_1.png);
                        background-size: 100% 100%;
                        &:hover {
                            background: url(./images/metting-add_2.png);
                            background-size: 100% 100%;
                        }
                    }
                }
                /deep/ .el-tree {
                    background: transparent;
                    color: #fff;
                }
                /deep/ .el-tree-node:focus > .el-tree-node__content {
                    background: transparent;
                }
                /deep/ .el-tree-node__content {
                    background: transparent;
                    &:hover {
                        background: linear-gradient(
                            to bottom,
                            rgba(58, 154, 236, 0.5) 0%,
                            rgba(58, 154, 236, 0) 30%,
                            rgba(58, 154, 236, 0) 70%,
                            rgba(58, 154, 236, 0.5) 100%
                        );
                    }
                    &:focus {
                        background: linear-gradient(
                            to bottom,
                            rgba(58, 154, 236, 0.5) 0%,
                            rgba(58, 154, 236, 0) 30%,
                            rgba(58, 154, 236, 0) 70%,
                            rgba(58, 154, 236, 0.5) 100%
                        );
                    }
                }
                /deep/
                    .el-tree--highlight-current
                    .el-tree-node.is-current
                    > .el-tree-node__content {
                    background: linear-gradient(
                        to bottom,
                        rgba(58, 154, 236, 0.5) 0%,
                        rgba(58, 154, 236, 0) 30%,
                        rgba(58, 154, 236, 0) 70%,
                        rgba(58, 154, 236, 0.5) 100%
                    );
                }
                /deep/
                    .el-tree--highlight-current
                    .el-tree-node.is-expanded
                    > .el-tree-node__content {
                    background: transparent;
                }
                /deep/ .el-checkbox__inner {
                    background: #396586;
                    border: none;
                    &:after {
                        color: #fff;
                    }
                }
                /deep/ .is-checked {
                    .el-checkbox__inner {
                        background: #f58700;
                        border: none;
                        &:after {
                            color: #fff;
                        }
                    }
                }
                /deep/ .nodeLabel {
                    color: #fff !important;
                    font-size: 14px;
                    line-height: 26px;
                    display: flex;
                    overflow: hidden;
                    .label {
                        padding-left: 5px;
                        color: #fff;
                        font-size: 14px;
                        line-height: 26px !important;
                        display: block;
                        height: 26px;
                        flex: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
                /deep/ .el-tree-node__expand-icon {
                    color: #00baff;
                    border: 1px solid #00baff;
                    width: 12px;
                    height: 12px;
                    padding: 0;
                    margin-right: 8px;
                    border-radius: 2px;
                    font-size: 12px;
                    margin-left: 15px;
                    &::before {
                        content: "\E6D9";
                    }
                }
                /deep/ .el-tree-node__expand-icon.is-leaf {
                    color: transparent;
                    border: 0;
                }
                /deep/ .el-tree-node__expand-icon.expanded {
                    transform: none;
                    &::before {
                        content: "\E6D8";
                    }
                }
                /deep/ .el-tree-node__expand-icon.is-leaf {
                    border: 1px solid transparent;
                }
                /deep/
                    .el-checkbox__input.is-indeterminate
                    .el-checkbox__inner::before {
                    top: 6px;
                }
                /deep/ .el-checkbox__inner::after {
                    left: 5px;
                    top: 2px;
                }
                /deep/ .el-tree-node__loading-icon {
                    display: none !important;
                }
                // 自定义子组件内容样式
                /deep/ .custom-tree-node {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    // 设备图标
                    .icon-TERMINAL_PERSONNEL {
                        width: 16px;
                        height: 16px;
                        background: url(./images/policeman2.png);
                        background-size: 100% 100%;
                    }
                }
                // 设备离线
                /deep/ .offline {
                    opacity: 0.5;
                    .icon-TERMINAL_PERSONNEL {
                        width: 16px;
                        height: 16px;
                        background: url(./images/policeman1.png);
                        background-size: 100% 100%;
                    }
                }

                /deep/ .nodeLabel {
                    flex: 1;
                }
                /*定义滚动条高宽及背景
                高宽分别对应横竖滚动条的尺寸*/
                &::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                    background-color: #f5f5f5;
                }
                /*定义滚动条轨道
                内阴影+圆角*/
                &::-webkit-scrollbar-track {
                    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                    border-radius: 10px;
                    background-color: #999;
                }
                /*定义滑块
                内阴影+圆角*/
                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                    background-color: #555;
                }
            }
            .phone {
                .phone-inp {
                    width: 220px;
                    height: 30px;
                    padding-left: 10px;
                    border: 1px solid #fff;
                    background-color: transparent;
                    color: #fff;
                    line-height: 30px;
                }
                .phone-btn {
                    width: 100px;
                    height: 32px;
                    margin-left: 10px;
                    text-align: center;
                    line-height: 32px;
                    background-color: transparent;
                    color: #15C8FF;
                    border: 1px solid #15C8FF;
                    box-shadow: 0 0 5px rgba(21, 200, 255, .5) inset;
                }
            }
        }
        .tree-tree::-webkit-scrollbar {
            display: none;
        }
        .tree-checked {
            flex: 1;
            padding-left: 10px;
            color: #fff;
            .title {
                height: 40px;
                line-height: 40px;
            }
            .list {
                height: 330px;
                overflow-x: hidden;
                overflow-y: auto;
                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    .name {
                        margin-left: 10px;
                    }
                    .no {
                        margin-left: 10px;
                    }
                    .el-icon-error {
                        width: 20px;
                        height: 20px;
                        text-align: center;
                        line-height: 20px;
                        color: #ce1414;
                        cursor: pointer;
                    }
                    // pc
                    .icon-TERMINAL_PC {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(./images/0.png);
                        background-size: 100% 100%;
                    }
                    // 警务通
                    .icon-TERMINAL_PHONE {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(./images/3.png);
                        background-size: 100% 100%;
                    }
                }
                /*定义滚动条高宽及背景
                高宽分别对应横竖滚动条的尺寸*/
                &::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                    background-color: #f5f5f5;
                }
                /*定义滚动条轨道
                内阴影+圆角*/
                &::-webkit-scrollbar-track {
                    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                    border-radius: 10px;
                    background-color: #999;
                }
                /*定义滑块
                内阴影+圆角*/
                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                    background-color: #555;
                }
            }
            .btns {
                height: 30px;
                line-height: 30px;
                text-align: center;
                .qx{
                    width:100px;
                    height:30px;
                    border: 0;
                    background: transparent;
                    color: #fff;
                    box-shadow: 0 0 5px rgba(63, 131, 249, .2) inset;
                    cursor: pointer;
                }
                .qd{
                    width:100px;
                    height:30px;
                    margin-left: 20px;
                    border: 0;
                    background: transparent;
                    color: #fff;
                    box-shadow: 0 0 5px rgba(63, 131, 249, .8) inset;
                    cursor: pointer;
                }
            }
        }
        .tree-checked::-webkit-scrollbar {
            display: none;
        }
    }
}
</style>