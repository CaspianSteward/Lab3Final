// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// Global Requirements;
// Sets the map frame name and the listener to run the first function when the DOM loads.
var map;
document.addEventListener('DOMContentLoaded', createMap)
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //


// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// createMap();

    function createMap(){
        // creates the editable map bits, sets a center and a zoom
        map = L.map('map', {
            center: [53.592505, -4.130602],
            zoom: 6});
        // adds the tiled basemap
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }).addTo(map);
        // runs the getData(); function
        getData();
    };

// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //


// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// onEachFeature()

    function onEachFeature(feature, layer) {
        var popupContent = "";
        if (feature.properties) {
            for (var property in feature.properties){
                    popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
            }
            layer.bindPopup(popupContent)
        }
    }

// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //



// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// getData()

    function getData(){
        // fetches the geojson data and gives it back to the map.
        fetch('/data/ports.geojson')
            .then(function(response){return response.json()})
            // sets the style for the points
            .then(function(json){
                var markerStyle = {
                    radius: 8,
                    fillColor: "lightblue",
                    color: "#000",
                    weight: 2,
                    opacity: 0.9,
                    fillOpacity: 0.8
                };
            // adds the points
            L.geoJSON(json, {
                pointToLayer: function(feature, latlng)
                {return L.circleMarker(latlng, markerStyle)},
                onEachFeature: onEachFeature   
            }).addTo(map)
        });
    };


// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //






// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
        // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
        // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //

// Code from the Leaflet Tutorials 

// var marker = L.marker([51.5, -0.09]).addTo(map);

// var circle = L.circle([51.508, -0.11], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,    radius: 500
// }).addTo(map);

// var polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(map);

// marker.bindPopup("<strong>Hello world!</strong><br />I am a popup.").openPopup();
// circle.bindPopup("I am a circle.");
// polygon.bindPopup("I am a polygon.");

// var popup = L.popup()
//     .setLatLng([51.5, -0.09])
//     .setContent("I am a standalone popup.")
//     .openOn(map);

// var popup = L.popup();

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }

// map.on('click', onMapClick)

        // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
        // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
        // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// Examples from Chapter Five, where I keep getting confused.


// function createPropSymbols(data){
//     var geJSON_MarkerOptions = {
//         radius: 8,
//         fillColor: "#ff7800",
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.8
//     }

//     L.geoJSON(data, {
//         pointToLayer: function(feature, latlng){
//                 return L.circleMarker(latlng, geoJSON_MarkerOptions);
//         }
//     }).addTo(map);
// };

// function getData(){
// fetch('/data/ports.geojson')
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(json){
//         createPropSymbols(json);
//     })
// };

