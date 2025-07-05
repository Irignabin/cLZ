import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { keyframes } from '@mui/system';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StepsSection: React.FC = () => {
  const steps = [
    {
      label: 'Registration',
      description: 'Fill out a form to register as a donor. Your data is securely stored and used only when necessary.',
      icon: <HowToRegIcon sx={{ fontSize: 40, color: '#dc2626' }} />,
      number: '01'
    },
    {
      label: 'Verification',
      description: 'After registration, verify your information to ensure accuracy.',
      icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#dc2626' }} />,
      number: '02'
    },
    {
      label: 'Participation in Donation',
      description: 'Receive notifications for donation opportunities in your area.',
      icon: <VolunteerActivismIcon sx={{ fontSize: 40, color: '#dc2626' }} />,
      number: '03'
    },
    {
      label: 'Receive Notifications',
      description: 'Get promptly informed about urgent requests matching your blood type.',
      icon: <NotificationsActiveIcon sx={{ fontSize: 40, color: '#dc2626' }} />,
      number: '04'
    },
  ];

  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 },
        backgroundColor: 'white',
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h6"
            component="p"
            sx={{
              color: '#dc2626',
              fontWeight: 600,
              mb: 2,
              animation: `${fadeInUp} 0.6s ease-out`,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              animation: `${fadeInUp} 0.6s ease-out 0.2s both`,
              background: 'linear-gradient(45deg, #dc2626 30%, #ef4444 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Start Saving Lives in 4 Easy Steps
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              animation: `${fadeInUp} 0.6s ease-out 0.4s both`,
            }}
          >
            Our streamlined process makes it easy to become a donor and start making a difference in your community.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid 
              item 
              xs={12} 
              md={6} 
              lg={3} 
              key={index}
              sx={{
                animation: `${fadeInUp} 0.6s ease-out ${0.6 + index * 0.2}s both`
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 40px -10px rgba(220, 38, 38, 0.2)',
                    borderColor: 'rgba(220, 38, 38, 0.2)',
                    '& .step-number': {
                      color: 'rgba(220, 38, 38, 0.15)'
                    }
                  }
                }}
              >
                <Typography
                  className="step-number"
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 20,
                    fontSize: '4rem',
                    fontWeight: 900,
                    color: 'rgba(0,0,0,0.05)',
                    transition: 'color 0.3s ease',
                    lineHeight: 1
                  }}
                >
                  {step.number}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    mb: 3
                  }}
                >
                  {step.icon}
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: '#111'
                  }}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.7
                  }}
                >
                  {step.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StepsSection; 