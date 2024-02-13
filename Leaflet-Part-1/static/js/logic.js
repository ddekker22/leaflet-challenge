// Create a map object.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  //Add a tile layer. Creates the base image of the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  //Load the GeoJSON data:
  const earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

  //Get the data with D3:
  d3.json(earthquakeData).then(function(data) {
    // console.log(data.features);
});

//define the colors for the depth and the legend used later
let colors = ['lightgreen','darkgreen','yellow','orange','red','darkred'];

//create a function that we can push the json data through
function earthquakeLocations(data){

//Create the function for coloring the markers based on depth
function depthColor(depth) {
    if (depth > 90 ) {return colors[5]}
    else if (depth > 70 ) {return colors[4]}
    else if (depth > 50 ) {return colors[3]}
    else if (depth > 30 ) {return colors[2]}
    else if (depth > 10 ) {return colors[1]}
    else if (depth > -10) {return colors[0]}
    else {return 'white'}
};

//create the function for creating the circle markers based on magnitude
function circleStyle(feature) {
    return {
    //test the size of each circle: may need to adjust *********
    radius: feature.properties.mag * 4,
    //Color will differ by depth. Write function to determine depth color
    fillColor: depthColor(feature.geometry.coordinates[2]),
    fillOpacity: .7,
    color: 'black',
    weight: 0.3,
    };
};

//Create the circle markers on the map and the popups with the information for each earthquake
let circleCreation = L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, circleStyle(feature));
    },
    onEachFeature: function(feature, layer){
        //add html elements to define the style of the popup text
        layer.bindPopup(`
            <h2>${feature.properties.place}</h2>
            <h3>Magnitude: ${feature.properties.mag.toLocaleString()}</h3>
            <h3>Depth: ${feature.geometry.coordinates[2].toLocaleString()}</h3>
            <h3>Time: ${new Date (feature.properties.time)}</h3>
            `);
    }
});

circleCreation.addTo(myMap);


  // Set up the legend.
  let legend = L.control({position: "bottomright"});
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let limits = ['-10-10','10-30','30-50','50-70','70-90','90+'];;
    div.innerHTML = `<h4> Depth (km)</h4>`
    for (let i = 0; i < limits.length; i++) {
        div.innerHTML += `<li style='background: ${colors[i]} '></li>   ${limits[i]}<br>` ;
    }
    return div
};
legend.addTo(myMap);
};


d3.json(earthquakeData).then(earthquakeLocations);


