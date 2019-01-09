import {
  ADD_NEW_NOTE,
  UPDATE_NOTE,
  SET_CURRENT_NOTE_ID,
  TOGGLE_NOTE_DELETION_MODAL,
  DELETE_NOTE,
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
  SET_DROPBOX_ACCESS_TOKEN,
  RENAME_NOTE
} from "./actionTypes";
import { dropbox } from "./store";
import { SOURCE_USER } from "../constants";

export const addNewNote = (note, source = SOURCE_USER) => {
  const action = {
    type: ADD_NEW_NOTE,
    payload: { note: note }
  };

  if (source === SOURCE_USER) {
    dropbox.enqueueAction(action);
  }
  return action;
};

export const updateNote = (oldNote, updatedNote, source = SOURCE_USER) => {
  const action = {
    type: UPDATE_NOTE,
    payload: { oldNote: oldNote, updatedNote: updatedNote, source: source }
  };

  if (source === SOURCE_USER) {
    dropbox.enqueueAction(action);
  }
  return action;
};

export const renameNote = (oldNote, updatedNote, source = SOURCE_USER) => {
  const action = {
    type: RENAME_NOTE,
    payload: { oldNote: oldNote, updatedNote: updatedNote, source: source }
  };

  if (source === SOURCE_USER) {
    dropbox.enqueueAction(action);
  }
  return action;
};

export const deleteNote = note => {
  const action = {
    type: DELETE_NOTE,
    payload: { note: note }
  };

  dropbox.enqueueAction(action);
  return action;
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
