//------------------------------------------------------------------------------
//Draw polylines route/route history and handle marker position.
//------------------------------------------------------------------------------
class MDRAW {

  constructor (viewer, options) {
    this.options = {
      centered : false,
      showRoute: false,
      gpsRun: false,
      routeColor: Cesium.Color.BROWN,
      historyColor: Cesium.Color.BEIGE,
      //------------------------------------------------------------------------------
      //Default style for geometry
      //------------------------------------------------------------------------------
      color: '#3388ff',
      fillColor: '#444444',
      fillOpacity: 0.5,
      ship: "/cesium/CesiumMilkTruck/CesiumMilkTruck.glb"
    }
    this.viewer = viewer;
    this.marker = false;
    this.history = [];
    this.routeDistance = 0;
    //--------------------------------------------------------------------------
    //Work with GPS data update
    //--------------------------------------------------------------------------
    //Reset all track data
    this.route = false;
	}

  moveMarker(lat, lng, dir = 0) {
    //Create marker if not yet
    if(!this.marker) this._makeMarker(lat, lng);

    const position = Cesium.Cartesian3.fromDegrees(
      lng,
      lat,
      0
    );
    this.marker.position = position;

    //Rotate marker according direction
    if(dir) {
      const heading = Cesium.Math.toRadians(dir - 90);
      const pitch = 0;
      const roll = 0;
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );
      this.marker.orientation = orientation;
    }

    if(this.options.centered) {
      //Put here function to center camera to map
    }
  }

  routePoint(lat, lng) {
    //If polyline is present on map
    if(this.route) {
      //Add point to polyline
      Cesium.Cartesian3.add(this.route.polyline.positions, Cesium.Cartesian3.fromDegreesArray([lng, lat]), this.route.polyline.positions);
      //let curDistance = this.route.distance("m");
      //$("#curDistance").text(curDistance + " mls.");
      // if(this.distance > 0) {
      //   let timeToGo = (this.distance - curDistance) / data['sog'];
      //   $("#timeToGo").html(timeToGo.toFixed(2) + " hrs");
      //   $("#leaveDistance").html((this.distance - curDistance) + " mls.");
      // }
    }
  }

  centered() {
    this.options.centered = !this.options.centered;
    return this.options.centered;
  }

  hideRoute() {
    //Remove polyline from map
    this._clean();
  }

  drawRoute(points) {
    this._clean();
    let polyline = this._drawPolyline(points, this.options.routeColor);
    this.route = polyline;
    this.viewer.zoomTo(this.route);
    //$("#curDistance").text(this.route.distance("m") + " miles.");
  }
  service() {
    this.options.gpsRun = !this.options.gpsRun;
    if(!this.options.gpsRun && this.marker) {
      this.viewer.entities.remove(this.marker);
      this.marker = false;
    }
    return this.options.gpsRun;
  }

  hideHistory() {
    for (let [key, value] of Object.entries(this.history)) {
      this.viewer.entities.remove(value);
    }
    this.history = [];
    this.routeDistance = 0;
  }
  drawPolyline(points, color = this.options.historyColor) {
    let polyline = this._drawPolyline(points, color);
    //Save polyline in history storage
    this.history.push(polyline);
    //this.routeDistance += polyline.distance("m");
  }
  //----------------------------------------------------------------------------
  //Draw polygon on map
  //----------------------------------------------------------------------------
  drawPolygon(points, ID, options = { color: this.options.color, fillColor: this.options.fillColor, fillOpacity: this.options.fillOpacity, weight: 2}) {
    console.log("Draw polyline");
    let latlngs = this._convertPoints(points);
    const polygon = new Cesium.Entity({
      id: ID,
      name: "Polygon " + ID,
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(latlngs),
        material: Cesium.Color.CYAN.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 10
      },
    });
    viewer.entities.add(polygon);
  }
  //----------------------------------------------------------------------------
  //Convert points from server format to leaflet format
  //----------------------------------------------------------------------------
  _convertPoints(points) {
    let latlngs = [];
    if(points?.length > 1) {
      //Fill array with leaflet points
      for(let i = 0; i < points.length; i++) {
        latlngs.push(points[i]["lng"]);
        latlngs.push(points[i]["lat"]);
      }
    }
    return latlngs;
  }
  _drawPolyline(points, color) {
    let latlngs = this._convertPoints(points);
    if(latlngs?.length > 1) {
      let positions = Cesium.Cartesian3.fromDegreesArray(latlngs);
        let polyline = new Cesium.Entity({
        name: "Route",
        polyline: {
            positions: positions,
            width: 2,
            material: color,
            clampToGround: true,
        },
        });
        this.viewer.entities.add(polyline);     
        return polyline;
    }
    return false;
  }
  _makeMarker(lat, lng) {
    const position = Cesium.Cartesian3.fromDegrees(
      lng,
      lat,
      0
    );
    const heading = Cesium.Math.toRadians(0);
    const pitch = 0;
    const roll = 0;
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    );

    this.marker = new Cesium.Entity({
      name: "Pointer",
      position: position,
      orientation: orientation,
      model: {
        uri: this.options.ship,
        minimumPixelSize: 128,
        maximumScale: 5000,
      },
    });

    this.viewer.entities.add(this.marker);
  }
  //----------------------------------------------------------------------------
  //Remove polyline from map
  //----------------------------------------------------------------------------
  _clean() {
    if(this.route) {
      this.viewer.entities.remove(this.route);
      this.route = false;
    }
    if(this.marker) {
      this.viewer.entities.remove(this.marker);
      this.marker = false;
    }
  }
  
}