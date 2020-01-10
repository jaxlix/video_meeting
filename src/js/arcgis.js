import * as esriLoader from "esri-loader"
import { api } from '@/api/api'

const arcgis = {}

// 加载js
esriLoader.loadScript({
    url: api.mapUrl.js
});
// 加载css
esriLoader.loadCss(api.mapUrl.css);
// 加载模块
esriLoader.loadModules([
    "esri/map",
    "js/gaodeLayer",
    "js/gaodeLayerDark",
    "js/gaodeLayerColor",
    // "pgis/XYSL2019",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/geometry/screenUtils",
    "esri/geometry/webMercatorUtils",
    "esri/symbols/PictureMarkerSymbol",
    "esri/graphic",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "js/ClusterLayer",
    "esri/geometry/Circle",
    "esri/geometry/Polygon",
    "esri/geometry/Polyline",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/toolbars/draw",
    "esri/renderers/ClassBreaksRenderer",
    "esri/Color",
    "esri/renderers/HeatmapRenderer",
    "esri/layers/FeatureLayer",
    "dojo/domReady!"
]).then(([
    Map, 
    gaodeLayer, 
    gaodeLayerDark, 
    gaodeLayerColor, 
    // XYSL2019,
    ArcGISTiledMapServiceLayer,
    Extent, 
    SpatialReference, 
    GraphicsLayer, 
    Point, 
    screenUtils, 
    webMercatorUtils, 
    PictureMarkerSymbol, 
    Graphic, 
    SimpleFillSymbol, 
    SimpleLineSymbol, 
    SimpleMarkerSymbol, 
    ClusterLayer, 
    Circle, 
    Polygon, 
    Polyline, 
    TextSymbol, 
    Font, 
    Draw, 
    ClassBreaksRenderer, 
    Color,
    HeatmapRenderer,
    FeatureLayer
]) => {
    // 实例化地图
    /**
     * {
     *  id: 字符串，dom元素id属性
     *  center: 数组，[经度，纬度]
     *  zoom: 数字，默认缩放等级
     *  minZoom: 最小缩放等级
     *  maxZoom: 最大缩放等级
     * }
     */
    arcgis.mapInit = function (obj) {
        let map = new Map(obj.id, {
            center: obj.center,
            extent: new Extent(114.278, 30.485, 114.556, 30.609, new SpatialReference({ wkid: 4326 })),
            zoom: obj.zoom,
            minZoom: obj.minZoom,
            maxZoom: obj.maxZoom,
            slider: false,
            logo: false,
            spatialReference: new SpatialReference({ wkid: 4326 })
        })
        if(api.mapType == "arcgis"){
            // 加载arcgis底图
            let burl = api.mapUrl.mapServe
            let electronicmap = new ArcGISTiledMapServiceLayer(burl)
            map.addLayer(electronicmap)
        }else if(api.mapType == "gaode"){
            // 加载高德底图
            if (obj.layer == 'gaodeLayerDark') {
                let electronicmap = new gaodeLayerDark();
                map.addLayer(electronicmap)
            } else if (obj.layer == 'gaodeLayerColor') {
                let electronicmap = new gaodeLayerColor();
                map.addLayer(electronicmap)
            } else {
                let electronicmap = new gaodeLayer();
                map.addLayer(electronicmap)
            }
        }else if(api.mapType == "arcgis"){
            // 加载pgis底图
            // let electronicmap = new XYSL2019();
            // map.addLayer(electronicmap)
        }
        return map
    }

    // 地图加载完成的回调，高德瓦片底图不会触发
    /**
     * map: 实例化的map对象
     * callback: 加载完成的回调
     */
    arcgis.mapOnload = function (map, callback) {
        map.on('load', callback)
    }

    // 创建普通图层
    /**
     * map: 实例化的map对象
     * index: 图层的层级
     */
    arcgis.createLayer = function (map, index) {
        var _layer = new GraphicsLayer()
        if (index){
            map.addLayer(_layer, index)
        } else {
            map.addLayer(_layer)
        }
        return _layer
    }

    // 清除图层内容
    // layer.clear()

    // 删除图层
    // map.removeLayer(layer)

    // 地理坐标转屏幕坐标
    /**
     * map: 实例化的map对象
     * longitude: 经度
     * latitude: 纬度
     */
    arcgis.toScreenPoint = function (map, longitude, latitude) {
        var point = new Point(longitude, latitude, new SpatialReference({
            wkid: 4326
        }))
        return screenUtils.toScreenGeometry(map.geographicExtent, map.width, map.height, point)
    }

    /**
     *经纬度转墨卡托
     * longitude: 经度
     * latitude: 纬度
     */
    arcgis.changePosXY = function (longitude, latitude) {
        var m = webMercatorUtils.lngLatToXY(longitude, latitude);
        return { x: m[0], y: m[1] };
    }

    /**
     *墨卡托转经纬度
     * x: x坐标
     * y: y坐标
     */
    arcgis.changePosPoint = function (x, y) {
        var lnglat = webMercatorUtils.xyToLngLat(x, y);
        return { longitude: lnglat[0], latitude: lnglat[1] };
    }

    // 添加pictureMarker上图，返回graphic对象
    /**
     * data: 数据源，
     * _layer：图层
     * option: 必须有{longitude: 经度, latitude: 纬度, img: 图片, width: 图片宽, height: 图片高, angle: 旋转角度, xoffset: x轴偏移量, yoffset: y轴偏移量}
     *  */
    arcgis.addPictureMarker = function (_layer, option, data) {
        var point = new Point(option.longitude, option.latitude, new SpatialReference({
            wkid: 4326
        }));
        var symbo = new PictureMarkerSymbol({
            "url": option.img,
            "width": option.width,
            "height": option.height,
            "angle": option.angle || 0,
            "xoffset": option.xoffset || 0,
            "yoffset": option.yoffset || 0,
            "type": "esriPMS"
        });
        var graphic = new Graphic(point, symbo, data);
        _layer.add(graphic);
        return graphic;
    }

    // 创建一个Point对象
    // * longitude: 经度
    // * latitude: 纬度
    arcgis.createPoint = function (longitude, latitude) {
        let point = new Point(longitude, latitude);
        return point;
    }

    // 移动图片
    /**
     * longitude：新的经度，
     * latitude：新的纬度，
     * symbo: PictureMarkerSymbol对象
     * _layer： 图层对象
     * data： 需要传递数据
     */
    arcgis.movePic = function (longitude, latitude, data, symbo, _layer) {
        if (null == data || null == longitude || null == latitude || isNaN(longitude) || isNaN(latitude)) {
            console.error("移动图片出错，坐标数据有误");
            console.error(longitude);
            console.error(latitude);
            return;
        }
        let point = new Point(longitude, latitude);
        var griphic = new Graphic(point, symbo, data);
        _layer.add(griphic);
    }

    // 图片图标替换
    /**
     * data: 需要传递的数据对象
     * pictureMarker: 原图标graphic对象,用于清除
     * _layer: 图层对象
     * option: 必须有{longitude: 经度, latitude: 纬度, img: 图片, width: 图片宽, height: 图片高, angle: 旋转角度, xoffset: x轴偏移量, yoffset: y轴偏移量}
     */
    arcgis.changePictureMarker = function (data, pictureMarker, _layer, option) {
        var point = new Point(option.longitude, option.latitude, new SpatialReference({
            wkid: 4326
        }));
        var symbo = new PictureMarkerSymbol({
            "url": option.img,
            "width": option.width ? option.width : pictureMarker.symbol.width,
            "height": option.height ? option.height : pictureMarker.symbol.height,
            "angle": option.angle ? option.angle : pictureMarker.symbol.angle,
            "xoffset": option.xoffset ? option.xoffset : pictureMarker.symbol.xoffset,
            "yoffset": option.yoffset ? option.yoffset : pictureMarker.symbol.yoffset,
            "type": "esriPMS"
        });
        var graphic = new Graphic(point, symbo, data);
        _layer.remove(pictureMarker);
        _layer.add(graphic);
        return graphic;
    }

    // 画圆  Circle类
    /**
     * data: 需要传递的数据
     * _layer: layer图层
     * option: {longitude: 经度, latitude：纬度, radius：半径, color: 填充颜色[r,g,b,a]，type: 填充类型，outlineColor: 边框颜色[r,g,b,a]，outlineType：边框类型，width：边框宽度} 
     * 
     * 填充类型 type: 
        STYLE_BACKWARDDIAGONAL:"backwarddiagonal" //左下线条
        STYLE_BACKWARD_DIAGONAL:"backwarddiagonal"
        STYLE_CROSS:"cross" //方格
        STYLE_DIAGONALCROSS:"diagonalcross" // 菱形
        STYLE_DIAGONAL_CROSS:"diagonalcross" // 菱形 没看出什么区别
        STYLE_FORWARDDIAGONAL:"forwarddiagonal" //右下线条
        STYLE_FORWARD_DIAGONAL:"forwarddiagonal" // 右下线条 没看出什么区别
        STYLE_HORIZONTAL:"horizontal" //横条
        STYLE_NULL:"none"
        STYLE_SOLID:"solid" // 纯面
        STYLE_VERTICAL:"vertical" // 竖条

        边框类型 outlineType：
        // STYLE_DASH:"dash" // 常规虚线
        // STYLE_DASHDOT:"dashdot" // 常规虚、点线
        // STYLE_DASHDOTDOT:"longdashdotdot" // 常规虚、点、点线
        // STYLE_DOT:"dot" // 常规点线
        // STYLE_LONGDASH:"longdash" // 长虚线
        // STYLE_LONGDASHDOT:"longdashdot" // 长虚、点线
        // STYLE_NULL:"none"
        // STYLE_SHORTDASH:"shortdash" // 短虚线
        // STYLE_SHORTDASHDOT:"shortdashdot" // 短虚、点线
        // STYLE_SHORTDASHDOTDOT:"shortdashdotdot" // 短虚、点、点线
        // STYLE_SHORTDOT:"shortdot" // 短点线
        // STYLE_SOLID:"solid" // 线条
    *  */
    // longitude 经度 latitude纬度(圆的中心点) r 半径
    arcgis.setCircle = function (_layer, option, data) {
        // 实例化并设置填充类型
        var symbol = new SimpleFillSymbol(option.type)
        // 设置填充颜色
        symbol.setColor(new Color(option.color))
        // 设置边框类型、颜色、宽度
        symbol.setOutline(new SimpleLineSymbol(option.outlineType, new Color(option.outlineColor), option.width));
        // 实例化圆形对象
        var circle = new Circle({
            center: [option.longitude, option.latitude],
            radius: option.radius,
            geodesic: true
        });
        var graphic = new Graphic(circle, symbol, data);
        _layer.add(graphic);
        return graphic;
    }

    //画多边形  Polygon
    /**
     * data: 需要传递的数据
     * _layer: layer图层
     * option: { data: [[114.1,30.1],[114.2,30.5],[114.8,30.9],[114.1,30.1]], color: 填充颜色[r,g,b,a]，type: 填充类型，outlineColor: 边框颜色[r,g,b,a]，outlineType：边框类型，width：边框宽度}
     *         顶点坐标,多边形的各个角的顶点坐标，注意：首尾要链接，也就是说，第一个点和最后一个点要一致 ps:[[114.1,30.1],[114.2,30.5],[114.8,30.9],[114.1,30.1]]
     * 填充类型 type: 
        STYLE_BACKWARDDIAGONAL:"backwarddiagonal" //左下线条
        STYLE_BACKWARD_DIAGONAL:"backwarddiagonal"
        STYLE_CROSS:"cross" //方格
        STYLE_DIAGONALCROSS:"diagonalcross" // 菱形
        STYLE_DIAGONAL_CROSS:"diagonalcross" // 菱形 没看出什么区别
        STYLE_FORWARDDIAGONAL:"forwarddiagonal" //右下线条
        STYLE_FORWARD_DIAGONAL:"forwarddiagonal" // 右下线条 没看出什么区别
        STYLE_HORIZONTAL:"horizontal" //横条
        STYLE_NULL:"none"
        STYLE_SOLID:"solid" // 纯面
        STYLE_VERTICAL:"vertical" // 竖条

        边框类型 outlineType：
        // STYLE_DASH:"dash" // 常规虚线
        // STYLE_DASHDOT:"dashdot" // 常规虚、点线
        // STYLE_DASHDOTDOT:"longdashdotdot" // 常规虚、点、点线
        // STYLE_DOT:"dot" // 常规点线
        // STYLE_LONGDASH:"longdash" // 长虚线
        // STYLE_LONGDASHDOT:"longdashdot" // 长虚、点线
        // STYLE_NULL:"none"
        // STYLE_SHORTDASH:"shortdash" // 短虚线
        // STYLE_SHORTDASHDOT:"shortdashdot" // 短虚、点线
        // STYLE_SHORTDASHDOTDOT:"shortdashdotdot" // 短虚、点、点线
        // STYLE_SHORTDOT:"shortdot" // 短点线
        // STYLE_SOLID:"solid" // 线条
    *  */
    arcgis.setPolygon = function (_layer, option, data) {
        // 实例化并设置填充类型
        var symbol = new SimpleFillSymbol(SimpleFillSymbol[option.type])
        // 设置填充颜色
        symbol.setColor(new Color(option.color))
        // 设置边框类型、颜色、宽度
        symbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol[option.outlineType], new Color(option.outlineColor), option.width));
        // 实例化多边形
        var polygon = new Polygon(new SpatialReference({ wkid: 4326 }));
        //添加多边形的各个角的顶点坐标，注意：首尾要链接，也就是说，第一个点和最后一个点要一致
        polygon.addRing(option.data);
        var graphic = new Graphic(polygon, symbol, data);
        _layer.add(graphic);
        return graphic;
    }

    // 绘制折线
    /*
     * data: 需要传递的数据
     * _layer: layer图层
     * option: { data: [[114.1,30.1],[114.2,30.5],[114.8,30.9]], color: 填充颜色[r,g,b,a], width：路线宽度} 
    */
    arcgis.setPolyline = function (_layer, option, data) {
        // 生成绘制的图形
        var polyline = new Polyline({
            "paths": [option.data],
            "spatialReference": { "wkid": 4326 }
        });
        var graphic = new Graphic({
            "geometry": polyline,
            "symbol": {
                "color": [55, 125, 214, 0],
                "outline": {
                    "color": new Color(option.color),
                    "width": option.width,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                },
                "type": "esriSFS",
                "style": "esriSFSSolid"
            },
            "attributes": data
        });
        _layer.add(graphic);
        return graphic
    }

    // 文字图标
    /**
     * data: 需要传递的数据
     * _layer: 图层
     * option: {longitude: 经度 latitude: 纬度，text：文字, fontSize: 字体大小, color：颜色[r,g,b,a], offsetX: 水平偏移量, offsetY: 垂直偏移量, haloColor: 描边颜色， haloSize： 描边大小, angle: 角度}
     */
    arcgis.addText = function (_layer, option, data) {
        var point = new Point(option.longitude, option.latitude, new SpatialReference({
            wkid: 4326
        }));
        var font = new Font();
        font.setSize(option.fontSize)
        var textSymbol = new TextSymbol({
            text: option.text,
            color: new Color(option.color),
            xoffset: option.offsetX,
            yoffset: option.offsetY,
            haloColor: new Color(option.haloColor),
            haloSize: option.haloSize,
            angle: option.angle,
            font: font
        });
        var graphic = new Graphic(point, textSymbol, data)
        _layer.add(graphic)
        return graphic
    }

    // 手动绘制
    /**
     * map: 地图对象
     * type: 绘制类型 CIRCLE(圆), POLYLINE(折线), POLYGON(多边形),ELLIPSE(椭圆),RECTANGLE(矩形),TRIANGLE(三角形)
     * callback： 回调函数,返回值：{geometry：图形对象，可用来绘制上图, target：_toolbar对象，target.deactivate()用于取消绘制}
     */
    arcgis.draw = function(map, type, callback){
        let _toolbar = new Draw(map);
        _toolbar.activate(Draw[type]);
        _toolbar.on("draw-end", callback);
        return _toolbar;
    }

    // 判断坐标点是否在绘制的圆、椭圆、长方形范围内
    /**
     * geometry: 绘制的圆、椭圆、长方形对象
     * longitude: 坐标点经度
     * latitude：坐标点纬度
     */
    arcgis.isInCircle = function(geometry, longitude, latitude){
        if( typeof(geometry) != "undefined"){
            return geometry.contains(new Point(longitude, latitude))
        }
    }

    // 创建聚合图层
    /**
     * id: 唯一标识
     * data: 聚合数据源
     * map: 实例化的map对象
     */
    arcgis.initClusterLayer = function (id, data, map) {
        var clusterLayer = new ClusterLayer({
            "data": data,//绑定聚合数据源
            "distance": 100,//设置聚合距离，根据地图分辨率来设置合适的值，默认是50
            "id": id,
            "labelColor": "#fff",//图标字体颜色值，白色字体
            "labelOffset": 0,//字体偏移位置
            "resolution": map.extent.getWidth() / map.width,//计算当前地图的分辨率
            "showSingles": false,
            //"singleTemplate": popupTemplate//绑定气泡窗口模型
        });
        return clusterLayer;
    }

    // 配置聚合图层图标
    /**
     * config: {img0: {url: '聚合的图标', width: 23, height: 23}, img1: {url: '未聚合的图标', width: 23, height: 23}}
     * clusterLayer: 实例化的聚合图层对象
     */
    arcgis.setCluterLayer = function (config, clusterLayer) {
        var defaultSym = new SimpleMarkerSymbol().setSize(4);
        var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");
        var symbol0 = new PictureMarkerSymbol(config.img0.url, config.img0.width, config.img0.height).setOffset(-8, 0);
        var symbol1 = new PictureMarkerSymbol(config.img1.url, config.img1.width, config.img1.height).setOffset(-8, 0);
        renderer.addBreak(0, 1, symbol1);
        renderer.addBreak(1, 9999, symbol0);
        clusterLayer.setRenderer(renderer);
    }

    // 热力图
    /**
     * map: 实例化的map对象
     * data: 数据源lng经度，lat纬度，num热力值;[{lng: 114, lat: 32, num: 56}, {lng: 114, lat: 33, num: 37}]
     */
    arcgis.heatmapRenderer = function (map, data) {
        let layerDefinition = {
            "geometryType": "esriGeometryPoint",
            "fields": [{
                "name": "ID",
                "type": "esriFieldTypeInteger",
                "alias": "ID"
            }]
        }
        let featureCollection = {
            layerDefinition: layerDefinition,
            featureSet: null
        };
        //创建FeatureLayer图层
        let featureLayer = new FeatureLayer(featureCollection, {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            opacity: 1
        });
        let heatmapRenderer = new HeatmapRenderer({
            colors: ["rgba(255, 0, 0, 0)", "rgb(0, 255, 0)", "rgb(255, 255, 0)", "rgb(255, 0, 0)"],
            blurRadius: 15,
            maxPixelIntensity: 100,
            minPixelIntensity: 0,
            field : "num"
        });
        //设置渲染方式
        featureLayer.setRenderer(heatmapRenderer);//heatmapRendererhtml中创建的渲染器
        map.addLayer(featureLayer);
        data.forEach( d => {
            let point = new Point(d.lng, d.lat, new SpatialReference({ wkid: 4326 }));//初始化起点
            var graphic =new Graphic(point);
            graphic.setAttributes( {"num": d.num});
            featureLayer.add(graphic);
        });
        return featureLayer
    }

    // 移动地图中心定位点
    /**
     * map: 实例化的map对象
     * longitude: 经度
     * latitude: 纬度
     */
    arcgis.centerTo = function (map, longitude, latitude) {
        if(longitude && latitude){
            var point = new Point(longitude, latitude);
            map.centerAt(point);
        }
    }

    // 绑定图层点击事件
    /**
     * _layer: 实例化的图层对象
     * callback: 点击事件的回调
     */
    arcgis.click = function (_layer, callback) {
        _layer.on("click", callback)
    }

    // 绑定双击事件
    /**
     * map: 实例化的map对象
     * callback: 双击事件的回调
     */
    arcgis.doubleClick = function (map, callback) {
        map.on("DblClick", callback)
    }

    // 绑定图层鼠标移入事件
    /**
     * _layer: 实例化的图层对象
     * callback: 鼠标移入事件的回调
     */
    arcgis.mouseOver = function (_layer, callback) {
        _layer.on("mouse-over", callback)
    }

    // 绑定图层鼠标移出事件
    /**
     * _layer: 实例化的图层对象
     * callback: 鼠标移出事件的回调
     */
    arcgis.mouseOut = function (_layer, callback) {
        _layer.on("mouse-out", callback)
    }

    // 监听地图缩放
    /**
     * map: 实例化的map对象
     * callback: 地图缩放事件的回调
     */
    arcgis.zoom = function (map, callback) {
        map.on("zoom-start", callback)
    }

    // 监听地图缩放end
    /**
     * map: 实例化的map对象
     * callback: 地图缩放结束的回调
     */
    arcgis.zoomEnd = function (map, callback) {
        map.on("zoom-end", callback)
    }

    // 鼠标滚动事件
    /**
     * map: 实例化的map对象
     * callback: 鼠标滚动事件的回调
     */
    arcgis.mousewheel = function (map, callback) {
        map.on("mouse-wheel", callback)
    }

    // 键盘事件
    /**
     * map: 实例化的map对象
     * callback: 键盘事件的回调
     */
    arcgis.keydown = function (map, callback) {
        map.on("key-down", callback)
    }
    arcgis.keyup = function (map, callback) {
        map.on("key-up", callback)
    }

    // 拖动地图事件
    /**
     * map: 实例化的map对象
     * callback: 拖动地图事件的回调
     */
    arcgis.pan = function (map, callback) {
        map.on("pan", callback)
    }

    // 拖动地图结束事件
    /**
     * map: 实例化的map对象
     * callback: 拖动地图结束的回调
     */
    arcgis.panend = function (map, callback) {
        map.on("pan-end", callback)
    }

    arcgis.all = true
}).catch(err => {
    throw err
})

export default arcgis