import Delta from "quill-delta";

class Note {
  constructor(id, name, text = new Delta(), lastEdit = new Date()) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.lastEdit = lastEdit;
  }

  static parse(json) {
    const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,}Z$/;

    const reviver = (key, value) => {
      if (typeof value === "string" && dateFormat.test(value)) {
        return new Date(value);
      }

      return value;
    };
    const obj = JSON.parse(json, reviver);
    return new Note(obj.id, obj.name, new Delta(obj.text), obj.lastEdit);
  }

  serialise() {
    return JSON.stringify(this);
  }

  updateText(newText, editTime) {
    return new Note(this.id, this.name, newText, editTime);
  }

  updateName(newName, editTime) {
    return new Note(this.id, newName, this.text, editTime);
  }
}

export default Note;
