<template>
  <div class="xlc">
    <div @click="close" class="xlc-close">&times;</div>
    <div :class="arrow ? arrow : 'arrow-bottom'"></div>
    <div class="msg">
      <img src="../images/patrolBoat/model-boat.png" alt />
      <p class="name">巡逻船 {{ data.groupNo ? data.groupNo : '[未知]'}}</p>
      <p class="ssfj">{{ data.name ? data.name : '[未知]'}}</p>
      <p class="sudu">{{ data.speed ? data.speed : '[未知]'}}km/h</p>
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
            @mouseout="qipaoShowIndex = ''"
          >
            <div v-if="d.type == 'POLICEMAN'" class="img-box">
              <img src="../images/patrolBoat/icon_policeman.png" alt />
              <div class="mj-title">李明</div>
            </div>
            <div v-else-if="d.type == 'MONITORBALL'" class="img-box">
              <img src="../images/patrolBoat/icon_bukongqiu.png" alt />
              <div class="mj-title">布控球</div>
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
  props: ["arrow", "data"],
  data() {
    return {
      visible: true,
      qipaoShowIndex: null,
      qipaoStyle: {},
      stylesArr: []
    };
  },
  components: {
    bubble: () => import("../bubble")
  },
  computed: {
    comData() {
      let obj = this.data || {};
      // 判断操作按钮的个数，不足四个push成四个
      obj.terminal.push({ type: "POLICEMAN", terminal: [] });
      obj.terminal.push({ type: "MONITORBALL" });
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
    showBubble(item) {
      this.visible = true;
      this.qipaoShowIndex = item;
    },
    // 关闭气泡
    close() {
      this.$emit("closeBubble");
    },
    // 获取嵌套气泡样式
    getStyles() {
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
.xlc {
  position: absolute;
  z-index: 99;
  width: 370px;
  height: 200px;
  background-color: rgba(13, 24, 43, 0.9);
  box-shadow: 4px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.9);
  color: #fff;
  border-radius: 4px;
  .xlc-close {
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
    left: 189px;
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
    img {
      width: 120px;
      margin-top: 6px;
      margin-left: 36px;
    }
    .name {
      position: relative;
      bottom: 20px;
      font-size: 16px;
      text-align: center;
    }
    .ssfj {
      position: relative;
      bottom: 20px;
      font-size: 15px;
      text-align: center;
    }
    .sudu {
      position: relative;
      bottom: 20px;
      margin-top: 10px;
      font-size: 14px;
      color: #b69c74;
      text-align: center;
    }
  }
  .btns {
    width: 210px;
    float: right;
    // margin-left: 120px;
    margin-top: 20px;
    text-align: left;
    height: 180px;
    overflow: hidden;
    .btns-item {
      position: relative;
      float: left;
      width: 90px;
      height: 90px;
      .img-box {
        width: 65px;
        height: 65px;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.3);
		margin: 0 12.5px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		position: relative;
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