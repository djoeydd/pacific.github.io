const map = L.map('map', {
    attributionControl: false,
    worldCopyJump: true,
    center: [25.39833, 154.30509],
    zoom: 3
  });
  
  var pane = map.createPane('fixed', document.getElementById('map'));
  
  const imperialFlagIcon = L.icon({
    iconUrl: 'imperialFlag.png',
    shadowUrl: 'circle.png',
    iconSize: [35, 35],
    iconAnchor: [0, 0],
    shadowSize: [45, 45],
    shadowAnchor: [5, 5],
    popupAnchor: [17, -5]
  });
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  L.control.attribution({
    position: 'bottomleft'
  }).addTo(map);
  
  let allMarkers = null;
  const markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 55,
    disableClusteringAtZoom: 12,
  });
  
  const shipFilters = document.querySelectorAll('.ship-filter');
  const countryFilters = document.querySelectorAll('.country-filter')
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const validData = data.filter(item => item.Latitude && item.Longitude);
  
      allMarkers = validData.map(item => {
        const marker = L.marker([parseFloat(item.Latitude), parseFloat(item.Longitude)], {
          icon: imperialFlagIcon
        });
  
        const popupContent = `
          <img class="flag" src="War_flag_of_the_Imperial_Japanese_Army_(1868–1945).svg.png"<br>
          <div class="shipTitle">${item["Name of Vessel"]} </div>
          <img src="${item["Image"]}"><br>
          <b>Vessel Type:</b> ${item["Type of Vessel"]}<br>
          <b>Date Sunk:</b> ${item["Month"]} ${item["Day"]}, ${item["Year"]}<br>
          <b>Country:</b> ${item["Vessel Country"]}<br>
          <b>Status:</b> ${item["Assessment"]}<br>
          <b>Standard Tonnage:</b> ${item["Standard\n Tonnage"]}<br>
          <b>Sunk By:</b> ${item["Flag of Agent"]}<br>
          <b>Sinking Ship Type:</b> ${item["Type of Agent"]}<br>
          <b>Casualties:</b> ${item["Casualties"]}<br>
        `;
  
        const popup = L.popup({
          pane: 'fixed',
          className: 'popup-fixed',
          autoPan: false,
          closeOnClick: false,
        }).setContent(popupContent);
  
        marker.bindPopup(popup);
        markers.addLayer(marker);
        return { marker, type: item["Type of Vessel"] };
      });
  
      map.addLayer(markers);
    })
    .catch(error => {
      console.error('Error loading JSON:', error);
    });
  
  function filterMarkers() {
    const selectedTypes = Array.from(shipFilters)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

      markers.clearLayers();

      if (selectedTypes.length === 0) {
        // If no filters are selected, display all markers
        allMarkers.forEach(({ marker }) => {
          markers.addLayer(marker);
        });
      } else {
        markers.clearLayers();
        allMarkers.forEach(({ marker, type }) => {
          if (selectedTypes.includes(type)) {
            markers.addLayer(marker);
          }
        });
      }
    map.addLayer(markers);
  }
  
  document.getElementById('showVesselTypesBtn').addEventListener('click', function() {
    const checkboxList = document.querySelector('.checkbox-list');
    checkboxList.style.display = checkboxList.style.display === 'none' ? 'flex' : 'none';
  });
