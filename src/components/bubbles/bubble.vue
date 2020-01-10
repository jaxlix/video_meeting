<template>
  <div class="bubble" v-if="visible" :style="comStyle">
    <!-- 无人机 -->
    <uav :arrow="arrow" :data="data" v-if="template =='TERMINAL_UAV'" @closeBubble="closeBubble"></uav>
    <!-- 摄像头 -->
    <camera :arrow="arrow" :data="data" v-if="template == 'CAMERA'" @closeBubble="closeBubble"></camera>
    <!-- 摄像头气泡视频播放 -->
    <div v-if="template == 'CAMERA' && videoShow" class="videoBox">
      <span class="close" @click="videoShow = false">&times;</span>
      <video controls class="video" ref="cameraVideo"></video>
    </div>
    <!-- 布控球 -->
    <monitorBall :arrow="arrow" :data="data" v-if="template == 'MONITORBALL'" @closeBubble="closeBubble"></monitorBall>
    <!-- 警务通 -->
    <phone :arrow="arrow" :data="data" v-if="template == 'TERMINAL_PHONE'" @closeBubble="closeBubble"></phone>
    <!-- 电台 -->
    <pdt :arrow="arrow" :data="data" v-if="template == 'TERMINAL_PDT'" @closeBubble="closeBubble"></pdt>
    <!-- 交管电台 -->
    <trafficPDT :arrow="arrow" :data="data" v-if="template == 'TRAFFICPDT'" @closeBubble="closeBubble"></trafficPDT>
    <!-- 执法仪 -->
    <bodyWornCamera :arrow="arrow" :data="data" v-if="template == 'TERMINAL_BODY_WORN_CAMERA'" @closeBubble="closeBubble"></bodyWornCamera>
    <!-- 分局 -->
    <branch :arrow="arrow" :data="data" v-if="template == 'ORG_BRANCH'" @closeBubble="closeBubble"></branch>
    <!-- 派出所 -->
    <policeStation :arrow="arrow" :data="data" v-if="template == 'ORG_POLICE_STATION'" @closeBubble="closeBubble"></policeStation>
    <!-- 口子所 -->
    <cutStation :arrow="arrow" :data="data" v-if="template == 'CUTSTATION'" @closeBubble="closeBubble"></cutStation>
    <!-- 警务站 -->
    <policeOffice :arrow="arrow" :data="data" v-if="template == 'ORG_POLICE_OFFICE'" @closeBubble="closeBubble"></policeOffice>
    <!-- 检查站 -->
    <checkPoint :arrow="arrow" :data="data" v-if="template == 'ORG_CHECK_POINT'" @closeBubble="closeBubble"></checkPoint>
    <!-- 基站 -->
    <baseStation :arrow="arrow" :data="data" v-if="template == 'BASE_STATION_PDT'" @closeBubble="closeBubble"></baseStation>
    <!-- LTE基站 -->
    <lteBaseStation :arrow="arrow" :data="data" v-if="template == 'BASE_STATION_LTE'" @closeBubble="closeBubble"></lteBaseStation>
    <!-- LTE -->
    <lte :arrow="arrow" :data="data" v-if="template == 'LTE'" @closeBubble="closeBubble"></lte>
    <!-- 民警 -->
    <policeMan :arrow="arrow" :data="data" v-if="template == 'POLICEMAN'" @closeBubble="closeBubble"></policeMan>
    <!-- 警车 -->
    <policeCar :arrow="arrow" :data="data" v-if="template == 'POLICECAR'" @closeBubble="closeBubble"></policeCar>
    <!-- 巡逻船 -->
    <patrolBoat :arrow="arrow" :data="data" v-if="template == 'PATROLBOAT'" @closeBubble="closeBubble"></patrolBoat>
    <!-- 飞手 -->
    <flyer :arrow="arrow" :data="data" v-if="template == 'FLYER'" @closeBubble="closeBubble"></flyer>
    <!-- 自定义组件内容 -->
    <slot name="content"></slot>
  </div>
</template>

