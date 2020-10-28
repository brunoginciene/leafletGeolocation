// Create Leaflet map
const map = L.map('map').setView([0, 0], 1);

// Create Basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Create cicle location
let circle = L.circle([0, 0], {
    color: 'yellow',
    fillColor: 'yellow',
    fillOpacity: 0.5,
    radius: 0
}).addTo(map)

// Create marker
let marker = L.marker([0, 0], {
    draggable: true
}).addTo(map)

// Get the Coords from the location
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}

function success (position) {
    let lat = position.coords.latitude
    let long = position.coords.longitude
    let accuracy = position.coords.accuracy

    document.getElementById('lat').textContent = lat
    document.getElementById('long').textContent = long
    document.getElementById('accuracy').textContent = accuracy

    //Set the map view
    if (accuracy < 100){
        map.setView([lat, long], 20)
    } else {
        map.setView([lat, long], 13)
    }

    //Set the lat, long and radius of the circle
    circle.setLatLng([lat, long])
    .setRadius(accuracy)
    .bindPopup(`
    <b> Você está nas coordenadas:</b> <br>
    <b> Latitude: </b> ${lat}°<br>
    <b> Longitude: </b> ${long}° <br>
    <b> Acurácia: </b> ${accuracy} m
    `) 

    // Create marker
    marker.setLatLng([lat, long])
}

function error (err) {
  console.log('ERROR(' + err.code + '): ' + err.message)
}

if ('geolocation' in navigator) {
    console.log('geolocation available')
    navigator.geolocation.watchPosition(success, error, options)
} else {
    console.log('geolocation not available')
}