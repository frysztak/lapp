class Note {
  constructor(name, text = "", lastEdit = Date()) {
    this.name = name;
    this.text = text;
    this.lastEdit = lastEdit;
  }

  static parse(json) {
    const obj = JSON.parse(json);
    return new Note(obj.name, obj.text, obj.lastEdit);
  }

  serialise() {
    return JSON.stringify(this);
  }

  updateText(newText) {
    return new Note(this.name, newText, Date())
  }

  updateName(newName) {
    return new Note(newName, this.text, Date())
  }
}

export default Note;
