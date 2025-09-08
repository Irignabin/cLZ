import React, { useState } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  Box,
  Button,
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  FormHelperText,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { useAuth } from '../context/AuthContext';
import { donorService } from '../services/api';
import type { DonorFormData } from '../services/api';
import { useNavigate } from 'react-router-dom';

const steps = ['Personal Information', 'Medical History', 'Confirmation'];

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  [theme.breakpoints.up(600 + Number(theme.spacing(3)) * 2)]: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    padding: theme.spacing(3),
  },
}));

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    background: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
});

const BecomeDonor: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialValues: DonorFormData = {
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    blood_type: user?.blood_type || '',
    address: user?.address || '',
    city: user?.city || '',
    date_of_birth: '',
    weight: '',
    height: '',
    last_donation: '',
    medical_conditions: [],
    medications: '',
    agreement: false,
    latitude: user?.latitude || 24,
    longitude: user?.longitude || 83,
    health_status: ''
  };

  const handleSubmit = async (values: DonorFormData) => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      setError(null);
      try {
        await donorService.becomeDonor({
          ...values,
          last_donation_date: values.last_donation
        });
        navigate('/profile');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to submit donor application');
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const PersonalInformationForm = () => (
    <Box>
      <Field name="name">
        {({ field, meta }: FieldProps) => (
          <TextField
            {...field}
            fullWidth
            label="Full Name"
            margin="normal"
            disabled={loading}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      </Field>
      <Field name="phone">
        {({ field, meta }: FieldProps) => (
          <TextField
            {...field}
            fullWidth
            label="Phone Number"
            margin="normal"
            disabled={loading}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      </Field>
      <FormControl fullWidth margin="normal">
        <FormLabel>Blood Type</FormLabel>
        <Field name="blood_type">
          {({ field, meta }: FieldProps) => (
            <>
              <Select 
                {...field} 
                disabled={loading}
                error={meta.touched && !!meta.error}
              >
                <MenuItem value="">Select Blood Type</MenuItem>
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
              </Select>
              <FormHelperText error>{meta.touched && meta.error}</FormHelperText>
            </>
          )}
        </Field>
      </FormControl>
      <Field name="address">
        {({ field, meta }: FieldProps) => (
          <TextField
            {...field}
            fullWidth
            label="Address"
            margin="normal"
            multiline
            rows={2}
            disabled={loading}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      </Field>
      <Field name="date_of_birth">
        {({ field, meta }: FieldProps) => (
          <TextField
            {...field}
            fullWidth
            type="date"
            label="Date of Birth"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      </Field>
    </Box>
  );

  const MedicalHistoryForm = () => (
    <Box>
      <Field name="weight">
        {({ field, meta }: FieldProps) => (
          <TextField
            {...field}
            fullWidth
            label="Weight (kg)"
            type="number"
            margin="normal"
            disabled={loading}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      </Field>
      <Field name="height">
        {({ field, meta }: FieldProps) => (
          <TextField
            {...field}
            fullWidth
            label="Height (cm)"
            type="number"
            margin="normal"
            disabled={loading}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      </Field>
      <Field name="last_donation">
        {({ field, meta }: FieldProps) => (
          <TextField
            {...field}
            fullWidth
            type="date"
            label="Last Blood Donation Date (if any)"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      </Field>
      <FormControl component="fieldset" sx={{ my: 2 }}>
        <FormLabel component="legend">Medical Conditions (if any)</FormLabel>
        <FormGroup>
          {['Diabetes', 'Heart Disease', 'High Blood Pressure', 'HIV/AIDS', 'Hepatitis'].map((condition) => (
            <FormControlLabel
              key={condition}
              control={
                <Field
                  name="medical_conditions"
                  type="checkbox"
                  value={condition}
                  disabled={loading}
                />
              }
              label={condition}
            />
          ))}
        </FormGroup>
      </FormControl>
      <Field name="medications">
        {({ field, meta }: FieldProps) => (
          <TextField
            {...field}
            fullWidth
            label="Current Medications"
            margin="normal"
            multiline
            rows={2}
            disabled={loading}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      </Field>
      <FormControl component="fieldset" sx={{ my: 2 }}>
        <FormLabel component="legend">Current Health Status</FormLabel>
        <Field name="health_status">
          {({ field, meta }: FieldProps) => (
            <>
              <RadioGroup {...field}>
                <FormControlLabel value="excellent" control={<Radio disabled={loading} />} label="Excellent" />
                <FormControlLabel value="good" control={<Radio disabled={loading} />} label="Good" />
                <FormControlLabel value="fair" control={<Radio disabled={loading} />} label="Fair" />
                <FormControlLabel value="poor" control={<Radio disabled={loading} />} label="Poor" />
              </RadioGroup>
              <FormHelperText error>{meta.touched && meta.error}</FormHelperText>
            </>
          )}
        </Field>
      </FormControl>
    </Box>
  );

  const ConfirmationForm = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Terms and Conditions
      </Typography>
      <Typography variant="body2" paragraph>
        By agreeing to become a blood donor, you confirm that:
        <ul>
          <li>All information provided is accurate and complete</li>
          <li>You are at least 18 years old</li>
          <li>You weigh at least 50kg</li>
          <li>You are in good health</li>
          <li>You understand that your contact information may be used to notify you of blood donation needs</li>
        </ul>
      </Typography>
      <Field name="agreement">
        {({ field, meta }: FieldProps) => (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  color="primary"
                  disabled={loading}
                />
              }
              label="I agree to the terms and conditions"
            />
            <FormHelperText error>{meta.touched && meta.error}</FormHelperText>
          </>
        )}
      </Field>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <PersonalInformationForm />;
      case 1:
        return <MedicalHistoryForm />;
      case 2:
        return <ConfirmationForm />;
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <Container maxWidth="md">
      <StyledPaper>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Become a Blood Donor
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors: any = {};
            const step0Fields = ['name', 'phone', 'blood_type', 'address', 'date_of_birth'];
            const step1Fields = ['weight', 'height', 'last_donation', 'medical_conditions', 'medications', 'health_status'];
            const step2Fields = ['agreement'];

            const currentStepFields = 
              activeStep === 0 ? step0Fields :
              activeStep === 1 ? step1Fields :
              step2Fields;

            currentStepFields.forEach(field => {
              if (!values[field as keyof DonorFormData] && field !== 'medical_conditions' && field !== 'last_donation') {
                errors[field] = 'This field is required';
              }
            });

            if (activeStep === 0) {
              if (values.phone && !/^\+?[\d\s-]{10,}$/.test(values.phone)) {
                errors.phone = 'Please enter a valid phone number';
              }
              if (values.date_of_birth) {
                const date = new Date(values.date_of_birth);
                const age = new Date().getFullYear() - date.getFullYear();
                if (age < 18) {
                  errors.date_of_birth = 'You must be at least 18 years old to donate blood';
                }
              }
            }

            if (activeStep === 1) {
              if (values.weight && parseInt(values.weight) < 50) {
                errors.weight = 'You must weigh at least 50kg to donate blood';
              }
            }

            if (activeStep === 2 && !values.agreement) {
              errors.agreement = 'You must agree to the terms and conditions';
            }

            return errors;
          }}
        >
          {({ values, isValid }) => (
            <Form>
              <Box sx={{ mt: 4, mb: 4 }}>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mr: 1 }}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading || (activeStep === steps.length - 1 && !isValid)}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : activeStep === steps.length - 1 ? (
                      'Submit'
                    ) : (
                      'Next'
                    )}
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </StyledPaper>
    </Container>
  );
};

export default BecomeDonor; 