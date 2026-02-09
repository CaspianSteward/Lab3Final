
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// Global Parameters
var map;
var map2;
var minValue;
var dataStats = {};
document.addEventListener('DOMContentLoaded', createMap1)
document.addEventListener('DOMContentLoaded', createMap2)


// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// createMap();

    function createMap1(){
        // creates the editable map bits, sets a center and a zoom
        map = L.map('map', {
            center: [40, -95],
            zoom: 4,    
            maxZoom: 5,
            minZoom: 0
        }); 

        // adds the tiled basemap
        Thunderforest_MobileAtlas = L.tileLayer('https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}{r}.png?apikey={apikey}', {
	    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        apikey: '2b398a56cb7946a8bc43733c97a04849',
    	    maxZoom: 22
        }).addTo(map);
        // runs the getData(); function
        getData();
    };

// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //


// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// createPropSymbols()

    function createPropSymbols(data){
        var attribute = "POPULATION"
        var geoJSONMarkerOptions =  {
            radius: 8,
            fillColor: "lightblue",
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        L.geoJSON(data, {
            pointToLayer: pointToLayer
        }).addTo(map);
    }
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //


// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// getData()

    function getData(){
        fetch("data/majorcities.geojson")
            .then(function(response){
                return  response.json();
            })
            .then(function(json){
                minValue = calculateMinValue(json)
                createPropSymbols(json);
                calcStats(json);
                createLegend(json);
            })
    }
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //



// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// calculateMinValue()

    function calculateMinValue(data){
        var allValues = [];
        for (var NAME of data.features){
            var value = NAME.properties["POPULATION"]
            allValues.push(value)
         }  
        var minValue = Math.min(...allValues)
        return minValue;
    }
    
// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //

// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// calcPropRadius()

    function calcPropRadius(attValue) {
        var minRadius = 1.5;
        var radius = 1.008 * Math.pow(attValue/minValue,0.5)*minRadius

        return radius;
    };

// calcStats()

    function calcStats(data){
        var allValues = [];
        for (var NAME of data.features){
            var value = NAME.properties["POPULATION"]
            allValues.push(value)
         }  
        dataStats.min = Math.min(...allValues)
        dataStats.max = Math.max(...allValues)
        var sum = allValues.reduce(function(a,b){return a+b});
        dataStats.mean = sum / allValues.length;
    }
    
// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //

// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// pointToLayer()

    function pointToLayer(feature, latlng){
        var attribute = "POPULATION";
        var options = {
            fillColor: '#633B57',
            color: '#E2CFDC',
            weight: 2,
            opacity: 0.5,
            fillOpacity: 0.25
        };

        var attValue = Number(feature.properties[attribute]);
        options.radius = calcPropRadius(attValue);
        var layer = L.circleMarker(latlng, options);    
        var formatted = new Intl.NumberFormat('en-US').format(feature.properties.POPULATION)

        var popupContent = "<p><h3>" + feature.properties.NAME + "</h3></p>" + "<p><b> Population : </b> " + formatted + "</p>"
        layer.bindPopup(popupContent);
        return layer;
    };


// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //


// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// createLegend()

    function createLegend(attributes){
        var LegendControl = L.Control.extend({
            options: {
                position: 'bottomright' 
            },
            onAdd: function(map) {
                var container = L.DomUtil.create('div', 'legend-control-container');
                container.innerHTML = '<p> Population </p>'

                var maxRadius = calcPropRadius(dataStats.max); 

                var svg = '<svg id ="attribute-legend" width="130px" height="180px">';
                var circles = ["max", "mean", "min"]    

                for (var i=0; i<circles.length; i++){
                    var radius = calcPropRadius(dataStats[circles[i]]);
                    var cy = 105 - radius
    
                    svg+= '<circle class = "legend-circle" id="' + circles[i] +
                        '" r="' + radius + 
                        '" cy="' + cy + '"' +
                        ' fill="#633B57" fill-opacity="0.25" stroke="#000" cx = "60"/>';
                };
                svg += "</svg>";
                container.innerHTML += svg;       

                return container;
            }

        });
        map.addControl(new LegendControl());
    };  
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //

// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //

// global variables for map2
var stateCoords = [];
var cityCoords = [];
var geojson;

// createMap2();

    function createMap2(){
        map2 = L.map('map2', {
            center: [45, -106],
            zoom: 3,    
        }); 

       Thunderforest_MobileAtlas = L.tileLayer('https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}{r}.png?apikey={apikey}', {
	    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	        apikey: '2b398a56cb7946a8bc43733c97a04849',
    	    maxZoom: 22
        }).addTo(map2);
        info.addTo(map2);
        legend.addTo(map2);
        statesData()
    };

// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// Pull the stateDate

    function statesData(){
        fetch("data/stateData.geojson")
        // pull the data and put it into the temp json
            .then(function(response){return  response.json()})
        // push that data into the separateStates() function
            .then(function(json){separateStates(json)})
    }

// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// Separate the states into a nonGeoJSON variable
// I found it incredibly hard to do anything with it still as a GeoJSON, so we pulled it out.

    function separateStates(data) {
        for (var NAME of data.features) {
        // push the data acquired here to the globacl variable stateCoords
            stateCoords.push({
        // set each of the array as a portion of the geoJSON
                name: NAME.properties.NAME,
                coords: NAME.geometry.coordinates,
                type: NAME.geometry.type,
                pops: NAME.properties.POPULATION})}
        // start pulling the next dataset
        pullCities();
    }
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// Pull the majorcities data, and then separate the cities out into their own array as well.
    function pullCities () {
        fetch("data/majorcities.geojson")
            // returns the data into the in-function var 'json'
            .then(function(response){return response.json()})
            // separateCities using that json var
            .then(function(json){separateCities(json)})
    }

    function separateCities(data) {
        for (var NAME of data.features) {
        // push the data acquired here to the global variable cityCoords
            cityCoords.push({
        // set each of the array as a portion of the geoJSON
            cityName: NAME.properties.NAME,
            population: NAME.properties.POPULATION,
            coords: NAME.geometry.coordinates })}
        // run the assignStates function
        assignStates()
    }
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
    // Run through each city of cityCoords
    function assignStates (){
        for (const city of cityCoords) {
            // turns each city into a point in turf.js
            const cityPoint = turf.point(city.coords);
            for (const state of stateCoords) {
                // set the stateType for states that are a single body vs. several
                const stateType =
                    state.type === "MultiPolygon"
                        ? turf.multiPolygon(state.coords)
                        : turf.polygon(state.coords);
                // run through every city, and identify which polygon each city is in.
                if(turf.booleanPointInPolygon(cityPoint, stateType)) 
                    // add the state name into the cityCoords variable
                    {city.state = state.name;
                    // stop seraching for a new state. - we've found it!
                    break;
            }}}
        // run the combine() function after we've added the 
        combine()
    }

// combine all cities within each state into a single count variable.
    function combine() {
        // for each state,
        for (var state of stateCoords) {
            // start counting the population in each city.
            let count = [];
            for (var cityName of cityCoords) {
                if (state.name === cityName.state){count.push(cityName.population)}
            }
            // run cityProportion over each state, and then push that to the stateCoords variable
            const  urbanProportion = cityProportion(count, state.pops);
            state.urbanProportion = urbanProportion;
        }
        // run createGeoJSON of stateCoords - put it back into a map layer!
        createGeoJSON(stateCoords);
    }

// do the math to get the proportion from the base number data
    function cityProportion(cityPops, statePop) {
        let sum = 0
        for (const pop of cityPops) {sum += Number(pop);}
        // remove the comma separators in the state population data
        var divide = sum / Number(statePop.replace(/,/g, ""))
        // make it into a percentage
        var multiply = divide * 100
        // round the number to not have a billion decimals
        var roundedNumber = multiply.toFixed(1);
        // send that back to combine()
        return roundedNumber
    }

// create the GeoJSON from the broad data.
    function createGeoJSON(states) {
        const geojson = {
            // name the type, features, and geometry.
            type: "FeatureCollection",
            features: states.map (state => ({
                    type: "Feature",
                    properties: {
                        NAME: state.name,
                        POPULATION: state.pops,
                        URBAN_PROPORTION: state.urbanProportion
                    },
                geometry: {
                    type: state.type,
                    coordinates: state.coords
                }}))}
        // start visualizing it again!
        createStatesBorders(geojson)
    }
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// visualize our newfound information on the map!
    function createStatesBorders(data){
        geojson = L.geoJSON(data, {
            // run the style function
            style: style,
            // run the onEachFeature function
            onEachFeature: onEachFeature
        }).addTo(map2);
   }
// the style function assigns each feature these appearances.
    function style(feature) {
        return {
            // run the getColor()
            fillColor: getColor(feature.properties.URBAN_PROPORTION),
            weight: 2,
            opacity: 1, 
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
    }
}

// this is run within the style() function to assign each state a color depending on proportion
function getColor(d) {
    return d > 75 ? '#633B57':
         d > 60 ? '#836078':
         d > 50 ? '#A3859A':
         d > 40 ? '#C2AABB':
            '#E2CFDC';
}
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// This starts the highlight / hover-over ability of the map.
// Interactivity !!

// for each feature, add the mouse interactivity sensors
    function onEachFeature(feature, layer){
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomtoFeature
        });
}

// highlight feature function
    function highlightFeature(e) {
        var layer = e.target;
        // different border!
        layer.setStyle({
            weight: 3,
            color: '#3B2334',
            dashArray: '',
            fillOpacity: 0.7
        });
        // put it in the front so it's easier to see
        layer.bringToFront()
        // update the info tab with the data.
        info.update(layer.feature.properties)
    }

    // resetting the highlight when the mouse leaves.
    function resetHighlight(e){
        geojson.resetStyle(e.target)
        info.update()
    }
    // zooms into the state when it's clicked.
    function zoomtoFeature(e) {
        map2.fitBounds(e.target.getBounds());
    }
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// Create the two different control centers.

var info = L.control({position: 'topright'});

info.onAdd = function (map2) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = '<h4>Percent Population in Major Cities </h4>' +  (props ?
        '<b>' + props.NAME + '</b><br />' + props.URBAN_PROPORTION+ ' %'
        : 'Hover over a state');
};

// create the legend.
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map2) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 40, 50, 60, 70],
        labels = [];
        div.innerHTML = "<h3> % in Major Cities </h3>"

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] +' %' + '<br>' : '+%');
    }

    return div;
};
