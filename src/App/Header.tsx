import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authSlice } from '../store/auth';

export default function Header() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(authSlice.selectors.getIsAuth);
  const loginRequest = useAppSelector(authSlice.selectors.getLoginRequest);

  const handleLogout = () => {
    dispatch(authSlice.thunks.logout());
  };

  return (
    <Box sx={{ flexGrow: 1, boxShadow: 0 }}>
      <AppBar position="static">
        <Toolbar sx={{ bgcolor: '#1976d2' }}>
          <Typography variant="h4" component="h4" sx={{ flexGrow: 1, alignItems: 'center' }}>
            Notes
          </Typography>
          {isAuth && loginRequest.data && (
            <Typography
              variant="subtitle1"
              component="h6"
              sx={{ color: '#EA8B20FF', marginRight: '1em', fontSize: '1.2em' }}
            >
              {loginRequest.data.firstName}
            </Typography>
          )}
          {isAuth ? (
            <Grid item>
              <Link href="/" variant="body2" component={'button'} onClick={handleLogout}>
                <Typography
                  variant="subtitle1"
                  component="h6"
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: '#7fc2ff',
                    },
                  }}
                >
                  Logout
                </Typography>
              </Link>
            </Grid>
          ) : (
            'Login'
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
