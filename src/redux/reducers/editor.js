import { TOGGLE_NOTE_DELETION_MODAL, TOGGLE_SIDEBAR } from "../actionTypes";

const initialState = {
  showSidebar: true,
  showNoteDeletionModal: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_NOTE_DELETION_MODAL:
      return { ...state, showNoteDeletionModal: !state.showNoteDeletionModal };
    case TOGGLE_SIDEBAR:
      return { ...state, showSidebar: !state.showSidebar };
    default:
      return state;
  }
}
