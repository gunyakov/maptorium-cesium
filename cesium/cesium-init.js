
function resizeContainer() {
    let height = $(document).height() - $(".navbar-header").height();
    $("#cesiumContainer").height(height); 
    $(".main-content").height(height);
    $("#routeInfo").css("bottom", `${$("#routeInfo").height() + 40 + 18}px`);
}
resizeContainer();
$(document).on("resize", resizeContainer);

let defMap = Cesium.ImageryLayer.fromProviderAsync(new Cesium.UrlTemplateImageryProvider({
    url : Cesium.buildModuleUrl('../tile/any') + '/{z}/{x}/{y}.any',
    tilingScheme : new Cesium.WebMercatorTilingScheme(),
    maximumLevel : 20
}));

const viewer = new Cesium.Viewer("cesiumContainer", {
  baseLayer: defMap,
  baseLayerPicker: false,
  //terrain: tms,
  geocoder: false,
  animation: false,
  timeline: false,
  scene3DOnly: true,
  sceneModePicker: false
});

const layers = viewer.scene.imageryLayers;

let mouseIn = false;

let lastPoly = false;
let lastMaterial = false;
function ConvertDEGToDMS(deg, lat) {
        var absolute = Math.abs(deg);

        var degrees = Math.floor(absolute);
        var minutesNotTruncated = (absolute - degrees) * 60;
        var minutes = Math.floor(minutesNotTruncated);
        var seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

        if (lat) {
            var direction = deg >= 0 ? "N" : "S";
        } else {
            var direction = deg >= 0 ? "E" : "W";
        }

        return degrees + "°" + minutes + "'" + seconds + "\"" + direction;
    }
