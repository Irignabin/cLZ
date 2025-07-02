import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { keyframes } from '@mui/system';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const GoalsSection: React.FC = () => {
  const goals = [
    {
      icon: <SearchIcon sx={{ fontSize: 48, color: '#dc2626' }} />,
      title: 'Quick Find',
      description: 'Instant matching of blood donors by blood type and location.',
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 48, color: '#dc2626' }} />,
      title: 'Real-time Availability',
      description: 'Donors can update their availability status for emergency situations.',
    },
    {
      icon: <NotificationsActiveIcon sx={{ fontSize: 48, color: '#dc2626' }} />,
      title: 'Emergency Notification',
      description: 'Immediate alerts to matching donors nearby via text, email, or mobile apps.',
    },
  ];

  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 },
        backgroundColor: 'rgba(220, 38, 38, 0.02)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 0% 0%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)
          `,
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h6"
            component="p"
            sx={{
              color: '#dc2626',
              fontWeight: 600,
              mb: 2,
              animation: `${slideIn} 0.6s ease-out`,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Our Mission
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              animation: `${slideIn} 0.6s ease-out 0.2s both`,
              background: 'linear-gradient(45deg, #dc2626 30%, #ef4444 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Connecting Lives Through Blood Donation
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              animation: `${slideIn} 0.6s ease-out 0.4s both`,
            }}
          >
            We're building a community where finding blood donors is quick, easy, and reliable.
            Our platform ensures that help is always within reach.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {goals.map((goal, index) => (
            <Grid 
              item 
              xs={12} 
              md={4} 
              key={index}
              sx={{
                animation: `${slideIn} 0.6s ease-out ${0.6 + index * 0.2}s both`
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: 'white',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 40px -10px rgba(220, 38, 38, 0.3)',
                    borderColor: 'rgba(220, 38, 38, 0.2)'
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    mb: 3
                  }}
                >
                  {goal.icon}
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
                  {goal.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.7
                  }}
                >
                  {goal.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default GoalsSection; 