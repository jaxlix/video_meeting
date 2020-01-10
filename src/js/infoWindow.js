define([
    "dojo/Evented",
    "dojo/parser",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/dom-style",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/fx/Toggler",
    "dojo/fx",
    "dojo/Deferred",
    "esri/domUtils",
    "esri/InfoWindowBase"
],
function(
    Evented,
    parser,
    on,
    declare,
    domConstruct,
    array,
    domStyle,
    lang,
    domClass,
    Toggler,
    coreFx,
    Deferred,
    domUtils,
    InfoWindowBase
) {
    var infoWidth,infoHeight;
    var initMapCenter,initScreenCenter;
    var showMapPoint,showScreenPoint=null;
    return declare([InfoWindowBase, Evented], {

        isContentShowing :false,

        constructor: function(parameters) {


            lang.mixin(this, parameters);

            domClass.add(this.domNode, "myInfoWindow"); // 构建弹窗容器
            this._closeButton = domConstruct.create("img",{"class": "ciw-close","src": "images/icon/close-white.png", "title": "Close"}, this.domNode);
            this._title = domConstruct.create("div",{"class": "ciw-title"}, this.domNode);
            this._content = domConstruct.create("div",{"class": "myInfoBox"}, this.domNode);

            this._toggleButton = domConstruct.create("div",{"class": "toggleOpen1", "title": "Toggle"}, this.domNode);

            var toggler = new  Toggler({
                "node": this._content,
                showFunc: coreFx.wipeIn,
                hideFunc: coreFx.wipeOut
            });
            toggler.show();
            on(this._closeButton, "click", lang.hitch(this, function(){
                //hide the content when the info window is toggled close.
                this.hide();
                if(this.isContentShowing){
                    toggler.hide();
                    this.isContentShowing = false;
                    domClass.remove(this._toggleButton);
                    domClass.add(this._toggleButton, "toggleOpen");
                }
            }));
            on(this._toggleButton, "click", lang.hitch(this, function(){
                //animate the content display
                if(this.isContentShowing){

                    toggler.hide();
                    this.isContentShowing = false;
                    domClass.remove(this._toggleButton);
                    domClass.add(this._toggleButton,"toggleOpen");

                }else{
                    toggler.show();
                    this.isContentShowing=true;
                    domClass.remove(this._toggleButton);
                    domClass.add(this._toggleButton,"toggleClose");
                }

            }));
            //hide initial display
            // domUtils.hide(this.domNode);
            this.isShowing = false;
        },
        setMap: function(map){
            this.inherited(arguments);
            map.on("pan-start", lang.hitch(this, function(){
               /* this.hide();*/
            }));
            map.on("zoom-start", lang.hitch(this, function(){
                domUtils.hide(this.domNode);
                this.hide();
            }));
            map.on("pan", lang.hitch(this, function(pan){
                var movePoint=pan.delta;
                if(this.isShowing)
                {
                    if(showScreenPoint!=null)
                    {
                        this._showInfoWindow(showScreenPoint.x+movePoint.x,showScreenPoint.y+movePoint.y);
                    }
                }
            }));
            map.on("pan-end", lang.hitch(this, function(panend){
                var movedelta=panend.delta;
                if(this.isShowing){
                    showScreenPoint.x=showScreenPoint.x+movedelta.x;
                    showScreenPoint.y=showScreenPoint.y+movedelta.y;
                }
            }));
            map.on("zoom-end", lang.hitch(this, function(){
                if(this.isShowing){
                    showScreenPoint=this.map.toScreen(showMapPoint);
                    this._showInfoWindow(showScreenPoint.x,showScreenPoint.y);
                }
            }));

        },
        setTitle: function(title){
            this.place(title, this._title);

        },
        setType: function(type){
            this._type=type;

        },
        setContent: function(content){
            this.place(content, this._content);
        },
        _showInfoWindow:function(x,y)
        {
            //Position 10x10 pixels away from the specified location
            domStyle.set(this.domNode,{
                "left":(x - infoWidth/2)  + "px",
                "top": (y - infoHeight - 35) + "px"
            });
            //display the info window
            domUtils.show(this.domNode);
        },
        show: function(location){
            infoHeight= parseInt($(".myInfoWindow").height());
            infoWidth= parseInt($(".myInfoWindow").width());
            if(location!=undefined){
            if(location.spatialReference){
                location = this.map.toScreen(location);
            }
            initMapCenter=this.map.extent.getCenter();
            initScreenCenter=this.map.toScreen(initMapCenter);

            var left=location.x-infoWidth/2;
            var top=location.y-infoHeight-75;
            var rights = document.body.offsetWidth;
            var right=rights-location.x-infoWidth/2;
            showScreenPoint=location;
            if(top<5) {
                initScreenCenter.y=initScreenCenter.y+top-5;
            }
            if(left<5) {
                initScreenCenter.x=initScreenCenter.x+left-5;
            }
            if(right<5) {
                initScreenCenter.x=initScreenCenter.x - right + 5;
            }
            this._showInfoWindow(showScreenPoint.x,showScreenPoint.y);
            initMapCenter=this.map.toMap(initScreenCenter);
            this.map.centerAt(initMapCenter);
                this.isShowing = true;
            }else{
                var positionX = $("body").width() - 350 - infoWidth/2;
                var positionY = 434;

                this._showInfoWindow(positionX,positionY);
                this.isShowing = false;
            }

            this.onShow();
        },
        hide: function(){
            domUtils.hide(this.domNode);
            this.isShowing = false;
            this.onHide();
            sessionStorage.removeItem("infoBox");
            sessionStorage.removeItem("infoBox_no");
        },
        resize: function(width, height){
            domStyle.set(this._content,{
                "width": width + "px",
                "height": height + "px"
            });

        },
        destroy: function(){
            domConstruct.destroy(this.domNode);
            this._closeButton = this._title = this._content = null;

        }


    });

});
