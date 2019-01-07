import {
  ADD_NEW_NOTE,
  SET_CURRENT_NOTE_ID,
  DELETE_CURRENT_NOTE,
  SET_NEWEST_NOTE_AS_CURRENT,
  UPDATE_NOTE,
  RENAME_NOTE
} from "../actionTypes";
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

    case RENAME_NOTE:
    case UPDATE_NOTE: {
      const { oldNote, updatedNote } = action.payload;
      return {
        ...state,
        all: state.all.map(n => (n.id === updatedNote.id ? updatedNote : n))
      };
    }

    case SET_CURRENT_NOTE_ID: {
      const { noteId } = action.payload;
      return { ...state, currentNoteId: noteId };
    }

    case SET_NEWEST_NOTE_AS_CURRENT: {
      if (state.all.length === 0) return state;
      const newestNote = state.all.sort((a, b) => {
        return a.lastEdit - b.lastEdit;
      })[0];
      return { ...state, currentNoteId: newestNote.id };
    }

    case DELETE_CURRENT_NOTE: {
      return {
        ...state,
        all: state.all.filter(note => note.id !== state.currentNoteId)
      };
    }

    default:
      return state;
  }
}
