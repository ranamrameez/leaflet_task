/* Created on 27 Jan, 2022
    Author: Rana Muhammad Rameez
    Place: Urban Unit 
    Updated on: 27 Jan, 2022: Created This separate js file for all map code
                28 Jan, 2022: Added the latlng labeling + Updated Routing
*/

// Shimla Hill Lahore's Location:
const shimlaLatLng = [31.562264550300096, 74.33584319594694];

/* ************************Base Layers and OverlaysLayers *************/
var mbAttr =
  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var mbUrl =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXJhbWVleiIsImEiOiJja3lsM25xcXczMjBxMnFvODgyeWJ1d2JuIn0.fYJTHaXf3mu0cRxoTCYvxA";
var cities = L.layerGroup();
var grayscale = L.tileLayer(mbUrl, {
  id: "mapbox/light-v9",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mbAttr,
});
var streets = L.tileLayer(mbUrl, {
  id: "mapbox/streets-v11",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mbAttr,
});
var satellite = L.tileLayer(mbUrl, {
  id: "mapbox/satellite-v9",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mbAttr,
});
var autonavi = L.tileLayer(
  "http://webrd0{s}.is.autonavi.com/appmaptile?lang=en&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
  {
    // maxZoom: 25,
    // minZoom: 1,
    subdomains: ["1", "2", "3", "4"],
  }
);
var terrain = L.tileLayer(mbUrl, {
  id: "mapbox/terrain-v2",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mbAttr,
});
var openStreet = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
});
// add Stamen Watercolor to map.
var watercolor = L.tileLayer.provider("Stamen.Watercolor"); //.addTo(map);
var openTopoMap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 17,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
);

/************ Overlay **************/
var mLahore = L.marker(shimlaLatLng).bindPopup("Lahore, PK.").addTo(cities);

/********* Init Leaflet Map ***********/
const map = L.map("map", {
  zoomControl: true,
  attributionControl: false,
  doubleClickZoom: true,
  scrollWheelZoom: true,

  center: shimlaLatLng,
  zoom: 12,
  layers: [openTopoMap, cities],
  scale: true,

  // measureControl: true,

  fullscreenControl: true,
  fullscreenControlOptions: {
    position: "topleft",
    title: "Show me the fullscreen !", // change the title of the button, default Full Screen
    titleCancel: "Exit fullscreen mode", // change the title of the button when fullscreen is on, default Exit Full Screen
  },
}).setView(shimlaLatLng, 14);

/*
// Showing error when we click on the results
const search = new GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
    style: 'bar',
    showMarker: true, // optional: true|false  - default true
    showPopup: false, // optional: true|false  - default false
    marker: {
        // optional: L.Marker    - default L.Icon.Default
        icon: new L.Icon.Default(),
        draggable: false,
    },
    popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
    resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
    maxMarkers: 1, // optional: number      - default 1
    retainZoomLevel: false, // optional: true|false  - default false
    animateZoom: true, // optional: true|false  - default true
    autoClose: false, // optional: true|false  - default false
    searchLabel: 'Enter address', // optional: string      - default 'Enter address'
    keepResult: false, // optional: true|false  - default false
    updateMap: true, // optional: true|false  - default true
});
map.addControl(search);
*/

/* ************************Base Layers and OverlaysLayers *************/
var baseLayers = {
  "Open Street": openStreet,
  "<span style='color: gray'>Grayscale</span>": grayscale,
  Streets: streets,
  Satellite: satellite,
  Terrain: terrain,
  Highways: autonavi,
  Watercolor: watercolor,
  "<span style='color: yellow'>Open Topo</span>": openTopoMap,
};

var overlays = {
  Cities: cities,
};

/***************************All Generic Variables************************************/
var layerControl = L.control.layers(baseLayers, overlays).addTo(map);
var currentLocation;
var marker;
var distancePoints = new Array();
var polygon;

// Circle around Shimla Hill
var circle = L.circle(shimlaLatLng, {
  color: "green",
  fillColor: "#993",
  fillOpacity: 0.5,
  radius: 20,
})
  .addTo(map)
  .bindPopup("Lahore");

/****************************************************************All Conrtols *****************************/
L.control.scale({ metric: true, imperial: true }).addTo(map);

// https://gitlab.com/leaflet/mouseCoordinate
L.control.mouseCoordinate({utm:true,utmref:true}).addTo(map);


