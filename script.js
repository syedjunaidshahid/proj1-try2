const map = L.map('map').setView([38.627, -90.1994], 12); // Coordinates for Saint Louis

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add a layer for parks in Saint Louis
const stlouis = 'https://raw.githubusercontent.com/blackmad/neighborhoods/master/st-louis.geojson';

fetch(stlouis)
  .then(response => response.json())
  .then(data => {
    const parksLayer = L.geoJSON(data).addTo(map);
  })
  .catch(error => console.error('Error fetching St Louis Neighborhoods layer:', error));

// Add a layer for pre-existing crime points in Saint Louis
const preExistingPointsURL = 'https://raw.githubusercontent.com/syedjunaidshahid/proj1-try2/main/crime.geojson';

fetch(preExistingPointsURL)
  .then(response => response.json())
  .then(data => {
    // Loop through each feature in the GeoJSON data
    data.features.forEach(feature => {
      const { coordinates } = feature.geometry;
      const { date, crimeType, details } = feature.properties;

      // Add a marker for each crime point with a popup
      const marker = L.marker([coordinates[1], coordinates[0]])
        .addTo(map)
        .bindPopup(`<b>${crimeType}</b><br>Date: ${date}<br>${details}`);
    });
  })
  .catch(error => console.error('Error fetching pre-existing crime points layer:', error));

// Array to store crime incidents
const crimeIncidents = [];

// Function to add a marker for a user-reported crime incident
function addCrimeIncident(lat, lng, date, crimeType, details) {
  const marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`<b>${crimeType}</b><br>Date: ${date}<br>${details}`);
  crimeIncidents.push({ lat, lng, date, crimeType, details });
}

// Event listener for map click to simulate reporting a crime incident
document.getElementById('addCrimeButton').addEventListener('click', function () {
  // Inform the user to click on the map to report a crime incident
  alert('Click on the map to report a crime incident.');

  // Get the map click event to add a marker at the clicked location
  map.once('click', function (e) {
    // Prompt users to enter details for the new crime incident
    const date = prompt('Enter date (YYYY-MM-DD):');
    const crimeType = prompt('Enter crime type:');
    const details = prompt('Enter additional details:');

    // Check if the entered data is valid
    if (date && crimeType && details) {
      // Add a marker for the crime incident
      addCrimeIncident(e.latlng.lat, e.latlng.lng, date, crimeType, details);
    } else {
      // Inform the user about invalid input
      alert('Invalid input. Crime incident not reported.');
    }
  });
});

