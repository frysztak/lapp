import Note from "./Note";
import uuidv1 from "uuid/v1";

class NoteManager {
  constructor() {
    this.notes = [];

    for (let i = 0; i < localStorage.length; i++) {
      const noteID = localStorage.key(i);
      const note = Note.parse(localStorage.getItem(noteID));
      this.insertNote(note);
    }
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
}

export default NoteManager;