// https://github.com/stefanocudini/leaflet-compass/blob/master/examples/simple.html
var comp = new L.Control.Compass({autoActive: true, showDigit:true, position: 'topright'});
map.addControl(comp);


// <!-- https://github.com/MrMufflon/Leaflet.Coordinates -->
L.control
  .coordinates({
    position: "bottomleft",
    // position:"topright",
    useDMS: true,
    labelTemplateLat: "N {y}",
    labelTemplateLng: "E {x}",
    useLatLngOrder: true,
  })
  .addTo(map);

  L.control.coordinates({
    position:"bottomleft", //optional default "bootomright"
    decimals:12, //optional default 4
    decimalSeperator:".", //optional default "."
    labelTemplateLat:"Latitude: {y}", //optional default "Lat: {y}"
    labelTemplateLng:"Longitude: {x}", //optional default "Lng: {x}"
    enableUserInput:true, //optional default true
    useDMS:false, //optional default false
    useLatLngOrder: true, //ordering of labels, default false-> lng-lat
    markerType: L.marker, //optional default L.marker
    markerProps: {}, //optional default {},
    // labelFormatterLng : function(lng){return lng+" lng"}, //optional default none,
    // labelFormatterLat : function(lat){return lat+" lat"}, //optional default none
    customLabelFcn: function(latLonObj, opts) { "Geohash: " + encodeGeoHash(latLonObj.lat, latLonObj.lng)} //optional default none
  }).addTo(map);

// ESRI Geocoder
var searchControl = L.esri.Geocoding.geosearch({
  position: "topleft",
  placeholder: "Search with ESRI..", //"Enter an address or place e.g. 1 York St",
  useMapBounds: false,
  expanded: true,
  zoomToResult: true,
  collapseAfterResult: false,
  title: "Search Here",
  providers: [
    L.esri.Geocoding.arcgisOnlineProvider({
      apikey:
        "AAPKec28b75036ad4b6980aafb21ec5fca0fIc8OmL2BNc1IxV2PzXbHV_Lr0uN7LyIVIzvHNiOwsv3gARKs7nUH64X5ob0mYyaG", // replace with your api key - https://developers.arcgis.com
      nearby: {
        lat: -33.8688,
        lng: 151.2093,
      },
    }),
  ],
}).addTo(map);

// ESRI Geocoder Results
var results = L.layerGroup().addTo(map);

// ESRI Geocoder Event Handler
searchControl.on("results", function (data) {
  results.clearLayers();
  console.log("Searh Result Info: ");
  console.log("* The center of the results: (latlng=" + data.latlng + ")");
  console.log("* text: (text=" + data.text + ")");

  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
    console.log("** Location #" + i);

    console.log(
      "*** (latlng " +
        data.results[i].latlng +
        " text: " +
        data.results[i].text +
        ")"
    );
  }
});

var osmGeocoder = new L.Control.OSMGeocoder({
  collapsed: false /* Whether its collapsed or not */,
  position: "topleft" /* The position of the control */,
  text: "Locate" /* The text of the submit button */,
  placeholder: "Search With OSM" /* The text of the search input placeholder */,
  bounds: null /* a L.LatLngBounds object to limit the results to */,
  email:
    null /* an email string with a contact to provide to Nominatim. Useful if you are doing lots of queries */,
  callback: function (results) {
    var bbox = results[0].boundingbox,
      first = new L.LatLng(bbox[0], bbox[2]),
      second = new L.LatLng(bbox[1], bbox[3]),
      bounds = new L.LatLngBounds([first, second]);
    this._map.fitBounds(bounds);
  },
});
map.addControl(osmGeocoder);


/*
// https://github.com/perliedman/leaflet-routing-machine / https://www.liedman.net/leaflet-routing-machine/tutorials/basic-usage/
*/
var ReversablePlan = L.Routing.Plan.extend({
  createGeocoders: function () {
    var container = L.Routing.Plan.prototype.createGeocoders.call(this),
      reverseButton = createButton("↑↓", container);
    L.DomEvent.on(
      reverseButton,
      "click",
      function () {
        var waypoints = this.getWaypoints();
        this.setWaypoints(waypoints.reverse());
      },
      this
    );

    return container;
  },
});

