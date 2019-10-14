var plates;
var myMap;
var link2 = "data/plates.geojson";

d3.json(link, function(response){
  plates = L.geoJSON(response, {
    style: function(feature) {
      return {
        color: "orange",
        fillColor: "white",
        fillOpacity: 0
      }
    },
    onEachFeature: function(feature, layer){
      console.log(feature.coordinates);
      layer.bindPopup("Plate Name: " + feature.properties.PlateName);
    }
  })

  var link = "data/data.geojson";

  d3.json(link, function(data) {
    console.log(data);

    function createCircleMarker(feature, latlng) {
      let option = {
        radius: feature.properties.mag*4,
        fillColor: chooseColor(feature.properties.mag),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
      }
      return L.circleMarker(latlng, options);
    }

    var earthquakes = L.geoJSON(data, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Place:" + feature.properties.place + "<br> Magnitude: "
      +feature.properties.mag+"<br> Time: " +new Date(feature.properties.time));
    },
    pointToLayer: createCircleMarker
  });
});

function createMap(plates, earthquakes) {
  var satelite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id:"mapbox.light",
    accessToken: config.API_KEY
  });

  var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: config.API_KEY
  });

  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
     maxZoom: 18,
     id: "mapbox.outdoors",
     accessToken: config.API_KEY
   });

  var baseMaps = {
    "Satelite": satelite,
    "Grayscale": grayscale,
    "Outdoors": outdoors
  };

  var overlayMaps = {
    "Fault Lines": plates,
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
      center: [ 37.0902405,-95.7128906],
      zoom: 4,
      layers: [satellite, plates, earthquakes]
    });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var info = L.control({
    position: "bottomright"
  });

  info.onAdd = function(){
    var div = L.DomUtil.create("div", "legend");
    return div;
  }

  info.addTo(myMap);

  document.querySelector(".legend").innerHTML = displayLegend();
}

  function chooseColor(mag) {
    switch (true) {
      case (mag < 1):
        return "chartreuse";
      case (mag < 2):
        return "greenyellow";
      case (mag < 3):
        return "gold";
      case (mag < 4):
        return "DarkOrgange";
      case (mag < 5):
        return "Peru";
      default:
        return "red";
    };
  }

  function displayLegend() {
    var legendInfo = [{
      limit: "Mag: 0-1",
      color: "chartreuse"
    }, {
      limit: "Mag: 1-2",
      color: "greenyellow"
    }, {
      limit: "Mag: 2-3",
      color: "gold"
    }, {
      limit: "Mag: 5+",
      color:"red"
    }];

    var header = "<h3>Magnitude</h3><hr>";

    var strng = "";

    for (i = 0; i < legendInfo.length; i++) {
      strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }

    return header+strng;
  };
}
