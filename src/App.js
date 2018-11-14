import React, { Component } from "react";
import "./App.css";
import Slideout from "slideout";
import NoteEditor from "./NoteEditor";
import NoteManager from "./NoteManager";

const File = (noteName, clickHandler) => {
  return (
    <li className="menu-file-list" key={noteName} onClick={clickHandler}>
      {noteName}
    </li>
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.fileClicked = this.fileClicked.bind(this);
    this.handleNoteTextChange = this.handleNoteTextChange.bind(this);
    this.handleNoteNameChange = this.handleNoteNameChange.bind(this);
    this.addNewNote = this.addNewNote.bind(this);

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

  render() {
    const files = this.noteManager.notes.map(note =>
      File(note.name, this.fileClicked)
    );

    return (
      <div>
        <nav id="menu">
          <header>
            <div className="menu-header">Files</div>
          </header>
          <ul>{files}</ul>
          <button onClick={this.addNewNote}>add</button>
        </nav>

        <main id="panel">
          <div>
            <NoteEditor
              currentNote={this.state.currentNote}
              onNoteNameChanged={this.handleNoteNameChange}
              onNoteTextChanged={this.handleNoteTextChange}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
