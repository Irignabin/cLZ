import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import DashboardStats from '../components/DashboardStats';
import NearbyDonors from '../components/NearbyDonors';
import BloodRequests from '../components/BloodRequests';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    // Try to get user's location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to user's saved location if available
          if (user?.latitude && user?.longitude) {
            setLocation({
              latitude: user.latitude,
              longitude: user.longitude
            });
          }
        }
      );
    }
  }, [user]);

  if (!location) {
    return (
      <Container>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>
            Please enable location services to see nearby donors and requests.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        {user && (
          <Box sx={{ mb: 4 }}>
            <Paper elevation={0} sx={{ p: 0 }}>
              <DashboardStats />
            </Paper>
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          <Paper elevation={0} sx={{ p: 0 }}>
            <BloodRequests 
              latitude={location.latitude} 
              longitude={location.longitude} 
            />
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper elevation={0} sx={{ p: 0 }}>
            <NearbyDonors 
              latitude={location.latitude} 
              longitude={location.longitude} 
            />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard; 