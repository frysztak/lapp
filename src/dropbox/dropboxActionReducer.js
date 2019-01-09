import { UPDATE_NOTE, RENAME_NOTE, DELETE_NOTE } from "../redux/actionTypes";
import { DBX_RENAME, DBX_UPLOAD, DBX_DELETE } from "./dropboxActions";

const sameContent = (actionA, actionB) =>
  actionA.payload.updatedNote.text === actionB.payload.oldNote.text;
const sameName = (actionA, actionB) =>
  actionA.payload.updatedNote.name === actionB.payload.oldNote.name;
const bothUpdate = (actionA, actionB) =>
  actionA.type === UPDATE_NOTE && actionB.type === UPDATE_NOTE;
const bothRename = (actionA, actionB) =>
  actionA.type === RENAME_NOTE && actionB.type === RENAME_NOTE;

const compareActions = (actionA, actionB) => {
  if (
    bothRename(actionA, actionB) &&
    sameContent(actionA, actionB) &&
    !sameName(actionA, actionB)
  ) {
    // rename
    return true;
  } else if (
    bothUpdate(actionA, actionB) &&
    sameName(actionA, actionB) &&
    !sameContent(actionA, actionB)
  ) {
    // content update
    return true;
  }

  return false;
};

export const convertToDropboxAction = reduxAction => {
  if (reduxAction.type === RENAME_NOTE) {
    const { oldNote, updatedNote } = reduxAction.payload;
    return {
      type: DBX_RENAME,
      from: oldNote.name,
      to: updatedNote.name,
      noteId: oldNote.id // not needed for dropbox, but needed to set sync status
    };
  } else if (reduxAction.type === UPDATE_NOTE) {
    const { oldNote, updatedNote } = reduxAction.payload;
    return {
      type: DBX_UPLOAD,
      note: updatedNote
    };
  } else if (reduxAction.type === DELETE_NOTE) {
    const { note } = reduxAction.payload;
    return {
      type: DBX_DELETE,
      note: note
    };
  }
};

export const splitIntoChunks = actions => {
  let chunks = [];
  let prev = 0;
  for (const current of actions) {
    if (!compareActions(current, prev)) chunks.push([]);
    chunks[chunks.length - 1].push(convertToDropboxAction(current));
    prev = current;
  }
  return chunks;
};

export const reduceDropboxActions = actions => {
  if (actions.length === 1) return actions[0];

  let reducedAction = actions[0];
  for (let idx = 1; idx < actions.length; idx++) {
    const action = actions[idx];
    if (action.type === DBX_RENAME) {
      reducedAction = { ...reducedAction, to: action.to };
    } else if (action.type === DBX_UPLOAD) {
      reducedAction = { ...reducedAction, note: action.note };
    }
  }
  return reducedAction;
};

export const reduceReduxActions = actions => {
  const chunks = splitIntoChunks(actions);
  return chunks.map(chunk => reduceDropboxActions(chunk));
};
