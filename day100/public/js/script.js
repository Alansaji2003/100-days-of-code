//MAP
const searchInput = document.getElementById('searchInput');
const voiceBtn = document.getElementById('voiceBtn');
const searchResults = document.getElementById('searchResults');
const statusResult = document.getElementById('status');
import { myToken } from './config.js';  // mapbox token from config file, get your own from mapbox website
voiceBtn.addEventListener('click', function() {
    recognizeSpeech();
});

function recognizeSpeech() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        
        statusResult.style.display = 'block';
        statusResult.innerHTML = `<p>Talk now. I am listening</p>....`;
        setTimeout(function() {
            statusResult.style.display = 'none';
        }, 10000);
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        search();
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error occurred: ' + event.error);
    };

    recognition.start();
}

function search() {
    const query = searchInput.value.trim();
    //  implement your search logic
    
    searchResults.style.display = 'block';
    searchResults.innerHTML = `<p>Search query: ${query}</p>`;
}
//get location
mapboxgl.accessToken = myToken;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.006, 40.7128],
    zoom: 12,
  });

  const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/driving',
    alternatives: true,
    instructions: 'html',
    language: 'en',
    placeholderOrigin: 'Enter start location',
    placeholderDestination: 'Enter end location',
    geocoder: {
      placeholder: 'Enter start or end location',
    },
  });

  map.addControl(directions, 'top-left');

  // Handle "Start Navigation" button click
  document.getElementById('startNavigation').addEventListener('click', () => {
    // Start navigation logic goes here
    
  });