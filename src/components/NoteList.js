import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentNoteId } from "../redux/actions";
import { NoteStatus } from "../constants";

class NoteList extends Component {
  constructor(props) {
    super(props);

    this.fileClicked = this.fileClicked.bind(this);
    this.statusMapping = {
      [NoteStatus.OK]: "",
      [NoteStatus.IN_PROGRESS]: "has-text-info",
      [NoteStatus.OK]: "has-text-success",
      [NoteStatus.ERROR]: "has-text-danger"
    };
  }

  fileClicked(e) {
    const noteID = e.target.dataset.id;
    this.props.onNoteClicked(noteID);
  }

  render() {
    const files = this.props.notes.map(note => {
      const status = this.props.notesStatus[note.id];

      const isActive = this.props.currentNote
        ? this.props.currentNote.id === note.id
        : false;

      return (
        <li
          className="menu-note-list-item"
          id={isActive ? "active" : "inactive"}
          key={note.id}
          data-id={note.id}
          onClick={this.fileClicked}
        >
          <span
            className={`icon move-left is-medium ${this.statusMapping[status]}`}
          >
            <i className="fas fa-sm fa-check-circle" />
          </span>
          {note.name}
        </li>
      );
    });

    return <ul className="menu-note-list">{files}</ul>;
  }
}

const processNotes = (notes, filter, sortOrder) => {
  let processedNotes = notes;
  if (filter) {
    processedNotes = notes.filter(a => a.name.startsWith(filter));
  }

  if (sortOrder.parameter === "Name") {
    const comparisonFunc =
      sortOrder.modifier === "asc"
        ? (a, b) => a.name.localeCompare(b.name)
        : (a, b) => b.name.localeCompare(a.name);

    return processedNotes.sort(comparisonFunc);
  } else if (sortOrder.parameter === "Last edited") {
    const comparisonFunc =
      sortOrder.modifier === "asc"
        ? (a, b) => a.lastEdit - b.lastEdit
        : (a, b) => b.lastEdit - a.lastEdit;

    return processedNotes.sort(comparisonFunc);
  } else {
    throw Error(`Unknown sortOrder '${sortOrder}'`);
  }
};

const mapStateToProps = state => {
  return {
    notes: processNotes(
      state.notes.all,
      state.filtersort.filter,
      state.filtersort.sortOrder
    ),
    notesStatus: state.dropbox.notesStatus,
    currentNote: state.notes.all.find(
      note => note.id === state.notes.currentNoteId
    )
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onNoteClicked: noteId => dispatch(setCurrentNoteId(noteId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteList);
