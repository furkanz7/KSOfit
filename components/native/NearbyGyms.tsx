import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface Gym {
  id: number;
  lat: number;
  lon: number;
  name: string;
}

export const NearbyGyms: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.text}>Finding your location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  const userLat = location?.coords.latitude;
  const userLon = location?.coords.longitude;

  // Leaflet + Overpass API HTML/JS
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; background: #0f172a; }
        .leaflet-popup-content-wrapper { background: #1e293b; color: #fff; border-radius: 12px; }
        .leaflet-popup-tip { background: #1e293b; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${userLat}, ${userLon}], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OSM',
          maxZoom: 19
        }).addTo(map);

        // User Marker
        const userIcon = L.divIcon({
          className: 'user-marker',
          html: '<div style="background-color: #3b82f6; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
          iconSize: [21, 21],
          iconAnchor: [10, 10]
        });
        L.marker([${userLat}, ${userLon}], {icon: userIcon}).addTo(map).bindPopup("You are here").openPopup();

        // Fetch Gyms using Overpass API
        const overpassUrl = 'https://overpass-api.de/api/interpreter';
        const query = \`
          [out:json][timeout:25];
          node["amenity"="gym"](around:1000, ${userLat}, ${userLon});
          out body;
        \`;

        fetch(overpassUrl, {
          method: 'POST',
          body: 'data=' + encodeURIComponent(query)
        })
        .then(res => res.json())
        .then(data => {
          data.elements.forEach(el => {
            const name = el.tags.name || "Gym";
            L.marker([el.lat, el.lon]).addTo(map)
              .bindPopup(\`<b>\${name}</b>\`);
          });
        })
        .catch(err => console.error("Overpass error:", err));
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    backgroundColor: '#0f172a',
    marginBottom: 24,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  center: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 24,
    marginBottom: 24,
  },
  text: {
    color: '#94a3b8',
    marginTop: 12,
  },
  errorText: {
    color: '#f87171',
    textAlign: 'center',
    padding: 20,
  }
});
