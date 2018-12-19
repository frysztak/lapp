import React, { Component } from "react";

class NoteList extends Component {
  constructor(props) {
    super(props);

    this.fileClicked = this.fileClicked.bind(this);
  }

  processNotes() {
    let notes = this.props.notes;
    const shouldSort = this.props.sortOrder !== "";
    const shouldFilter = this.props.filter !== "";
    if (!shouldSort && !shouldFilter) return notes;

    if (shouldSort) {
      if (this.props.sortOrder === "name") {
        return notes.sort((a, b) => a.name - b.name);
      } else if (this.props.sortOrder === "lastEdit") {
        return notes.sort((a, b) => a.lastEdit - b.lastEdit);
      } else {
        throw `Unknown sortOrder '${this.props.sortOrder}'`;
      }
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
