import React, { Component } from "react";
import "./App.css";
import Slideout from "slideout";
import NoteEditor from "./NoteEditor";
import NoteManager from "./NoteManager";
import ReactModal from "react-modal";
import NoteList from "./NoteList";

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

    this.state = {
      currentNote: this.noteManager.getNewestNote(),
      showSortPopup: false,
      sortOrder: this.sortTypes[0]
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

  onSortNotesClicked(e) {
    this.setState({ showSortPopup: !this.state.showSortPopup });
  }

  onSortOrderClicked(order) {
    this.setState({ sortOrder: order });
  }

  render() {
    return (
      <div
        onClick={() => {
          if (this.state.showSortPopup) this.setState({ showSortPopup: false });
        }}
      >
        <nav id="menu">
          <div className="menu-header has-text-centered is-size-2">Lapp</div>
          <div className="menu-divider is-divider" />

          <div className="columns is-size-3">
            <div className="column icon-container has-text-centered">
              <i
                onClick={this.addNewNote}
                className="fas fa-plus-square has-hover-shadow clickable"
              />
            </div>

            <div className="column icon-container has-text-centered">
              <i className="fas fa-search has-hover-shadow clickable" />
            </div>

            <div className="column icon-container has-text-centered">
              <div
                className={
                  this.state.showSortPopup
                    ? "dropdown is-active is-right"
                    : "dropdown is-right"
                }
              >
                <div
                  className="dropdown-trigger"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu"
                >
                  <i
                    className="fas fa-sort has-hover-shadow clickable"
                    onClick={this.onSortNotesClicked}
                  />
                </div>

                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    {this.sortTypes.map(sortType => {
                      return (
                        <button
                          key={sortType.id}
                          className="button is-white dropdown-item"
                          onClick={() => this.onSortOrderClicked(sortType)}
                        >
                          <span>
                            {sortType.parameter}
                            <i
                              className={
                                sortType.modifier === "asc"
                                  ? "fas fa-arrow-up"
                                  : "fas fa-arrow-down"
                              }
                              style={{ marginLeft: "5px" }}
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="menu-divider is-divider" />

          <NoteList
            currentNote={this.state.currentNote}
            notes={this.noteManager.notes}
            onNoteClicked={this.handleNoteClicked}
            sortOrder={this.state.sortOrder}
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
