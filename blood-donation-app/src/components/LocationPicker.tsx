import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng, Icon } from 'leaflet';
import { Box, Typography, Paper, Alert } from '@mui/material';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

// Component to handle map clicks and location updates
const LocationMarker: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}> = ({ onLocationSelect, initialLocation }) => {
  const [position, setPosition] = useState<LatLng | null>(
    initialLocation ? new LatLng(initialLocation.lat, initialLocation.lng) : null
  );

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (initialLocation) {
      setPosition(new LatLng(initialLocation.lat, initialLocation.lng));
      map.setView([initialLocation.lat, initialLocation.lng], map.getZoom());
    }
  }, [initialLocation, map]);

  return position === null ? null : (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (event) => {
          const marker = event.target;
          const latlng = marker.getLatLng();
          setPosition(latlng);
          onLocationSelect(latlng.lat, latlng.lng);
        },
      }}
    >
    </Marker>
  );
};

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation = { lat: 29.3949, lng: 86.1240 }, // Center of Nepal
}) => {
  if (!initialLocation) {
    return (
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Location not available
        </Typography>
      </Paper>
    );
  }
  let mapContent = null;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Click on the map to select your location
      </Typography>
      {mapContent}
      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
        You can zoom in/out using the mouse wheel and drag the map to find your exact location
      </Typography>
    </Paper>
  );
};

export default LocationPicker; 