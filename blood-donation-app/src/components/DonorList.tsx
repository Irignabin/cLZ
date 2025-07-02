import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import type { Donor } from '../services/api';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';

interface DonorListProps {
  donors: Donor[];
  loading: boolean;
}

const DonorList: React.FC<DonorListProps> = ({ donors, loading }) => {
  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>Loading donors...</Typography>
      </Box>
    );
  }

  if (donors.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>No donors found in this area</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Blood Type</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Distance</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {donors.map((donor) => (
            <TableRow key={donor.id}>
              <TableCell>
                <Typography variant="body1">{donor.name}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  icon={<BloodtypeIcon />}
                  label={donor.blood_type}
                  color="error"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon color="action" fontSize="small" />
                  <Typography variant="body2">{donor.city}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {donor.distance.toFixed(1)} km
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={donor.is_available ? "Available" : "Unavailable"}
                  color={donor.is_available ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<PhoneIcon />}
                  href={`tel:${donor.phone}`}
                >
                  Contact
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DonorList; 