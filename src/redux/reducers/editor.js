import { TOGGLE_NOTE_DELETION_MODAL } from "../actionTypes";

const initialState = {
  showNoteDeletionModal: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_NOTE_DELETION_MODAL:
      return { showNoteDeletionModal: !state.showNoteDeletionModal };
    default:
      return state;
  }
}
