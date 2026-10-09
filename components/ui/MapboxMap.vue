<template>
  <div class="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden shadow-inner">
    <div ref="mapContainer" class="absolute inset-0"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const props = defineProps<{
  mapboxToken: string;
  erranderLocation?: [number, number]; // [lng, lat]
  order?: any;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: mapboxgl.Map | null = null;
let erranderMarker: mapboxgl.Marker | null = null;
let pickupMarker: mapboxgl.Marker | null = null;
let dropoffMarker: mapboxgl.Marker | null = null;

// Parse coordinates from string "lat,lng" or standard object
const parseCoords = (locStr: string): [number, number] | null => {
  if (!locStr) return null;
  const parts = locStr.split(',');
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lng, lat]; // Mapbox expects [lng, lat]
    }
  }
  return null;
};

const getPickupDropoff = () => {
  if (!props.order) return { pickup: null, dropoff: null };
  let pickup = null;
  let dropoff = null;
  
  if (props.order.type === 'custom_errand') {
    pickup = parseCoords(props.order.customDetails?.pickupLocationStr);
    dropoff = parseCoords(props.order.customDetails?.deliveryLocationStr);
  } else {
    // Standard order uses vendor location
    if (props.order.vendor?.location?.coordinates) {
      pickup = props.order.vendor.location.coordinates;
    }
    dropoff = parseCoords(props.order.deliveryLocationStr);
  }
  return { pickup, dropoff };
};

const drawRoute = async (pickup: [number, number], dropoff: [number, number]) => {
  if (!map) return;
  try {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup[0]},${pickup[1]};${dropoff[0]},${dropoff[1]}?steps=true&geometries=geojson&access_token=${props.mapboxToken}`
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;

    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };

    if (map.getSource('route')) {
      (map.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as any);
    } else {
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson as any
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#FF5C1A',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
  } catch (err) {
    console.error('Failed to draw route:', err);
  }
};

const fitBoundsToMarkers = () => {
  if (!map) return;
  const bounds = new mapboxgl.LngLatBounds();
  let hasPoints = false;
  
  const { pickup, dropoff } = getPickupDropoff();
  if (pickup) { bounds.extend(pickup); hasPoints = true; }
  if (dropoff) { bounds.extend(dropoff); hasPoints = true; }
  if (props.erranderLocation) { bounds.extend(props.erranderLocation); hasPoints = true; }
  
  if (hasPoints) {
    map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
  }
};

onMounted(() => {
  if (!mapContainer.value) return;

  mapboxgl.accessToken = props.mapboxToken;

  const { pickup, dropoff } = getPickupDropoff();
  const initialCenter = props.erranderLocation || pickup || dropoff || [3.3792, 6.5244];

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: initialCenter,
    zoom: 14,
  });

  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  map.on('load', () => {
    if (pickup) {
      const el = document.createElement('div');
      el.className = 'pickup-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/2838/2838912.png")'; // Store icon
      el.style.backgroundSize = 'contain';
      pickupMarker = new mapboxgl.Marker({ element: el }).setLngLat(pickup).addTo(map!);
    }

    if (dropoff) {
      const el = document.createElement('div');
      el.className = 'dropoff-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/2933/2933250.png")'; // Home/Flag icon
      el.style.backgroundSize = 'contain';
      dropoffMarker = new mapboxgl.Marker({ element: el }).setLngLat(dropoff).addTo(map!);
    }

    if (pickup && dropoff) {
      drawRoute(pickup, dropoff);
    }
    
    fitBoundsToMarkers();
    
    if (props.erranderLocation) {
      updateMarker(props.erranderLocation);
    }
  });
});

const updateMarker = (lngLat: [number, number]) => {
  if (!map) return;
  
  if (!erranderMarker) {
    const el = document.createElement('div');
    el.className = 'errander-marker';
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/3757/3757962.png")';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
    el.style.backgroundColor = '#fff';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid #FF5C1A';
    el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

    erranderMarker = new mapboxgl.Marker({ element: el })
      .setLngLat(lngLat)
      .addTo(map);
  } else {
    erranderMarker.setLngLat(lngLat);
  }

  // Only pan if it's not a fixed bound view (like watching tracking on initial load)
  // map.flyTo({ center: lngLat, speed: 1.2 });
};

watch(() => props.erranderLocation, (newLocation) => {
  if (newLocation) {
    updateMarker(newLocation);
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style>
.mapboxgl-map {
  width: 100%;
  height: 100%;
}
</style>
