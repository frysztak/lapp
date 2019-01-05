import { ADD_NEW_NOTE, UPDATE_NOTE, SET_CURRENT_NOTE_ID } from "../actionTypes";
import Note from "../../Note";

const initialNote = new Note();
const initialState = {
  all: [initialNote],
  currentNoteId: initialNote.id
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_NEW_NOTE: {
      const { note } = action.payload;
      return { ...state, all: [...state.all, note] };
    }
    case UPDATE_NOTE: {
      const { note } = action.payload;
      return {
        ...state,
        all: state.all.map(n => (n.id === note.id ? note : n))
      };
    }
    case SET_CURRENT_NOTE_ID: {
      const { noteId } = action.payload;
      return { ...state, currentNoteId: noteId };
    }
    default:
      return state;
  }
}
