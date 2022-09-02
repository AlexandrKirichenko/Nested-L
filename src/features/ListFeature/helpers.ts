import { NoteList, NoteViewList } from './types';

export const getNoteViewList = (noteList: NoteList): NoteViewList => {
  const noteViewList: NoteViewList = {};

  const noteListKeyList = Object.keys(noteList);

  noteListKeyList.forEach((noteListKey) => {
    const note = noteList[noteListKey];
    noteViewList[noteListKey] = {
      title: note.title,
      isEnableSubList: note.isEnableSubList,
      childIdList: [],
      order: note.order,
      isShowChildren: note.isShowChildren,
    };
  });

  noteListKeyList.forEach((noteListKey) => {
    const parentId = noteList[noteListKey].parentId;
    if (parentId !== null) {
      noteViewList[parentId].childIdList.push(noteListKey);
    }
  });

  return noteViewList;
};

export const getSubtreeOfChildren = (
  id: string,
  noteList: NoteList,
  noteViewList: NoteViewList,
  isItemDelete: boolean,
): string[] => {
  const deleteIdList: string[] = [];

  if (isItemDelete) {
    deleteIdList.push(id);
  }

  const getDeleteIdList = (idList: string[]) => {
    idList.forEach((id) => {
      deleteIdList.push(id);
      getDeleteIdList(noteViewList[id].childIdList);
    });
  };

  getDeleteIdList(noteViewList[id].childIdList);

  return deleteIdList;
};
