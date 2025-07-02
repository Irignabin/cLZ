import React, { useEffect, useState } from 'react';
import { requestService } from '../services/api';
import type { BloodRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Button,
  Badge
} from '@mui/material';
import { 
  Bloodtype, 
  LocationOn, 
  Phone, 
  LocalHospital,
  AccessTime
} from '@mui/icons-material';

interface BloodRequestsProps {
  latitude: number;
  longitude: number;
  radius?: number;
}

const getUrgencyColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'emergency':
      return 'error';
    case 'urgent':
      return 'warning';
    default:
      return 'info';
  }
};

const formatDate = (date: string | undefined) => {
  if (!date) return 'Recently';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const BloodRequests: React.FC<BloodRequestsProps> = ({ latitude, longitude, radius = 10 }) => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await requestService.getNearbyRequests({ latitude, longitude, radius });
        setRequests(response);
      } catch (err: any) {
        console.error('Failed to fetch blood requests:', err);
        setError(err.message || 'Failed to fetch blood requests');
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchRequests();
    }
  }, [latitude, longitude, radius]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading blood requests...</Typography>
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

  if (!requests.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No blood requests in your area.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Blood Requests ({requests.length})
      </Typography>
      <Grid container spacing={2}>
        {requests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Bloodtype sx={{ mr: 1, color: 'error.main' }} />
                    <Chip 
                      label={request.blood_type} 
                      color="error" 
                      size="small"
                    />
                  </Box>
                  <Chip 
                    label={request.urgency_level}
                    color={getUrgencyColor(request.urgency_level) as any}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalHospital sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    {request.hospital_name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {request.hospital_address} ({Math.round(request.distance / 1000)}km away)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Posted: {formatDate(request.created_at)}
                  </Typography>
                </Box>

                {user && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Contact: {request.contact_phone}
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      href={`tel:${request.contact_phone}`}
                    >
                      Respond to Request
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BloodRequests; 