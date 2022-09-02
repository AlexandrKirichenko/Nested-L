import React, { FC, useEffect } from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAppSelector } from '../../store/hooks';
import { notesSlice } from '../../features/ListFeature/slice';
import { authSlice } from '../../store/auth';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export const Spinner: FC = () => {
  const [progress, setProgress] = React.useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const fetchNoteListRequest = useAppSelector(notesSlice.selectors.getFetchNoteListRequest);
  const addNoteItemRequest = useAppSelector(notesSlice.selectors.getAddNoteItemRequest);
  const patchNoteItemRequest = useAppSelector(notesSlice.selectors.getPatchNoteItemRequest);
  const deleteNodeListRequest = useAppSelector(notesSlice.selectors.getDeleteNodeListRequest);
  const changeOrderRequest = useAppSelector(notesSlice.selectors.getChangeOrderRequest);

  const loginRequest = useAppSelector(authSlice.selectors.getLoginRequest);
  const signUpRequest = useAppSelector(authSlice.selectors.getSignUpRequest);

  const isLoading =
    fetchNoteListRequest.isLoading ||
    addNoteItemRequest.isLoading ||
    patchNoteItemRequest.isLoading ||
    loginRequest.isLoading ||
    signUpRequest.isLoading ||
    deleteNodeListRequest.isLoading ||
    changeOrderRequest.isLoading;

  return isLoading ? (
    <Box sx={{ width: '100%', position: 'absolute', top: '65px' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  ) : null;
};
