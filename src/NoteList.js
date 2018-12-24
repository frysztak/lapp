import React, { Component } from "react";

class NoteList extends Component {
  constructor(props) {
    super(props);

    this.fileClicked = this.fileClicked.bind(this);
  }

  processNotes() {
    let notes = this.props.notes;
    const shouldFilter = this.props.filter !== "";

    if (this.props.sortOrder.parameter === "Name") {
      const comparisonFunc =
        this.props.sortOrder.modifier === "asc"
          ? (a, b) => a.name.localeCompare(b.name)
          : (a, b) => b.name.localeCompare(a.name);

      return notes.sort(comparisonFunc);
    } else if (this.props.sortOrder.parameter === "Last edited") {
      const comparisonFunc =
        this.props.sortOrder.modifier === "asc"
          ? (a, b) => a.lastEdit - b.lastEdit
          : (a, b) => b.lastEdit - a.lastEdit;

      return notes.sort(comparisonFunc);
    } else {
      throw Error(`Unknown sortOrder '${this.props.sortOrder}'`);
    }
  }

  fileClicked(e) {
    const noteID = e.target.dataset.id;
    this.props.onNoteClicked(noteID);
  }

  render() {
    const notes = this.processNotes();

    const files = notes.map(note => {
      const isActive = this.props.currentNote.id === note.id;
      return (
        <li
          className="menu-note-list-item"
          id={isActive ? "active" : "inactive"}
          key={note.id}
          data-id={note.id}
          onClick={this.fileClicked}
        >
          {note.name}
        </li>
      );
    });

    return <ul className="menu-note-list">{files}</ul>;
  }
}

export default NoteList;