var plan = new ReversablePlan(
  [
    L.latLng(31.59306597364911, 74.3682931861898),
    L.latLng(31.554665794346963, 74.34850235232662),
  ],
  {
    geocoder: L.Control.OSMGeocoder,
    routeWhileDragging: true,

    waypointNameFallback: function (latLng) {
      function zeroPad(n) {
        n = Math.round(n);
        return n < 10 ? "0" + n : n;
      }
      function sexagesimal(p, pos, neg) {
        var n = Math.abs(p),
          degs = Math.floor(n),
          mins = (n - degs) * 60,
          secs = (mins - Math.floor(mins)) * 60,
          frac = Math.round((secs - Math.floor(secs)) * 100);
        return (
          (n >= 0 ? pos : neg) +
          degs +
          "°" +
          zeroPad(mins) +
          "'" +
          zeroPad(secs) +
          "." +
          zeroPad(frac) +
          '"'
        );
      }

      return (
        sexagesimal(latLng.lat, "N", "S") +
        " " +
        sexagesimal(latLng.lng, "E", "W")
      );
    },
  }
);

var control = L.Routing.control({
  routeWhileDragging: true,
  plan: plan,
}).addTo(map);

/*
var control = L.Routing.control({
  waypoints: [
    L.latLng(31.59306597364911, 74.3682931861898),
    L.latLng(31.554665794346963, 74.34850235232662)
  ],
  routeWhileDragging: true,

  waypointNameFallback: function (latLng) {
    function zeroPad(n) {
      n = Math.round(n);
      return n < 10 ? "0" + n : n;
    }
    function sexagesimal(p, pos, neg) {
      var n = Math.abs(p),
        degs = Math.floor(n),
        mins = (n - degs) * 60,
        secs = (mins - Math.floor(mins)) * 60,
        frac = Math.round((secs - Math.floor(secs)) * 100);
      return (
        (n >= 0 ? pos : neg) +
        degs +
        "°" +
        zeroPad(mins) +
        "'" +
        zeroPad(secs) +
        "." +
        zeroPad(frac) +
        '"'
      );
    }

    return (
      sexagesimal(latLng.lat, "N", "S") +
      " " +
      sexagesimal(latLng.lng, "E", "W")
    );
  },

  // geocoder: L.Control.Geocoder.nominatim() // Not Working
  // geocoder: L.esri.Geocoding // Working but showing lat longs instead of addresses
//   geocoder: searchControl, // searchControl is working same as  L.esri.Geocoding. searchControl = L.esri.Geocoding.geosearch()
geocoder: L.Control.OSMGeocoder
}).addTo(map);
*/
function createButton(label, container) {
  var btn = L.DomUtil.create("button", "", container);
  btn.setAttribute("type", "button");
  btn.innerHTML = label;
  return btn;
}

map.on("click", function (e) {
  var container = L.DomUtil.create("div"),
    startBtn = createButton("Start from this location", container),
    destBtn = createButton("Go to this location", container);

  L.popup().setContent(container).setLatLng(e.latlng).openOn(map);

  L.DomEvent.on(startBtn, "click", function () {
    control.spliceWaypoints(0, 1, e.latlng);
    map.closePopup();
  });

  L.DomEvent.on(destBtn, "click", function () {
    control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
    map.closePopup();
  });
});

/*
// openstreetmap's nominatim's Search Control Options
L.control.search({
    url: "https://nominatim.openstreetmap.org/search?format=json&q={s}",
    propertyName: "display_name",
    jsonpParam: "json_callback",
    propertyLoc: ["lat", "lon"],
    autoCollapse: false,
    autoType: true,
    minLength: 3,
    style: "bar",
    position: "bottomleft",
    // moveToLocation: function(latlng, title, map) {
    //     var url = L.Util.template('http://osm.org/?mlat={lat}&amp;mlon={lon}#map={zoom}/{lat}/{lon}', {
    //         lat: latlng.lat,
    //         lon: latlng.lng,
    //         zoom: map.getZoom()
    //     });
    //     location.href = url;
    // }
  })
  .addTo(map);
*/

// Adding Full Screen control with coding:
// map.addControl(new L.Control.Fullscreen());
// L.control.measure({
//     position: 'topleft',
//     keyboard: true,
//     lineColor: 'green',
//     lineWeight:3,
//     lineOpacity: 0.5,
//     textColor: 'green',