<script>
import flvjs from "flv.js";
export default {
  name: "subBubble",
  props: ["visible", "map", "template", "data", "arrow", "styles", "videoUrl"],
  data() {
    return {
      startPoint: {},
      qipaoStyle: {},
      videoShow: true
    };
  },
  computed: {
    // 合并传入的style和计算出的style
    comStyle () {
      let styles = {}
      if (this.styles) {
        styles = Object.assign(styles, this.styles)
      }
      if (this.qipaoStyle) {
        styles = Object.assign(styles, this.qipaoStyle)
      }
      return styles
    }
  },
  watch: {
    // 气泡显示计算出气泡位置
    visible: {
      immediate: true,
      handler (val) {
        if (val) {
          this.videoShow = true
          this.$nextTick(() => {
            // 气泡显示时，如果时摄像头气泡，且有时间播放url，则播放视频
            if (this.template == 'CAMERA' && this.videoUrl) {
              this.playVideo()
            }
          })
          if (this.data.position.longitude && this.data.position.latitude) {
            // 计算初始化气泡位置
            let point = this.$arcgis.toScreenPoint(this.map, this.data.position.longitude, this.data.position.latitude);
            this.qipaoStyle = {
              left: point.x - 185 + "px",
              top: point.y - 230 + "px"
            };
            this.startPoint = this.qipaoStyle;
          } else {
            this.startPoint = this.styles;
          }
        }
      }
    },
    template(val) {
      if (val == 'CAMERA' && this.videoUrl) {
        this.$nextTick(() => {
          this.playVideo()
        })
      }
    },
    'data.position': {
      handler () {
        if (this.data.position.longitude && this.data.position.latitude) {
          // 计算初始化气泡位置
          let point = this.$arcgis.toScreenPoint(this.map, this.data.position.longitude, this.data.position.latitude);
          this.qipaoStyle = {
            left: point.x - 185 + "px",
            top: point.y - 230 + "px"
          };
          this.startPoint = this.qipaoStyle;
        }
      }
    },
    map: {
      immediate: true,
      handler (newval) {
        if (newval) {
          // 拖动地图改变气泡位置
          this.$arcgis.pan(this.map, e => {
            if (this.visible) {
              let offx = e.delta.x;
              let offy = e.delta.y;
              let style = {
                left: this.startPoint.left.replace("px", "") * 1 + offx + "px",
                top: this.startPoint.top.replace("px", "") * 1 + offy + "px"
              };
              this.qipaoStyle = style;
            }
          });
          // 拖动地图结束更新气泡位置
          this.$arcgis.panend(this.map, () => {
            if (this.visible) {
              this.startPoint = this.qipaoStyle;
            }
          });
        }
      }
    }
  },
  components: {
    uav: () => import("./template/uav"),
    camera: () => import("./template/camera"),
    monitorBall: () => import("./template/monitorBall"),
    phone: () => import("./template/phone"),
    pdt: () => import("./template/pdt"),
    trafficPDT: () => import("./template/trafficPDT"),
    bodyWornCamera: () => import("./template/bodyWornCamera"),
    branch: () => import("./template/branch"),
    policeStation: () => import("./template/policeStation"),
    cutStation: () => import("./template/cutStation"),
    policeOffice: () => import("./template/policeOffice"),
    checkPoint: () => import("./template/checkPoint"),
    baseStation: () => import("./template/baseStation"),
    lteBaseStation: () => import("./template/lteBaseStation"),
    lte: () => import("./template/lte"),
    policeMan: () => import("./template/policeMan"),
    policeCar: () => import("./template/policeCar"),
    patrolBoat: () => import("./template/patrolBoat"),
    flyer: () => import("./template/flyer")
  },
  methods: {
    // 关闭气泡
    closeBubble() {
      this.$emit('update:visible', false);
    },
    // 播放视频
    playVideo() {
      var flvPlayer = flvjs.createPlayer({
          type: "flv",
          // url: res.FLV
          url: this.videoUrl
        });
        flvPlayer.attachMediaElement(this.$refs.cameraVideo);
        flvPlayer.load();
        // 部分谷歌浏览器无法播放，必须静音后才能播放
        var userAgent = navigator.userAgent
        if (userAgent.indexOf('WebKit') > -1) {
          flvPlayer.muted = true
        }
        flvPlayer.play();
    }
  }
};
</script>

<style lang="less" scoped>
.bubble {
  width: 370px;
  height: 200px;
  position: fixed;
  z-index: 2000;
  .videoBox {
    width: 356px;
    height: 100%;
    position: absolute;
    left: 100%;
    top: 0;
    .close {
      display: block;
      width: 30px;
      height: 30px;
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
      color: #fff;
      font-size: 30px;
      line-height: 30px;
      cursor: pointer;
      z-index: 2;
    }
    video {
      width: 100%;
      height: 100%;
    }
  }
}
</style>