// Create Leaflet map
const map = L.map('map', {zoomControl: false}).setView([0, 0], 1);

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

// Get the Coords from the location
var options = {
  enableHighAccuracy: true,
  timeout: 30000,
  maximumAge: 500000
}

let firstTime = true

function success (position) {
    let lat = position.coords.latitude.toFixed(6)
    let long = position.coords.longitude.toFixed(6)
    let accuracy = position.coords.accuracy.toFixed(2)

    document.getElementById('lat').textContent = lat
    document.getElementById('long').textContent = long
    document.getElementById('accuracy').textContent = accuracy

    //Set the map view
    if (firstTime && accuracy < 100){
        map.setView([lat, long], 20)
        firstTime = false
    } else if (firstTime && accuracy >= 100) {
        map.setView([lat, long], 13)
        firstTime = false
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

// Create marker
function addMarker(){
    
    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position)
        let markerLat = position.coords.latitude
        let markerLong = position.coords.longitude
        let markerAccuracy = position.coords.accuracy
        
        let marker = L.marker([markerLat, markerLong], {draggable: true}).addTo(map)

        //Marker drag function
        marker.on('dragend', function(event) {
            let latlng = event.target.getLatLng();
            console.log(latlng.lat, latlng.lng)
        
        })
        
    }, 
    error, 
    options
    )
}

let btnAddMarker = document.getElementById('btnAddMarker')
btnAddMarker.addEventListener('click', addMarker)


