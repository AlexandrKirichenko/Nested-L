import { FC, MouseEvent, useState } from 'react';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Alert from '@mui/material/Alert';
import { appSlice } from '../../../store/app';
import { getRoutePath } from '../../../router';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { SignUpData } from '../types';
import { authSlice } from '../../../store/auth';

const theme = createTheme();

const INITIAL_VALUES: SignUpData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
};

const VALIDATION_SCHEMA = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

export const SignUpMainForm: FC = () => {
  const dispatch = useAppDispatch();
  const [successAlertFlag, setSuccessAlertFlag] = useState(false);
  const signUpRequest = useAppSelector(authSlice.selectors.getSignUpRequest);

  const formik = useFormik<SignUpData>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      setSuccessAlertFlag(!successAlertFlag);
      const successCb = () => {
        dispatch(appSlice.actions.redirect(getRoutePath('LoginPage')));
      };

      dispatch(authSlice.thunks.singUpThunk({ signUpData: values, successCb }));
    },
  });

  const handleGoToSignIn = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(appSlice.actions.redirect(getRoutePath('LoginPage')));
  };
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {successAlertFlag && !signUpRequest.error && (
            <Alert severity="success">
              Congratulations! Your registration was successful completed.
            </Alert>
          )}
        </Box>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            {signUpRequest.error && (
              <Typography sx={{ color: '#d3466b' }} component="h3" variant="subtitle2">
                ERROR REQUEST: {signUpRequest.error.errorMsg}
              </Typography>
            )}
            <Box
              component="form"
              noValidate
              sx={{ mt: 3 }}
              onSubmit={formik.handleSubmit}
              autoComplete={'off'}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    {...formik.getFieldProps('firstName')}
                    error={Boolean(formik.touched.firstName) && Boolean(formik.errors.firstName)}
                    name="firstName"
                    helperText={formik.errors.firstName}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    autoComplete="family-name"
                    {...formik.getFieldProps('lastName')}
                    error={Boolean(formik.touched.lastName) && Boolean(formik.errors.lastName)}
                    name="lastName"
                    helperText={formik.errors.lastName}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    {...formik.getFieldProps('email')}
                    error={Boolean(formik.touched.email) && Boolean(formik.errors.email)}
                    name="email"
                    helperText={formik.errors.email}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    {...formik.getFieldProps('password')}
                    error={Boolean(formik.touched.password) && Boolean(formik.errors.password)}
                    name="password"
                    helperText={formik.errors.password}
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, height: 45 }}>
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2" onClick={handleGoToSignIn}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};
