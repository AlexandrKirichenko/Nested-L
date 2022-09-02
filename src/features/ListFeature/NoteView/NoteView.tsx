import TextField from '@mui/material/TextField';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import Fade from '@mui/material/Fade';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ListItemText from '@mui/material/ListItemText';
import DoneIcon from '@mui/icons-material/Done';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import { Badge, Stack } from '@mui/material';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { AnimatePresence, motion } from 'framer-motion';
import { NoteViewItem, NoteViewList } from '../types';
import { NoteEditFormValues } from './types';
import { NoteEditForm } from './NoteEditForm';

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

interface NoteViewProps {
  noteViewItem: NoteViewItem;
  noteViewList: NoteViewList;
  onAddItem: (parentId: string, title: string) => void;
  id: string;
  onAddSublist: (id: string) => void;
  onChangeOrder: (idA: string, idB: string) => void;
  children?: ReactNode;
  isEnableDeleteItem: boolean;
  onDeleteItem: (id: string) => void;
  onDeleteSublist: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  isBorder: boolean;
  isShowListControlButtons: boolean;
  setIsShowChildren: (value: boolean, id: string) => void;
}

const NOTE_EDIT_FORM_INITIAL_STATE: NoteEditFormValues = {
  title: '',
  formReinitializeKey: 0,
};

