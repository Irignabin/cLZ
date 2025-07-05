import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';

const EmergencyBroadcast: React.FC = () => {
  const [formData, setFormData] = useState({
    bloodType: '',
    hospital: '',
    units: '',
    urgency: 'High',
    message: '',
    radius: '5000',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // TODO: Implement actual API call
      // const response = await axios.post('/api/emergency-broadcast', formData);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setSuccess(true);
      setFormData({
        bloodType: '',
        hospital: '',
        units: '',
        urgency: 'High',
        message: '',
        radius: '5000',
      });
    } catch (err) {
      setError('Failed to send broadcast. Please try again.');
      console.error('Error sending broadcast:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{ color: '#dc2626', fontWeight: 'bold', mb: 6 }}
        >
          Emergency Blood Request
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Emergency broadcast sent successfully! Nearby donors will be notified.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Blood Type</InputLabel>
                  <Select
                    name="bloodType"
                    value={formData.bloodType}
                    label="Blood Type"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="AB-">AB-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Hospital Name"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Units Required"
                  name="units"
                  type="number"
                  value={formData.units}
                  onChange={handleChange}
                  InputProps={{
                    inputProps: { min: 1 }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Urgency Level</InputLabel>
                  <Select
                    name="urgency"
                    value={formData.urgency}
                    label="Urgency Level"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Broadcast Radius (meters)"
                  name="radius"
                  type="number"
                  value={formData.radius}
                  onChange={handleChange}
                  InputProps={{
                    inputProps: { min: 1000, max: 50000 }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Additional Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Add any additional information or special requirements..."
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    backgroundColor: '#dc2626',
                    '&:hover': {
                      backgroundColor: '#b91c1c',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Send Emergency Broadcast'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default EmergencyBroadcast; 