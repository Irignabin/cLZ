import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Typography,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { requestService, type BloodRequestData, type UrgencyLevel } from '../services/api';
import { useNavigate } from 'react-router-dom';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencyLevels: UrgencyLevel[] = ['normal', 'urgent', 'emergency'];

const BloodRequestForm: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState<BloodRequestData>({
        blood_type: '',
        units_needed: 1,
        hospital_id: 1, // This should be selected from a list of hospitals
        contact_name: '',
        contact_phone: '',
        urgency_level: 'normal',
        notes: ''
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'units_needed' ? Number(value) : value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await requestService.createRequest(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit blood request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h5" gutterBottom>
                    Create Blood Request
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Blood request created successfully!
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Blood Type</InputLabel>
                        <Select
                            name="blood_type"
                            value={formData.blood_type}
                            label="Blood Type"
                            onChange={handleSelectChange}
                            required
                        >
                            {bloodTypes.map(type => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        type="number"
                        name="units_needed"
                        label="Units Needed"
                        value={formData.units_needed}
                        onChange={handleTextChange}
                        required
                        sx={{ mb: 2 }}
                        InputProps={{ inputProps: { min: 1 } }}
                    />

                    <TextField
                        fullWidth
                        name="contact_name"
                        label="Contact Name"
                        value={formData.contact_name}
                        onChange={handleTextChange}
                        required
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        name="contact_phone"
                        label="Contact Phone"
                        value={formData.contact_phone}
                        onChange={handleTextChange}
                        required
                        sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Urgency Level</InputLabel>
                        <Select
                            name="urgency_level"
                            value={formData.urgency_level}
                            label="Urgency Level"
                            onChange={handleSelectChange}
                            required
                        >
                            {urgencyLevels.map(level => (
                                <MenuItem key={level} value={level}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        name="notes"
                        label="Additional Notes"
                        value={formData.notes}
                        onChange={handleTextChange}
                        multiline
                        rows={3}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Submit Request'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default BloodRequestForm; 