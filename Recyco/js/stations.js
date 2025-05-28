// Initialize the map
let map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Sample data for pickup stations (in real application, this would come from a backend)
const sampleStations = [
    {
        id: 1,
        name: "Central Recycling Center",
        type: "recycling",
        address: "123 Green Street",
        lat: 0,
        lng: 0,
        distance: 0
    },
    // More stations would be added here from your backend
];

let userMarker = null;
let stationMarkers = [];

// Handle GPS button click
document.getElementById('gps-button').addEventListener('click', () => {
    if (navigator.geolocation) {
        document.getElementById('gps-button').disabled = true;
        document.getElementById('gps-button').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                updateMap(latitude, longitude);
                document.getElementById('gps-button').disabled = false;
                document.getElementById('gps-button').innerHTML = '<i class="fas fa-location-crosshairs"></i> Use My Location';
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to get your location. Please check your GPS settings and try again.");
                document.getElementById('gps-button').disabled = false;
                document.getElementById('gps-button').innerHTML = '<i class="fas fa-location-crosshairs"></i> Use My Location';
            }
        );
    } else {
        alert("Geolocation is not supported by your browser");
    }
});

// Update map with new location
function updateMap(lat, lng) {
    // Update user marker
    if (userMarker) {
        userMarker.setLatLng([lat, lng]);
    } else {
        userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'user-marker',
                html: '<i class="fas fa-user-circle"></i>',
                iconSize: [30, 30]
            })
        }).addTo(map);
    }

    // Center map on user location
    map.setView([lat, lng], 13);

    // Update stations with distances and display them
    updateStationsList(lat, lng);
}

// Calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Update stations list and markers
function updateStationsList(userLat, userLng) {
    // Clear existing markers
    stationMarkers.forEach(marker => marker.remove());
    stationMarkers = [];

    // Get filter values
    const typeFilter = document.getElementById('filter-type').value;
    const distanceFilter = parseInt(document.getElementById('filter-distance').value);

    // Filter and sort stations
    const filteredStations = sampleStations
        .map(station => ({
            ...station,
            distance: calculateDistance(userLat, userLng, station.lat, station.lng)
        }))
        .filter(station => 
            (typeFilter === 'all' || station.type === typeFilter) &&
            station.distance <= distanceFilter
        )
        .sort((a, b) => a.distance - b.distance);

    // Update results container
    const resultsContainer = document.getElementById('stations-results');
    resultsContainer.innerHTML = '';

    filteredStations.forEach(station => {
        // Add marker to map
        const marker = L.marker([station.lat, station.lng])
            .bindPopup(`
                <strong>${station.name}</strong><br>
                ${station.address}<br>
                ${station.distance.toFixed(1)} km away
            `)
            .addTo(map);
        stationMarkers.push(marker);

        // Add to results list
        const stationElement = document.createElement('div');
        stationElement.className = 'station-item';
        stationElement.innerHTML = `
            <h3>${station.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${station.address}</p>
            <p><i class="fas fa-road"></i> ${station.distance.toFixed(1)} km away</p>
            <button class="btn btn-secondary" onclick="map.setView([${station.lat}, ${station.lng}], 15)">
                View on Map
            </button>
        `;
        resultsContainer.appendChild(stationElement);
    });
}

// Handle filter changes
document.getElementById('filter-type').addEventListener('change', () => {
    if (userMarker) {
        const latLng = userMarker.getLatLng();
        updateStationsList(latLng.lat, latLng.lng);
    }
});

document.getElementById('filter-distance').addEventListener('change', () => {
    if (userMarker) {
        const latLng = userMarker.getLatLng();
        updateStationsList(latLng.lat, latLng.lng);
    }
}); 