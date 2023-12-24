
const map = L.map('map', {
    attributionControl: false,
    worldCopyJump: true,
    noWrap: false,
    center: [25.39833, 154.30509],
    zoom: 3,
    minZoom:3,

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
    disableClusteringAtZoom: 8,
    
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
        <div class="data-container">
        <img class="japan-flag" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/War_flag_of_the_Imperial_Japanese_Army_%281868–1945%29.svg/1920px-War_flag_of_the_Imperial_Japanese_Army_%281868–1945%29.svg.png">
        <h3 id="ship-name">${item["Name of Vessel"]}</h3>
        <div id="vessel-type" class="text-data">
            <p>${item["Type of Vessel"]}<p>
        </div>
        
    <img class="ship-image" src=${item["Image"]}>
    </div>
    <div class="popcontainer-text">
        <div class="text-data">
            <p>${item["Month"]} ${item["Day"]}, ${item["Year"]}
            </p>
        </div>  
        <div class="text-data">
            <p>${item["Assessment"]}
            </p>
        </div>           
        <div class="text-data">
            <p>by: ${item["Flag of Agent"]}</p>
        </div>
        <div class="text-data">
            <p>Standard Tonnage: ${item["Standard\n Tonnage"]}</p>
        </div>
        <div class="text-data">
            <p>Casualties: ${item["Casualties"]}</p>
        </div>
    </div>
        `;
  
        const popup = L.popup({
          pane: 'fixed',
          className: 'popup-fixed',
          autoPan: false,
          closeOnClick: false,
        }).setContent(popupContent);
  
        marker.bindPopup(popup);
        marker.on('popupopen', function() {
          var modal = document.getElementById("myModal");
          var modalImg = document.getElementById("img01");
          var span = document.querySelector(".close");
      
          document.querySelector('.leaflet-popup-content .ship-image').onclick = function(){
            modal.style.display = "block";
            modalImg.src = this.src;
          }
      
          span.onclick = function() { 
            modal.style.display = "none";
          }
        });
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
        checkboxList.style.display = checkboxList.style.display === 'none' ? 'flex' : 'none';
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

  document.getElementById('filter').addEventListener('click', function() {
  const checkboxList = document.querySelector('.checkbox-list');
  checkboxList.style.display = checkboxList.style.display === 'none' ? 'flex' : 'none';
});
