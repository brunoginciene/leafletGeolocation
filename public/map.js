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
    fillOpacity: 0.2,
    radius: 0
}).addTo(map)

// Create marker
let marker = L.marker([0, 0], {
    draggable: true
}).addTo(map)

// Get the Coords from the location
if ('geolocation' in navigator) {
    console.log('geolocation available')
    navigator.geolocation.watchPosition(position => {
        let lat = position.coords.latitude
        let long = position.coords.longitude
        let accuracy = position.coords.accuracy

        document.getElementById('lat').textContent = lat
        document.getElementById('long').textContent = long
        document.getElementById('accuracy').textContent = accuracy

        //Set the map view
        map.setView([lat, long], 13)

        //Set the lat, long and radius of the circle
        circle.setLatLng([lat, long])
        .setRadius(accuracy)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.') 

        // Create marker
        marker.setLatLng([lat, long])
          
    })
} else {
    console.log('geolocation not available')
}







