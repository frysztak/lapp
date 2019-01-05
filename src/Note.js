import Delta from "quill-delta";
import uuidv1 from "uuid/v1";

class Note {
  constructor(
    id = uuidv1(),
    name = "new note",
    text = new Delta(),
    lastEdit = new Date()
  ) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.lastEdit = lastEdit;
  }

  static updateText(note, newText, editTime) {
    return new Note(note.id, note.name, newText, editTime);
  }

  static updateName(note, newName, editTime) {
    return new Note(note.id, newName, note.text, editTime);
  }
}

export default Note;
