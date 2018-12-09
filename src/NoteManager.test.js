import Note from "./Note";
import NoteManager from "./NoteManager";
import Delta from "quill-delta";

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
    new Note("note", new Delta().insert("my note"), Date()),
    new Note("note2", new Delta().insert("a very cool note"), Date())
  ];
  beforeEach(() => {
    localStorage.clear();
    const manager = new NoteManager();
    for (let note of initialNotes) {
      manager.addToLocalStorage(note);
    }
  });

  it("Load pre-existing notes", () => {
    const manager = new NoteManager();
    expect(manager.notes).toEqual(initialNotes);
  });

  it("Find note", () => {
    const manager = new NoteManager();
    const foundNote = manager.findNote(initialNotes[0].name);
    expect(foundNote).toEqual(initialNotes[0]);
  });
});