viewer.screenSpaceEventHandler.setInputAction(function(e) {
    let cartesian = viewer.camera.pickEllipsoid(e.endPosition, viewer.scene.globe.ellipsoid);
    //consoole.log(cartesian);
    if(cartesian) {
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        $("#mLat").html("Lat: " + ConvertDEGToDMS(lat, true));
        $("#mLng").html("Lng: " + ConvertDEGToDMS(lng, false));
    }


    var pObj = viewer.scene.pick(e.endPosition);
    if(pObj && pObj.id) {
        if(mouseIn === false) {
            lastPoly = viewer.entities.getById(pObj.id._id);
            if(lastPoly.polyline) {
                lastMaterial = lastPoly.polyline.material;
                lastPoly.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
                                                color: Cesium.Color.RED,
                                                outlineColor: Cesium.Color.YELLOW,
                                                outlineWidth: 2
                                            });
                lastPoly.polyline.width = 6;
            }
            if(lastPoly.polygon) {
                lastMaterial = lastPoly.polygon.material
                lastPoly.polygon.material = Cesium.Color.BLACK.withAlpha(0.5)
                lastPoly.polygon.outlineColor = Cesium.Color.BLACK;
                lastPoly.polygon.outlineWidth = 4;
            }
            mouseIn = null;
            setTimeout(() => { mouseIn = true}, 500);
        }
    }
    else {
        if(lastPoly && mouseIn === true) {
            if(lastPoly.polyline) {
                lastPoly.polyline.material = lastMaterial;
                lastPoly.polyline.width = 2;
            }
            if(lastPoly.polygon) {
                lastPoly.polygon.material = lastMaterial;
                lastPoly.polygon.outlineColor = Cesium.Color.WHITE;
                lastPoly.polygon.outlineWidth = 2;
            }
            mouseIn = null;
            lastPoly = false;
            setTimeout(() => { mouseIn = false}, 500);
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

viewer.screenSpaceEventHandler.setInputAction(function(e) {
    if(lastPoly) {
        console.log("Init menu");
    }
}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
viewer.screenSpaceEventHandler.setInputAction(function(e) {
    console.log("Close menu");
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

viewer.screenSpaceEventHandler.setInputAction(function(e) {
    console.log(viewer.camera.getMagnitude());
    const eartRadius = 6378137;
    const tileSize = 256;
    const ratio = eartRadius * 2 * Math.PI / tileSize;
    const zoom = Math.round(Math.log(ratio * viewer.camera.positionCartographic.height) / Math.log(2));
    $("#mZ").html("Z" + (45 - zoom));
}, Cesium.ScreenSpaceEventType.WHEEL);
//------------------------------------------------------------
//Vars for maps and layers 
//------------------------------------------------------------
let mapsLayers = {};
let overlayLayers = {};
//------------------------------------------------------------
//Init Drawer class for map
//------------------------------------------------------------
let MDraw = new MDRAW(viewer);
//------------------------------------------------------------
//Cesium specific functions and interractions
//------------------------------------------------------------
(async() => {
    // console.log(Cesium.buildModuleUrl('') + 'mapbox.json');
    // let vectorTiles = await Cesium.Cesium3DTileset.fromUrl(
    //     Cesium.buildModuleUrl('') + 'mapbox.json'
    // );
    // console.log(vectorTiles);
    // viewer.scene.primitives.add(vectorTiles);
    //------------------------------------------------------------
    //Set function what will execute when maptorium init
    //------------------------------------------------------------
    M.on("init", async function(mapsList, layersList) {

        //Prepare tile layers for maps
        for(let i = 0; i < mapsList.length; i++) {
            let mapInfo = mapsList[i];
            mapsLayers[mapInfo.id] = Cesium.ImageryLayer.fromProviderAsync(new Cesium.UrlTemplateImageryProvider({
                url : Cesium.buildModuleUrl(`../tile/${mapInfo.id}`) + '/{z}/{x}/{y}.any',
                tilingScheme : new Cesium.WebMercatorTilingScheme(),
                maximumLevel : 20
            }));
        }
        //Prepare tile layers for overlays
        for(let i = 0; i < layersList.length; i++) {
            let mapInfo = layersList[i];
            if(mapInfo.format != "vector") {
                overlayLayers[mapInfo.id] = Cesium.ImageryLayer.fromProviderAsync(new Cesium.UrlTemplateImageryProvider({
                    url : Cesium.buildModuleUrl(`../tile/${mapInfo.id}`) + '/{z}/{x}/{y}.any',
                    tilingScheme : new Cesium.WebMercatorTilingScheme(),
                    maximumLevel : 20
                }));
            }
            else {
                
            }
        }
        setTimeout(() => $("#side-menu").metisMenu({toggle: true}), 1000);
        
    });
    //------------------------------------------------------------
    //Center map event raised when default config received from server
    //or when Centered GPS position activated
    //------------------------------------------------------------
    M.on("map.center", function(lat, lng, zoom) {
        //map.setView([lat, lng], zoom);
    });
    //------------------------------------------------------------
    //Fire when need change main map
    //------------------------------------------------------------
    M.on("map.change", function(mapID, currentMapID) {
        console.log("map change to ", mapID);
        //console.log(mapsLayers[mapID]);
        if(defMap) {
            layers.remove(defMap, true);
            defMap = false;
        }
        if(currentMapID) {
            layers.remove(mapsLayers[currentMapID]);
        }
        layers.add(mapsLayers[mapID]);
        layers.lowerToBottom(mapsLayers[mapID]);
    });
    //------------------------------------------------------------
    //Fire when need add overlay to map
    //------------------------------------------------------------
    M.on("map.layerAdd", function(layerID) {
        layers.add(overlayLayers[layerID]);
        layers.raiseToTop(overlayLayers[layerID]);
    });
    //------------------------------------------------------------
    //Fire when need remove overlay from map
    //------------------------------------------------------------
    M.on("map.layerRemove", function(layerID) {
        layers.remove(overlayLayers[layerID]);
        // overlayLayers[layerID].remove();
    });
    //------------------------------------------------------------
    //Fire when gps have new coords
    //------------------------------------------------------------
    M.on("gps.update", function(lat, lng, dir) {
        MDraw.moveMarker(lat, lng, dir);
    });
    //------------------------------------------------------------
    //Fire when route insert new point
    //------------------------------------------------------------
    M.on("route.point", function(lat, lng) {
        console.log("Router.Point");
        MDraw.routePoint(lat, lng);
    });
    //------------------------------------------------------------
    //Fire when need to hide current route
    //------------------------------------------------------------
    M.on("route.hide", function() {
        MDraw.hideRoute();
    });
    //------------------------------------------------------------
    //Fire when need to show current route
    //------------------------------------------------------------
    M.on("route.show", function(points) {
        MDraw.drawRoute(points);
    });
    //------------------------------------------------------------
    //Fire when need to hide history routes
    //------------------------------------------------------------
    M.on("history.hide", function() {
        MDraw.hideHistory();
    });
    //------------------------------------------------------------
    //Fire when need to show history route
    //------------------------------------------------------------
    M.on("history.show", function(ID, points) {
        MDraw.drawPolyline(points);
    });
    //------------------------------------------------------------
    //Fire when need to draw polygon
    //------------------------------------------------------------
    M.on("add.polygon", function(points, ID, options) {
        MDraw.drawPolygon(points, ID, options);
    });
    //------------------------------------------------------------
    //Fire when need to draw polyline
    //------------------------------------------------------------
    M.on("add.polyline", function(points) {
        MDraw.drawPolyline(points);
    });
    //------------------------------------------------------------
    //Fire when need to draw point
    //------------------------------------------------------------
    M.on("add.point", function(points) {
        MDraw.drawPoint(points);
    });
    //------------------------------------------------------------
    //Fire when new cached Map arrive
    //------------------------------------------------------------
    M.on("cachedtile.map", function(mapInfo) {
        //CachedMap.setData(mapInfo);
        //CachedMap.bringToFront();
    });
    //------------------------------------------------------------
    //Fire when tile in cache map change state
    //------------------------------------------------------------
    M.on("cachedtile.tile", function(tileInfo) {
        //CachedMap.updateTile(tileInfo);
    });
    //------------------------------------------------------------
    //Init new Maptorium UI after all preparations. Must call last
    //------------------------------------------------------------
    M.init();
})();