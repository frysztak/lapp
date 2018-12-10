import React, { Component } from "react";
import "./App.css";
import Slideout from "slideout";
import NoteEditor from "./NoteEditor";
import NoteManager from "./NoteManager";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

class App extends Component {
  constructor(props) {
    super(props);

    this.fileClicked = this.fileClicked.bind(this);
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

  fileClicked(e) {
    const noteID = e.target.dataset.id;
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
          <header className="menu-header">
            <span className="is-size-2">
              <span>Lapp</span>
              <i
                style={{ paddingLeft: 5 }}
                onClick={this.addNewNote}
                className="fas fa-plus-square"
                id="plusIcon"
              />
            </span>
          </header>
          <ul className="menu-note-list">{files}</ul>
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