export const NoteView: FC<NoteViewProps> = ({
  noteViewItem,
  noteViewList,
  onAddItem,
  onAddSublist,
  id,
  children,
  onChangeOrder,
  onEdit,
  isEnableDeleteItem,
  onDeleteItem,
  onDeleteSublist,
  isBorder,
  isShowListControlButtons,
  setIsShowChildren,
}) => {
  const [noteEditFormInitialState, setNoteEditFormInitialState] = useState<NoteEditFormValues>({
    ...NOTE_EDIT_FORM_INITIAL_STATE,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState(noteViewItem.title);
  const editTitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode) {
      editTitleInputRef?.current?.focus();
    }
  }, [isEditMode]);

  const handleFormSubmit = (values: NoteEditFormValues) => {
    setNoteEditFormInitialState((prev) => ({
      ...NOTE_EDIT_FORM_INITIAL_STATE,
      formReinitializeKey: prev.formReinitializeKey + 1,
    }));
    onAddItem(id, values.title);
  };

  const handleFormCancel = () => {
    setNoteEditFormInitialState((prev) => ({
      ...NOTE_EDIT_FORM_INITIAL_STATE,
      formReinitializeKey: prev.formReinitializeKey + 1,
    }));
  };

  const childListView = [...noteViewItem.childIdList].sort(
    (a, b) => noteViewList[a].order - noteViewList[b].order,
  );
  return (
    <List sx={{ padding: '0.2em 0 0.2em 0.1em' }}>
      <ListItem
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: '0 5px 0 7px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flex: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 10px',
            border: isBorder ? '1px solid lightgray' : 'none',
            borderRadius: '5px',
            boxShadow: isBorder ? 'rgba(0, 0, 0, 0.35) 0px 5px 15px' : 'none',
          }}
        >
          <Box sx={{ width: '75%' }}>
            {isEditMode ? (
              <TextField
                sx={{ width: '65%', height: 30, marginLeft: '1em' }}
                value={value}
                variant="standard"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onEdit(id, value);
                    setIsEditMode(false);
                  }
                }}
                label="Edit note"
                fullWidth
                maxRows={4}
              />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                {!!childListView.length && isShowListControlButtons && (
                  <>
                    <Stack spacing={2} direction="row">
                      <Badge
                        badgeContent={!noteViewItem.isShowChildren ? childListView.length : 0}
                        color="success"
                        onClick={() => setIsShowChildren(!noteViewItem.isShowChildren, id)}
                      >
                        {noteViewItem.isShowChildren ? (
                          <LightTooltip
                            title="Hide sublist"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                          >
                            <MenuIcon
                              sx={{
                                fontSize: 30,
                                color: '#2d3843',
                                '&:hover': {
                                  color: '#93cc61',
                                },
                              }}
                              color="action"
                              cursor={'pointer'}
                            />
                          </LightTooltip>
                        ) : (
                          <LightTooltip
                            title="Display sublist"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                          >
                            <PlaylistPlayIcon
                              sx={{
                                fontSize: 36,
                                color: '#2d3843',
                                '&:hover': {
                                  color: '#93cc61',
                                },
                              }}
                              color="action"
                              cursor={'pointer'}
                            />
                          </LightTooltip>
                        )}
                      </Badge>
                    </Stack>
                    <LightTooltip
                      title="Delete sublist"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                      <IconButton
                        onClick={() => onDeleteSublist(id)}
                        id={id}
                        aria-label="delete"
                        size="large"
                      >
                        <PlaylistRemoveIcon
                          sx={{
                            // #2d3843
                            fontSize: 36,
                            color: '#2d3843',
                            '&:hover': {
                              color: '#be0000',
                            },
                          }}
                        />
                      </IconButton>
                    </LightTooltip>
                  </>
                )}
                <ListItemText
                  sx={{
                    fontSize: 24,
                    color: '#2d3843',
                    backgroundColor: 'white',
                    wordBreak: 'break-all',
                  }}
                >
                  {noteViewItem.title}
                </ListItemText>
              </Box>
            )}
          </Box>
          {isEnableDeleteItem && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {children && <Box sx={{ display: 'flex', alignItems: 'center' }}>{children}</Box>}
              {isEditMode ? (
                <LightTooltip
                  title="Save changes"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <IconButton
                    onClick={() => {
                      onEdit(id, value);
                      setIsEditMode(false);
                    }}
                    id={id}
                    aria-label="save"
                    size="small"
                  >
                    <DoneIcon
                      sx={{
                        fontSize: 28,
                        color: '#2d3843',
                        '&:hover': {
                          color: '#93cc61',
                        },
                      }}
                    />
                  </IconButton>
                </LightTooltip>
              ) : (
                <LightTooltip
                  title="Edit note title"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <IconButton
                    onClick={() => {
                      setIsEditMode(true);
                    }}
                    id={id}
                    aria-label="edit"
                    size="small"
                  >
                    <EditIcon
                      sx={{
                        fontSize: 28,
                        color: '#2d3843',
                        '&:hover': {
                          color: '#ff790f',
                        },
                      }}
                    />
                  </IconButton>
                </LightTooltip>
              )}
              {!noteViewItem.isEnableSubList && (
                <LightTooltip
                  title="Add sublist"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <IconButton
                    onClick={() => onAddSublist(id)}
                    id={id}
                    aria-label="add"
                    size="large"
                  >
                    <PlaylistAddIcon
                      sx={{
                        fontSize: 36,
                        color: '#2d3843',
                        '&:hover': {
                          color: '#93cc61',
                        },
                      }}
                    />
                  </IconButton>
                </LightTooltip>
              )}
              <LightTooltip
                title="Delete list"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <IconButton
                  onClick={() => onDeleteItem(id)}
                  id={id}
                  aria-label="delete"
                  size="large"
                >
                  <DeleteOutlineIcon
                    sx={{
                      fontSize: 28,
                      color: '#2d3843',
                      '&:hover': {
                        color: '#be0000',
                      },
                    }}
                  />
                </IconButton>
              </LightTooltip>
            </Box>
          )}
        </Box>
        {noteViewItem.isEnableSubList && (
          <NoteEditForm
            initialValues={noteEditFormInitialState}
            onSubmit={handleFormSubmit}
            placeholder={'Type here...'}
            autoFocus={false}
            onCancel={handleFormCancel}
            id={id}
          />
        )}
        <div>
          <AnimatePresence exitBeforeEnter>
            {noteViewItem.isShowChildren &&
              childListView
                .filter((childId, index, arr) =>
                  noteViewItem.isShowChildren ? true : arr.length - 1 === index,
                )
                .map((childId, index) => (
                  <motion.div
                    key={childId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NoteView
                      noteViewItem={noteViewList[childId]}
                      key={childId}
                      noteViewList={noteViewList}
                      onAddItem={onAddItem}
                      id={childId}
                      onEdit={onEdit}
                      onAddSublist={onAddSublist}
                      onChangeOrder={onChangeOrder}
                      isEnableDeleteItem={true}
                      onDeleteItem={onDeleteItem}
                      onDeleteSublist={onDeleteSublist}
                      isBorder={true}
                      isShowListControlButtons={true}
                      setIsShowChildren={setIsShowChildren}
                    >
                      {index > 0 && (
                        <LightTooltip
                          title="Move note up"
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                        >
                          <IconButton
                            onClick={() =>
                              onChangeOrder(childListView[index], childListView[index - 1])
                            }
                            aria-label="up"
                            size="small"
                          >
                            <NorthIcon
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
                      )}
                      {index < childListView.length - 1 && (
                        <LightTooltip
                          title="Move note down"
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                        >
                          <IconButton
                            onClick={() =>
                              onChangeOrder(childListView[index + 1], childListView[index])
                            }
                            aria-label="down"
                            size="small"
                          >
                            <SouthIcon
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
                      )}
                    </NoteView>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </ListItem>
    </List>
  );
};
