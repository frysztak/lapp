import React, { Component } from "react";
import "./App.css";
import Slideout from "slideout";
import NoteEditor from "./NoteEditor";
import NoteManager from "./NoteManager";
import ReactModal from "react-modal";
import NoteList from "./NoteList";

ReactModal.setAppElement("#root");

class App extends Component {
  constructor(props) {
    super(props);

    this.handleNoteClicked = this.handleNoteClicked.bind(this);
    this.handleNoteTextChange = this.handleNoteTextChange.bind(this);
    this.handleNoteNameChange = this.handleNoteNameChange.bind(this);
    this.addNewNote = this.addNewNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);

    this.noteManager = new NoteManager();
    if (this.noteManager.notes.length === 0) {
      this.noteManager.addNewNote();
    }

    this.state = {
      currentNote: this.noteManager.getNewestNote()
    };
  }

  componentDidMount() {
    this.slideout = new Slideout({
      panel: document.getElementById("panel"),
      menu: document.getElementById("menu"),
      padding: 256,
      tolerance: 70
    });
    this.slideout.open();
  }

  handleNoteClicked(noteID) {
    const note = this.noteManager.findNote(noteID);
    this.setState({ currentNote: note });
  }

  handleNoteTextChange(text) {
    const note = this.noteManager.updateNoteText(
      this.state.currentNote.id,
      text
    );
    this.setState({ currentNote: note });
  }

  handleNoteNameChange(name) {
    const note = this.noteManager.updateNoteName(
      this.state.currentNote.id,
      name
    );
    this.setState({ currentNote: note });
  }

  addNewNote() {
    const note = this.noteManager.addNewNote();
    this.setState({ currentNote: note });
  }

  deleteNote(note) {
    this.noteManager.deleteNote(note);
    this.setState({ currentNote: this.noteManager.getNewestNote() });
  }

  render() {
    const files = this.noteManager.notes.map(note => {
      const isActive = this.state.currentNote.id === note.id;
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

    return (
      <div>
        <nav id="menu">
          <div className="menu-header has-text-centered is-size-2">Lapp</div>
          <div className="menu-divider is-divider" />

          <div className="columns is-size-3">
            <div className="column icon-container has-text-centered">
              <i
                onClick={this.addNewNote}
                className="fas fa-plus-square has-hover-shadow"
              />
            </div>

            <div className="column icon-container has-text-centered">
              <i className="fas fa-search has-hover-shadow" />
            </div>

            <div className="column icon-container has-text-centered">
              <i className="fas fa-sort has-hover-shadow" />
            </div>
          </div>

          <div className="menu-divider is-divider" />

          <NoteList
            currentNote={this.state.currentNote}
            notes={this.noteManager.notes}
            onNoteClicked={this.handleNoteClicked}
            sortOrder=""
            filter=""
          />
        </nav>

        <main id="panel">
          <div>
            <NoteEditor
              currentNote={this.state.currentNote}
              onNoteNameChanged={this.handleNoteNameChange}
              onNoteTextChanged={this.handleNoteTextChange}
              onDeleteNote={this.deleteNote}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
