import { api } from '@/api/api';
import { post, postJson, get } from '@/http/http';
import store from '../store/store';

var socket = new WebSocket(api.wsUrl);
if(socket.readyState == 0){
    console.log('开始创建融合通信websocket连接')
}
socket.onopen = function(){
    console.log('融合通信websocket连接创建成功')
    rhtxApi.connected = true;
}
socket.onclose = function () {
    console.error('融合通信websocket连接关闭！！！')
    rhtxApi.connected = false;
}

socket.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    // 监听组呼叫消息推送
    if (data.path == 'groupCall-notifyGroupCallIncoming') {
        console.log("监听开始推送:" + data.msg)
        console.log(JSON.parse(data.msg))
        store.commit('setCall', JSON.parse(data.msg))
    }
    // 监听组呼叫结束推送
    if (data.path == 'groupCall-notifyGroupCallStopped') {
        console.log("监听结束推送:" + data.msg)
        console.log(msg)
        store.commit('setCall', 'end')
    }
    // 组呼接通
    if (data.path == 'groupCall-startGroupCall-resp') {
        console.log(msg)
        store.commit('setStartGroupCall', true)
    }
    // 组呼结束
    if (data.path == 'groupCall-ceaseGroupCall-resp') {
        console.log(msg)
        store.commit('setStartGroupCall', false)
    }
    // 监听和取消监听
    if (data.path == 'group-notifyMonitorGroupList') {
        console.log(JSON.parse(data.msg).scanGroups)
        let groups = JSON.parse(data.msg).scanGroups
        store.commit('setListeningGroups', groups)
    }
    // 接收到一条新消息
    if(data.path=='terminalMessage-notifyTerminalMessage'){
        console.log('接收到一条新消息');
        console.log(JSON.parse(data.msg));
        store.commit('setxiaoxi', JSON.parse(data.msg).terminalMessage)
    }
}

