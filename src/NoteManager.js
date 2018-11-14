import Note from "./Note";

class NoteManager {
  constructor() {
    this.notes = [];

    if (localStorage.length === 0) {
      const note = new Note("new note", "", Date());
      this.insertNote(note);
    } else {
      for (let i = 0; i < localStorage.length; i++) {
        const noteName = localStorage.key(i);
        const note = Note.parse(localStorage.getItem(noteName));
        this.insertNote(note);
      }
    }
  }

  addToLocalStorage(note) {
    localStorage.setItem(note.name, note.serialise());
  }

  removeFromLocalStorage(note) {
      localStorage.removeItem(note.name)
  }

  insertNote(note) {
    this.notes.push(note);
    this.addToLocalStorage(note)
  }

  replaceNote(oldNote, newNote) {
      const idx = this.notes.findIndex(note => note === oldNote)
      if (idx === -1) {
          throw Error("Note not found")
      }

      this.removeFromLocalStorage(oldNote)
      this.addToLocalStorage(newNote)

      this.notes[idx] = newNote
  }

  getNewestNote() {
      // @TODO
      return this.notes[0]
  }

  updateNoteText(noteName, newText) { 
      const note = this.notes.find(note => note.name === noteName)
      if (note === null) {
          throw Error("Note not found")
      }

      const newNote = note.updateText(newText)
      this.replaceNote(note, newNote)
      return newNote
  }

  updateNoteName(noteName, newName) { 
      const note = this.notes.find(note => note.name === noteName)
      if (note === null) {
          throw Error("Note not found")
      }

      const newNote = note.updateName(newName)
      this.replaceNote(note, newNote)
      return newNote
  }
}

export default NoteManager;
