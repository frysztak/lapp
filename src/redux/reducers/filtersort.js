import {
  TOGGLE_FILTER_POPUP,
  SET_FILTER_VALUE,
  HIDE_FILTER_POPUP,
  TOGGLE_SORT_POPUP,
  HIDE_SORT_POPUP,
  SET_SORT_VALUE
} from "../actionTypes";
import { SortTypes } from "./../../constants";

const initialState = {
  showFilterPopup: false,
  filter: "",
  showSortPopup: false,
  sortOrder: SortTypes[0]
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
    case TOGGLE_SORT_POPUP: {
      return { ...state, showSortPopup: !state.showSortPopup };
    }
    case HIDE_SORT_POPUP: {
      return { ...state, showSortPopup: false };
    }
    case SET_SORT_VALUE: {
      const { sortValue } = action.payload;
      return { ...state, sortOrder: sortValue };
    }
    default:
      return state;
  }
}