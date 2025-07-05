import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, Box, CssBaseline, CircularProgress } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import GoalsSection from './components/GoalsSection';
import StepsSection from './components/StepsSection';
import DonorsMap from './components/DonorsMap';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import EmergencyBroadcast from './components/EmergencyBroadcast';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import BecomeDonor from './components/BecomeDonor';
import { AuthProvider, useAuth } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dc2626',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

interface PrivateRouteProps {
  children: React.ReactElement;
}

interface PublicRouteProps {
  children: React.ReactElement;
  restricted?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, token, initializing } = useAuth();
  console.log(user)
  const location = useLocation();

  if (initializing) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#f8f9fa'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public route that redirects to dashboard if user is already authenticated
const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
  const { user, token, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#f8f9fa'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (user && token && restricted) {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const showHeaderFooter = true;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showHeaderFooter && <Header />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <GoalsSection />
                <StepsSection />
              </>
            }
          />
          <Route
            path="/become-donor"
            element={
              <PrivateRoute>
                <BecomeDonor />
              </PrivateRoute>
            }
          />
          <Route path="/search-donors" element={<DonorsMap />} />
          <Route
            path="/login"
            element={
              <PublicRoute restricted>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute restricted>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/emergency-broadcast"
            element={
              <PrivateRoute>
                <EmergencyBroadcast />
              </PrivateRoute>
            }
          />
        </Routes>
      </Box>
      {showHeaderFooter && <Footer />}
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
