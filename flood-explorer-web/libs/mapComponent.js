let lat = sessionStorage.getItem("lat");
let long = sessionStorage.getItem("long");
const gt = {"lat":lat?lat:"15.5000000","lon":long?long:"-90.2500000","ele":"195.9"}; // current location
const gtStart = gt; // starting coordinates
let endpointRegion = "https://restcountries.eu/rest/v2/regionalbloc/CAIS";

//Initialize map
let Center = new google.maps.LatLng(gt.lat, gt.lon);
let directionsDisplay = new google.maps.DirectionsRenderer();
let directionsService = new google.maps.DirectionsService();
let map;

//Get countries
let getCountries = async function (data) {

  let countries = await axios.get(endpointRegion);
  let select = document.getElementById('countrySelect');

  for (let i in countries.data) {
      $(select).append('<option value="' + countries.data[i].nativeName + '">' + countries.data[i].name + '</option>');
  }

  let c = sessionStorage.getItem("country");
  $(select).val(c?c:"Guatemala");
}


// Head by set coordenates
let headboard = () =>{
  directionsDisplay = new google.maps.DirectionsRenderer();
  let properties = {
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  map = new google.maps.Map(document.getElementById("map2"), properties);
}


//Method initialize map default
let initialize = () => {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var properties = {
    center: Center,
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  map = new google.maps.Map(document.getElementById("map2"), properties);
  directionsDisplay.setMap(map);

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(gtStart.lat, gtStart.lon),
    map: map,
    title: 'Flood explorer'
  });

  marker.setMap(map);
  loadLocation(map);

}

//Set coordenates location
let setCoordenates = (location) => {
  headboard();
  map.setZoom(9);
  directionsDisplay.setMap(map);
  
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: 'Flood explorer'
  });
  map.setCenter(location);
  directionsDisplay.setMap(map);
  marker.setMap(map);
  sessionStorage.setItem("lat", map.center.lat());
  sessionStorage.setItem("long", map.center.lng());
  sessionStorage.removeItem("country");  
  loadLocation(map);
}

//Set coordenates location
let setCoordenatesStorage = () => {
  headboard();
  map.setZoom(9);
  directionsDisplay.setMap(map);
  
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(sessionStorage.getItem("lat"), sessionStorage.getItem("long")),
    map: map,
    title: 'Flood explorer'
  });
  map.setCenter( new google.maps.LatLng(sessionStorage.getItem("lat"), sessionStorage.getItem("long")));
  directionsDisplay.setMap(map);
  marker.setMap(map);
  sessionStorage.setItem("lat", map.center.lat());
  sessionStorage.setItem("long", map.center.lng());
  sessionStorage.removeItem("country");  
  loadLocation(map);
}

//Load selected location
let loadLocation = (map)=>{
  google.maps.event.addListener(map, 'click', function(event) { 
    let ltn = event.latLng;
    setCoordenates(ltn);
    viewCountry(ltn);
  });
}


//Set only country
let setCountry = (country) => {
  headboard();
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode( {'address' : country.target.value}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          directionsDisplay.setMap(map);
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(map.center.lat(), map.center.lng()),
            map: map,
            title: 'Flood explorer by' + country
          });
        
          marker.setMap(map);   
          sessionStorage.setItem("lat", map.center.lat());
          sessionStorage.setItem("long", map.center.lng());
          sessionStorage.setItem("country", country.target.value);
          loadLocation(map);
      }
  });

}

let viewCountry = (latlng) => {
  var geoCoder = new google.maps.Geocoder();
  console.log(latlng)
  geoCoder.geocode({
      location: latlng
  }, function(results, statusCode) {
    console.log(results)
      //var lastResult = results.slice(-2)[0];
      var lastResult = results[0];
  
      if (statusCode == 'OK' && lastResult && 'address_components' in lastResult) {
          console.log( 'country: ' + lastResult.formatted_address);
      } else {
        console.log( 'failed: ' + statusCode);
      }
  });

}

//Run api google maps
google.maps.event.addDomListener(window, 'load', initialize);
getCountries();