// //  distance formatter, output mile instead of km
//     // formatDistance: function (val) {
//     //     return Math.round(1000 * val / 1609.344) / 1000 + ' mile';
//     // }
// }).addTo(map);

// polylineMeasure's MeasurementOptions
mMeasurementOptions = {
  position: "topleft", // Position to show the control. Values: 'topright', 'topleft', 'bottomright', 'bottomleft'
  unit: "kilometres", // Default unit the distances are displayed in. Values: 'kilometres', 'landmiles', 'nauticalmiles'
  useSubunits: true, // Use subunits (metres/feet) in tooltips if distances are less than 1 kilometre/landmile
  clearMeasurementsOnStop: true, // Clear all measurements when Measure Control is switched off
  showBearings: true, // Whether bearings are displayed within the tooltips
  bearingTextIn: "In", // language dependend label for inbound bearings
  bearingTextOut: "Out", // language dependend label for outbound bearings
  tooltipTextFinish: "Click to <b>finish line</b><br>",
  tooltipTextDelete: "Press SHIFT-key and click to <b>delete point</b>",
  tooltipTextMove: "Click and drag to <b>move point</b><br>",
  tooltipTextResume: "<br>Press CTRL-key and click to <b>resume line</b>",
  tooltipTextAdd: "Press CTRL-key and click to <b>add point</b>",
  // language dependend labels for point's tooltips
  measureControlTitleOn: "Turn on PolylineMeasure", // Title for the Measure Control going to be switched on
  measureControlTitleOff: "Turn off PolylineMeasure", // Title for the Measure Control going to be switched off
  measureControlLabel: "&#8614;", // Label of the Measure Control (Unicode symbols are possible)
  measureControlClasses: [], // Classes to apply to the Measure Control
  showClearControl: true, // Show a control to clear all the measurements
  clearControlTitle: "Clear Measurements", // Title text to show on the Clear Control
  clearControlLabel: "&times", // Label of the Clear Control (Unicode symbols are possible)
  clearControlClasses: [], // Classes to apply to Clear Control
  showUnitControl: true, // Show a control to change the units of measurements
  unitControlUnits: ["kilometres", "landmiles", "nauticalmiles"],
  // measurement units being cycled through by using the Unit Control
  unitControlTitle: {
    // Title texts to show on the Unit Control
    text: "Change Units",
    kilometres: "kilometres",
    landmiles: "land miles",
    nauticalmiles: "nautical miles",
  },
  unitControlLabel: {
    // Unit symbols to show in the Unit Control and measurement labels
    metres: "m",
    kilometres: "km",
    feet: "ft",
    landmiles: "mi",
    nauticalmiles: "nm",
  },
  unitControlClasses: [], // Classes to apply to the Unit Control
  tempLine: {
    // Styling settings for the temporary dashed line
    color: "#00f", // Dashed line color
    weight: 2, // Dashed line weight
  },
  fixedLine: {
    // Styling for the solid line
    color: "#006", // Solid line color
    weight: 2, // Solid line weight
  },
  startCircle: {
    // Style settings for circle marker indicating the starting point of the polyline
    color: "#000", // Color of the border of the circle
    weight: 1, // Weight of the circle
    fillColor: "#0f0", // Fill color of the circle
    fillOpacity: 1, // Fill opacity of the circle
    radius: 3, // Radius of the circle
  },
  intermedCircle: {
    // Style settings for all circle markers between startCircle and endCircle
    color: "#000", // Color of the border of the circle
    weight: 1, // Weight of the circle
    fillColor: "#ff0", // Fill color of the circle
    fillOpacity: 1, // Fill opacity of the circle
    radius: 3, // Radius of the circle
  },
  currentCircle: {
    // Style settings for circle marker indicating the latest point of the polyline during drawing a line
    color: "#000", // Color of the border of the circle
    weight: 1, // Weight of the circle
    fillColor: "#f0f", // Fill color of the circle
    fillOpacity: 1, // Fill opacity of the circle
    radius: 3, // Radius of the circle
  },
  endCircle: {
    // Style settings for circle marker indicating the last point of the polyline
    color: "#000", // Color of the border of the circle
    weight: 1, // Weight of the circle
    fillColor: "#f00", // Fill color of the circle
    fillOpacity: 1, // Fill opacity of the circle
    radius: 3, // Radius of the circle
  },
};

