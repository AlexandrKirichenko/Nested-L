import { createSlice } from '@reduxjs/toolkit';
import { RequestSliceStateProperty } from '../../../store/types';
import { makeRequestCaseToBuilder, makeRequestSliceStateProperty } from '../../../store/helpers';
import { NoteList } from '../types';
import { SLICE_NAME } from './types';
import * as thunks from './thunks';

interface InitialState {
  fetchNoteListRequest: RequestSliceStateProperty<NoteList>;
  addNoteItemRequest: RequestSliceStateProperty<unknown>;
  patchNoteItemRequest: RequestSliceStateProperty<unknown>;
  deleteNodeListRequest: RequestSliceStateProperty<unknown>;
  changeOrderRequest: RequestSliceStateProperty<unknown>;
}

const initialState: InitialState = {
  fetchNoteListRequest: makeRequestSliceStateProperty<NoteList>(),
  addNoteItemRequest: makeRequestSliceStateProperty<unknown>(),
  patchNoteItemRequest: makeRequestSliceStateProperty<unknown>(),
  deleteNodeListRequest: makeRequestSliceStateProperty<unknown>(),
  changeOrderRequest: makeRequestSliceStateProperty<unknown>(),
};

export const { actions, reducer } = createSlice({
  initialState,
  name: SLICE_NAME,
  reducers: {},
  extraReducers: (builder) => {
    makeRequestCaseToBuilder<InitialState>(
      builder,
      thunks.fetchNoteListThunk,
      'fetchNoteListRequest',
    );
    makeRequestCaseToBuilder<InitialState>(builder, thunks.addNoteItemThunk, 'addNoteItemRequest');
    makeRequestCaseToBuilder<InitialState>(
      builder,
      thunks.patchNoteItemThunk,
      'patchNoteItemRequest',
    );
    makeRequestCaseToBuilder<InitialState>(
      builder,
      thunks.deleteNodeListThunk,
      'deleteNodeListRequest',
    );
    makeRequestCaseToBuilder<InitialState>(builder, thunks.changeOrderThunk, 'changeOrderRequest');
  },
});
