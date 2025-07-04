import React, { useState, ChangeEvent, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Link,
  Snackbar,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, initializing } = useAuth();
  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('rememberedEmail') !== null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!initializing && user) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, initializing, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      console.log('Login successful:', result);
      navigate("/dashboard")
      
      // Handle remember me
      // if (rememberMe) {
      //   localStorage.setItem('rememberedEmail', email);
      // } else {
      //   localStorage.removeItem('rememberedEmail');
      // }
    } catch (err: any) {
      console.error('Login error details:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status,
        fullError: JSON.stringify(err, null, 2)
      });
      
      const errorMessage = err.response?.data?.message || 'Failed to login';
      if (errorMessage.toLowerCase().includes('expired')) {
        setError('Your session has expired. Please login again.');
      } else if (errorMessage.toLowerCase().includes('credentials')) {
        setError('Invalid email or password.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

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

  return (
    <Box sx={{ py: 8, backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ color: '#dc2626', fontWeight: 'bold' }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Sign in to continue saving lives
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              margin="normal"
              required
              error={!!error}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              margin="normal"
              required
              error={!!error}
              helperText={error}
              disabled={loading}
            />
            
            <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      color="secondary"
                    />
                  }
                  label="Remember me"
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  sx={{ color: '#dc2626' }}
                >
                  Forgot your password?
                </Link>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#dc2626',
                '&:hover': {
                  backgroundColor: '#b91c1c',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup" sx={{ color: '#dc2626' }}>
              Sign up here
            </Link>
          </Typography>
        </Paper>
      </Container>

      <Snackbar
        open={showSuccess}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login; 