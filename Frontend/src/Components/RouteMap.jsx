import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import axios from 'axios';
import { useEffect, useState } from 'react';

const RouteMap = ({ from, to }) => {
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [center, setCenter] = useState([12.9716, 77.5946]); // default to Bangalore

  const apiKey = '5b3ce3597851110001cf62487a8b320c9b214dd1a48cad95a52d92f2';

  useEffect(() => {
    const getCoordinates = async (place) => {
      const res = await axios.get(`https://api.openrouteservice.org/geocode/search`, {
        params: {
          api_key: apiKey,
          text: place,
        },
      });
      return res.data.features[0].geometry.coordinates; // [lon, lat]
    };

    const getRoute = async () => {
      try {
        const [startCoord, endCoord] = await Promise.all([
          getCoordinates(from),
          getCoordinates(to),
        ]);

        setCenter([startCoord[1], startCoord[0]]); // center map

        const res = await axios.post(
          'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
          {
            coordinates: [startCoord, endCoord],
          },
          {
            headers: {
              Authorization: apiKey,
              'Content-Type': 'application/json',
            },
          }
        );

        const geometry = res.data.features[0].geometry.coordinates;
        const distKm = res.data.features[0].properties.summary.distance / 1000;
        setDistance(distKm.toFixed(2));
        const path = geometry.map(([lon, lat]) => [lat, lon]);
        setRoute(path);
      } catch (err) {
        console.error('Route error:', err);
      }
    };

    if (from && to) getRoute();
  }, [from, to]);

  return (
    <div>
      <h3>Route Map</h3>
      {distance && <p>Distance: {distance} km</p>}
      <MapContainer center={center} zoom={7} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {route && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
