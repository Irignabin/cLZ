import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import type { DashboardStats } from '../services/api';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  Favorite,
  People,
  LocalHospital,
  CalendarToday
} from '@mui/icons-material';

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          backgroundColor: `${color}15`, 
          borderRadius: '50%', 
          p: 1, 
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon as React.ReactElement, { 
            sx: { color: color }
          })}
        </Box>
        <Typography variant="h6" component="div">
          {value}
        </Typography>
      </Box>
      <Typography color="text.secondary" variant="body2">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userService.getDashboardStats();
        setStats(response);
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats:', err);
        setError(err.message || 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
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

  if (!stats) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No statistics available.</Typography>
      </Box>
    );
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Impact
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Donations"
            value={stats.totalDonations}
            icon={<Favorite />}
            color="#e91e63"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lives Impacted"
            value={stats.livesImpacted}
            icon={<People />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Nearby Requests"
            value={stats.nearbyRequests}
            icon={<LocalHospital />}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Last Donation"
            value={formatDate(stats.lastDonationDate)}
            icon={<CalendarToday />}
            color="#4caf50"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats; 