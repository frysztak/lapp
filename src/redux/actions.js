import {
  ADD_NEW_NOTE,
  UPDATE_NOTE,
  SET_CURRENT_NOTE_ID,
  TOGGLE_NOTE_DELETION_MODAL,
  DELETE_CURRENT_NOTE,
  SET_NEWEST_NOTE_AS_CURRENT,
  TOGGLE_FILTER_POPUP,
  HIDE_FILTER_POPUP,
  SET_FILTER_VALUE,
  SET_SORT_VALUE,
  HIDE_SORT_POPUP,
  TOGGLE_SORT_POPUP,
  TOGGLE_SIDEBAR,
  SET_NOTE_SYNC_STATUS,
  SET_DROPBOX_SYNC_ENABLED,
  SET_DROPBOX_ACCESS_TOKEN
} from "./actionTypes";
import { dropbox } from "./store";
import { NoteStatus } from "../constants";

export const addNewNote = note => ({
  type: ADD_NEW_NOTE,
  payload: { note: note }
});

export const updateNote = (note, justRename) => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_NOTE,
    payload: { note: note, justRename: justRename }
  });

  dispatch(setNoteSyncStatus(note.id, NoteStatus.IN_PROGRESS));
  let success = false;
  if (justRename) {
    const oldNote = getState().notes.all.find(n => n.id === note.id);
    success = await dropbox.renameNote(oldNote, note);
  } else {
    success = await dropbox.updateNote(note);
  }
  const status = success ? NoteStatus.OK : NoteStatus.ERROR;
  dispatch(setNoteSyncStatus(note.id, status));
};

export const setCurrentNoteId = noteId => ({
  type: SET_CURRENT_NOTE_ID,
  payload: { noteId: noteId }
});

export const setNewestNoteAsCurrent = () => ({
  type: SET_NEWEST_NOTE_AS_CURRENT
});

export const toggleNoteDeletionModal = () => ({
  type: TOGGLE_NOTE_DELETION_MODAL
});

export const deleteCurrentNote = () => ({
  type: DELETE_CURRENT_NOTE
});

export const toggleFilterPopup = () => ({
  type: TOGGLE_FILTER_POPUP
});

export const hideFilterPopup = () => ({
  type: HIDE_FILTER_POPUP
});

export const setFilterValue = value => ({
  type: SET_FILTER_VALUE,
  payload: { filterValue: value }
});

export const toggleSortPopup = () => ({
  type: TOGGLE_SORT_POPUP
});

export const hideSortPopup = () => ({
  type: HIDE_SORT_POPUP
});

export const setSortValue = value => ({
  type: SET_SORT_VALUE,
  payload: { sortValue: value }
});

export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR
});

export const setDropboxSyncEnabled = enabled => ({
  type: SET_DROPBOX_SYNC_ENABLED,
  payload: { enabled: enabled }
});

export const setDropboxAccessToken = token => ({
  type: SET_DROPBOX_ACCESS_TOKEN,
  payload: { accessToken: token }
});

export const setNoteSyncStatus = (noteId, syncStatus) => ({
  type: SET_NOTE_SYNC_STATUS,
  payload: { noteId: noteId, syncStatus: syncStatus }
});
