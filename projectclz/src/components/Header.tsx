import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Fade
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      handleCloseMenu();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getNavItems = () => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Search Donors', path: '/search-donors' }
    ];

    if (user) {
      items.push(
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Become Donor', path: '/become-donor' }
      );
    } else {
      items.push(
        { label: 'Login', path: '/login' },
        { label: 'Sign Up', path: '/signup' }
      );
    }

    return items;
  };

  const navItems = getNavItems();

  const userMenuItems = [
    { label: 'Profile', path: '/profile' },
    { label: 'Edit Profile', path: '/profile/edit' },
    { label: 'Dashboard', path: '/dashboard' }
  ];

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const NavLink = ({ label, path }: { label: string; path: string }) => (
    <Button
      component={Link}
      to={path}
      sx={{
        color: 'white',
        textTransform: 'none',
        fontSize: '1rem',
        px: 2,
        py: 1,
        mx: 0.5,
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '2px',
          backgroundColor: 'white',
          transform: isActive(path) ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.3s ease'
        },
        '&:hover::after': {
          transform: 'scaleX(1)'
        }
      }}
    >
      {label}
    </Button>
  );

  const mobileDrawer = (
    <Drawer
      variant="temporary"
      anchor="right"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          backgroundColor: '#dc2626',
          color: 'white'
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Menu
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              borderLeft: isActive(item.path) ? '4px solid white' : '4px solid transparent',
              backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {user && userMenuItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              borderLeft: isActive(item.path) ? '4px solid white' : '4px solid transparent',
              backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {user && (
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#dc2626',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 }, minHeight: '70px' }}>
          <Box 
            component={Link} 
            to="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white'
            }}
          >
            <BloodtypeIcon sx={{ fontSize: 32, mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Smart Blood Bank
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ ml: 4, display: 'flex' }}>
              {navItems.map((item) => (
                <NavLink key={item.path} {...item} />
              ))}
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }} />

          {user && (
            <>
              {!isMobile && (
                <Button
                  onClick={handleOpenMenu}
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white'
                    }}
                  >
                    {user.name ? getInitials(user.name) : <PersonIcon />}
                  </Avatar>
                  <Typography>{user.name || 'User'}</Typography>
                  <KeyboardArrowDownIcon />
                </Button>
              )}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                TransitionComponent={Fade}
                sx={{
                  '& .MuiPaper-root': {
                    backgroundColor: '#dc2626',
                    color: 'white',
                    minWidth: 180,
                    mt: 1
                  }
                }}
              >
                {userMenuItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={() => {
                      handleCloseMenu();
                      navigate(item.path);
                    }}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}

          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>
      {mobileDrawer}
    </AppBar>
  );
};

export default Header; 