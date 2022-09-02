import { FC, MouseEvent, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { authSlice } from '../../../store/auth';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { LoginCredentials } from '../types';
import { appSlice } from '../../../store/app';
import { getRoutePath } from '../../../router';

const theme = createTheme();

const INITIAL_VALUES: LoginCredentials = {
  email: '',
  password: '',
};

const VALIDATION_SCHEMA = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export const LoginMainForm: FC = () => {
  const [successAlert, setSuccessAlert] = useState(false);
  const dispatch = useAppDispatch();
  const loginRequest = useAppSelector(authSlice.selectors.getLoginRequest);

  const formik = useFormik<LoginCredentials>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      dispatch(authSlice.thunks.loginThunk(values));
      setSuccessAlert(!successAlert);
    },
  });

  const handleGoToSignUp = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(appSlice.actions.redirect(getRoutePath('SignUpPage')));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="div" maxWidth="xs">
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
            Sign in
          </Typography>
          {loginRequest.error && (
            <Typography sx={{ color: '#d3466b' }} component="h3" variant="subtitle2">
              ERROR REQUEST: {loginRequest.error.errorMsg}
            </Typography>
          )}
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={formik.handleSubmit}
            autoComplete={'off'}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              {...formik.getFieldProps('email')}
              error={Boolean(formik.touched.email) && Boolean(formik.errors.email)}
              name="email"
              helperText={formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              {...formik.getFieldProps('password')}
              error={Boolean(formik.touched.password) && Boolean(formik.errors.password)}
              name="password"
              helperText={formik.errors.password}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, height: 45 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link variant="body2" onClick={handleGoToSignUp}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
