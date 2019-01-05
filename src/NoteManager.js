import Note, { NoteStatus } from "./Note";
import uuidv1 from "uuid/v1";
import { Dropbox } from "dropbox";
import { fromDelta } from "quill-delta-markdown";
import moment from "moment";

class NoteManager {
  constructor() {
    this.notes = [];

    for (let i = 0; i < localStorage.length; i++) {
      const noteID = localStorage.key(i);
      const note = Note.parse(localStorage.getItem(noteID));
      this.insertNote(note);
    }

    this.dropbox = new Dropbox({ fetch: window.fetch });
  }

  addNewNote() {
    const id = uuidv1();
    const note = new Note(id, "new note");
    this.insertNote(note);
    return note;
  }

  findNote(noteID) {
    const note = this.notes.find(note => note.id === noteID);
    return note ? note : null; // null signifies error
  }

  addToLocalStorage(note) {
    localStorage.setItem(note.id, note.serialise());
  }

  removeFromLocalStorage(note) {
    localStorage.removeItem(note.id);
  }

  insertNote(note) {
    this.notes.push(note);
    this.addToLocalStorage(note);
  }

  deleteNote(note) {
    this.notes = this.notes.filter(item => item.id !== note.id);
    this.removeFromLocalStorage(note);
  }

  replaceNote(oldNote, newNote) {
    const idx = this.notes.findIndex(note => note.id === oldNote.id);
    if (idx === -1) {
      throw Error("Note not found");
    }

    this.removeFromLocalStorage(oldNote);
    this.addToLocalStorage(newNote);

    this.notes[idx] = newNote;
  }

  getNewestNote() {
    if (this.notes.length === 0) return null;
    return this.notes.sort((a, b) => {
      return a.lastEdit - b.lastEdit;
    })[0];
  }

  updateNoteText(noteID, newText, editTime = new Date()) {
    const note = this.findNote(noteID);
    if (!note) return null;
    const newNote = note.updateText(newText, editTime);
    this.replaceNote(note, newNote);
    return newNote;
  }

  updateNoteName(noteID, newName, editTime = new Date()) {
    const note = this.findNote(noteID);
    if (!note) return null;
    const newNote = note.updateName(newName, editTime);
    this.replaceNote(note, newNote);
    return newNote;
  }

  updateNoteSyncStatus(noteID, newStatus) {
    const note = this.findNote(noteID);
    if (!note) return null;
    const newNote = note.updateStatus(newStatus);
    this.replaceNote(note, newNote);
    return newNote;
  }

  setDropboxAccessToken(accessToken) {
    this.dropbox.setAccessToken(accessToken);
    this.beginDropboxSync();
  }

  convertDateTimeToDropboxFormat(datetime) {
    return (
      moment.utc(datetime, moment.ISO_8601).format("YYYY-MM-DDTHH:mm:ss") + "Z"
    );
  }

  getLocalFileList() {
    return this.notes.map(note => {
      return {
        name: `${note.name}.md`,
        id: note.id,
        last_modified: this.convertDateTimeToDropboxFormat(note.lastEdit),
        content: fromDelta(note.text.ops)
      };
    });
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

export default NoteManager;
