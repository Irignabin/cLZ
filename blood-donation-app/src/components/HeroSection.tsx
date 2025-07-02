import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PeopleIcon from '@mui/icons-material/People';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      icon: <FavoriteIcon sx={{ fontSize: 40, color: '#dc2626' }} />,
      value: '1000+',
      label: 'Lives Saved'
    },
    {
      icon: <VolunteerActivismIcon sx={{ fontSize: 40, color: '#dc2626' }} />,
      value: '500+',
      label: 'Active Donors'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#dc2626' }} />,
      value: '24/7',
      label: 'Support'
    }
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
        pt: { xs: 4, md: 8 },
        pb: { xs: 6, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                animation: `${fadeIn} 1s ease-out`,
                opacity: isVisible ? 1 : 0
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  background: 'linear-gradient(45deg, #dc2626 30%, #991b1b 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Every Drop Counts
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  animation: `${fadeIn} 1s ease-out 0.3s forwards`,
                  opacity: 0
                }}
              >
                Join our community of life-savers. Your donation can make a difference.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  animation: `${fadeIn} 1s ease-out 0.6s forwards`,
                  opacity: 0
                }}
              >
                <Button
                  component={Link}
                  to="/become-donor"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: '#b91c1c',
                      animation: `${pulse} 1s ease-in-out`
                    },
                  }}
                >
                  Become a Donor
                </Button>
                <Button
                  component={Link}
                  to="/search-donors"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#dc2626',
                    color: '#dc2626',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: '#b91c1c',
                      backgroundColor: 'rgba(220, 38, 38, 0.04)'
                    },
                  }}
                >
                  Find Donors
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                animation: `${float} 6s ease-in-out infinite`,
                transform: 'translateY(0)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0) 70%)',
                  borderRadius: '50%',
                  animation: `${pulse} 4s ease-in-out infinite`
                }
              }}
            >
              <Box
                component="img"
                src="https://assets.api.uizard.io/api/cdn/stream/4eb521d0-1d80-4c5e-ad91-089378185cfc.png"
                alt="Blood Cells"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: 600,
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  animation: `${fadeIn} 1s ease-out 0.9s forwards`,
                  opacity: 0
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  animation: `${fadeIn} 1s ease-out ${1.2 + index * 0.2}s forwards`,
                  opacity: 0,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                {stat.icon}
                <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; 