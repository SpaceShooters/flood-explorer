
var today = new Date();
var actualLayer;

var day = new Date(today.getTime());

var dayParameter = function () {
  return day.toISOString().split('T')[0];
};

var mapGoogle;

function update() {
  clearLayers();
  mapGoogle.addLayer(createLayer(actualLayer, '2km', 0.5));
  init();
  var activeLayers = mapGoogle.getLayers().getArray();
  document.querySelector('#day-label').textContent = dayParameter();
};

function clearLayers() {
  mapGoogle.setLayerGroup(new ol.layer.Group());
};

function createLayer(mode, tileMatrix, opacity) {
  var source = new ol.source.WMTS({
    url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=' + dayParameter(),
    layer: mode,
    crossOrigin: "Anonymous",
    format: 'image/png',
    matrixSet: tileMatrix,
    tileGrid: new ol.tilegrid.WMTS({
      origin: [-180, 90],
      resolutions: [
        0.5625,
        0.28125,
        0.140625,
        0.0703125,
        0.03515625,
        0.017578125,
        0.0087890625,
        0.00439453125,
        0.002197265625
      ],
      matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      tileSize: 512
    })
  });

  var layer = new ol.layer.Tile({ source: source });
  layer.setOpacity(opacity);
  return layer;
};


window.onload = function () {
  mapGoogle = new ol.Map({
    view: new ol.View({
      maxResolution: 0.5625,
      projection: ol.proj.get('EPSG:4326'),
      extent: [-180, -90, 180, 90],
      center: [-90.2500000, 15.5000000],
      zoom: 2,
      maxZoom: 8
    }),
    target: 'map',
    renderer: ['canvas', 'dom']
  });
  init();
  var vectorSource = new ol.source.Vector({
  });
  var vectorLayer = new ol.layer.Vector({
    source: vectorSource

  });


  mapGoogle.addLayer(vectorLayer);

  mapGoogle.on('singleclick', function (evt) {
    let cor = evt.coordinate;
    sessionStorage.setItem('lat', evt.coordinate[1]);
    sessionStorage.setItem('long', evt.coordinate[0]);        
    sessionStorage.setItem('coordinate', cor);
    exportMap();
  });
  document.querySelector('#day-label').textContent = dayParameter();

  document.querySelector('#day-slider')
    .addEventListener('change', function (event) {
      var newDay = new Date(today.getTime());
      newDay.setUTCDate(today.getUTCDate() +
        Number.parseInt(event.target.value));
      day = newDay;
      update();
    });

}

function exportMap() {
  var node = document.getElementById('map');
  domtoimage.toJpeg(node, { quality: 0.95 })
    .then(function (dataUrl) {
      sessionStorage.setItem('map', dataUrl);  
      document.getElementById("test").click();

    });
}



function setMod(selected) {
  var selectIndex = selected.selectedIndex;
  var selectValue = selected.options[selectIndex].value;
  actualLayer = selectValue;
  clearLayers();
  mapGoogle.addLayer(createLayer(selectValue, '2km', 0.5));
  init();
  document.querySelector('#day-label').textContent = dayParameter();
}

function init() {
  mapGoogle.addLayer(createLayer('Reference_Features', '250m', 1.0));
  mapGoogle.addLayer(createLayer('Reference_Labels', '250m', 1.0));
}
