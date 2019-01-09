import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { loadState, saveState } from "./localStorage";
import throttle from "lodash/throttle";
import DropboxSync from "../dropbox/dropboxSync";
import thunk from "redux-thunk";

const persistedState = loadState();
const composeEnhancers = composeWithDevTools({
  trace: true
});

const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunk))
);

export const dropbox = new DropboxSync();
dropbox.attach(store);

store.subscribe(
  throttle(() => {
    saveState({
      notes: store.getState().notes
    });
  }, 1000)
);

export default store;
