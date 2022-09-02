import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../api';
import { NoteItem, NoteList } from '../types';
import { RootState } from '../../../store/types';
import { authSlice } from '../../../store/auth';
import { SLICE_NAME } from './types';
import { notesSlice } from './index';

const getUserId = (getState: () => unknown): number => {
  const loginRequest = authSlice.selectors.getLoginRequest(getState() as RootState);
  let userId = 0;
  if (loginRequest.data?.id) {
    userId = loginRequest.data.id;
  }
  return userId;
};

export const fetchNoteListThunk = createAsyncThunk(
  `${SLICE_NAME}/fetchNoteThunks`,
  async (_, { getState }) => {
    const userId = getUserId(getState);

    return api.notes.fetchNoteList(userId);
  },
);

export const addNoteItemThunk = createAsyncThunk(
  `${SLICE_NAME}/addNoteItemThunk`,
  async (noteItem: NoteItem, { dispatch, getState }) => {
    const userId = getUserId(getState);
    const response = await api.notes.addNoteItem(noteItem, userId);
    dispatch(fetchNoteListThunk());
    return response;
  },
);

interface PatchNoteItemThunk {
  noteItem: NoteItem;
  id: string;
}

export const patchNoteItemThunk = createAsyncThunk(
  `${SLICE_NAME}/patchNoteItemThunk`,
  async ({ noteItem, id }: PatchNoteItemThunk, { dispatch, getState }) => {
    const userId = getUserId(getState);
    const response = await api.notes.patchNoteItem(noteItem, id, userId);
    dispatch(fetchNoteListThunk());

    return response;
  },
);

export const deleteNodeListThunk = createAsyncThunk(
  `${SLICE_NAME}/deleteNodeList`,
  async (nodeItemIdList: string[], { dispatch }) => {
    const response = await api.notes.deleteNodeList(nodeItemIdList);
    dispatch(fetchNoteListThunk());
    return response;
  },
);

interface ChangeOrderThunkPayload {
  idA: string;
  idB: string;
}

export const changeOrderThunk = createAsyncThunk(
  `${SLICE_NAME}/changeOrderThunk`,
  async ({ idA, idB }: ChangeOrderThunkPayload, { dispatch, getState }) => {
    const userId = getUserId(getState);

    const noteList = notesSlice.selectors.getFetchNoteListRequest(getState() as RootState).data;

    if (noteList) {
      const currentA = noteList[idA];
      const currentB = noteList[idB];
      if (currentA && currentB) {
        const newA: NoteItem = { ...currentA, order: currentB.order };
        const newB: NoteItem = { ...currentB, order: currentA.order };

        await api.notes.patchNoteItem(newA, idA, userId);
        await api.notes.patchNoteItem(newB, idB, userId);

        dispatch(fetchNoteListThunk());
      }
    }

    return null;
  },
);

interface SetIsShowChildrenPayload {
  noteList: NoteList;
  idList: string[];
  value: boolean;
}

export const setIsShowChildren = createAsyncThunk(
  `${SLICE_NAME}/setIsShowChildren`,
  async ({ noteList, idList, value }: SetIsShowChildrenPayload, { dispatch, getState }) => {
    // console.log(noteList, idList);
    const userId = getUserId(getState);
    for (let i = 0; i < idList.length; i++) {
      const currentId = idList[i];
      const currentNoteItem = noteList[currentId];
      // console.log(currentId, currentNoteItem);
      if (currentNoteItem) {
        const noteItem: NoteItem = {
          ...currentNoteItem,
          isShowChildren: value,
        };
        await api.notes.patchNoteItem(noteItem, currentId, userId);
      }
    }
    dispatch(fetchNoteListThunk());
  },
);
