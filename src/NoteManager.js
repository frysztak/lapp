import Note from "./Note";

class NoteManager {
  constructor() {
    this.notes = [];

    if (localStorage.length === 0) {
      this.addNewNote();
    } else {
      for (let i = 0; i < localStorage.length; i++) {
        const noteName = localStorage.key(i);
        const note = Note.parse(localStorage.getItem(noteName));
        this.insertNote(note);
      }
    }
  }

  addNewNote() {
    // TODO: what if note named 'new note' already exists?
    const note = new Note("new note", "your note...", Date());
    this.insertNote(note);
    return note;
  }

  findNote(noteName) {
    const note = this.notes.find(note => note.name === noteName);
    if (note === null) {
      throw Error("Note not found");
    }
    return note;
  }

  addToLocalStorage(note) {
    localStorage.setItem(note.name, note.serialise());
  }

  removeFromLocalStorage(note) {
    localStorage.removeItem(note.name);
  }

  insertNote(note) {
    this.notes.push(note);
    this.addToLocalStorage(note);
  }

  deleteNote(note) {
    this.notes = this.notes.filter(item => item !== note);
    this.removeFromLocalStorage(note);
  }

  replaceNote(oldNote, newNote) {
    const idx = this.notes.findIndex(note => note === oldNote);
    if (idx === -1) {
      throw Error("Note not found");
    }

    this.removeFromLocalStorage(oldNote);
    this.addToLocalStorage(newNote);

    this.notes[idx] = newNote;
  }

  getNewestNote() {
    // @TODO
    return this.notes[0];
  }

  updateNoteText(noteName, newText) {
    const note = this.findNote(noteName);
    const newNote = note.updateText(newText);
    this.replaceNote(note, newNote);
    return newNote;
  }

  updateNoteName(noteName, newName) {
    const note = this.findNote(noteName);
    const newNote = note.updateName(newName);
    this.replaceNote(note, newNote);
    return newNote;
  }
}

export default NoteManager;
