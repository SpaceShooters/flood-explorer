let lat = sessionStorage.getItem("lat");
let long = sessionStorage.getItem("long");

const gt = {"lat":lat?lat:"15.5000000","lon":long?long:"-90.2500000","ele":"195.9"}; // current location
const gtStart = gt; // starting coordinates
let endpointRegion = "https://restcountries.eu/rest/v2/regionalbloc/CAIS";

let Center = new google.maps.LatLng(gt.lat, gt.lon);
let directionsDisplay = new google.maps.DirectionsRenderer();
let directionsService = new google.maps.DirectionsService();
let map;

let getCountries = async function (data) {

  let countries = await axios.get(endpointRegion);
  let select = document.getElementById('countrySelect');

  for (let i in countries.data) {
      $(select).append('<option value="' + countries.data[i].nativeName + '">' + countries.data[i].name + '</option>');
  }
  let c = sessionStorage.getItem("country");
  $(select).val(c?c:"Guatemala");
}


let initialize = () => {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var properties = {
    center: Center,
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  map = new google.maps.Map(document.getElementById("map"), properties);
  directionsDisplay.setMap(map);

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(gtStart.lat, gtStart.lon),
    map: map,
    title: 'Flood explorer'
  });


  marker.setMap(map);
}


let setCountry = (country) => {
  directionsDisplay = new google.maps.DirectionsRenderer();
  let properties = {
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  map = new google.maps.Map(document.getElementById("map"), properties);
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
          
      }
  });

}

google.maps.event.addDomListener(window, 'load', initialize);
getCountries();

