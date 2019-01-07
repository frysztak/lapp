import {
  splitIntoChunks,
  convertToDropboxAction,
  reduceDropboxActions,
  reduceReduxActions
} from "./dropboxActionReducer";
import { UPDATE_NOTE, RENAME_NOTE } from "./actionTypes";
import { DBX_RENAME, DBX_UPLOAD } from "./dropboxActions";

describe("Splitting into chunks", () => {
  it("No consecutive renames", () => {
    const actions = [
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "smth", content_hash: "hashA" },
          updatedNote: { name: "A", content_hash: "hashA" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "B", content_hash: "hashB-" },
          updatedNote: { name: "B", content_hash: "hashB" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "C-", content_hash: "hashC" },
          updatedNote: { name: "C", content_hash: "hashC" }
        }
      }
    ];
    const chunks = splitIntoChunks(actions);
    const dbxActions = actions.map(a => convertToDropboxAction(a));
    expect(chunks).toEqual(dbxActions.map(action => [action]));
  });

  it("Consecutive renames", () => {
    const actions = [
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "A-", content_hash: "hashA" },
          updatedNote: { name: "A", content_hash: "hashA" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "A", content_hash: "hashA" },
          updatedNote: { name: "B", content_hash: "hashA" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "C", content_hash: "hashC-" },
          updatedNote: { name: "C", content_hash: "hashC" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "D-", content_hash: "hashD" },
          updatedNote: { name: "D", content_hash: "hashD" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "D", content_hash: "hashD" },
          updatedNote: { name: "E", content_hash: "hashD" }
        }
      }
    ];
    const chunks = splitIntoChunks(actions);
    const dbxActions = actions.map(a => convertToDropboxAction(a));
    expect(chunks).toEqual([
      [dbxActions[0], dbxActions[1]],
      [dbxActions[2]],
      [dbxActions[3], dbxActions[4]]
    ]);
  });

  it("Consecutive content changes", () => {
    const actions = [
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "A", content_hash: "hashA-" },
          updatedNote: { name: "A", content_hash: "hashA" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "A", content_hash: "hashA" },
          updatedNote: { name: "A", content_hash: "hashB" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "C", content_hash: "hashC-" },
          updatedNote: { name: "C", content_hash: "hashC" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "D", content_hash: "hashD-" },
          updatedNote: { name: "D", content_hash: "hashD" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "D", content_hash: "hashD" },
          updatedNote: { name: "D", content_hash: "hashE" }
        }
      }
    ];
    const chunks = splitIntoChunks(actions);
    const dbxActions = actions.map(a => convertToDropboxAction(a));
    expect(chunks).toEqual([
      [dbxActions[0], dbxActions[1]],
      [dbxActions[2]],
      [dbxActions[3], dbxActions[4]]
    ]);
  });

  it("Rename followed by content changes", () => {
    const actions = [
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "A-", content_hash: "hashA" },
          updatedNote: { name: "A", content_hash: "hashA" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "A", content_hash: "hashA" },
          updatedNote: { name: "Aa", content_hash: "hashA" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "Aa", content_hash: "hashA" },
          updatedNote: { name: "Aaa", content_hash: "hashA" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "Aaa", content_hash: "hashA" },
          updatedNote: { name: "Aaa", content_hash: "hashB" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "Aaa", content_hash: "hashB" },
          updatedNote: { name: "Aaa", content_hash: "hashC" }
        }
      }
    ];
    const chunks = splitIntoChunks(actions);
    const dbxActions = actions.map(a => convertToDropboxAction(a));
    expect(chunks).toEqual([
      [dbxActions[0], dbxActions[1], dbxActions[2]],
      [dbxActions[3], dbxActions[4]]
    ]);
  });
});

describe("Reducing Dropbox actions", () => {
  it("Reduce single action", () => {
    const actions = [
      {
        type: DBX_RENAME,
        from: "A",
        to: "B"
      }
    ];
    const reducedAction = reduceDropboxActions(actions);
    expect(reducedAction).toEqual(actions[0]);
  });

  it("Reduce renames", () => {
    const actions = [
      {
        type: DBX_RENAME,
        from: "A",
        to: "B"
      },
      {
        type: DBX_RENAME,
        from: "B",
        to: "C"
      },
      {
        type: DBX_RENAME,
        from: "C",
        to: "D"
      }
    ];

    const reducedAction = reduceDropboxActions(actions);
    expect(reducedAction).toEqual({
      type: DBX_RENAME,
      from: "A",
      to: "D"
    });
  });

  it("Reduce uploads", () => {
    const actions = [
      {
        type: DBX_UPLOAD,
        note: { name: "A", content: "a" }
      },
      {
        type: DBX_UPLOAD,
        note: { name: "A", content: "aa" }
      },
      {
        type: DBX_UPLOAD,
        note: { name: "A", content: "aaa" }
      }
    ];

    const reducedAction = reduceDropboxActions(actions);
    expect(reducedAction).toEqual(actions[actions.length - 1]);
  });
});

describe("Reducing Redux actions", () => {
  it("Consecutive renames", () => {
    const actions = [
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "smth", content_hash: "hashA" },
          updatedNote: { name: "A", content_hash: "hashA" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "A", content_hash: "hashA" },
          updatedNote: { name: "B", content_hash: "hashA" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "B", content_hash: "hashA" },
          updatedNote: { name: "C", content_hash: "hashA" }
        }
      }
    ];

    const reducedActions = reduceReduxActions(actions);
    expect(reducedActions).toEqual([
      {
        type: DBX_RENAME,
        from: "smth",
        to: "C"
      }
    ]);
  });
});
