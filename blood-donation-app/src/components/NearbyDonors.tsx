import React, { useEffect, useState } from 'react';
import { donorService } from '../services/api';
import type { Donor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Card, CardContent, Grid, Chip, Button } from '@mui/material';
import { LocalHospital, LocationOn, Phone } from '@mui/icons-material';

interface NearbyDonorsProps {
  latitude: number;
  longitude: number;
  radius?: number;
}

const NearbyDonors: React.FC<NearbyDonorsProps> = ({ latitude, longitude, radius = 10 }) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNearbyDonors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await donorService.getNearbyDonors({ latitude, longitude, radius });
        setDonors(response);
      } catch (err: any) {
        console.error('Failed to fetch nearby donors:', err);
        setError(err.message || 'Failed to fetch nearby donors');
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchNearbyDonors();
    }
  }, [latitude, longitude, radius]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading nearby donors...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  if (!donors.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No donors found in your area.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Nearby Blood Donors ({donors.length})
      </Typography>
      <Grid container spacing={2}>
        {donors.map((donor) => (
          <Grid item xs={12} sm={6} md={4} key={donor.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {donor.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalHospital sx={{ mr: 1, color: 'primary.main' }} />
                  <Chip 
                    label={donor.blood_type} 
                    color="primary" 
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {donor.city} ({Math.round(donor.distance / 1000)}km away)
                  </Typography>
                </Box>
                {user && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {donor.phone}
                    </Typography>
                  </Box>
                )}
                {user && (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    href={`tel:${donor.phone}`}
                    sx={{ mt: 1 }}
                  >
                    Contact Donor
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NearbyDonors; 