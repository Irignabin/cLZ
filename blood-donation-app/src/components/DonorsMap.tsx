import React, { useState, useEffect, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { locationService } from '../services/locationService';
import type { Donor, Hospital, BloodRequest, LocationData } from '../services/api';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Chip, 
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Grid,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import ErrorIcon from '@mui/icons-material/Error';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DonorList from './DonorList';

// Fix for the default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// SVG paths for icons
const iconPaths = {
  person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  hospital: 'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z',
  bloodtype: 'M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm3 16H9v-2h6v2zm0-5h-2v2h-2v-2H9v-2h2V9h2v2h2v2z',
  error: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
};

// Custom marker icons
const createCustomIcon = (iconType: keyof typeof iconPaths, color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="color: ${color}; transform: scale(1.5);">
      <svg viewBox="0 0 24 24" style="width: 24px; height: 24px;">
        <path fill="currentColor" d="${iconPaths[iconType]}"/>
      </svg>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

// Defensive: Move custom icon creation outside the component to avoid recreation on every render
const donorIcon = createCustomIcon('person', '#2196f3');
const hospitalIcon = createCustomIcon('hospital', '#4caf50');
const bloodBankIcon = createCustomIcon('bloodtype', '#f44336');
const requestIcon = createCustomIcon('error', '#ff9800');

interface MapLocation {
  latitude: number;
  longitude: number;
}

const DonorsMap = () => {
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState(10); // 10km
  const [searchCity, setSearchCity] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [showDonors, setShowDonors] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showBloodBanks, setShowBloodBanks] = useState(true);
  const [showRequests, setShowRequests] = useState(true);

  const fetchNearbyLocations = useCallback(async (location: MapLocation) => {
    setLoading(true);
    setError(null);
    try {
      const params: LocationData = {
        latitude: location.latitude,
        longitude: location.longitude,
        radius,
        blood_type: selectedBloodType || undefined,
        city: searchCity || undefined,
      };

      const [
        donorsRes,
        hospitalsRes,
        requestsRes
      ] = await Promise.allSettled([
        locationService.getNearbyDonors(params),
        locationService.getNearbyHospitals(params),
        locationService.getNearbyRequests(params)
      ]);

      if (donorsRes.status === 'fulfilled') {
        setDonors(donorsRes.value as Donor[]);
      }
      if (hospitalsRes.status === 'fulfilled') {
        setHospitals(hospitalsRes.value as Hospital[]);
      }

      const errors = [donorsRes, hospitalsRes, requestsRes]
        .filter((res): res is PromiseRejectedResult => res.status === 'rejected')
        .map(res => res.reason?.message || 'Failed to fetch data');

      if (errors.length > 0) {
        setError(`Some data could not be loaded: ${errors.join(', ')}`);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch nearby locations');
    } finally {
      setLoading(false);
    }
  }, [radius, selectedBloodType, searchCity]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: MapLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(location);
        fetchNearbyLocations(location);
      },
      (error) => {
        setError('Failed to get your location. Please enable location services.');
        setLoading(false);
      }
    );
  }, [fetchNearbyLocations]);

  const handleSearch = () => {
    if (userLocation) {
      fetchNearbyLocations(userLocation);
    }
  };

  if (!userLocation) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">
          Location access is required to display the donor map. Please enable location services in your browser settings.
        </Alert>
      </Box>
    );
  }

  // Defensive: Only render MapContainer if userLocation is available
  let mapContent = null;
  try {
    mapContent = (
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={L.divIcon({
              className: 'custom-marker',
              html: '<div style="color: #1976d2; transform: scale(1.5);"><svg viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path fill="currentColor" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg></div>',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>You are here</Popup>
          </Marker>
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={radius * 1000}
            pathOptions={{ color: '#1976d2', fillColor: '#1976d2', fillOpacity: 0.1 }}
          />
          {showDonors && donors.map((donor) => (
            <Marker
              key={donor.id}
              position={[donor.latitude, donor.longitude]}
              icon={donorIcon}
            >
              <Popup>
                <Typography variant="subtitle2">{donor.name}</Typography>
                <Typography variant="body2">Blood Type: {donor.blood_type}</Typography>
                <Typography variant="body2">
                  Distance: {(donor.distance || 0).toFixed(1)}km
                </Typography>
              </Popup>
            </Marker>
          ))}
          {showHospitals && hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.latitude, hospital.longitude]}
              icon={hospitalIcon}
            >
              <Popup>
                <Typography variant="subtitle2">{hospital.name}</Typography>
                <Typography variant="body2">{hospital.address}</Typography>
                <Typography variant="body2">
                  Distance: {(hospital.distance || 0).toFixed(1)}km
                </Typography>
              </Popup>
            </Marker>
          ))}
          {showRequests && bloodRequests.map((request) => (
            <Marker
              key={request.id}
              position={[request.latitude, request.longitude]}
              icon={requestIcon}
            >
              <Popup>
                <Typography variant="subtitle2">Emergency Request</Typography>
                <Typography variant="body2">Blood Type: {request.blood_type}</Typography>
                <Typography variant="body2">Distance: {(request.distance || 0).toFixed(1)}km</Typography>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
    );
  } catch (err) {
    mapContent = (
      <Alert severity="error">Map failed to load. Please refresh the page.</Alert>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* Left side - Map */}
      <Box sx={{ width: '50%', position: 'relative' }}>
        {mapContent}
      </Box>

      {/* Right side - Search and Results */}
      <Box sx={{ width: '50%', p: 2, overflowY: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Search Blood Donors
        </Typography>

        {/* Search Controls */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Search by City"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Blood Type</InputLabel>
            <Select
              value={selectedBloodType}
              onChange={(e) => setSelectedBloodType(e.target.value)}
              label="Blood Type"
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Search Radius: {radius}km</Typography>
            <Slider
              value={radius}
              onChange={(_, value) => setRadius(value as number)}
              min={1}
              max={50}
              valueLabelDisplay="auto"
              marks={[
                { value: 1, label: '1km' },
                { value: 25, label: '25km' },
                { value: 50, label: '50km' },
              ]}
            />
          </Box>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Results */}
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={3}>
              <Chip
                icon={<PersonIcon />}
                label={`Donors (${donors.length})`}
                onClick={() => setShowDonors(!showDonors)}
                color={showDonors ? "primary" : "default"}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={3}>
              <Chip
                icon={<LocalHospitalIcon />}
                label={`Hospitals (${hospitals.length})`}
                onClick={() => setShowHospitals(!showHospitals)}
                color={showHospitals ? "primary" : "default"}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={3}>
              <Chip
                icon={<BloodtypeIcon />}
                label={`Blood Banks (${hospitals.filter(h => h.has_blood_bank).length})`}
                onClick={() => setShowBloodBanks(!showBloodBanks)}
                color={showBloodBanks ? "primary" : "default"}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={3}>
              <Chip
                icon={<ErrorIcon />}
                label={`Requests (${bloodRequests.length})`}
                onClick={() => setShowRequests(!showRequests)}
                color={showRequests ? "primary" : "default"}
                sx={{ width: '100%' }}
              />
            </Grid>
          </Grid>

          {/* Donor List Table */}
          <DonorList donors={donors} loading={loading} />
        </Box>
      </Box>
    </Box>
  );
};

export default DonorsMap; 