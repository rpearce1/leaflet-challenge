// Creating the map object
let myMap = L.map("map", {
    center: [25, -10],
    zoom: 3
  });
  
  // Adding the tile layer
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);
  
  // Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

d3.json(link).then(function(data) {
    //console.log(data.features);
    // Loop through the data.
    for (let i = 0; i < data.features.length; i++) {
        let quake = data.features[i]
        let color = ""
        if(quake.geometry.coordinates[2] > 95){
            color = 'red'
        }else if(quake.geometry.coordinates[2] > 35){
            color = 'orange'
        }else if(quake.geometry.coordinates[2] > 5){
            color = 'yellow'
        }else{
            color = 'green'
        }
        L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]],{
            fillOpacity: 0.9,
            color: "black",
            fillColor: color,
            radius: 1.5**(quake.properties.mag) * 25000
        }).bindPopup(`<h4>Magnitude: ${quake.properties.mag} <h4> <h4>Depth: ${quake.geometry.coordinates[2]} <h4>
        <h4>Coordinates: ${quake.geometry.coordinates[1]}, ${quake.geometry.coordinates[0]} <h4>`).addTo(myMap);
 
    }
    function getColor(d) {
        return d > 95 ? '#FF0000' :
               d > 35  ? '#FFA500' :
               d > 5  ? '#FFFF00' :
                          '#006400';
    }
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        let depths = [0, 5, 35, 95];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + ';"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
    console.log(getColor(6));
});