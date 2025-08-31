
function initMap() 
{
  // Center on India
  var india = { lat: 22.351115, lng: 78.667742 };

  // Create map
  var map = new google.maps.Map(document.getElementById("map"),
                                {
    zoom: 5,
    center: india,
  });

  // List of markers with your coordinates
  var markers = 
    [
    { lat: 27.4720, lng: 71.9600, title: "Bhadla Solar Park" },
    { lat: 23.9080, lng: 71.2160, title: "Charanka Solar Park" },
    { lat: 23.1312, lng: 68.9296, title: "Bhuj / Kutch Wind Cluster" },
    { lat: 23.0170, lng: 70.2170, title: "Deendayal (Kandla) Port" },
    { lat: 22.7460, lng: 69.7000, title: "Mundra Port" },
    { lat: 22.34516, lng: 69.85960, title: "Jamnagar Refinery" },
    { lat: 21.7294, lng: 72.6642, title: "Dahej GIDC / Port" },
    { lat: 8.7642, lng: 78.1348, title: "Tuticorin (Thoothukudi) Port" },
    { lat: 17.6868, lng: 83.2185, title: "Visakhapatnam (Vizag)" },
    { lat: 20.2869, lng: 86.6740, title: "Paradeep Port" }
  ];

  // Add each marker to the map
  markers.forEach(function(loc) {
    new google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      map: map,
      title: loc.title
    });
  });
}
