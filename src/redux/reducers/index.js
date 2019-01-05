import { combineReducers } from "redux";
import notes from "./notes";
import editor from "./editor";
import filtersort from "./filtersort";

export default combineReducers({ notes, editor, filtersort });
