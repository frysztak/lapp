import { ADD_NEW_NOTE, UPDATE_NOTE, SET_CURRENT_NOTE_ID } from "./actionTypes";

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
