import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Chip,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import { userService } from '../services/api';
import { locationService } from '../services/locationService';
import type { BloodRequest, Donor, DashboardStats, Activity } from '../services/api';

const Dashboard: React.FC = () => {
  const { user, refreshUserData } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    livesImpacted: 0,
    lastDonationDate: null,
    nearbyRequests: 0,
    nearbyDonors: 0
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [nearbyRequests, setNearbyRequests] = useState<BloodRequest[]>([]);
  const [nearbyDonors, setNearbyDonors] = useState<Donor[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const locationParams = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radius: 10 // 10km radius
        };

        // Load all data in parallel
        const [
          statsResponse,
          activityResponse,
          requestsResponse,
          donorsResponse
        ] = await Promise.all([
          userService.getDashboardStats(),
          userService.getRecentActivity(),
          locationService.getNearbyRequests(locationParams),
          locationService.getNearbyDonors(locationParams)
        ]);

        setStats(statsResponse);
        setRecentActivity(activityResponse);
        setNearbyRequests(requestsResponse);
        setNearbyDonors(donorsResponse);

      } catch (err: any) {
        console.error('Failed to load dashboard data:', err);
        setError(err?.message || 'Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [refreshUserData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const statsData = [
    {
      label: 'Total Donations',
      value: stats.totalDonations.toString(),
      icon: <BloodtypeIcon sx={{ fontSize: 40, color: '#dc2626' }} />,
      color: '#dc2626'
    },
    {
      label: 'Lives Impacted',
      value: stats.livesImpacted.toString(),
      icon: <FavoriteIcon sx={{ fontSize: 40, color: '#059669' }} />,
      color: '#059669'
    },
    {
      label: 'Last Donation',
      value: stats.lastDonationDate ? new Date(stats.lastDonationDate).toLocaleDateString() : 'No donations yet',
      icon: <CalendarTodayIcon sx={{ fontSize: 40, color: '#7c3aed' }} />,
      color: '#7c3aed'
    },
    {
      label: 'Nearby Requests',
      value: stats.nearbyRequests.toString(),
      icon: <ErrorIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
      color: '#f59e0b'
    },
    {
      label: 'Nearby Donors',
      value: stats.nearbyDonors.toString(),
      icon: <PersonIcon sx={{ fontSize: 40, color: '#3b82f6' }} />,
      color: '#3b82f6'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Hero Section */}
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    fontSize: '2rem'
                  }}
                >
                  {user?.name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Welcome back, {user?.name?.split(' ')[0]}!
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <LocationOnIcon />
                    <Typography>{user?.address || 'Update your location'}</Typography>
                  </Box>
                </Box>
              </Box>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                Blood type: {user?.blood_type || 'Update your profile'}
              </Typography>
              <Button
                component={Link}
                to="/profile/edit"
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: '#dc2626',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
                startIcon={<EditIcon />}
              >
                Edit Profile
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            display: { xs: 'none', md: 'block' }
          }}
        />
      </Paper>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={statsData.length > 3 ? 2.4 : 4} key={index}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 3,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  bgcolor: `${stat.color}10`
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Nearby Blood Requests */}
      {nearbyRequests.length > 0 && (
        <Card sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Nearby Blood Requests
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {nearbyRequests.slice(0, 3).map((request) => (
                <Box key={request.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#dc262610', color: '#dc2626' }}>
                      <BloodtypeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {request.blood_type} Blood Needed
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {request.hospital_name} • {(request.distance / 1000).toFixed(1)}km away
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={request.urgency_level}
                    color={request.urgency_level === 'High' ? 'error' : 'warning'}
                    size="small"
                  />
                </Box>
              ))}
            </Box>
            {nearbyRequests.length > 3 && (
              <Button
                component={Link}
                to="/requests"
                sx={{ mt: 2 }}
                color="primary"
              >
                View All Requests
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Recent Activity
          </Typography>
          {recentActivity.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#dc262610', color: '#dc2626' }}>
                        <BloodtypeIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {activity.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.location} • {new Date(activity.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={activity.status}
                      color={activity.status === 'Completed' ? 'success' : 'primary'}
                      size="small"
                    />
                  </Box>
                  {index < recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              No recent activity to display
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard; 