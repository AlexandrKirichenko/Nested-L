import Typography from '@mui/material/Typography';
import React, { FC, useEffect } from 'react';
import Box from '@mui/material/Box';
import RefreshIcon from '@mui/icons-material/Refresh';
import Fade from '@mui/material/Fade';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { notesSlice } from './slice';
import { NoteView } from './NoteView';
import { getSubtreeOfChildren, getNoteViewList } from './helpers';
import { NoteItem } from './types';

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

export const ListFeature: FC = () => {
  const dispatch = useAppDispatch();
  const noteListRequest = useAppSelector(notesSlice.selectors.getFetchNoteListRequest);
  const addNoteItemRequest = useAppSelector(notesSlice.selectors.getAddNoteItemRequest);
  const patchNoteItemRequest = useAppSelector(notesSlice.selectors.getPatchNoteItemRequest);
  const deleteNodeListRequest = useAppSelector(notesSlice.selectors.getDeleteNodeListRequest);
  const changeOrderRequest = useAppSelector(notesSlice.selectors.getChangeOrderRequest);
  const errors = [
    noteListRequest,
    addNoteItemRequest,
    patchNoteItemRequest,
    deleteNodeListRequest,
    changeOrderRequest,
  ];

  useEffect(() => {
    dispatch(notesSlice.thunks.fetchNoteListThunk());
  }, []);

  if (noteListRequest.data === null) {
    return null;
  }
  const noteViewList = getNoteViewList(noteListRequest.data);

  const handleAddItem = (parentId: string, title: string) => {
    const noteItem: NoteItem = {
      parentId,
      title,
      order: new Date().getTime(),
      isEnableSubList: false,
      isShowChildren: false,
    };

    dispatch(notesSlice.thunks.addNoteItemThunk(noteItem));
  };

  const handleAddSubList = (id: string) => {
    if (noteListRequest.data) {
      const currentNoteItem = noteListRequest.data[id];
      if (currentNoteItem) {
        const noteItem: NoteItem = {
          ...currentNoteItem,
          isEnableSubList: true,
        };
        dispatch(notesSlice.thunks.patchNoteItemThunk({ noteItem, id }));
      }
    }
  };

  const handleEditList = (id: string, title: string) => {
    if (noteListRequest.data) {
      const currentNoteItem = noteListRequest.data[id];
      if (currentNoteItem) {
        const noteItem: NoteItem = {
          ...currentNoteItem,
          title,
        };
        dispatch(notesSlice.thunks.patchNoteItemThunk({ noteItem, id }));
      }
    }
  };

  const handleChangeOrder = (idA: string, idB: string) => {
    dispatch(notesSlice.thunks.changeOrderThunk({ idA, idB }));
  };

  const handleDeleteItem = (id: string) => {
    if (noteListRequest.data) {
      const deleteItemIdListFromNodeList = getSubtreeOfChildren(
        id,
        noteListRequest.data,
        noteViewList,
        true,
      );

      dispatch(notesSlice.thunks.deleteNodeListThunk(deleteItemIdListFromNodeList));
    }
  };

  const handleDeleteSublist = (id: string) => {
    if (noteListRequest.data) {
      const deleteItemIdListFromNodeList = getSubtreeOfChildren(
        id,
        noteListRequest.data,
        noteViewList,
        false,
      );

      dispatch(notesSlice.thunks.deleteNodeListThunk(deleteItemIdListFromNodeList));
    }
  };

  const isBorder = false;

  const handleSetIsShowChildren = (value: boolean, id: string) => {
    if (noteListRequest.data) {
      const updateItemIdListFromNodeList = getSubtreeOfChildren(
        id,
        noteListRequest.data,
        noteViewList,
        true,
      );

      dispatch(
        notesSlice.thunks.setIsShowChildren({
          noteList: noteListRequest.data,
          idList: updateItemIdListFromNodeList,
          value,
        }),
      );
    }
  };

  return (
    <>
      <Box>
        {errors.map((el) => {
          return el.error ? (
            <Typography
              sx={{ color: '#d3466b', textAlign: 'center' }}
              component="h3"
              variant="subtitle2"
            >
              ERROR REQUEST: {el.error.errorMsg}
            </Typography>
          ) : null;
        })}
        <LightTooltip
          title="Update Note list"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton
            onClick={() => {
              dispatch(notesSlice.thunks.fetchNoteListThunk());
            }}
            aria-label="list update"
            size="small"
          >
            <RefreshIcon
              sx={{
                fontSize: 28,
                color: '#2d3843',
                '&:hover': {
                  color: 'blue',
                },
              }}
            />
          </IconButton>
        </LightTooltip>
        <NoteView
          noteViewItem={noteViewList[0]}
          noteViewList={noteViewList}
          onAddItem={handleAddItem}
          id={'0'}
          onEdit={handleEditList}
          onAddSublist={handleAddSubList}
          onChangeOrder={handleChangeOrder}
          isEnableDeleteItem={false}
          onDeleteItem={handleDeleteItem}
          onDeleteSublist={handleDeleteSublist}
          isBorder={isBorder}
          isShowListControlButtons={false}
          setIsShowChildren={handleSetIsShowChildren}
        />
      </Box>
    </>
  );
};
