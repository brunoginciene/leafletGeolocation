if ('geolocation' in navigator) {
    console.log('geolocation available')
    navigator.geolocation.watchPosition(position => {
        let lat = position.coords.latitude
        let long = position.coords.longitude
        let accuracy = position.coords.accuracy

        document.getElementById('lat').textContent = lat
        document.getElementById('long').textContent = long
        document.getElementById('accuracy').textContent = accuracy
    })
} else {
    console.log('geolocation not available')
}