// L.control.polylineMeasure(mMeasurementOptions).addTo(map);
// OR use the below on if we need polylineMeasure object for custom lines!
let polylineMeasure = L.control.polylineMeasure(mMeasurementOptions);
polylineMeasure.addTo(map);

const line1coords = [
  { lat: 22.156883186860703, lng: -158.95019531250003 },
  { lat: 22.01436065310322, lng: -157.33520507812503 },
  { lat: 21.391704731036587, lng: -156.17065429687503 },
  { lat: 20.64306554672647, lng: -155.56640625000003 },
];
const line2coords = [
  { lat: 19.880391767822505, lng: -159.67529296875003 },
  { lat: 17.90556881196468, lng: -156.39038085937503 },
];
polylineMeasure.seed([line1coords, line2coords]);

/********************************* Event Handlers ************************>*/

/**************** polylineMeasure Measurement Events *****************/
map.on("polylinemeasure:toogle", (e) => {
  /* e.sttus */
});
map.on("polylinemeasure:start", (currentLine) => {});
map.on("polylinemeasure:resume", (currentLine) => {});
map.on("polylinemeasure:finish", (currentLine) => {});
map.on("polylinemeasure:change", (currentLine) => {});
map.on("polylinemeasure:clear", (e) => {});
map.on("polylinemeasure:add", (e) => {
  /* e.latlng */
});
map.on("polylinemeasure:insert", (e) => {
  /* e.latlng */
});
map.on("polylinemeasure:move", (e) => {
  /* e.latlng ; e.sourceTarget._latlng */
});
map.on("polylinemeasure:remove", (e) => {
  /* e.latlng ; e.sourceTarget._latlng */
});

//onMapClick Handler
function onMapClick(e) {
  distancePoints.push(e.latlng);
  // marker = L.marker(e.latlng, {
  //     // icon:iconAddress,
  //     title:'Point' + distancePoints.length,
  //     draggable:true
  // }).addTo(map)
  // .bindPopup('<b>Point ' + distancePoints.length+'</b>').openPopup();

  // marker.on('move',function(){
  //     console.log('Marker Moved');
  // });

  var lat = e.latlng.lat;
  var lng = e.latlng.lng;
  console.log(
    "Point " + distancePoints.length + " (lat:" + lat + ", lng: " + lng + ")"
  );
  // polygon = L.polygon(distancePoints).addTo(map).bindPopup('Selected Area');
  // polygon = L.polygon([
  //     e.latlng,
  //     [lat + 0.0007, lng - 0.0007],
  //     [31.561368695556247, 74.332698163917],
  //     [lat - 0.00010, lng + 0.00050]
  // ]).addTo(map).bindPopup('Estimated Area From Current Location');
}

// onLocationFound: user Location Handler
function onLocationFound(e) {
  var radius = e.accuracy;
  currentLocation = e.latlng;
  L.marker(e.latlng)
    .addTo(map)
    .bindPopup("You are within " + radius + " meters from this point")
    .openPopup();
  L.circle(e.latlng, {
    color: "blue",
    fillColor: "#0f0",
    fillOpacity: 0.3,
    radius: radius % 40,
  })
    .addTo(map)
    .bindPopup("My Location");
}

//Map Error handler
function onLocationError(e) {
  alert(e.message);
}

var scale = true;
//Show Distance Scale
function toggleContols() {
  if (!scale) {
    L.control.scale().addTo(map);
    scale = true;
  } else {
    popup
      .setLatLng(currentLocation.latlng)
      .setContent("Scale aleady enabled!")
      .openOn(map);
  }
}

var popup = L.popup()
  .setLatLng(shimlaLatLng)
  .setContent("Shimla Hill")
  .openOn(map);

/********************************* Adding Event Handlers To Leaflet************************>*/
// events are fired when entering or exiting fullscreen.
map.on("enterFullscreen", function () {
  console.log("entered fullscreen");
});
map.on("exitFullscreen", function () {
  console.log("exited fullscreen");
});
map.on("click", onMapClick);
// map.on('dblclick', onMapClick); //Events ->> click, dblclick, preclick
map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);
map.locate({ watch: true, setView: true, maxZoom: 16 });
// map.stopLocate()
// map.removeControl(?);
// map.addControl(?);

console.log("Map loaded");
