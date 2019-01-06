import { createStore } from "redux";
import rootReducer from "./reducers";
import { loadState, saveState } from "./localStorage";
import throttle from "lodash/throttle";
import DropboxSync from "./dropboxSync";

const persistedState = loadState();
const storeEnhancer =
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true });
const store = createStore(rootReducer, persistedState, storeEnhancer);

const dropbox = new DropboxSync();
dropbox.attach(store);

store.subscribe(
  throttle(() => {
    saveState({
      notes: store.getState().notes
    });
  }, 1000)
);

export default store;
