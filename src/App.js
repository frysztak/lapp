import React, { Component } from "react";
import "./App.css";
import PlusSquareSolid from "./plus-square-solid.svg";
import Slideout from "slideout";
import NoteEditor from "./NoteEditor";
import NoteManager from "./NoteManager";
import ReactModal from "react-modal";

const File = (noteName, isActive, clickHandler) => {
  return (
    <li
      className="menu-note-list-item"
      id={isActive ? "active" : "inactive"}
      key={noteName}
      onClick={clickHandler}
    >
      {noteName}
    </li>
  );
};

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
    const noteName = e.target.innerHTML;
    const note = this.noteManager.findNote(noteName);
    this.setState({ currentNote: note });
  }

  handleNoteTextChange(text) {
    const note = this.noteManager.updateNoteText(
      this.state.currentNote.name,
      text
    );
    this.setState({ currentNote: note });
  }

  handleNoteNameChange(name) {
    const note = this.noteManager.updateNoteName(
      this.state.currentNote.name,
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
      const isActive = this.state.currentNote.name === note.name;
      return File(note.name, isActive, this.fileClicked);
    });

    return (
      <div>
        <nav id="menu">
          <header className="menu-header">
            <div>Lapp</div>
            <img
              className="menu-plus"
              onClick={this.addNewNote}
              src={PlusSquareSolid}
              alt="plus"
            />
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
