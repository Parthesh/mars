// Initialize Cesium access token (not required when using the CDN version, but good practice)
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZTZhNGRkZS1kZDg2LTRlZTctOTAwOS0wMTk3YmEyM2I2YjAiLCJpZCI6MjIyNDAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODE1ODM2ODN9.iH21fRfhwcJ4HyUx2y_b1K2lh04-WiQdhmXewqVayGY';

// Define Mars ellipsoid (different from Earth's default in Cesium)
const ellipsoidMars = new Cesium.Ellipsoid(3376200, 3376200, 3376200);
const mapProjectionMars = new Cesium.GeographicProjection(ellipsoidMars);
const globeMars = new Cesium.Globe(ellipsoidMars);

// Configure Cesium viewer with Mars-specific settings
const viewer = new Cesium.Viewer('cesiumContainer', {
    mapProjection: mapProjectionMars,
    globe: globeMars,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false
});

// Disable Earth-specific features
viewer.scene.skyAtmosphere.show = false;
viewer.scene.fog.enabled = false;
viewer.scene.globe.showGroundAtmosphere = false;
viewer.scene.moon.show = false;
viewer.scene.sun.show = false;

// Enhance terrain visualization
viewer.scene.globe.enableLighting = true;
viewer.scene.globe.depthTestAgainstTerrain = true;

// Since we don't have actual Mars terrain data in this demo, we'll simulate it
// In a real application, you would use actual Mars terrain data
// For demonstration purposes, we'll use a simple color map for Mars
viewer.scene.globe.baseColor = new Cesium.Color(0.5, 0.2, 0.1, 1.0); // Reddish-brown color for Mars

// Add a simple Mars texture as the base layer
// In a real application, you would use actual Mars imagery data
const marsImagery = viewer.imageryLayers.addImageryProvider(
    new Cesium.SingleTileImageryProvider({
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1200px-OSIRIS_Mars_true_color.jpg',
        rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0)
    })
);

// Define points of interest on Mars
const pointsOfInterest = {
    curiosity: {
        name: 'Curiosity Rover (Gale Crater)',
        longitude: 137.4417,
        latitude: -4.5895,
        altitude: 0,
        description: 'NASA\'s Curiosity rover landed in Gale Crater on August 6, 2012. The rover is still operational and exploring Mount Sharp within the crater.'
    },
    perseverance: {
        name: 'Perseverance Rover (Jezero Crater)',
        longitude: 77.4298,
        latitude: 18.4447,
        altitude: 0,
        description: 'NASA\'s Perseverance rover landed in Jezero Crater on February 18, 2021. The rover is searching for signs of ancient microbial life and collecting samples for future return to Earth.'
    },
    insight: {
        name: 'InSight Lander (Elysium Planitia)',
        longitude: 135.6234,
        latitude: 4.5024,
        altitude: 0,
        description: 'NASA\'s InSight lander touched down on Elysium Planitia on November 26, 2018. The mission studied the interior of Mars, including its crust, mantle, and core.'
    },
    olympus: {
        name: 'Olympus Mons',
        longitude: -133.85,
        latitude: 18.65,
        altitude: 21000,
        description: 'Olympus Mons is the largest volcano in the solar system, standing about 21.9 km (13.6 mi) high and 600 km (370 mi) in diameter.'
    },
    valles: {
        name: 'Valles Marineris',
        longitude: -70.0,
        latitude: -13.0,
        altitude: 0,
        description: 'Valles Marineris is a system of canyons that runs along the Martian equator. It is about 4,000 km (2,500 mi) long, 200 km (120 mi) wide, and up to 7 km (4.3 mi) deep.'
    }
};

// Add markers for points of interest
for (const key in pointsOfInterest) {
    const poi = pointsOfInterest[key];
    viewer.entities.add({
        id: key,
        position: Cesium.Cartesian3.fromDegrees(poi.longitude, poi.latitude, poi.altitude),
        point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2
        },
        label: {
            text: poi.name,
            font: '14pt sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -10),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000000)
        }
    });
}

// Set initial view to show the whole Mars
viewer.camera.flyHome(0);

// Event handlers for UI controls
document.getElementById('poiSelector').addEventListener('change', function(e) {
    const selectedPoi = e.target.value;
    if (selectedPoi && pointsOfInterest[selectedPoi]) {
        const poi = pointsOfInterest[selectedPoi];
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(poi.longitude, poi.latitude, poi.altitude + 1000000),
            orientation: {
                heading: 0.0,
                pitch: -Cesium.Math.PI_OVER_TWO,
                roll: 0.0
            },
            duration: 3
        });
        
        // Update info panel with POI description
        document.getElementById('infoPanel').innerHTML = `<h4>${poi.name}</h4><p>${poi.description}</p>`;
    }
});

// Layer visibility controls
document.getElementById('themisLayer').addEventListener('change', function(e) {
    // In a real application, you would toggle the visibility of the THEMIS layer
    // For this demo, we'll just adjust the opacity of our base Mars imagery
    marsImagery.alpha = e.target.checked ? 1.0 : 0.0;
});

// Note: In a real application, these would control actual CTX and HiRISE layers
// For this demo, they don't do anything since we don't have those layers
document.getElementById('ctxLayer').addEventListener('change', function(e) {
    console.log('CTX layer visibility:', e.target.checked);
    // ctxLayer.show = e.target.checked;
});

document.getElementById('hiriseLayer').addEventListener('change', function(e) {
    console.log('HiRISE layer visibility:', e.target.checked);
    // hiriseLayer.show = e.target.checked;
});

// In a real application, you would implement the following:
// 1. Load actual Mars terrain data (e.g., MOLA-HRSC DEM)
// 2. Add multiple imagery layers (THEMIS, CTX, HiRISE)
// 3. Implement proper level-of-detail management
// 4. Add more interactive features and data visualization options
