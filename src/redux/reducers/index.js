import { combineReducers } from "redux";
import notes from "./notes";
import editor from "./editor";
import filtersort from "./filtersort";
import dropbox from "./dropbox";

export default combineReducers({ notes, editor, filtersort, dropbox });
