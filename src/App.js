import React, { Component } from "react";
import "./App.css";
import Slideout from "slideout";
import NoteEditor from "./NoteEditor";
import NoteManager from './NoteManager'

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

    this.noteManager = new NoteManager()

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
    const filename = e.target.innerHTML;
    this.updateCurrentFile(filename);
  }

  handleNoteTextChange(text) {
    const note = this.noteManager.updateNoteText(this.state.currentNote.name, text)
    this.setState({currentNote: note})
  }

  handleNoteNameChange(name) {
    const note = this.noteManager.updateNoteName(this.state.currentNote.name, name)
    this.setState({currentNote: note})
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
