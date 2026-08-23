  mapboxgl.accessToken=map_token;
let coord = (coordinates && coordinates.length === 2) ? coordinates : [77.209, 28.6139];
 const map = new mapboxgl.Map({
   accessToken: map_token,
   container: "map", // container ID
   style: "mapbox://styles/mapbox/satellite-streets-v12",
   center: coord, // starting position [lng, lat]. Note that lat must be set between -90 and 90
   zoom: 5, // starting zoom
 });
 const marker = new mapboxgl.Marker({color:"red"})
 .setLngLat(coord)
 .setPopup(
  new mapboxgl.Popup({offset:25}).setHTML(`<h4>${locate}</h4><p>Exact location provided after booking</p>`))
  .addTo(map);