const rhtxApi = {

    // 开始组呼
    createGroupCall: function (groupNo) {
        var param = {
            groupNo: parseInt(groupNo)
        }
        var msgBody = JSON.stringify({
            path: 'groupCall-startGroupCall',
            param: param
        });
        socket.send(msgBody);
    },

    // 关闭组呼
    endGroupCall: function () {
        var param = {}
        var msgBody = JSON.stringify({
            path: 'groupCall-ceaseGroupCall',
            param: param
        });
        socket.send(msgBody);
    },

    // 切组
    switchGroup: function (num) {
        let msgBody = {
            "path": "queue-change-group-order",
            "param": {
                "groupNo": parseInt(num)
            }
        }
        socket.send(JSON.stringify(msgBody))
    },

    guid: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    },

    // 发送文本消息
    // type: type, // 1:个人   2：组
    // messageType: messageType, // 1：文本消息 3：图片消息 4：录音消息 6：文件消息
    // content: content, // 文本消息内容
    // path: path, // 当消息类型为文件、录音、图片消息时，必填。相应文件在PC的文件磁盘路径
    sendMsg: function (num, type, messageType, content) {
        let uuid = this.guid()
        let toIdsMap = type == 1 ? { "1": [num] } : { "2": [num] }
        let msgBody = {
            "path": "terminalMessage-sendDataMessage",
            "param": {
                "url": "",
                "messageType": messageType,
                "body": {
                    "content": content,
                    "tokenPcId": uuid
                },
                "toIdsMap": toIdsMap,
                "uniqueNos": [null]
            }
        }
        socket.send(JSON.stringify(msgBody));
    },

    // 发送消息带界面
    // type: 1人  2组
    sendMsgHasPanel(memberNo, name, type) {
        var url = "http://127.0.0.1:8099/chatInterface/open?no=" + memberNo + "&name=" + name + "&type=" + type
        get(url).then(res => {
            console.log(res);
            console.log("向编号" + memberNo + "的 " + name + "发送消息");
        }).catch(err => {
            console.error(err)
        })
    },

    // 历史图像
    historyVideo(memberNo) {
        var url = "http://127.0.0.1:8099/video/openSiteEnforcementRecorderVideoList?terminalMemberNo=" + memberNo
        get(url).then(res => {
            console.log(res);
            console.log("察看" + memberNo + "的历史图像消息");
        }).catch(err => {
            console.error(err)
        })
    },

    // 播放历史回传视频
    playHistoryVideo(messageVersion, uniqueNo, groupNo){
        var url = "http://127.0.0.1:8099/video/playMovie?messageVersion="+ messageVersion + "&uniqueNo=" + uniqueNo + "&groupNo=" + groupNo
        get(url).then( res => {
            console.log(res);
            console.log("播放" + uniqueNo + "的历史图像消息");
        }).catch( err => {
            console.error(err)
        })
    },

    // 发送图片
    sendImg: function (nos, uniqueNos, path, fileName, fileSize){
        let uuid = this.guid()
        let msgBody = {
            "path":"terminalMessage-sendDataMessage",
            "param":{
                "url": path,
                "messageType": 6,
                "body":{
                    "tokenPcId": uuid,
                    "fileName": fileName,
                    "fileSize": fileSize
                },
                "toIdsMap":{ "2": nos },
                "uniqueNos": uniqueNos
            }
        }
        socket.send(JSON.stringify(msgBody));
    },

    // 发送文件
    sendFile: function (nos, uniqueNos, path, fileName, fileSize){
        let uuid = this.guid()
        let msgBody = {
            "path":"terminalMessage-sendDataMessage",
            "param":{
                "url": path,
                "messageType": 3,
                "body":{
                    "tokenPcId": uuid,
                    "pictureName": fileName,
                    "pictureSize": fileSize,
                    "pictureThumbUrl": path,
                    "pictureUrl": path
                },
                "toIdsMap":{
                    "2":nos
                },
                "uniqueNos": uniqueNos
            }
        }
        socket.send(JSON.stringify(msgBody));
    },

    // 开始个呼带页面
    // memberNo: 个呼号码, name: 名字, code: 授权码, policeSituationNo: 指令ID
    // type: "TERMINAL_PHONE"警务通  "TERMINAL_BODY_WORN_CAMERA"执法仪   "TERMINAL_UAV"无人机    TERMINAL_PDT: 手台
    individualCall: function (memberNo, name, type, code, policeSituationNo) {
        console.log("向编号" + memberNo + "的 " + name + "发起个呼");
        var url = "http://127.0.0.1:8099" + "/individualCall/start?no=" + memberNo + "&name=" + name + "&type=" + type + "&code=" + code + "&policeSituationNo=" + policeSituationNo;
        var msgTask = setTimeout(function () {
            alert("宽带融合通讯服务未启动")
        }, 1000 * 1.5);
        get(url).then(res => {
            console.log(res);
            console.log("向编号" + memberNo + "的 " + name + "发起个呼成功");
            window.clearTimeout(msgTask)
        }).catch(err => {
            console.error(err)
        })
    },

    // 监听
    setMonitorGroup: function (groupNo) {
        let params = new URLSearchParams()
        params.append('groupNo', groupNo)
        params.append('isAdd', true)
        post('http://127.0.0.1:8099/groupService/setMonitorGroup', params).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    },

    // 结束监听
    endSetMonitorGroup: function (groupNo) {
        let params = new URLSearchParams();
        params.append('groupNo', groupNo)
        params.append('isAdd', false)
        post('http://127.0.0.1:8099/groupService/setMonitorGroup', params).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    },

    // 视频回传带页面
    video: function (memberNo, name, type, isForce, code) {
        // memberNo: 号码   name: 名字  code：授权码   policeSituationNo：指令ID  isForce:true紧急回传 false普通回传
        // type: "TERMINAL_PHONE"警务通  "TERMINAL_BODY_WORN_CAMERA"执法仪   "TERMINAL_UAV"无人机   
        console.log("向编号" + memberNo + "的 " + name + "发起视频回传");
        var url = "http://127.0.0.1:8099" + "/video/open?no=" + memberNo + "&type=" + type + "&name=" + name + "&code=" + code + "&isForce=" + isForce;
        var msgTask = setTimeout(function () {
            alert("宽带融合通讯服务未启动")
        }, 1000 * 1.5)
        get(url).then(res => {
            console.log(res)
            console.log("向编号" + memberNo + "的 " + name + "发起视频回传成功")
            window.clearTimeout(msgTask)
        }).catch(err => {
            console.log(err)
        })
    },

    // LTE
    lteVideo: function (memberNo) {
        // memberNo: 号码   name: 名字  code：授权码   policeSituationNo：指令ID
        console.log("向编号" + memberNo + "的 " + name + "发起视频回传")
        var url = "http://127.0.0.1:8099" + "/video/openDeviceVideo?no=" + memberNo
        var msgTask = setTimeout(function () {
            alert("宽带融合通讯服务未启动")
        }, 1000 * 1.5)
        get(url).then(res => {
            window.clearTimeout(msgTask)
            console.log(res)
            console.log("向编号" + memberNo + "的 " + name + "发起视频回传成功")
        }).catch(err => {
            window.clearTimeout(msgTask)
            console.error(err)
        })
    },

    // 城市摄像头
    cityVideo: function (num) {
        // var msgTask = setTimeout(function () {
        //     alert("宽带融合通讯服务未启动")
        // },1000*5);
        let params = JSON.stringify([num])
        postJson("http://127.0.0.1:8099/video/playCameras", params).then(res => {
            console.log(res)
        }).catch(err => {
            console.error(err)
        })
    },

    // 拨打电话
    // phone: 手机号码 
    phoneCall: function (phone) {
        if(phone == null || phone == "" || phone == undefined || phone.length<5){
            alert("电话号码错误")
            return
        }
        console.log("向" + phone + "拨打电话")
        var url = "http://127.0.0.1:8099/call/callOnPage?phone=" + phone + "&appId=123"
        var msgTask = setTimeout(function () {
            alert("宽带融合通讯服务未启动")
        }, 1000 * 1.5)
        get(url).then(res => {
            window.clearTimeout(msgTask)
            console.log(res)
        }).catch(err => {
            window.clearTimeout(msgTask)
            console.error(err)
        })
    },

    // 创建临时组
    createTempGroupByWeb: function(){
        var url = "http://127.0.0.1:8099/createTempGroupByWeb";
        var msgTask = setTimeout(function () {
            alert("宽带融合通讯服务未启动")
        },1000*1.5)
        get(url).then( res => {
            window.clearTimeout(msgTask)
            console.log(res)
        }).catch( err => {
            window.clearTimeout(msgTask)
            console.error(err)
        })
    }
}

export default rhtxApi