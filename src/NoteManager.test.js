import Note from "./Note";
import NoteManager from "./NoteManager";
import Delta from "quill-delta";
import uuidv1 from "uuid/v1";

describe("No pre-existing notes", () => {
  test("Load notes", () => {
    beforeEach(() => localStorage.clear());

    const manager = new NoteManager();
    expect(manager.notes.length).toEqual(0);
    expect(localStorage.length).toEqual(0);
  });
});

describe("With pre-exising notes", () => {
  const initialNotes = [
    new Note(uuidv1(), "note", new Delta().insert("my note"), new Date()),
    new Note(
      uuidv1(),
      "note2",
      new Delta().insert("a very cool note"),
      new Date()
    )
  ];

  beforeEach(() => {
    localStorage.clear();
    const manager = new NoteManager();
    for (let note of initialNotes) {
      manager.addToLocalStorage(note);
    }
  });

  // checks if `expectedNotes` exist in localStorage
  function checkLocalStorage(expectedNotes) {
    const noteIDs = Object.keys(localStorage);

    for (const note of expectedNotes) {
      if (!noteIDs.includes(note.id)) return false;

      const json = note.serialise();
      if (localStorage.getItem(note.id) !== json) return false;
    }
    return true;
  }

  function checkNotes(actualNotes, expectedNotes) {
    expect(actualNotes).toEqual(expectedNotes);
    expect(checkLocalStorage(expectedNotes)).toEqual(true);
  }

  test("Load pre-existing notes", () => {
    const manager = new NoteManager();
    checkNotes(manager.notes, initialNotes);
  });

  test("Add new note", () => {
    const manager = new NoteManager();
    const note = manager.addNewNote();
    checkNotes(manager.notes, [...initialNotes, note]);
  });

  test("Delete note", () => {
    const manager = new NoteManager();
    manager.deleteNote(initialNotes[0]);
    checkNotes(manager.notes, [initialNotes[1]]);
  });

  test("Find note", () => {
    const manager = new NoteManager();
    const foundNote = manager.findNote(initialNotes[0].id);
    expect(foundNote).toEqual(initialNotes[0]);
  });

  test("Find note that doesn't exist", () => {
    const manager = new NoteManager();
    const foundNote = manager.findNote("non-existent-id");
    expect(foundNote).toBeNull();
  });

  test("Replace note", () => {
    const manager = new NoteManager();
    const newNote = new Note(
      uuidv1(),
      "new note",
      new Delta().insert("my note"),
      new Date()
    );

    manager.replaceNote(initialNotes[0], newNote);
    checkNotes(manager.notes, [newNote, initialNotes[1]]);
  });

  test("Replace non-existent note", () => {
    const manager = new NoteManager();
    const newNote = new Note(
      uuidv1(),
      "new note",
      new Delta().insert("my note"),
      new Date()
    );

    expect(() => manager.replaceNote(newNote, initialNotes[1])).toThrow();
  });

  test("Update note name", () => {
    const manager = new NoteManager();
    const newName = "new name";
    const newTime = new Date();
    const updatedNote = manager.updateNoteName(
      initialNotes[1].id,
      newName,
      newTime
    );

    let manuallyCraftedNote = initialNotes[1];
    manuallyCraftedNote.name = newName;
    manuallyCraftedNote.lastEdit = newTime;
    checkNotes(manager.notes, [initialNotes[0], manuallyCraftedNote]);
    expect(updatedNote).toEqual(manuallyCraftedNote);
  });

  test("Update note body", () => {
    const manager = new NoteManager();
    const newBody = "new body";
    const newTime = new Date();
    const updatedNote = manager.updateNoteText(
      initialNotes[1].id,
      newBody,
      newTime
    );

    let manuallyCraftedNote = initialNotes[1];
    manuallyCraftedNote.text = newBody;
    manuallyCraftedNote.lastEdit = newTime;
    checkNotes(manager.notes, [initialNotes[0], manuallyCraftedNote]);
    expect(updatedNote).toEqual(manuallyCraftedNote);
  });
});
