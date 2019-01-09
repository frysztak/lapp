import {
  SET_NOTE_SYNC_STATUS,
  SET_DROPBOX_ACCESS_TOKEN,
  SET_DROPBOX_SYNC_ENABLED
} from "../actionTypes";

const initialState = {
  synchronizationEnabled: false,
  dbxAccessToken: undefined,
  notesStatus: {} //id: NoteStatus
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_DROPBOX_SYNC_ENABLED: {
      const { enabled } = action.payload;
      return { ...state, synchronizationEnabled: enabled };
    }

    case SET_DROPBOX_ACCESS_TOKEN: {
      const { token } = action.payload;
      return { ...state, dbxAccessToken: token };
    }

    case SET_NOTE_SYNC_STATUS: {
      const { noteId, syncStatus } = action.payload;
      return {
        ...state,
        notesStatus: { ...state.notesStatus, [noteId]: syncStatus }
      };
    }
    default:
      return state;
  }
}
