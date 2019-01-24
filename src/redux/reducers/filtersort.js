import {
  TOGGLE_FILTER_POPUP,
  SET_FILTER_VALUE,
  HIDE_FILTER_POPUP,
  TOGGLE_SORT_POPUP,
  HIDE_SORT_POPUP,
  SET_SORT_VALUE,
  TOGGLE_MENU,
  HIDE_ALL_POPUPS
} from "../actionTypes";
import { SortTypes } from "./../../constants";

const initialState = {
  showFilterPopup: false,
  filter: "",
  showSortPopup: false,
  sortOrder: SortTypes[0],
  showMenu: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_FILTER_POPUP: {
      const next = !state.showFilterPopup;
      return next === true
        ? {
            ...state,
            showFilterPopup: true,
            showSortPopup: false,
            showMenu: false
          }
        : { ...state, showFilterPopup: next };
    }
    case HIDE_FILTER_POPUP: {
      return { ...state, showFilterPopup: false };
    }
    case SET_FILTER_VALUE: {
      const { filterValue } = action.payload;
      return { ...state, filter: filterValue };
    }
    case TOGGLE_SORT_POPUP: {
      const next = !state.showSortPopup;
      return next === true
        ? {
            ...state,
            showSortPopup: true,
            showFilterPopup: false,
            showMenu: false
          }
        : { ...state, showSortPopup: next };
    }
    case HIDE_SORT_POPUP: {
      return { ...state, showSortPopup: false };
    }
    case SET_SORT_VALUE: {
      const { sortValue } = action.payload;
      return { ...state, sortOrder: sortValue };
    }
    case TOGGLE_MENU: {
      const next = !state.showMenu;
      return next === true
        ? {
            ...state,
            showMenu: true,
            showFilterPopup: false,
            showSortPopup: false
          }
        : { ...state, showMenu: next };
    }
    case HIDE_ALL_POPUPS: {
      return {
        ...state,
        showFilterPopup: false,
        showSortPopup: false,
        showMenu: false
      };
    }
    default:
      return state;
  }
}
