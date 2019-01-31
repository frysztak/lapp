import { Dropbox } from "dropbox";
import Cookies from "js-cookie";
import { env as Env } from "../Env";
import {
  setDropboxSyncEnabled,
  setNoteSyncStatus,
  addNewNote,
  renameNote,
  updateNote,
  setCurrentNoteId
} from "../redux/actions";
import { NoteStatus, SOURCE_DROPBOX } from "../constants";
import { reduceReduxActions } from "./dropboxActionReducer";
import {
  DBX_RENAME,
  DBX_UPLOAD,
  DBX_DOWNLOAD,
  LOCAL_RENAME,
  DBX_DELETE
} from "./dropboxActions";
import {
  convertNoteToFile,
  calculateDiff,
  convertDiffToActions
} from "./dropboxDiff";
import { blob2string } from "../redux/utils";
import Note from "../Note";
import markdownToDelta from "markdown-to-quill-delta";
import uuidv1 from "uuid/v1";
import * as Delta from "quill-delta";
import moment from "moment";

export default class DropboxSync {
  constructor(fetch = window.fetch) {
    this.dropbox = new Dropbox({ fetch: fetch });
    this.store = null;
    this.actionQueue = [];

    this.dispatchTimeout = 1000;
    this.timeoutID = 0;

    this.dispatchQueuedActions = this.dispatchQueuedActions.bind(this);
  }

  attach(store) {
    this.store = store;

    const accessToken = Cookies.get(process.env.REACT_APP_DROPBOX_ACCESS_TOKEN_COOKIE_NAME);
    if (accessToken) {
      this._setup(accessToken);
      return;
    }

    store.subscribe(() => {
      const currentToken = this.dropbox.getAccessToken();
      if (currentToken) return;

      let accessToken = store.getState().dropbox.dbxAccessToken;
      if (!accessToken) {
        accessToken = Cookies.get(process.env.REACT_APP_DROPBOX_ACCESS_TOKEN_COOKIE_NAME);
      }

      if (accessToken !== currentToken) {
        this._setup(accessToken);
      }
    });
  }

  _setup(accessToken) {
    this.dropbox.setAccessToken(accessToken);
    this.store.dispatch(setDropboxSyncEnabled(true));
    this.hardSync();

    if (!!window.EventSource) {
      const source = new EventSource(Env.DropboxNotifications);
      source.onmessage = e => {
        console.log(e);
      };
    }
  }

  async hardSync() {
    if (!this.dropbox.getAccessToken()) return;

    const remoteFiles = await this.getRemoteFiles();
    const localFiles = this.getLocalFiles();

    const diff = calculateDiff(remoteFiles, localFiles);
    const actions = convertDiffToActions(diff);
    console.log(diff);
    this.setStatusForUpToDateFiles(diff.upToDate);
    await this.performSyncActions(actions);
  }

  setStatusForUpToDateFiles(upToDate) {
    for (const file of upToDate) {
      this.store.dispatch(setNoteSyncStatus(file.noteId, NoteStatus.OK));
    }
  }

  enqueueAction(reduxAction) {
    if (!this.dropbox.getAccessToken()) return;

    clearTimeout(this.timeoutID);
    this.actionQueue.push(reduxAction);
    this.timeoutID = setTimeout(
      this.dispatchQueuedActions,
      this.dispatchTimeout
    );
  }

  disableSynchronization() {
    this.dropbox.setAccessToken(null);
    Cookies.remove(process.env.REACT_APP_DROPBOX_ACCESS_TOKEN_COOKIE_NAME);

    this.store.getState().notes.all.forEach(note => {
      this.store.dispatch(setNoteSyncStatus(note.id, NoteStatus.DETACHED));
    });
  }

  async getRemoteFiles() {
    try {
      const response = await this.dropbox.filesListFolder({ path: "" });
      if (response.has_more) {
        throw Error("has_more");
      }

      return response.entries.filter(file => file.name.endsWith(".md"));
    } catch (err) {
      return null;
    }
  }

  getLocalFiles() {
    return this.store.getState().notes.all.map(note => convertNoteToFile(note));
  }

