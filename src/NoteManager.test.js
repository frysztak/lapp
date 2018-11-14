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
    const note = new Note("note", "hey there", Date());
    localStorage.setItem("note", note.serialise())

    const manager = new NoteManager()
    expect(manager.notes.length).toEqual(1)
    expect(manager.notes[0]).toEqual(note)
    expect(localStorage.length).toEqual(1)
});

it('Find note', () => {
    localStorage.clear()
    const note = new Note("note", "hey there", Date());
    localStorage.setItem("note", note.serialise())

    const manager = new NoteManager()
    const foundNote = manager.findNote("note")
    expect(foundNote).toEqual(note)
});