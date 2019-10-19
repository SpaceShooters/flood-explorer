
  var today = new Date();
  var actualLayer;

  var day = new Date(today.getTime());

  var dayParameter = function () {
    return day.toISOString().split('T')[0];
  };

  var map;
  
  function update() {
    clearLayers();
	map.addLayer(createLayer(actualLayer, '2km', 0.5));
	init();
	var activeLayers = map.getLayers().getArray();
    document.querySelector('#day-label').textContent = dayParameter();
  };

  function clearLayers() {
	map.setLayerGroup(new ol.layer.Group());
  };

  function createLayer(mode, tileMatrix, opacity) {
    var source = new ol.source.WMTS({
      url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=' + dayParameter(),
      layer: mode,
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
	map = new ol.Map({
    view: new ol.View({
      maxResolution: 0.5625,
      projection: ol.proj.get('EPSG:4326'),
      extent: [-180, -90, 180, 90],
      center: [0, 0],
      zoom: 2,
      maxZoom: 8
    }),
    target: 'map',
    renderer: ['canvas', 'dom']
  });
	init();
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

  function setMod(selected){
	  var selectIndex=selected.selectedIndex;
	  var selectValue=selected.options[selectIndex].value;
	  actualLayer = selectValue;
	  console.log(selectValue);
	  clearLayers();
	  map.addLayer(createLayer(selectValue, '2km', 0.5));
	  init();
    document.querySelector('#day-label').textContent = dayParameter();
  }
  
  function init(){
	  map.addLayer(createLayer('Reference_Features', '250m', 1.0));
	  map.addLayer(createLayer('Reference_Labels', '250m', 1.0));
  }
