import { SET_CURRENT_NOTE_ID } from "../actionTypes";

const initialState = {
  currentNoteId: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_NOTE_ID:
      const { noteId } = action.payload;
      return { currentNoteId: noteId };
    default:
      return state;
  }
}
