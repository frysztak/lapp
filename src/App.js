import React, { Component } from "react";
import "./App.css";
import Slideout from "slideout";
import NoteEditor from "./NoteEditor";
import NoteManager from "./NoteManager";
import ReactModal from "react-modal";
import Sidebar from "./Sidebar";

ReactModal.setAppElement("#root");

class SortType {
  constructor(id, parameter, modifier) {
    this.id = id;
    this.parameter = parameter;
    this.modifier = modifier;
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.handleNoteClicked = this.handleNoteClicked.bind(this);
    this.handleNoteTextChange = this.handleNoteTextChange.bind(this);
    this.handleNoteNameChange = this.handleNoteNameChange.bind(this);
    this.addNewNote = this.addNewNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.onSortNotesClicked = this.onSortNotesClicked.bind(this);
    this.onSortOrderClicked = this.onSortOrderClicked.bind(this);
    this.onFilterNotesClicked = this.onFilterNotesClicked.bind(this);
    this.onFilterChanged = this.onFilterChanged.bind(this);

    this.noteManager = new NoteManager();
    if (this.noteManager.notes.length === 0) {
      this.noteManager.addNewNote();
    }

    this.sortTypes = [
      new SortType(0, "Name", "asc"),
      new SortType(1, "Name", "desc"),
      new SortType(2, "Last edited", "asc"),
      new SortType(3, "Last edited", "desc")
    ];

    this.noteEditorRef = React.createRef();

    this.state = {
      currentNote: this.noteManager.getNewestNote(),
      showSortPopup: false,
      sortOrder: this.sortTypes[0],
      showFilterPopup: false,
      filter: ""
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

    this.noteEditorRef.current.overwriteNote(note);
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
    this.noteEditorRef.current.overwriteNote(note);
  }

  deleteNote(note) {
    this.noteManager.deleteNote(note);
    const newestNote = this.noteManager.getNewestNote();
    this.setState({ currentNote: newestNote });

    this.noteEditorRef.current.overwriteNote(newestNote);
  }

  onSortNotesClicked() {
    this.setState({ showSortPopup: !this.state.showSortPopup });
  }

  onSortOrderClicked(order) {
    this.setState({ sortOrder: order });
  }

  onFilterNotesClicked() {
    this.setState({ showFilterPopup: !this.state.showFilterPopup });
  }

  onFilterChanged(e) {
    const filter = e.target.value;
    this.setState({ filter: filter });
  }

  render() {
    return (
      <div
        onClick={() => {
          if (this.state.showSortPopup) this.setState({ showSortPopup: false });
          if (this.state.showFilterPopup)
            this.setState({ showFilterPopup: false });
        }}
      >
        <nav id="menu">
          <Sidebar
            addNewNote={this.addNewNote}
            showSortPopup={this.state.showSortPopup}
            sortTypes={this.sortTypes}
            sortOrder={this.state.sortOrder}
            onSortNotesClicked={this.onSortNotesClicked}
            onSortOrderClicked={this.onSortOrderClicked}
            currentNote={this.state.currentNote}
            notes={this.noteManager.notes}
            showFilterPopup={this.state.showFilterPopup}
            filter={this.state.filter}
            onFilterNotesClicked={this.onFilterNotesClicked}
            onFilterChanged={this.onFilterChanged}
            onNoteClicked={this.handleNoteClicked}
          />
        </nav>

        <main id="panel">
          <div>
            <NoteEditor
              ref={this.noteEditorRef}
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
