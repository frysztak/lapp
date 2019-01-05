import {
  ADD_NEW_NOTE,
  UPDATE_NOTE,
  SET_CURRENT_NOTE_ID,
  TOGGLE_NOTE_DELETION_MODAL,
  DELETE_CURRENT_NOTE,
  SET_NEWEST_NOTE_AS_CURRENT
} from "./actionTypes";

export const addNewNote = note => ({
  type: ADD_NEW_NOTE,
  payload: { note: note }
});

export const updateNote = note => ({
  type: UPDATE_NOTE,
  payload: { note: note }
});

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
