// Create Leaflet map
const map = L.map('map', {zoomControl: false}).setView([0, 0], 2);

// Create Basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Green marker
var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//red marker
var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//Get data from the database
async function getData() {
    const allMarkers = []
    const getResponse = await fetch('/api')
    const getData = await getResponse.json()
    for (item in getData){
        allMarkers.push(getData[item])
    }
    for (marcador in allMarkers){
        L.marker([ allMarkers[marcador].sendLat, allMarkers[marcador].sendLong ], {icon: greenIcon}).addTo(map)
            .bindPopup(`
                <b> Nome: </b> ${allMarkers[marcador].sendName}<br>
                <b> Data: </b> ${allMarkers[marcador].sendDate}<br>
                <b> Hora: </b> ${allMarkers[marcador].sendTime}<br>
                <b> Observação: </b> ${allMarkers[marcador].sendObs}<br>
                <b> Latitude: </b> ${allMarkers[marcador].sendLat}°<br>
                <b> Longitude: </b> ${allMarkers[marcador].sendLong}°<br>
                <b> id: </b> ${allMarkers[item]._id}<br>
            `)
    }

    
}
getData()

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
let firstMarker = true

function addMarker(){
    navigator.geolocation.getCurrentPosition(function(position){
        let markerLat = position.coords.latitude.toFixed(6)
        let markerLong = position.coords.longitude.toFixed(6)
        let markerAccuracy = position.coords.accuracy
        
        let marker = L.marker([markerLat, markerLong], {draggable: true, title: "novoMarcador", icon: redIcon})

        if (firstMarker){
            marker.addTo(map)
            firstMarker = false 
        } else {
            $('#alerta').modal()
        }

        document.getElementById("markerLat").value = markerLat
        document.getElementById("markerLong").value = markerLong

        //Marker drag function
        marker.on('dragend', function(event) {
            let latlng = event.target.getLatLng()
            document.getElementById("markerLat").value = latlng.lat
            document.getElementById("markerLong").value = latlng.lng
        })
        
        marker.on('click', function(){
            $('#exampleModal').modal()
        })

        $('#btnDelete').on('click', function(){
            marker.remove()
            firstMarker = true
        })

    }, error, options)
}
let btnAddMarker = document.getElementById('btnAddMarker')
btnAddMarker.addEventListener('click', addMarker)

//Enviar formulário
function sendData(){
    let sendName = document.getElementById('nome').value
    let sendDate = document.getElementById('date').value
    let sendTime = document.getElementById('time').value
    let sendLat = document.getElementById('markerLat').value
    let sendLong = document.getElementById('markerLong').value
    let sendObs = document.getElementById('obs').value

    let data = {
        sendName, 
        sendDate, 
        sendTime, 
        sendLat, 
        sendLong,
        sendObs
    }

    const options_send = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch('/api', options_send)
        .then(response =>{
            getData()
        })
        .then(response =>{
            for (item in map._layers){
                if (map._layers[item].options.title == "novoMarcador"){
                    map._layers[item].remove()
                    firstMarker = true
                }
            }
            
        })
        .then(response =>{
            $('#sucesso').modal()
            document.getElementById('nome').value = ""
            document.getElementById('date').value = ""
            document.getElementById('time').value = ""
            document.getElementById('markerLat').value = ""
            document.getElementById('markerLong').value = ""
            document.getElementById('obs').value = ""
        })
        
    
}
let btnSendData = document.getElementById('btnSendData')
btnSendData.addEventListener('click', sendData)




