<template>
  <div class="mj">
    <div @click="close" class="close">&times;</div>
    <div :class="arrow ? arrow : 'arrow-bottom'"></div>
    <div class="msg">
      <img src="../images/policeMan/img_police.png" alt />
      <div>
        <div class="name">{{data.name?data.name:"[未知]"}} {{data.no?String(data.no).replace(/^8[8|7]/, ''):"[未知]"}}</div>
        <div class="department">{{(data.department && data.department.name)?data.department.name:"[部门未知]"}}</div>
        <div class="railway_no">{{data.train ? '当前值乘：'+data.train.name : "当前值乘：未知"}}</div>
        <div class="phone_no" :title="data.phoneNo">{{(data.phoneNo&&!isNaN(data.phoneNo))?data.phoneNo:"电话号码未知"}}</div>
      </div>
    </div>
    <div class="btns">
      <el-scrollbar style="height:100%" ref="scrollbar">
        <ul class="btns-ul">
          <li
            v-for="(d, i) in comData.terminal"
            :key="i"
            class="btns-item"
            ref="btns"
            @mouseover="showBubble(i)"
            @mouseout="closeBubble"
          >
            <div v-if="d.type == 'PHONE'" class="img-box">
              <img src="../images/policeMan/icon_phone.png" alt />
              <div class="mj-title">警务通</div>
            </div>
            <div v-else-if="d.type == 'PDT'" class="img-box">
              <img src="../images/policeMan/icon_pdt.png" alt />
              <div class="mj-title">电台</div>
            </div>
            <div v-else-if="d.type == 'UAV'" class="img-box">
              <img src="../images/policeMan/icon_uav.png" alt />
              <div class="mj-title">无人机</div>
            </div>
            <div v-else-if="d.type == 'BODYWORNCAMERA'" class="img-box">
              <img src="../images/policeMan/icon_zhifayi.png" alt />
              <div class="mj-title">执法仪</div>
            </div>
            <div v-else class="img-box">
              <div v-if="d.kong" class="mj-title"></div>
            </div>
            <bubble
              v-if="d.type"
              v-show="qipaoShowIndex === i"
              :visible.sync="visible"
              :template="d.type"
              :data="d"
              :styles="stylesArr[i]"
              arrow="arrow-left"
            ></bubble>
          </li>
        </ul>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      qipaoShowIndex: null,
      qipaoStyle: {},
      stylesArr: []
    };
  },
  props: ["arrow", "data"],
  components: {
    bubble: () => import("../bubble")
  },
  computed: {
    comData() {
      let obj = this.data || {};
      // 判断操作按钮的个数，不足四个push成四个
      obj.terminal.push({ type: "UAV" });
      obj.terminal.push({ type: "PDT" });
      obj.terminal.push({ type: "PHONE" });
      obj.terminal.push({ type: "BODYWORNCAMERA" });
      for (let i = 0; i < 4; i++) {
        if (obj.terminal.length < 4) {
          obj.terminal.push({});
        } else {
          break;
        }
      }
      return obj;
    }
  },
  methods: {
    // 显示嵌套气泡
    showBubble(index) {
      
      this.qipaoShowIndex = index;
      this.$nextTick(() => {
        setTimeout(() => {
          this.visible = true;
          this.getStyles()
        }, 0)
      })
    },
    // 关闭嵌套气泡
    closeBubble() {
      // this.visible = false
      this.qipaoShowIndex = ''
    },
    // 关闭气泡
    close() {
      this.$emit("closeBubble");
    },
    // 获取嵌套气泡样式
    getStyles() {
      this.$nextTick(() => {
        let btns = this.$refs.btns || [];
        let arr = [];
        btns.forEach(item => {
          // 计算每个嵌套气泡的位置
          let offset = item.getBoundingClientRect();
          let styles = {
            left: offset.left + offset.width - 6 + "px",
            top: offset.top + 32.5 - 100 + "px"
          };
          arr.push(styles);
        });
        this.stylesArr = arr;
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getStyles();
      // 按钮滚动时重新计算嵌套气泡位置
      let scrollBox = document.getElementsByClassName("el-scrollbar__wrap")[0];
      if (scrollBox) {
        scrollBox.addEventListener("scroll", this.getStyles);
      }
    });
  },
  destroyed() {
    // 去除监听
    let scrollBox = document.getElementsByClassName("el-scrollbar__wrap")[0];
    if (scrollBox) {
      scrollBox.removeEventListener("scroll", this.getStyles);
    }
  }
};
</script>

<style lang="less" scoped>
.mj {
  position: absolute;
  z-index: 99;
  width: 370px;
  height: 200px;
  background-color: rgba(13, 24, 43, 0.9);
  box-shadow: 4px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.9);
  color: #fff;
  border-radius: 4px;
  .close {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    font-size: 30px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }
  .arrow-bottom {
    position: absolute;
    bottom: -20px;
    left: 175px;
    border: 10px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.5);
  }
  .arrow-left {
    position: absolute;
    bottom: 90px;
    left: -20px;
    border: 10px solid transparent;
    border-right-color: rgba(0, 0, 0, 0.5);
  }
  .msg {
    float: left;
    width: 160px;
    margin-left: 0px;
    text-align: center;
    img {
      height: 64px;
      margin-top: 20px;
    }
    .name {
      height: 20px;
      font-size: 14px;
      line-height: 22px;
      margin-top: 2px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .department,
    .railway_no {
      font-size: 14px;
      margin-top: 0;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .railway_no {
      color: #fa9b55;
    }
    .phone_no {
      margin-top: 5px;
      line-height: 22px;
      font-size: 14px;
      color: rgb(0, 255, 255);
    }
  }
  .btns {
    width: 210px;
    float: right;
    margin-top: 20px;
    text-align: left;
    height: 180px;
    overflow: hidden;
    .btns-item {
      position: relative;
      float: left;
      width: 90px;
      text-align: center;
      height: 90px;
      .img-box {
        width: 65px;
        height: 65px;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.3);
        text-align: center;
        margin: 0 12.5px;
        cursor: pointer;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .mj-title {
        font-size: 12px;
        line-height: 25px;
        position: absolute;
        width: 100%;
        text-align: center;
        left: 0;
        bottom: -25px;
      }
    }
    .btns-ul {
      width: 230px;
      height: 180px;
    }
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
/deep/ .is-vertical {
  opacity: 1 !important;
}
/deep/ .is-horizontal {
  opacity: 0 !important;
}
</style>