  dispatchQueuedActions() {
    const dropboxActions = reduceReduxActions(this.actionQueue);
    this.actionQueue = [];
    this.performSyncActions(dropboxActions);
  }

  async performSyncActions(syncActions) {
    for (const action of syncActions) {
      switch (action.type) {
        case DBX_RENAME:
          await this.renameNote(action);
          break;
        case DBX_UPLOAD:
          await this.uploadNote(action);
          break;
        case DBX_DOWNLOAD:
          await this.downloadNote(action);
          break;
        case DBX_DELETE:
          await this.deleteNote(action);
          break;
        case LOCAL_RENAME:
          this.renameLocalNote(action);
          break;
        default:
          break;
      }
    }
  }

  async uploadNote(action) {
    const file = action.note ? convertNoteToFile(action.note) : action.file;

    this.store.dispatch(setNoteSyncStatus(file.noteId, NoteStatus.IN_PROGRESS));
    try {
      await this.dropbox.filesUpload({
        contents: file.content,
        path: `/${file.name}`,
        client_modified: file.client_modified,
        mode: "overwrite"
      });
      this.store.dispatch(setNoteSyncStatus(file.noteId, NoteStatus.OK));
    } catch (err) {
      console.log(err);
      this.store.dispatch(setNoteSyncStatus(file.noteId, NoteStatus.ERROR));
    }
  }

  async downloadNote(action) {
    const buildNewNote = content => {
      const quillOps = markdownToDelta(content);
      const quillDelta = new Delta(quillOps);
      const id = uuidv1();
      const name = action.filename.replace(".md", "");
      const date = moment(action.server_modified).toISOString();
      return new Note(id, name, quillDelta, date);
    };

    try {
      const response = await this.dropbox.filesDownload({
        path: `/${action.filename}`
      });

      const content = await blob2string(response.fileBlob);
      const currentNoteId = this.store.getState().notes.currentNoteId;
      let note;

      if (action.noteId) {
        note = buildNewNote(content);
        const fakeOldNote = { id: action.noteId };
        this.store.dispatch(updateNote(fakeOldNote, note, SOURCE_DROPBOX));
        if (currentNoteId === fakeOldNote.id) {
          this.store.dispatch(setCurrentNoteId(note.id));
        }
      } else {
        note = buildNewNote(content);
        this.store.dispatch(addNewNote(note, SOURCE_DROPBOX));
        if (!currentNoteId) {
          this.store.dispatch(setCurrentNoteId(note.id));
        }
      }

      this.store.dispatch(setNoteSyncStatus(note.id, NoteStatus.OK));
    } catch (err) {
      console.log(err);
    }
  }

  async renameNote(action) {
    const noteId = action.noteId;
    this.store.dispatch(setNoteSyncStatus(noteId, NoteStatus.IN_PROGRESS));

    try {
      await this.dropbox.filesMoveV2({
        from_path: `/${action.from}.md`,
        to_path: `/${action.to}.md`
      });
      this.store.dispatch(setNoteSyncStatus(noteId, NoteStatus.OK));
    } catch (err) {
      console.log(err);
      this.store.dispatch(setNoteSyncStatus(noteId, NoteStatus.ERROR));
    }
  }

  renameLocalNote(action) {
    const noteId = action.noteId;
    if (!noteId) {
      throw new Error("noteId unknown, unable to rename local note");
    }

    const oldNote = { id: noteId, name: action.oldName.replace(".md", "") };
    const newNote = {
      id: uuidv1(),
      name: action.newName.replace(".md", ""),
      lastEdit: action.lastEdit
    };
    this.store.dispatch(renameNote(oldNote, newNote, SOURCE_DROPBOX));

    const currentNoteId = this.store.getState().notes.currentNoteId;
    if (currentNoteId === noteId) {
      this.store.dispatch(setCurrentNoteId(newNote.id));
    }
    this.store.dispatch(setNoteSyncStatus(newNote.id, NoteStatus.OK));
  }

  async deleteNote(action) {
    try {
      await this.dropbox.filesDeleteV2({
        path: `/${action.note.name}.md`
      });
    } catch (err) {
      console.log(err);
    }
  }
}
