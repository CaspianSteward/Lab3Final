
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
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 5,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
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
            fillColor: "lightblue",
            color: "lightblue",
            weight: 2,
            opacity: 0.5,
            fillOpacity: 0.075
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
                        ' fill="lightblue" fill-opacity="0.5" stroke="#000" cx = "60"/>';
                };
                svg += "</svg>";
                container.innerHTML += svg;       

                return container;
            }

        });
        map.addControl(new LegendControl());
    };  
// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //

// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// createMap2();

    function statesData(){
        fetch("data/stateData.geojson")
            .then(function(response){
                return  response.json();
            })
            .then(function(json){
                separateStates(json)
            })
    }

var stateCoords = [];
var cityCoords = [];

    function separateStates(data) {
        for (var NAME of data.features) {
            stateCoords.push({
                name: NAME.properties.NAME,
                coords: NAME.geometry.coordinates,
                type: NAME.geometry.type,
                pops: NAME.properties.POPULATION
            });
        }
        pullCities();
    }

    function pullCities () {
        fetch("data/majorcities.geojson")
            .then(function(response){
                return response.json();
            })
            .then(function(json){
                separateCities(json)
            })
    }

    function separateCities(data) {
        for (var NAME of data.features) {
            cityCoords.push({
            cityName: NAME.properties.NAME,
            population: NAME.properties.POPULATION,
            coords: NAME.geometry.coordinates })
        }
        assignStates()
    }

    function assignStates (){
        for (const city of cityCoords) {
            const cityPoint = turf.point(city.coords);
        for (const state of stateCoords) {
            const stateType =
                state.type === "MultiPolygon"
                    ? turf.multiPolygon(state.coords)
                    : turf.polygon(state.coords);

            if(turf.booleanPointInPolygon(cityPoint, stateType)) {
                    city.state = state.name;
                    break;
            }
        }
        }
        print()
    }

    function print() {
        for (var state of stateCoords) {
            let count = [];
            for (var cityName of cityCoords) {
                if (state.name === cityName.state){count.push(cityName.population)}
            }
            const  urbanProportion = cityProportion(count, state.pops);
            state.urbanProportion = urbanProportion;
        }
        createGeoJSON(stateCoords);
        console.log(stateCoords)
    }

    function cityProportion(cityPops, statePop) {
        let sum = 0
        for (const pop of cityPops) {sum += Number(pop);}
        var divide = sum / Number(statePop.replace(/,/g, ""))
        var multiply = divide * 100
        var roundedNumber = multiply.toFixed(1);
        return roundedNumber
    }

    function createGeoJSON(states) {
        const geojson = {
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
                }
            }))
        }
        createStatesBorders(geojson)
    }

    function createMap2(){
        // creates the editable map bits, sets a center and a zoom
        map2 = L.map('map2', {
            center: [45, -106],
            zoom: 3,    
        }); 

        // adds the tiled basemap
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 5,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }).addTo(map2);
        info.addTo(map2);
        legend.addTo(map2);
        statesData()
    };


function getColor(d) {
    return d > 70 ? '#633B57':
         d > 60 ? '#836078':
         d > 50 ? '#A3859A':
         d > 40 ? '#C2AABB':
            '#E2CFDC';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.URBAN_PROPORTION),
        weight: 2,
        opacity: 1, 
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    }
}

var geojson;
function highlightFeature(e) {
    var layer = e.target;
    
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    layer.bringToFront()
    info.update(layer.feature.properties)
}

function resetHighlight(e){
    geojson.resetStyle(e.target)
    info.update()
}
function zoomtoFeature(e) {
    map2.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomtoFeature
    });
}

function createStatesBorders(data){
        geojson = L.geoJSON(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map2);
   }
var info = L.control({position: 'topright'});

info.onAdd = function (map2) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = '<h4>Percent Urban Population</h4>' +  (props ?
        '<b>' + props.NAME + '</b><br />' + props.URBAN_PROPORTION+ ' %'
        : 'Hover over a state');
};

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map2) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 40, 50, 60, 70],
        labels = [];
        div.innerHTML = "<h3> % Urban Population </h3>"

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] +' %' + '<br>' : '+%');
    }

    return div;
};
