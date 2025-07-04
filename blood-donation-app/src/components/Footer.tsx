import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link as MuiLink,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Become Donor', path: '/become-donor' },
    { label: 'Search Donors', path: '/search-donors' },
    { label: 'Emergency Broadcast', path: '/emergency' },
  ];

  const contactInfo = [
    { icon: <LocalPhoneIcon />, text: '+1 (555) 123-4567' },
    { icon: <EmailIcon />, text: 'contact@smartbloodbank.com' },
    { icon: <LocationOnIcon />, text: '123 Medical Center Drive, Healthcare City, HC 12345' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#111827',
        color: 'white',
        pt: 8,
        pb: 4,
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BloodtypeIcon sx={{ fontSize: 40, color: '#dc2626', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Smart Blood Bank
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 300 }}>
              Connecting blood donors with those in need. Every donation counts in saving lives and making a difference in our community.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                  }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                  }
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                  }
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                  }
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5
              }}
            >
              {quickLinks.map((link) => (
                <MuiLink
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#dc2626',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              {contactInfo.map((info, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5
                  }}
                >
                  <Box
                    sx={{
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      flex: 1
                    }}
                  >
                    {info.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: 2,
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            © {new Date().getFullYear()} Smart Blood Bank. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 3
            }}
          >
            <MuiLink
              href="#"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                '&:hover': { color: '#dc2626' }
              }}
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              href="#"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                '&:hover': { color: '#dc2626' }
              }}
            >
              Terms of Service
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 