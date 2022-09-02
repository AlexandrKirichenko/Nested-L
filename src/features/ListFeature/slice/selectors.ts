import { RequestSliceStateProperty, RootState } from '../../../store/types';
import { NoteList } from '../types';

export const getFetchNoteListRequest = (store: RootState): RequestSliceStateProperty<NoteList> =>
  store.notes.fetchNoteListRequest;

export const getAddNoteItemRequest = (store: RootState): RequestSliceStateProperty<unknown> =>
  store.notes.addNoteItemRequest;

export const getPatchNoteItemRequest = (store: RootState): RequestSliceStateProperty<unknown> =>
  store.notes.patchNoteItemRequest;

export const getDeleteNodeListRequest = (store: RootState): RequestSliceStateProperty<unknown> =>
  store.notes.deleteNodeListRequest;

export const getChangeOrderRequest = (store: RootState): RequestSliceStateProperty<unknown> =>
  store.notes.changeOrderRequest;
