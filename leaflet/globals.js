//------------------------------------------------------------
//Config for maptorium DOM utility
//------------------------------------------------------------
let MDOM = new M.MDOM({
    mapsContainerID: "maps-list",
    layersContainerID: "layers-list",
    menuParrentTag: "ul",
    menuChildTag: "li",
    menuParrentClass: "",
    menuChildClass: "",
    menuSelectedClass: "bg-secondary",
    gpsRouteButton: "gps-show-route",
    gpsRouteRecordButton: "gps-record-route",
    gpsRouteNewButton: "gps-new-route",
    gpsRouteTimeButton: "gps-sample-time",
    gpsHistoryButton: "gps-history-list",
    gpsHistoryCleanButton: "gps-clear-history",
    toggleClass: "bg-secondary",
    mapContainerID: "mapMenuContainer",
    routeListContainer: "route-list"
});
//------------------------------------------------------------
//Config for maptorium UI
//------------------------------------------------------------
let MUI = new M.Maptorium({
    vectorMapSupport: false,
    MDOM: MDOM
});

//------------------------------------------------------------
//Init leaflet map
//------------------------------------------------------------
$("#leaflet-map").height($(document).height() - $(".navbar-header").height() + 2);
let map = L.map('leaflet-map', {
    editable: true,
    contextmenu: true,
    worldCopyJump: true,
    maxBoundsViscosity: 1,
    contextmenuItems: [{
        text: 'Add placemark',
        iconCls: 'mdi mdi-pin-outline',
        callback: function() {}, //addPlacemark
      },
      '-',
      {
        text: 'Force download map tile to cache',
        callback: function() {}, //downloadTileMap,
        iconCls: "mdi mdi-download-multiple"
      },
      {
        text: 'Force download overlay tile to cache',
        callback: function() {}, //downloadTileOverlay,
        iconCls: "mdi mdi-download-multiple"
      },
      {
        text: 'Force download visible map tile to cache',
        callback: function() {}, //downloadTileMapForce,
        iconCls: "mdi mdi-download-multiple"
      },
      {
        text: 'Force download visible overlay tile to cache',
        callback: function() {}, //downloadTileOverlayForce,
        iconCls: "mdi mdi-download-multiple"
      }]
}).setView([39, 0], 5);

async function POIDelete(e) {
    let result = await MUI.deletePOI(e.relatedTarget.maptoriumID);
    if(result) e.relatedTarget.remove();
}

async function POIModal(e) {
    let ID = e.relatedTarget.maptoriumID;
    MUI.POIModal(ID, function(poiID, style) {
      map.eachLayer(function(layer) {
        if(layer.maptoriumID == poiID) {
          layer.setStyle(style);
        }
      });
    });
}
async function POIEdit(e) {
  let ID = e.relatedTarget.maptoriumID;
  MUI.POIEdit(ID, function() {
    
  });
  map.eachLayer(function(layer) {
    if(layer.maptoriumID == ID) {
      layer.enableEdit();
    }
  });
}
//----------------------------------------------------------------------------
//Global polygon options
//----------------------------------------------------------------------------
let globalPolygonOptions = {
    contextmenu: true,
    //contextmenuWidth: 140,
    contextmenuInheritItems: true,
    contextmenuItems: [
    '-',
    {
      text: 'Properties',
      callback: POIModal,
      iconCls: "mdi mdi-application-cog"
    },
    {
      text: 'Edit',
      callback: POIEdit,
      iconCls: "mdi mdi-circle-edit-outline"
    },
    {
      text: 'Bring to back',
      callback: function() {}, //bringToBack,
      iconCls: "mdi mdi-arrange-send-backward"
    },
    {
      text: 'Add to merge bar',
      callback: function() {}, //showPolygonMergeBar,
      iconCls: "mdi mdi-checkerboard-plus"
    },
    {
      text: 'Start download job',
      callback: function() {}, //window.showJobModal,
      iconCls: "mdi mdi-auto-download"
    },
    {
      text: 'Generate map',
      callback: function() {}, //window.showJobGenerateModal,
      iconCls: "mdi mdi-auto-download"
    },
    {
      text: 'Show tile cached map for main map',
      iconCls: "mdi mdi-data-matrix-plus",
      contextmenuItems: [{
        text: "Z6",
        callback: function() {}, //window.showTileCachedMap,
        data: 6
      },
      {
        text: "Z7",
        callback: function() {}, //window.showTileCachedMap,
        data: 7
      },
      {
        text: "Z8",
        callback: function() {}, //window.showTileCachedMap,
        data: 8
      },
      {
        text: "Z9",
        callback: function() {}, //window.showTileCachedMap,
        data: 9
      },
      {
        text: "Z10",
        callback: function() {}, //window.showTileCachedMap,
        data: 10
      },
      {
        text: "Z11",
        callback: function() {}, //window.showTileCachedMap,
        data: 11
      },
      {
        text: "Z12",
        callback: function() {}, //window.showTileCachedMap,
        data: 12
      },
      {
        text: "Z13",
        callback: function() {}, //window.showTileCachedMap,
        data: 13
      },
      {
        text: "Z14",
        callback: function() {}, //window.showTileCachedMap,
        data: 14
      },
      {
        text: "Z15",
        callback: function() {}, //window.showTileCachedMap,
        data: 15
      },
      {
        text: "Z16",
        callback: function() {}, //window.showTileCachedMap,
        data: 16
      },
      {
        text: "Z17",
        callback: function() {}, //window.showTileCachedMap,
        data: 17
      },
      {
        text: "Z18",
        callback: function() {}, //window.showTileCachedMap,
        data: 18
      }]
    },
    '-',
    {
      text: 'Delete',
      callback: POIDelete,
      iconCls: "mdi mdi-delete-outline"
    }]
  }