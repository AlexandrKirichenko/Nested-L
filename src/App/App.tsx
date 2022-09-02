import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Header from './Header';
import { Router } from '../router';
import { useAppDispatch } from '../store/hooks';
import { authSlice } from '../store/auth';
import { Spinner } from './Spinner';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authSlice.thunks.checkTokenThunk());
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container sx={{ flex: '1 1 90vh' }}>
        <div>
          <Router />
        </div>
      </Container>
      <Spinner />
    </Box>
  );
};
