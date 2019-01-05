import { ADD_NEW_NOTE, UPDATE_NOTE, SET_CURRENT_NOTE_ID } from "../actionTypes";

const initialState = {
  all: [],
  currentNote: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_NEW_NOTE:
      const { note } = action.payload;
      return { ...state, all: [...state.all, note] };
    case UPDATE_NOTE:
      const { noteId, updatedNote } = action.payload;
      return {
        ...state,
        all: state.notes.map(note =>
          note.id === noteId ? { ...note, ...updatedNote } : note
        )
      };
    case SET_CURRENT_NOTE_ID: {
      const { noteId } = action.payload;
      const idx = state.all.findIndex(note => note.id === noteId);
      return { ...state, currentNote: state.all[idx] };
    }
    default:
      return state;
  }
}
