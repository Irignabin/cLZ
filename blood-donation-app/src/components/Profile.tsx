import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { userService } from '../services/api';
import type { User } from '../services/api';

const Profile: React.FC = () => {
  const { user: authUser, initializing } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(authUser);

  // Update user state when authUser changes
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  // Load profile data
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      if (!authUser?.id) return;

      try {
        setError(null);
        const userData = await userService.getProfile();
        if (mounted) {
          console.log('Loaded user data:', userData); // Debug log
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        if (mounted) {
          setError('Failed to load profile data. Please try again.');
          setUser(authUser);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [authUser, authUser?.id]);

  if (initializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              border: '1px solid #eee',
              borderRadius: '8px'
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: '#dc2626',
                fontSize: '3rem',
                margin: '0 auto 16px'
              }}
            >
              {user.name ? getInitials(user.name) : <PersonIcon />}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  display: 'inline-block',
                  bgcolor: user.is_donor ? '#dc2626' : '#666',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: '4px'
                }}
              >
                {user.is_donor ? 'Active Donor' : 'Not a Donor'}
              </Typography>
              <Button
                component={Link}
                to="/profile/edit"
                startIcon={<EditIcon />}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: '#dc2626',
                  color: '#dc2626',
                  '&:hover': {
                    borderColor: '#b91c1c',
                    bgcolor: 'rgba(220, 38, 38, 0.04)'
                  }
                }}
              >
                Edit your profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3,
              border: '1px solid #eee',
              borderRadius: '8px'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: '#dc2626' }}>
              Profile Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon sx={{ color: '#dc2626' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Full Name" 
                  secondary={user.name} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <EmailIcon sx={{ color: '#dc2626' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Email Address" 
                  secondary={user.email} 
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <PhoneIcon sx={{ color: '#dc2626' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Phone Number" 
                  secondary={user.phone || 'Click Edit Profile to add your phone number'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <LocalHospitalIcon sx={{ color: '#dc2626' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Blood Type" 
                  secondary={user.blood_type || 'Click Edit Profile to add your blood type'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon sx={{ color: '#dc2626' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Location" 
                  secondary={user.address || 'Click Edit Profile to add your location'} 
                />
              </ListItem>
            </List>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#dc2626' }}>
                Donation History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                {user.last_donation_date 
                  ? `Last donation: ${new Date(user.last_donation_date).toLocaleDateString()}`
                  : 'No donation history available yet.'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 