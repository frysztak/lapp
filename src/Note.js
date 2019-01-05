import Delta from "quill-delta";

export const NoteStatus = {
  DETACHED: 0, // used when synchronization is disabled
  IN_PROGRESS: 1,
  OK: 2,
  ERROR: 3
};

class Note {
  constructor(
    id,
    name,
    text = new Delta(),
    lastEdit = new Date(),
    syncStatus = NoteStatus.DETACHED
  ) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.lastEdit = lastEdit;
    this.syncStatus = syncStatus;
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
    const replacer = (key, value) => {
      if (key === "syncStatus") return undefined;
      return value;
    };
    return JSON.stringify(this, replacer);
  }

  updateText(newText, editTime) {
    return new Note(this.id, this.name, newText, editTime);
  }

  updateName(newName, editTime) {
    return new Note(this.id, newName, this.text, editTime);
  }

  updateStatus(newStatus) {
    return new Note(this.id, this.name, this.text, this.editTime, newStatus);
  }
}

export default Note;
