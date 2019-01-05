import React, { Component } from "react";
import { NoteStatus } from "./Note";

class NoteList extends Component {
  constructor(props) {
    super(props);

    this.fileClicked = this.fileClicked.bind(this);
  }

  processNotes() {
    let notes = this.props.notes;
    if (this.props.filter) {
      notes = notes.filter(a => a.name.startsWith(this.props.filter));
    }

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

      let icon;
      if (note.syncStatus === NoteStatus.DETACHED) {
        icon = null;
      } else {
        let className;
        switch (note.syncStatus) {
          case NoteStatus.OK:
            className = "has-text-success";
            break;
          case NoteStatus.IN_PROGRESS:
            className = "has-text-success";
            break;
          case NoteStatus.ERROR:
            className = "has-text-danger";
            break;
          default:
            className = "";
        }
        icon = (
          <span className={`icon ${className}`}>
            <i className="fas fa-check-circle" />
          </span>
        );
      }

      return (
        <li
          className="menu-note-list-item"
          id={isActive ? "active" : "inactive"}
          key={note.id}
          data-id={note.id}
          onClick={this.fileClicked}
        >
          {icon}
          <span>{note.name}</span>
        </li>
      );
    });

    return <ul className="menu-note-list">{files}</ul>;
  }
}

export default NoteList;
