let isGaw = false   // 是否公安网
const IP = isGaw ? 'http://59.32.1.170:9011' : 'http://192.168.1.222:9011'   // 一体化服务
const IP2 = isGaw ? 'http://59.32.1.174:6061' : 'http://192.168.1.223:6061'    // 文件服务

export const api = {
    isGaw: isGaw,
    api: {
        getThermodynamicChart: IP + "/phone/getThermodynamicChart", // 查询热力图,参数： dayTime=201912按月查：年月，按天查：年月日   flag=1按月1，按天2
        getTerminalCurrentTrace: IP + "/phone/getTerminalCurrentTrace", // 实时轨迹，参数: gpsId , beginTime, endTime, memberType 警员： memberType=PERSIONNEL
        getTerminalTraceByNo: IP + "/phone/getTerminalTraceByNo",   // 查询历史轨迹,参数: gpsId , beginTime, endTime, memberType  警员： memberType=PERSIONNEL

        // 文件服务部门树接口
        findGroups: IP2 + "/file/findGroups",   // 查询部门--组
        findMembers: IP2 + "/file/findMembers", // 查询部门--人员
        findByDeptAndKey: IP2 + "/file/terminal/findByDeptAndKey",  // 查询部门--设备
        getDeptData: IP2 + "/file/getDeptData",    // 获取部门--组，部门--人员
        getDept: IP2 + "/file/getDept",    // 获取部门--设备
    },
    mapUrl: {
        css: isGaw ? 'http://59.32.1.166:4869/arcgis_pc/arcgis_js_api/library/3.19/3.19/esri/css/esri.css' : // 市局pc
            'http://192.168.1.223:6062/arcgis_pc/arcgis_js_api/library/3.19/3.19/esri/css/esri.css',         // 公司测试
        js: isGaw ? 'http://59.32.1.166:4869/arcgis_pc/arcgis_js_api/library/3.19/3.19/init.js' :            // 市局pc
            'http://192.168.1.223:6062/arcgis_pc/arcgis_js_api/library/3.19/3.19/init.js',                   // 公司测试
        mapServe: isGaw ? 'http://10.73.95.153/whgaj_gis_gissite3/rest/services/whmap_201802/MapServer' :    // 市局pc
            'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer'                        // 公司测试
    },
    mapType: "gaode",   // 底图加载类型：gaode高德底图，pgis公安底图
    wsUrl: 'ws://127.0.0.1:8099/websocket'
}