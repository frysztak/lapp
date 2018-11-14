import Note from './Note';
import NoteManager from './NoteManager';

it('Load notes when there arent any', () => {
    localStorage.clear()
    const manager = new NoteManager()
    expect(manager.notes.length).toEqual(1)
    expect(localStorage.length).toEqual(1)
});

it('Load pre-existing notes', () => {
    localStorage.clear()
    const note = new Note("note", "hey there");
    localStorage.setItem("note", note.serialise())

    const manager = new NoteManager()
    expect(manager.notes.length).toEqual(1)
    expect(localStorage.length).toEqual(1)
});
