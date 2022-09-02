import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { NoteEditFormValues } from '../types';

interface NoteEditFormProps {
  initialValues: NoteEditFormValues;
  onSubmit: (values: NoteEditFormValues) => void;
  onCancel?: () => void;
  placeholder: string;
  autoFocus: boolean;
  id: string;
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const validationSchema = yup.object({
  title: yup.string().required(),
});

export const NoteEditForm: FC<NoteEditFormProps> = ({
  initialValues,
  autoFocus,
  id,
  onSubmit,
  placeholder,
}) => {
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <Box sx={{ marginInline: 'auto', paddingTop: '0.3em' }}>
      <form onSubmit={formik.handleSubmit} noValidate autoComplete={'off'}>
        <Box sx={{ marginInline: 'auto', display: 'flex' }}>
          <TextField
            sx={{ minWidth: '400px', height: 20, marginLeft: '1em' }}
            id="outlined-multiline-flexible"
            label="Add new note"
            variant="standard"
            fullWidth
            maxRows={4}
            {...formik.getFieldProps('title')}
            autoFocus={autoFocus}
          />
          <LightTooltip
            title="Add note"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton type={'submit'} id={id} aria-label="add" size="large">
              <AddIcon
                sx={{
                  fontSize: 30,
                  color: '#2D3843FF',
                  '&:hover': {
                    color: '#93cc61',
                  },
                }}
              />
            </IconButton>
          </LightTooltip>
        </Box>
      </form>
    </Box>
  );
};
