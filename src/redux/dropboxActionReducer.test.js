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
          oldNote: { name: "smth", text: "contentA" },
          updatedNote: { name: "A", text: "contentA" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "B", text: "contentB-" },
          updatedNote: { name: "B", text: "contentB" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "C-", text: "contentC" },
          updatedNote: { name: "C", text: "contentC" }
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
          oldNote: { name: "A-", text: "contentA" },
          updatedNote: { name: "A", text: "contentA" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "A", text: "contentA" },
          updatedNote: { name: "B", text: "contentA" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "C", text: "contentC-" },
          updatedNote: { name: "C", text: "contentC" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "D-", text: "contentD" },
          updatedNote: { name: "D", text: "contentD" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "D", text: "contentD" },
          updatedNote: { name: "E", text: "contentD" }
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
          oldNote: { name: "A", text: "contentA-" },
          updatedNote: { name: "A", text: "contentA" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "A", text: "contentA" },
          updatedNote: { name: "A", text: "contentB" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "C", text: "contentC-" },
          updatedNote: { name: "C", text: "contentC" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "D", text: "contentD-" },
          updatedNote: { name: "D", text: "contentD" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "D", text: "contentD" },
          updatedNote: { name: "D", text: "contentE" }
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
          oldNote: { name: "A-", text: "contentA" },
          updatedNote: { name: "A", text: "contentA" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "A", text: "contentA" },
          updatedNote: { name: "Aa", text: "contentA" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "Aa", text: "contentA" },
          updatedNote: { name: "Aaa", text: "contentA" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "Aaa", text: "contentA" },
          updatedNote: { name: "Aaa", text: "contentB" }
        }
      },
      {
        type: UPDATE_NOTE,
        payload: {
          oldNote: { name: "Aaa", text: "contentB" },
          updatedNote: { name: "Aaa", text: "contentC" }
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
          oldNote: { name: "smth", text: "contentA" },
          updatedNote: { name: "A", text: "contentA" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "A", text: "contentA" },
          updatedNote: { name: "B", text: "contentA" }
        }
      },
      {
        type: RENAME_NOTE,
        payload: {
          oldNote: { name: "B", text: "contentA" },
          updatedNote: { name: "C", text: "contentA" }
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
