import {
  TOGGLE_FILTER_POPUP,
  SET_FILTER_VALUE,
  HIDE_FILTER_POPUP
} from "../actionTypes";

const initialState = {
  showFilterPopup: false,
  filter: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_FILTER_POPUP: {
      return { ...state, showFilterPopup: !state.showFilterPopup };
    }
    case HIDE_FILTER_POPUP: {
      return { ...state, showFilterPopup: false };
    }
    case SET_FILTER_VALUE: {
      const { filterValue } = action.payload;
      return { ...state, filter: filterValue };
    }
    default:
      return state;
  }
}
