import { Dropbox } from "dropbox";
import Cookies from "js-cookie";
import { env as Env } from "../Env";
import {
  setDropboxSyncEnabled,
  setNoteSyncStatus,
  addNewNote,
  renameNote
} from "./actions";
import { NoteStatus } from "../constants";
import { reduceReduxActions } from "./dropboxActionReducer";
import {
  DBX_RENAME,
  DBX_UPLOAD,
  DBX_DOWNLOAD,
  LOCAL_RENAME
} from "./dropboxActions";
import {
  convertNoteToFile,
  calculateDiff,
  convertDiffToActions
} from "./dropboxDiff";
import { blob2string } from "./utils";
import Note from "../Note";
import { toDelta } from "quill-delta-markdown";
import uuidv1 from "uuid/v1";
import * as Delta from "quill-delta";
import moment from "moment";

export default class DropboxSync {
  constructor(remoteFiles = [], localFiles = [], fetch = window.fetch) {
    this.dropbox = new Dropbox({ fetch: fetch });
    this.store = null;
    this.remoteFiles = remoteFiles;
    this.localFiles = localFiles;
    this.actionQueue = [];

    this.dispatchTimeout = 1000;
    this.timeoutID = 0;

    this.dispatchQueuedActions = this.dispatchQueuedActions.bind(this);
  }

  attach(store) {
    this.store = store;

    const accessToken = Cookies.get(Env.DropboxAccessTokenCookieName);
    if (accessToken) {
      this._setup(accessToken);
      return;
    }

    store.subscribe(() => {
      const currentToken = this.dropbox.getAccessToken();
      if (currentToken) return;

      const accessToken = store.getState().dropbox.dbxAccessToken;
      if (accessToken !== currentToken) {
        this._setup(accessToken);
      }
    });
  }

  _setup(accessToken) {
    this.store.dispatch(setDropboxSyncEnabled(true));
    this.dropbox.setAccessToken(accessToken);
  }

  async hardSync() {
    if (!this.dropbox.getAccessToken()) return;

    const remoteFiles = await this.getRemoteFiles();
    const localFiles = this.getLocalFiles();

    const diff = calculateDiff(remoteFiles, localFiles);
    const actions = convertDiffToActions(diff);
    console.log(diff);
    await this.performSyncActions(actions);
  }

  enqueueAction(reduxAction) {
    clearTimeout(this.timeoutID);
    this.actionQueue.push(reduxAction);
    console.log("enqueueing  action");
    this.timeoutID = setTimeout(
      this.dispatchQueuedActions,
      this.dispatchTimeout
    );
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

  async dispatchQueuedActions() {
    const dropboxActions = reduceReduxActions(this.actionQueue);
    this.actionQueue = [];
    console.log("dispatching dbx actions");

    await this.performSyncActions(dropboxActions);
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
        case LOCAL_RENAME:
          this.renameLocalNote(action);
          break;
      }
    }
  }

  async uploadNote(action) {
    const file = action.note;

    this.store.dispatch(setNoteSyncStatus(file.id, NoteStatus.IN_PROGRESS));
    try {
      await this.dropbox.filesUpload({
        contents: file.content,
        path: `/${file.name}`,
        client_modified: file.client_modified
      });
      this.store.dispatch(setNoteSyncStatus(file.id, NoteStatus.OK));
    } catch (err) {
      console.log(err);
      this.store.dispatch(setNoteSyncStatus(file.id, NoteStatus.ERROR));
    }
  }

  async downloadNote(action) {
    const buildNewNote = content => {
      const quillOps = toDelta(content);
      const quillDelta = new Delta(quillOps);
      const id = uuidv1();
      const name = action.filename.replace(".md", "");
      const date = moment(action.client_modified).toISOString();
      return new Note(id, name, quillDelta, date);
    };

    try {
      const response = await this.dropbox.filesDownload({
        path: `/${action.filename}`
      });

      const content = await blob2string(response.fileBlob);
      const note = buildNewNote(content);
      this.store.dispatch(addNewNote(note));
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
    const noteId = action.id;
    if (!noteId) {
      throw new Error("noteId unknown, unable to rename local note");
    }

    const oldNote = { id: noteId, name: action.oldName.replace(".md", "") };
    const newNote = { id: noteId, name: action.newName.replace(".md", "") };
    this.store.dispatch(renameNote(oldNote, newNote));
  }

  async beginDropboxSync() {
    const dbxFilesResponse = await this.dropbox.filesListFolder({ path: "" });
    if (dbxFilesResponse.has_more) {
      throw Error("has_more");
    }

    const dbxFiles = dbxFilesResponse.entries.filter(file =>
      file.name.endsWith(".md")
    );
    const localFiles = this.getLocalFileList();

    const filesToDownload = dbxFiles.filter(remoteFile => {
      const localIdx = localFiles.findIndex(
        localFile => localFile.name === remoteFile.name
      );
      if (localIdx === -1) return true;

      if (remoteFile.last_modified > localFiles[localIdx].last_modified)
        return true;

      return false;
    });

    const filesToUpload = localFiles.filter(localFile => {
      const remoteIdx = dbxFiles.findIndex(
        remoteFile => remoteFile.name === localFile.name
      );
      if (remoteIdx === -1) return true;

      if (dbxFiles[remoteIdx].last_modified > localFile.last_modified)
        return true;

      return false;
    });

    console.log(dbxFilesResponse);
    console.log(dbxFiles);
    console.log(localFiles);
    console.log(filesToDownload);
    console.log(filesToUpload);

    await this.uploadFiles(filesToUpload);
  }

  async uploadFiles(localFiles) {
    for (const file of localFiles) {
      this.updateNoteSyncStatus(file.id, NoteStatus.IN_PROGRESS);

      await this.dropbox.filesUpload({
        contents: file.content,
        path: `/${file.name}`,
        client_modified: file.last_modified
      });

      this.updateNoteSyncStatus(file.id, NoteStatus.OK);
    }
  }
}
