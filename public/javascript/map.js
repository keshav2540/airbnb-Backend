  mapboxgl.accessToken=map_token;
let coord = (coordinates && coordinates.length === 2) ? coordinates : [77.209, 28.6139];
 const map = new mapboxgl.Map({
   accessToken: map_token,
   container: 'map', // container ID
   center: coord, // starting position [lng, lat]. Note that lat must be set between -90 and 90
   zoom: 9 // starting zoom
 });
 const marker = new mapboxgl.Marker().setLngLat(coord).addTo(map);


